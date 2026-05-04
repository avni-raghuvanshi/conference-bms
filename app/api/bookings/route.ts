import { NextRequest, NextResponse } from 'next/server';
import { Prisma } from '@prisma/client';
import { prisma } from '@/lib/db';
import { verifyOtpToken } from '@/lib/jwt';
import { BASE_SLOTS } from '@/lib/rooms';
import { createCalendarEvent } from '@/lib/calendar';
import { sendBookingConfirmationEmail } from '@/lib/email';
import { BookingPayload } from '@/lib/types';

const VALID_EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MAX_ATTENDEES = 50;
const MAX_TITLE_LENGTH = 120;

const REF_CHARS = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';

function generateBookingRef(): string {
    let ref = 'CONF-';
    for (let i = 0; i < 4; i++) ref += REF_CHARS[Math.floor(Math.random() * REF_CHARS.length)];
    return ref;
}

const VALID_SLOT_PAIRS = new Set(BASE_SLOTS.map((s) => `${s.startTime}|${s.endTime}`));
const SLOT_BY_ID = new Map(BASE_SLOTS.map((s) => [s.id, s]));

// POST /api/bookings
// Body: BookingPayload
// Header (new users only): Authorization: Bearer <otp-jwt>
export async function POST(request: NextRequest) {
    let body: unknown;
    try {
        body = await request.json();
    } catch {
        return NextResponse.json({ error: 'Invalid JSON body.' }, { status: 400 });
    }

    const payload = body as Partial<BookingPayload>;

    // Validate required fields
    if (!payload.roomId || !payload.date || !payload.startTime || !payload.endTime) {
        return NextResponse.json({ error: 'roomId, date, startTime, and endTime are required.' }, { status: 400 });
    }

    // Validate date format (YYYY-MM-DD)
    if (!/^\d{4}-\d{2}-\d{2}$/.test(payload.date)) {
        return NextResponse.json({ error: 'Invalid date format.' }, { status: 400 });
    }

    // Validate each slotId exists, slots are consecutive, and derived times match
    const slotIds = payload.slotIds ?? [];
    if (slotIds.length === 0) {
        return NextResponse.json({ error: 'At least one time slot is required.' }, { status: 400 });
    }
    if (slotIds.length > 5) {
        return NextResponse.json({ error: 'Maximum 5 consecutive slots allowed.' }, { status: 400 });
    }
    const resolvedSlots = slotIds.map((id) => SLOT_BY_ID.get(id));
    if (resolvedSlots.some((s) => !s)) {
        return NextResponse.json({ error: 'One or more slot IDs are invalid.' }, { status: 400 });
    }
    // Verify slots are consecutive (endTime[i] === startTime[i+1])
    for (let i = 0; i < resolvedSlots.length - 1; i++) {
        if (resolvedSlots[i]!.endTime !== resolvedSlots[i + 1]!.startTime) {
            return NextResponse.json({ error: 'Selected slots must be consecutive.' }, { status: 400 });
        }
    }
    // Verify derived startTime/endTime match what the client sent
    if (
        resolvedSlots[0]!.startTime !== payload.startTime ||
        resolvedSlots[resolvedSlots.length - 1]!.endTime !== payload.endTime
    ) {
        return NextResponse.json({ error: 'Invalid time slot.' }, { status: 400 });
    }
    // Each individual slot pair must be in VALID_SLOT_PAIRS
    if (resolvedSlots.some((s) => !VALID_SLOT_PAIRS.has(`${s!.startTime}|${s!.endTime}`))) {
        return NextResponse.json({ error: 'Invalid time slot.' }, { status: 400 });
    }

    const trimmedTitle = payload.title?.trim() ?? '';
    if (!trimmedTitle) {
        return NextResponse.json({ error: 'Meeting title is required.' }, { status: 400 });
    }
    if (trimmedTitle.length > MAX_TITLE_LENGTH) {
        return NextResponse.json({ error: `Title must be ${MAX_TITLE_LENGTH} characters or fewer.` }, { status: 400 });
    }

    if (!payload.organizerEmail || !VALID_EMAIL_RE.test(payload.organizerEmail.trim())) {
        return NextResponse.json({ error: 'A valid organizer email is required.' }, { status: 400 });
    }

    const attendees = payload.attendees ?? [];
    if (attendees.length > MAX_ATTENDEES) {
        return NextResponse.json({ error: `Maximum ${MAX_ATTENDEES} attendees allowed.` }, { status: 400 });
    }
    const invalidAttendee = attendees.find((a) => typeof a !== 'string' || !VALID_EMAIL_RE.test(a));
    if (invalidAttendee !== undefined) {
        return NextResponse.json({ error: 'One or more attendee emails are invalid.' }, { status: 400 });
    }

    const organizerEmail = payload.organizerEmail.trim().toLowerCase();

    // Verify room exists
    const room = await prisma.room.findUnique({ where: { id: payload.roomId } });
    if (!room) {
        return NextResponse.json({ error: 'Room not found.' }, { status: 404 });
    }

    // Check if this is a new user
    const existingUser = await prisma.user.findUnique({ where: { email: organizerEmail } });
    const isNewUser = existingUser === null;

    if (isNewUser) {
        // New users must present a verified OTP token
        const authHeader = request.headers.get('Authorization');
        const token = authHeader?.startsWith('Bearer ') ? authHeader.slice(7) : null;

        if (!token) {
            return NextResponse.json(
                { error: 'Email verification required for new users.', requiresOtp: true },
                { status: 403 },
            );
        }

        try {
            const claims = await verifyOtpToken(token);
            if (claims.email !== organizerEmail) {
                return NextResponse.json(
                    { error: 'Verification token does not match the organizer email.' },
                    { status: 403 },
                );
            }
        } catch {
            return NextResponse.json(
                { error: 'Verification token is invalid or expired. Please verify your email again.', requiresOtp: true },
                { status: 403 },
            );
        }
    }

    // --- Concurrency-safe booking inside a transaction ---
    // The SELECT FOR UPDATE locks the row (or confirms no row) before inserting,
    // so two simultaneous requests for the same slot queue rather than double-book.
    try {
        const booking = await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
            // Lock any overlapping booking — catches both single and multi-slot conflicts
            const existing = await tx.$queryRaw<{ id: string }[]>`
                SELECT id FROM "Booking"
                WHERE "roomId" = ${payload.roomId}
                  AND date = ${payload.date}
                  AND "startTime" < ${payload.endTime}
                  AND "endTime" > ${payload.startTime}
                  AND status = 'CONFIRMED'
                FOR UPDATE
            `;

            if (existing.length > 0) {
                throw new SlotConflictError('One or more of the selected slots is already booked. Please choose different times.');
            }

            // Create the booking
            const created = await tx.booking.create({
                data: {
                    ref: generateBookingRef(),
                    roomId: payload.roomId!,
                    date: payload.date!,
                    startTime: payload.startTime!,
                    endTime: payload.endTime!,
                    title: trimmedTitle,
                    organizerEmail,
                    attendees,
                    status: 'CONFIRMED',
                },
            });

            // Upsert the user record
            await tx.user.upsert({
                where: { email: organizerEmail },
                create: { email: organizerEmail },
                update: {},
            });

            return created;
        });

        // Create Google Calendar event outside the transaction (non-critical — booking already confirmed)
        let calendarEventId: string | undefined;
        let meetLink: string | null = null;
        try {
            const calendarResult = await createCalendarEvent({
                title: booking.title,
                date: booking.date,
                startTime: booking.startTime,
                endTime: booking.endTime,
                roomName: room.name,
                organizerEmail,
                attendees: booking.attendees,
                bookingId: booking.id,
            });

            calendarEventId = calendarResult.eventId;
            meetLink = calendarResult.meetLink;

            await prisma.booking.update({
                where: { id: booking.id },
                data: { calendarEventId, meetLink },
            });
        } catch (calendarError) {
            console.error('Google Calendar event creation failed:', calendarError);
        }

        // Send confirmation email (non-critical — booking already confirmed)
        const RATE_PER_HOUR = 4500;
        const durationHours = slotIds.length;

        try {
            await sendBookingConfirmationEmail({
                to: [organizerEmail, ...booking.attendees],
                bookingRef: booking.ref ?? booking.id,
                title: booking.title,
                roomName: room.name,
                floor: room.floor,
                date: booking.date,
                startTime: booking.startTime,
                endTime: booking.endTime,
                totalAmount: durationHours * RATE_PER_HOUR,
                organizerEmail,
                attendees: booking.attendees,
                meetLink,
            });
        } catch (emailError) {
            console.error('Booking confirmation email failed:', emailError);
        }

        return NextResponse.json({
            success: true,
            bookingId: booking.id,
            booking: {
                id: booking.id,
                roomName: room.name,
                date: booking.date,
                startTime: booking.startTime,
                endTime: booking.endTime,
                title: booking.title,
                organizerEmail: booking.organizerEmail,
                attendees: booking.attendees,
                calendarEventId,
            },
        });
    } catch (error) {
        if (error instanceof SlotConflictError) {
            return NextResponse.json({ error: error.message }, { status: 409 });
        }
        // Unique constraint violation from the DB (second safety net)
        if (isUniqueConstraintError(error)) {
            return NextResponse.json(
                { error: 'This time slot was just booked by someone else. Please choose a different slot.' },
                { status: 409 },
            );
        }
        console.error('Booking creation failed:', error);
        return NextResponse.json({ error: 'Booking failed. Please try again.' }, { status: 500 });
    }
}

class SlotConflictError extends Error {}

function isUniqueConstraintError(error: unknown): boolean {
    return (
        typeof error === 'object' &&
        error !== null &&
        'code' in error &&
        (error as { code: string }).code === 'P2002'
    );
}

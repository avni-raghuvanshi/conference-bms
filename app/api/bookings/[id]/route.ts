import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

// GET /api/bookings/[id]?email=organizer@example.com
// Requires the organizer email to match — prevents PII disclosure to unauthenticated callers.
export async function GET(
    request: NextRequest,
    { params }: { params: { id: string } },
) {
    const booking = await prisma.booking.findUnique({
        where: { id: params.id },
    });

    if (!booking) {
        // Return 404 for both missing and unauthorized to avoid confirming ID existence
        return NextResponse.json({ error: 'Booking not found.' }, { status: 404 });
    }

    // Lightweight ownership check: caller must supply the organizer email
    const callerEmail = request.nextUrl.searchParams.get('email')?.trim().toLowerCase();
    if (!callerEmail || callerEmail !== booking.organizerEmail) {
        return NextResponse.json({ error: 'Booking not found.' }, { status: 404 });
    }

    const room = await prisma.room.findUnique({ where: { id: booking.roomId }, select: { name: true } });

    return NextResponse.json({
        id: booking.id,
        roomName: room?.name ?? booking.roomId,
        date: booking.date,
        startTime: booking.startTime,
        endTime: booking.endTime,
        title: booking.title,
        organizerEmail: booking.organizerEmail,
        attendees: booking.attendees,
        status: booking.status,
        calendarEventId: booking.calendarEventId,
        createdAt: booking.createdAt.toISOString(),
    });
}

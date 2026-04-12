import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { BASE_SLOTS } from '@/lib/rooms';
import { TimeSlot } from '@/lib/types';

// GET /api/rooms/[id]/slots?date=YYYY-MM-DD
// Returns all time slots for a room/date with real availability from the DB.
export async function GET(
    request: NextRequest,
    { params }: { params: { id: string } },
) {
    const { id: roomId } = params;
    const date = request.nextUrl.searchParams.get('date');

    if (!date || !/^\d{4}-\d{2}-\d{2}$/.test(date)) {
        return NextResponse.json(
            { error: 'Query param `date` is required in YYYY-MM-DD format.' },
            { status: 400 },
        );
    }

    // Fetch all confirmed bookings for this room+date in one query
    const bookedSlots = await prisma.booking.findMany({
        where: { roomId, date, status: 'CONFIRMED' },
        select: { startTime: true },
    });

    const bookedStartTimes = new Set(bookedSlots.map((b) => b.startTime));

    const slots: TimeSlot[] = BASE_SLOTS.map((slot) => ({
        ...slot,
        available: !bookedStartTimes.has(slot.startTime),
    }));

    return NextResponse.json(slots);
}

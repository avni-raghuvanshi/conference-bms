import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { BASE_SLOTS } from '@/lib/rooms';

// GET /api/rooms/[id]/availability?month=YYYY-MM
// Returns dates in the given month where all slots are booked.
export async function GET(
    request: NextRequest,
    { params }: { params: { id: string } },
) {
    const { id: roomId } = params;
    const month = request.nextUrl.searchParams.get('month');

    if (!month || !/^\d{4}-\d{2}$/.test(month)) {
        return NextResponse.json(
            { error: 'Query param `month` is required in YYYY-MM format.' },
            { status: 400 },
        );
    }

    // Date range for the queried month
    const [year, mon] = month.split('-').map(Number);
    const firstDay = `${month}-01`;
    const lastDayDate = new Date(year, mon, 0); // day 0 of next month = last day of this month
    const lastDay = `${month}-${String(lastDayDate.getDate()).padStart(2, '0')}`;

    // Fetch all confirmed bookings for this room in this month
    const bookings = await prisma.booking.findMany({
        where: {
            roomId,
            status: 'CONFIRMED',
            date: { gte: firstDay, lte: lastDay },
        },
        select: { date: true, startTime: true },
    });

    // Group booked startTimes by date
    const bookedByDate = new Map<string, Set<string>>();
    for (const b of bookings) {
        if (!bookedByDate.has(b.date)) bookedByDate.set(b.date, new Set());
        bookedByDate.get(b.date)!.add(b.startTime);
    }

    const totalSlots = BASE_SLOTS.length;

    // A date is fully booked when every slot start time has a confirmed booking
    const fullyBookedDates: string[] = [];
    bookedByDate.forEach((bookedTimes, date) => {
        if (bookedTimes.size >= totalSlots) {
            fullyBookedDates.push(date);
        }
    });

    return NextResponse.json({ bookedDates: fullyBookedDates });
}

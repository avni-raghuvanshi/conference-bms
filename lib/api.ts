import { Room, TimeSlot, BookingPayload, BookingResult } from './types';

// --------------------------------------------------------------------------
// Simulated network delay helper
// --------------------------------------------------------------------------
function delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

// --------------------------------------------------------------------------
// Mock Data
// --------------------------------------------------------------------------
const ROOMS: Room[] = [
    {
        id: 'room-alpha',
        name: 'Alpha Suite',
        slug: 'alpha-suite',
        capacity: 12,
        floor: 3,
        amenities: ['4K Display', 'Video Conferencing', 'Whiteboard', 'Sound System'],
        imageUrl: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&q=80',
        description: 'Spacious executive suite with panoramic city views, perfect for high-level meetings and presentations.',
    },
    {
        id: 'room-beta',
        name: 'Beta Lab',
        slug: 'beta-lab',
        capacity: 6,
        floor: 2,
        amenities: ['Dual Monitors', 'Whiteboard', 'High-Speed Wi-Fi'],
        imageUrl: 'https://images.unsplash.com/photo-1553877522-43269d4ea984?w=800&q=80',
        description: 'A collaborative workspace designed for small teams, brainstorming, and agile standups.',
    },
    {
        id: 'room-gamma',
        name: 'Gamma Hall',
        slug: 'gamma-hall',
        capacity: 30,
        floor: 5,
        amenities: ['Projector', 'Stage', 'Microphones', 'Video Recording', 'Breakout Areas'],
        imageUrl: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&q=80',
        description: 'A large event hall suitable for all-hands meetings, workshops, and company-wide presentations.',
    },
    {
        id: 'room-delta',
        name: 'Delta Pod',
        slug: 'delta-pod',
        capacity: 4,
        floor: 1,
        amenities: ['Smart TV', 'Whiteboard'],
        imageUrl: 'https://images.unsplash.com/photo-1568992687947-868a62a9f521?w=800&q=80',
        description: 'A cozy focus room ideal for quick syncs, 1:1s, and confidential conversations.',
    },
];

// Time slots for a working day
const BASE_SLOTS: Array<{ id: string; startTime: string; endTime: string }> = [
    { id: 'slot-1', startTime: '08:00', endTime: '09:00' },
    { id: 'slot-2', startTime: '09:00', endTime: '10:00' },
    { id: 'slot-3', startTime: '10:00', endTime: '11:00' },
    { id: 'slot-4', startTime: '11:00', endTime: '12:00' },
    { id: 'slot-5', startTime: '12:00', endTime: '13:00' },
    { id: 'slot-6', startTime: '13:00', endTime: '14:00' },
    { id: 'slot-7', startTime: '14:00', endTime: '15:00' },
    { id: 'slot-8', startTime: '15:00', endTime: '16:00' },
    { id: 'slot-9', startTime: '16:00', endTime: '17:00' },
    { id: 'slot-10', startTime: '17:00', endTime: '18:00' },
];

// --------------------------------------------------------------------------
// API Functions
// --------------------------------------------------------------------------

/**
 * Fetch all available rooms.
 */
export async function getRooms(): Promise<Room[]> {
    await delay(600);
    return ROOMS;
}

/**
 * Fetch available time slots for a given room and date.
 * Availability is simulated by seeding a deterministic pseudo-random
 * pattern from the roomId + date string — no hardcoded per-slot logic.
 */
export async function getAvailableSlots(
    roomId: string,
    date: string,
): Promise<TimeSlot[]> {
    await delay(800);

    // Deterministic seed from roomId + date so the UI is consistent per session
    const seed = Array.from(`${roomId}-${date}`).reduce(
        (acc, ch) => acc + ch.charCodeAt(0),
        0,
    );

    return BASE_SLOTS.map((slot, i) => ({
        ...slot,
        available: (seed + i * 7) % 3 !== 0, // ~66% available
    }));
}

/**
 * Submit a new booking.
 * Simulates a backend call. Returns a booking confirmation or error.
 */
export async function createBooking(
    data: BookingPayload,
): Promise<BookingResult> {
    await delay(1200);

    // Simulate occasional server-side validation failure (~5% of the time)
    if (Math.random() < 0.05) {
        return {
            success: false,
            message: 'The selected time slot is no longer available. Please choose another.',
        };
    }

    const room = ROOMS.find((r) => r.id === data.roomId);

    const bookingId = `BMS-${Date.now().toString(36).toUpperCase()}`;

    return {
        success: true,
        bookingId,
        booking: {
            id: bookingId,
            roomName: room?.name ?? 'Conference Room',
            date: data.date,
            startTime: data.startTime,
            endTime: data.endTime,
            title: data.title,
            organizerEmail: data.organizerEmail,
            attendees: data.attendees,
        },
    };
}

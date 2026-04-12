import { Room, TimeSlot, BookingPayload, BookingResult } from './types';

export async function getRooms(): Promise<Room[]> {
    const res = await fetch('/api/rooms');
    if (!res.ok) throw new Error('Failed to fetch rooms');
    return res.json();
}

export async function getAvailableSlots(roomId: string, date: string): Promise<TimeSlot[]> {
    const res = await fetch(`/api/rooms/${roomId}/slots?date=${encodeURIComponent(date)}`);
    if (!res.ok) throw new Error('Failed to fetch time slots');
    return res.json();
}

export async function getBookedDates(roomId: string, month: string): Promise<string[]> {
    const res = await fetch(`/api/rooms/${roomId}/availability?month=${encodeURIComponent(month)}`);
    if (!res.ok) throw new Error('Failed to fetch availability');
    const data = await res.json() as { bookedDates: string[] };
    return data.bookedDates;
}

export async function checkUser(email: string): Promise<{ isNewUser: boolean }> {
    const res = await fetch('/api/auth/check-user', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
    });
    if (!res.ok) throw new Error('Failed to check user');
    return res.json();
}

export async function sendOtp(email: string): Promise<void> {
    const res = await fetch('/api/auth/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
    });
    if (!res.ok) {
        const data = await res.json() as { error?: string };
        throw new Error(data.error ?? 'Failed to send OTP');
    }
}

export async function verifyOtp(email: string, otp: string): Promise<{ token: string }> {
    const res = await fetch('/api/auth/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, otp }),
    });
    const data = await res.json() as { token?: string; error?: string };
    if (!res.ok) throw new Error(data.error ?? 'Verification failed');
    return { token: data.token! };
}

export async function createBooking(
    payload: BookingPayload,
    otpToken?: string,
): Promise<BookingResult> {
    const headers: Record<string, string> = { 'Content-Type': 'application/json' };
    if (otpToken) headers['Authorization'] = `Bearer ${otpToken}`;

    const res = await fetch('/api/bookings', {
        method: 'POST',
        headers,
        body: JSON.stringify(payload),
    });

    const data = await res.json() as {
        success?: boolean;
        bookingId?: string;
        booking?: BookingResult['booking'];
        error?: string;
        requiresOtp?: boolean;
    };

    if (!res.ok) {
        return {
            success: false,
            message: data.error ?? 'Booking failed. Please try again.',
            requiresOtp: data.requiresOtp,
        };
    }

    return {
        success: true,
        bookingId: data.bookingId,
        booking: data.booking,
    };
}

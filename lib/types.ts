export interface Room {
    id: string;
    name: string;
    slug: string;
    capacity: number;
    floor: number;
    amenities: string[];
    imageUrl: string;
    description: string;
}

export interface TimeSlot {
    id: string;
    startTime: string; // "HH:MM"
    endTime: string;   // "HH:MM"
    available: boolean;
}

export interface BookingPayload {
    roomId: string;
    date: string;           // "YYYY-MM-DD"
    slotIds: string[];      // ordered list of selected slot IDs
    startTime: string;      // first slot's startTime "HH:MM"
    endTime: string;        // last slot's endTime "HH:MM"
    title: string;
    organizerEmail: string;
    attendees: string[];
}

export interface BookingResult {
    success: boolean;
    bookingId?: string;
    message?: string;
    requiresOtp?: boolean;
    booking?: ApiBooking;
}

export interface ApiBooking {
    id: string;
    roomName: string;
    date: string;
    startTime: string;
    endTime: string;
    title: string;
    organizerEmail: string;
    attendees: string[];
    status?: string;
    calendarEventId?: string;
    createdAt?: string;
}

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
    startTime: string; // "09:00"
    endTime: string;   // "10:00"
    available: boolean;
}

export interface BookingPayload {
    roomId: string;
    date: string;         // ISO date "YYYY-MM-DD"
    slotId: string;
    startTime: string;
    endTime: string;
    title: string;
    organizerEmail: string;
    attendees: string[];
}

export interface BookingResult {
    success: boolean;
    bookingId?: string;
    message?: string;
    booking?: {
        id: string;
        roomName: string;
        date: string;
        startTime: string;
        endTime: string;
        title: string;
        organizerEmail: string;
        attendees: string[];
    };
}

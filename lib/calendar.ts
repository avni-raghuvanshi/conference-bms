import { google } from 'googleapis';

interface CalendarEventInput {
    title: string;
    date: string;        // "YYYY-MM-DD"
    startTime: string;   // "HH:MM"
    endTime: string;     // "HH:MM"
    roomName: string;
    organizerEmail: string;
    attendees: string[];
    bookingId: string;
}

function getAuth() {
    const privateKey = (process.env.GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY ?? '')
        .replace(/\\n/g, '\n');

    return new google.auth.GoogleAuth({
        credentials: {
            client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
            private_key: privateKey,
        },
        clientOptions: {
            subject: process.env.GOOGLE_CALENDAR_IMPERSONATE_EMAIL, // e.g. reservations@conferra.co
        },
        scopes: ['https://www.googleapis.com/auth/calendar'],
    });
}

export async function createCalendarEvent(input: CalendarEventInput): Promise<{ eventId: string; meetLink: string | null }> {
    const auth = getAuth();
    const calendar = google.calendar({ version: 'v3', auth });

    const calendarId = process.env.GOOGLE_CALENDAR_ID ?? 'reservations@conferra.co';

    // Build attendee list: organizer + additional attendees + reservations mailbox
    const attendeeEmails = Array.from(
        new Set([input.organizerEmail, ...input.attendees, calendarId]),
    );

    const event = await calendar.events.insert({
        calendarId,
        conferenceDataVersion: 1,  // required to generate a Meet link
        sendUpdates: 'all',
        requestBody: {
            summary: input.title,
            description: `Booking ref: ${input.bookingId}\nRoom: ${input.roomName}`,
            location: input.roomName,
            start: {
                dateTime: `${input.date}T${input.startTime}:00`,
                timeZone: 'Asia/Kolkata',
            },
            end: {
                dateTime: `${input.date}T${input.endTime}:00`,
                timeZone: 'Asia/Kolkata',
            },
            attendees: attendeeEmails.map((email) => ({ email })),
            conferenceData: {
                createRequest: {
                    requestId: input.bookingId,
                    conferenceSolutionKey: { type: 'hangoutsMeet' },
                },
            },
            reminders: {
                useDefault: false,
                overrides: [
                    { method: 'email', minutes: 24 * 60 },
                    { method: 'popup', minutes: 30 },
                ],
            },
        },
    });

    return {
        eventId: event.data.id ?? '',
        meetLink: event.data.conferenceData?.entryPoints?.find(e => e.entryPointType === 'video')?.uri ?? null,
    };
}

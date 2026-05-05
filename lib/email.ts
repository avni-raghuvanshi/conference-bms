import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

const FROM = process.env.RESEND_FROM_EMAIL ?? 'reservations@conferra.co';

interface BookingConfirmationInput {
    to: string[];
    bookingRef: string;
    title: string;
    roomName: string;
    date: string;       // "YYYY-MM-DD"
    startTime: string;  // "HH:MM"
    endTime: string;    // "HH:MM"
    totalAmount: number;
    organizerEmail: string;
    attendees: string[];
    meetLink: string | null;
}

function formatDate(date: string): string {
    return new Date(`${date}T00:00:00`).toLocaleDateString('en-IN', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    });
}

function formatTime(time: string): string {
    const [h, m] = time.split(':').map(Number);
    const suffix = h < 12 ? 'AM' : 'PM';
    const display = h % 12 || 12;
    return `${display}:${String(m).padStart(2, '0')} ${suffix}`;
}

export async function sendBookingConfirmationEmail(input: BookingConfirmationInput): Promise<void> {
    const allRecipients = Array.from(new Set([input.organizerEmail, ...input.attendees]));

    const meetLinkBlock = input.meetLink
        ? `<a href="${input.meetLink}" style="display:inline-block;background:#1a73e8;color:#fff;text-decoration:none;padding:12px 24px;border-radius:6px;font-weight:600;font-size:14px;margin-top:4px;">Join Google Meet</a>
           <p style="color:#888;font-size:12px;margin-top:8px;">${input.meetLink}</p>`
        : '';

    const attendeeList = input.attendees.length > 0
        ? input.attendees.map((a) => `<li style="color:#555;font-size:14px;">${a}</li>`).join('')
        : '<li style="color:#888;font-size:14px;">None</li>';

    const html = `
        <div style="font-family:sans-serif;max-width:560px;margin:0 auto;padding:32px;color:#111;">
            <div style="margin-bottom:28px;">
                <span style="display:inline-block;background:#e8f5e9;color:#2e7d32;font-size:12px;font-weight:700;letter-spacing:0.08em;text-transform:uppercase;padding:4px 10px;border-radius:4px;margin-bottom:12px;">Booking Confirmed</span>
                <h1 style="font-size:22px;margin:0 0 4px;">${input.title}</h1>
                <p style="color:#555;font-size:14px;margin:0;">Booking Reference: <strong>${input.bookingRef}</strong></p>
            </div>

            <table style="width:100%;border-collapse:collapse;margin-bottom:28px;">
                <tr>
                    <td style="padding:10px 0;border-bottom:1px solid #eee;color:#888;font-size:13px;width:120px;">Room</td>
                    <td style="padding:10px 0;border-bottom:1px solid #eee;font-size:14px;font-weight:600;">${input.roomName}</td>
                </tr>
                <tr>
                    <td style="padding:10px 0;border-bottom:1px solid #eee;color:#888;font-size:13px;">Date</td>
                    <td style="padding:10px 0;border-bottom:1px solid #eee;font-size:14px;">${formatDate(input.date)}</td>
                </tr>
                <tr>
                    <td style="padding:10px 0;border-bottom:1px solid #eee;color:#888;font-size:13px;">Time</td>
                    <td style="padding:10px 0;border-bottom:1px solid #eee;font-size:14px;">${formatTime(input.startTime)} – ${formatTime(input.endTime)}</td>
                </tr>
                <tr>
                    <td style="padding:10px 0;border-bottom:1px solid #eee;color:#888;font-size:13px;">Total</td>
                    <td style="padding:10px 0;border-bottom:1px solid #eee;font-size:14px;font-weight:600;">₹${input.totalAmount.toLocaleString('en-IN')}</td>
                </tr>
                <tr>
                    <td style="padding:10px 0;color:#888;font-size:13px;">Booked by</td>
                    <td style="padding:10px 0;font-size:14px;">${input.organizerEmail}</td>
                </tr>
            </table>

            <div style="margin-bottom:28px;">
                <p style="font-size:13px;color:#888;margin-bottom:8px;text-transform:uppercase;letter-spacing:0.06em;">Attendees</p>
                <ul style="margin:0;padding-left:18px;">${attendeeList}</ul>
            </div>

            ${input.meetLink ? `
            <div style="background:#f7f9fc;border-radius:8px;padding:20px;margin-bottom:28px;">
                <p style="font-size:13px;color:#888;margin:0 0 12px;text-transform:uppercase;letter-spacing:0.06em;">Video Call</p>
                ${meetLinkBlock}
            </div>` : ''}

            <p style="color:#aaa;font-size:12px;margin:0;">
                Need to cancel? Reply to this email at ${FROM}.
            </p>
        </div>
    `;

    const { error } = await resend.emails.send({
        from: `Conferra <${FROM}>`,
        to: allRecipients,
        subject: `Booking Confirmed — ${input.roomName}, ${formatDate(input.date)}`,
        html,
    });

    if (error) throw new Error(error.message);
}

export async function sendOtpEmail(to: string, otp: string): Promise<void> {
    const { error } = await resend.emails.send({
        from: `Conferra <${FROM}>`,
        to,
        subject: `${otp} — Your Conferra verification code`,
        html: `
            <div style="font-family:sans-serif;max-width:480px;margin:0 auto;padding:32px;">
                <h2 style="font-size:18px;margin-bottom:8px;">Verify your email</h2>
                <p style="color:#555;margin-bottom:24px;">
                    Use the code below to confirm your identity. It expires in 10 minutes.
                </p>
                <div style="background:#f5f5f5;border-radius:8px;padding:24px;text-align:center;letter-spacing:0.3em;font-size:32px;font-weight:700;font-variant-numeric:tabular-nums;margin-bottom:24px;">${otp}</div>
                <p style="color:#888;font-size:13px;">
                    If you didn't request this, you can safely ignore this email.
                </p>
            </div>
        `,
    });
    if (error) throw new Error(error.message);
}

import { NextRequest, NextResponse } from 'next/server';
import { createHash } from 'crypto';
import { prisma } from '@/lib/db';
import { signOtpToken } from '@/lib/jwt';

const MAX_ATTEMPTS = 5;

// POST /api/auth/verify-otp
// Body: { email: string; otp: string }
// Returns: { token: string } — a short-lived JWT used to authorize the booking
export async function POST(request: NextRequest) {
    let body: unknown;
    try {
        body = await request.json();
    } catch {
        return NextResponse.json({ error: 'Invalid JSON body.' }, { status: 400 });
    }

    const { email, otp } = body as { email?: string; otp?: string };

    if (!email || typeof email !== 'string') {
        return NextResponse.json({ error: 'Email is required.' }, { status: 400 });
    }
    if (!otp || typeof otp !== 'string' || !/^\d{6}$/.test(otp)) {
        return NextResponse.json({ error: 'A 6-digit OTP is required.' }, { status: 400 });
    }

    const normalizedEmail = email.trim().toLowerCase();
    const now = new Date();

    // Find the most recent unused, unexpired OTP for this email that hasn't hit the attempt limit
    const record = await prisma.otpVerification.findFirst({
        where: {
            email: normalizedEmail,
            usedAt: null,
            expiresAt: { gt: now },
            attempts: { lt: MAX_ATTEMPTS },
        },
        orderBy: { createdAt: 'desc' },
    });

    if (!record) {
        return NextResponse.json(
            { error: 'Invalid or expired verification code. Please request a new one.' },
            { status: 401 },
        );
    }

    const otpHash = createHash('sha256').update(otp.trim()).digest('hex');

    if (record.otpHash !== otpHash) {
        // Increment failed attempt counter
        await prisma.otpVerification.update({
            where: { id: record.id },
            data: { attempts: { increment: 1 } },
        });

        const remaining = MAX_ATTEMPTS - (record.attempts + 1);
        return NextResponse.json(
            {
                error: remaining > 0
                    ? `Incorrect code. ${remaining} attempt${remaining === 1 ? '' : 's'} remaining.`
                    : 'Too many incorrect attempts. Please request a new code.',
            },
            { status: 401 },
        );
    }

    // Mark the OTP as used (one-time)
    await prisma.otpVerification.update({
        where: { id: record.id },
        data: { usedAt: now },
    });

    const token = await signOtpToken(normalizedEmail);
    return NextResponse.json({ token });
}

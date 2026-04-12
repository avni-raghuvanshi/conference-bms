import { NextRequest, NextResponse } from 'next/server';
import { createHash, randomInt } from 'crypto';
import { prisma } from '@/lib/db';
import { sendOtpEmail } from '@/lib/email';

const OTP_TTL_MINUTES = 10;
// Prevent abuse: max 3 OTP requests per email per 10 minutes
const RATE_LIMIT_WINDOW_MINUTES = 10;
const RATE_LIMIT_MAX = 3;

// IP-level cap: max 10 OTP sends per minute per IP (blocks bulk email abuse)
const ipHits = new Map<string, { count: number; resetAt: number }>();
const IP_LIMIT = 10;
const IP_WINDOW_MS = 60_000;

function isIpRateLimited(ip: string): boolean {
    const now = Date.now();
    const entry = ipHits.get(ip);
    if (!entry || now > entry.resetAt) {
        ipHits.set(ip, { count: 1, resetAt: now + IP_WINDOW_MS });
        return false;
    }
    entry.count += 1;
    return entry.count > IP_LIMIT;
}

// POST /api/auth/send-otp
// Body: { email: string }
export async function POST(request: NextRequest) {
    const ip = request.headers.get('x-forwarded-for')?.split(',')[0].trim() ?? 'unknown';
    if (isIpRateLimited(ip)) {
        return NextResponse.json({ error: 'Too many requests. Please try again shortly.' }, { status: 429 });
    }

    let body: unknown;
    try {
        body = await request.json();
    } catch {
        return NextResponse.json({ error: 'Invalid JSON body.' }, { status: 400 });
    }

    const { email } = body as { email?: string };
    if (!email || typeof email !== 'string' || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
        return NextResponse.json({ error: 'A valid email is required.' }, { status: 400 });
    }

    const normalizedEmail = email.trim().toLowerCase();
    const now = new Date();

    // Rate limit check
    const windowStart = new Date(now.getTime() - RATE_LIMIT_WINDOW_MINUTES * 60 * 1000);
    const recentCount = await prisma.otpVerification.count({
        where: {
            email: normalizedEmail,
            createdAt: { gte: windowStart },
        },
    });

    if (recentCount >= RATE_LIMIT_MAX) {
        return NextResponse.json(
            { error: 'Too many OTP requests. Please wait a few minutes before trying again.' },
            { status: 429 },
        );
    }

    // Generate a cryptographically secure 6-digit OTP
    const otp = String(randomInt(100000, 999999));
    const otpHash = createHash('sha256').update(otp).digest('hex');
    const expiresAt = new Date(now.getTime() + OTP_TTL_MINUTES * 60 * 1000);

    try {
        await prisma.otpVerification.create({
            data: { email: normalizedEmail, otpHash, expiresAt },
        });

        await sendOtpEmail(normalizedEmail, otp);
    } catch (err) {
        console.error('[send-otp] Failed to create OTP or send email:', err);
        return NextResponse.json({ error: 'Failed to send verification code. Please try again.' }, { status: 500 });
    }

    return NextResponse.json({ ok: true });
}

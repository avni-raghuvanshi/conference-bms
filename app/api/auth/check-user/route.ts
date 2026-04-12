import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

// Simple in-memory IP rate limiter (resets on server restart; use Redis for multi-instance deployments)
const ipHits = new Map<string, { count: number; resetAt: number }>();
const IP_LIMIT = 20;
const IP_WINDOW_MS = 60_000; // 20 calls per minute per IP

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

// POST /api/auth/check-user
// Body: { email: string }
// Returns: { isNewUser: boolean }
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
    const user = await prisma.user.findUnique({ where: { email: normalizedEmail } });

    return NextResponse.json({ isNewUser: user === null });
}

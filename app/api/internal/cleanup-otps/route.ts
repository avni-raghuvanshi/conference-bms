import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

// POST /api/internal/cleanup-otps
// Called by a cron job (e.g. Vercel cron) to purge expired OTP records.
// Protected by a shared secret in the Authorization header.
export async function POST(request: NextRequest) {
    const expectedToken = process.env.INTERNAL_CRON_SECRET;
    if (!expectedToken) {
        return NextResponse.json({ error: 'Cron secret not configured.' }, { status: 500 });
    }

    const provided = request.headers.get('Authorization')?.replace('Bearer ', '');
    if (provided !== expectedToken) {
        return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 });
    }

    const { count } = await prisma.otpVerification.deleteMany({
        where: { expiresAt: { lt: new Date() } },
    });

    return NextResponse.json({ deleted: count });
}

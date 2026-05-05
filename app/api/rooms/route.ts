import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET() {
    const rooms = await prisma.room.findMany({ orderBy: { capacity: 'desc' } });
    return NextResponse.json(rooms);
}

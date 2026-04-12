import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET() {
    const rooms = await prisma.room.findMany({ orderBy: { floor: 'asc' } });
    return NextResponse.json(rooms);
}

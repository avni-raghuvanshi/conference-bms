import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const rooms = [
    {
        id: 'room-orbit',
        name: 'Orbit',
        slug: 'orbit',
        capacity: 22,
        hasAV: true,
        imageUrl: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&q=80',
        description: 'Seats 22. Conference room with full audio/video setup. Suited for presentations, team meetings, and workshops.',
        priceMin: 2200,
        priceMax: 3000,
    },
    {
        id: 'room-huddle',
        name: 'Huddle',
        slug: 'huddle',
        capacity: 15,
        hasAV: true,
        imageUrl: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&q=80',
        description: 'Seats 15. Meeting room with display screen and video conferencing. Good for client meetings and team sessions.',
        priceMin: 2000,
        priceMax: 2500,
    },
    {
        id: 'room-sync',
        name: 'Sync',
        slug: 'sync',
        capacity: 8,
        hasAV: false,
        imageUrl: 'https://images.unsplash.com/photo-1553877522-43269d4ea984?w=800&q=80',
        description: 'Seats 8. Quiet room for focused discussions, strategy sessions, and small-group work.',
        priceMin: 1800,
        priceMax: 2000,
    },
    {
        id: 'room-loop',
        name: 'Loop',
        slug: 'loop',
        capacity: 8,
        hasAV: false,
        imageUrl: 'https://images.unsplash.com/photo-1568992687947-868a62a9f521?w=800&q=80',
        description: 'Seats 8. Compact room for 1:1s, interviews, and short team syncs.',
        priceMin: 1800,
        priceMax: 2000,
    },
];

async function main() {
    await prisma.room.deleteMany({});
    await prisma.room.createMany({ data: rooms });
    console.log(`Seeded ${rooms.length} rooms.`);
}

main()
    .catch((e) => { console.error(e); process.exit(1); })
    .finally(() => prisma.$disconnect());

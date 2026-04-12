import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const rooms = [
    {
        id: 'room-alpha',
        name: 'Alpha Suite',
        slug: 'alpha-suite',
        capacity: 12,
        floor: 3,
        amenities: ['4K Display', 'Video Conferencing', 'Whiteboard', 'Sound System'],
        imageUrl: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&q=80',
        description: 'Spacious executive suite with panoramic city views, perfect for high-level meetings and presentations.',
    },
    {
        id: 'room-beta',
        name: 'Beta Lab',
        slug: 'beta-lab',
        capacity: 6,
        floor: 2,
        amenities: ['Dual Monitors', 'Whiteboard', 'High-Speed Wi-Fi'],
        imageUrl: 'https://images.unsplash.com/photo-1553877522-43269d4ea984?w=800&q=80',
        description: 'A collaborative workspace designed for small teams, brainstorming, and agile standups.',
    },
    {
        id: 'room-gamma',
        name: 'Gamma Hall',
        slug: 'gamma-hall',
        capacity: 30,
        floor: 5,
        amenities: ['Projector', 'Stage', 'Microphones', 'Video Recording', 'Breakout Areas'],
        imageUrl: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&q=80',
        description: 'A large event hall suitable for all-hands meetings, workshops, and company-wide presentations.',
    },
    {
        id: 'room-delta',
        name: 'Delta Pod',
        slug: 'delta-pod',
        capacity: 4,
        floor: 1,
        amenities: ['Smart TV', 'Whiteboard'],
        imageUrl: 'https://images.unsplash.com/photo-1568992687947-868a62a9f521?w=800&q=80',
        description: 'A cozy focus room ideal for quick syncs, 1:1s, and confidential conversations.',
    },
];

async function main() {
    for (const room of rooms) {
        await prisma.room.upsert({
            where: { id: room.id },
            update: room,
            create: room,
        });
    }
    console.log(`Seeded ${rooms.length} rooms.`);
}

main()
    .catch((e) => { console.error(e); process.exit(1); })
    .finally(() => prisma.$disconnect());

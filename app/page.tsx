import type { Metadata } from 'next';
import Link from 'next/link';
import styles from './page.module.css';
import Image from 'next/image';
import Button from '@/components/ui/Button';
import Container from '@/components/container/Container';

export const metadata: Metadata = {
    title: 'Conference BMS — Book Smarter, Meet Better',
    description:
        'Instantly reserve conference rooms for your team. Real-time availability, seamless scheduling.',
    openGraph: {
        title: 'Conference BMS — Book Smarter, Meet Better',
        description:
            'Instantly reserve conference rooms for your team. Real-time availability, seamless scheduling.',
    },
};

const FEATURES = [
    {
        icon: '🏢',
        color: 'indigo' as const,
        title: 'Curated Spaces',
        desc: 'From cozy 4-person pods to 30-seat event halls — every room optimized for productivity.',
    },
    {
        icon: '⚡',
        color: 'pink' as const,
        title: 'Instant Confirmation',
        desc: 'Reserve in under a minute. No back-and-forth emails, no allocation conflicts.',
    },
    {
        icon: '📅',
        color: 'green' as const,
        title: 'Live Availability',
        desc: 'Real-time slot data ensures you always see what\'s actually open right now.',
    },
    {
        icon: '👥',
        color: 'orange' as const,
        title: 'Invite Your Team',
        desc: 'Add attendees at booking time — everyone gets the right details from day one.',
    },
    {
        icon: '🔒',
        color: 'blue' as const,
        title: 'Conflict-Free',
        desc: 'Built-in scheduling logic prevents double-bookings across your entire team.',
    },
    {
        icon: '📊',
        color: 'purple' as const,
        title: 'Any Device',
        desc: 'Fully responsive and accessible — book from desktop, tablet, or phone.',
    },
];

export default function HomePage() {
    return (
        <div className={styles.mainLayout}>
            <main>
                <section className={styles.heroSection}>
                    <Image
                        src="https://res.cloudinary.com/doggeavv4/image/upload/v1774977603/hero_image_hskvjv.webp?w=1280"
                        alt="Hero Image"
                        fill
                        priority
                        className={styles.heroImage}
                    />
                    <div className={styles.heroContent}>
                        <Container>
                            <div className={styles.innerContent}>
                                <h1>Where Cases are Won & <i>Precedents</i> are Set</h1>
                                <p>Strategically positioned within reach of the Supreme Court and Delhi High Court. Our executive suites are designed to provide the perfect blend of comfort, convenience, and professionalism for legal minds who demand the best.</p>
                                <div className={styles.ctaContainer}>
                                    <Button>
                                        Find Your Space
                                    </Button>
                                    <Button variant="secondary">
                                        Virtual Tour
                                    </Button>
                                </div>
                            </div>
                        </Container>
                    </div>
                </section>
            </main>
        </div>
    );
}

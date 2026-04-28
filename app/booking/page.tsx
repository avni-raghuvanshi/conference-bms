import type { Metadata } from 'next';
import BookingForm from '@/components/booking/BookingForm';
import styles from './page.module.css';

export const metadata: Metadata = {
    title: 'Book a Meeting Room',
    description:
        'Reserve a meeting room in GK II, New Delhi. Select a room, pick a date, choose a time slot, and confirm in seconds.',
    openGraph: {
        title: 'Book a Meeting Room | Conferra',
        description:
            'Reserve a private meeting room in Greater Kailash II. Real-time availability.',
    },
};

export default function BookingPage() {
    return (
        <div className={styles.page}>
            <header className={styles.pageHeader}>
                <div className={styles.pageHeaderLeft}>
                    <span className={styles.kicker}>Booking</span>
                    <h1 className={styles.pageTitle}>
                        Book a
                        <br />
                        Meeting Room.
                    </h1>
                </div>
                <div className={styles.pageHeaderRule} aria-hidden="true" />
            </header>

            <main className={styles.main} id="main-content">
                <BookingForm />
            </main>
        </div>
    );
}

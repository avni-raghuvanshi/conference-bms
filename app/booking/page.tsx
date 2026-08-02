import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import BookingForm from '@/components/booking/BookingForm';
import styles from './page.module.css';

export const metadata: Metadata = {
    title: 'Book a Meeting Room',
    description:
        'Reserve a meeting room in East of Kailash, New Delhi. Select a room, pick a date, choose a time slot, and confirm in seconds.',
    openGraph: {
        title: 'Book a Meeting Room | Conferra',
        description:
            'Reserve a private meeting room in Delhi. Real-time availability.',
    },
};

export default function BookingPage() {
    // Booking flow is disabled while the site is being redone — route back home.
    redirect('/');

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

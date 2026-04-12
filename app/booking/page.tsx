import type { Metadata } from 'next';
import BookingForm from '@/components/booking/BookingForm';
import styles from './page.module.css';

export const metadata: Metadata = {
    title: 'Configure Your Environment',
    description:
        'Reserve a conference room for your next meeting. Select a room, pick a date, choose a time slot, and confirm in seconds.',
    openGraph: {
        title: 'Configure Your Environment | CONFERRA',
        description:
            'Reserve a premium conference room. Real-time availability, seamless scheduling.',
    },
};

export default function BookingPage() {
    return (
        <div className={styles.page}>
            <header className={styles.pageHeader}>
                <div className={styles.pageHeaderLeft}>
                    <span className={styles.kicker}>RESERVATION GATEWAY</span>
                    <h1 className={styles.pageTitle}>
                        Configure Your
                        <br />
                        Environment.
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

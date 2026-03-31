import type { Metadata } from 'next';
import Link from 'next/link';
import BookingForm from '@/components/booking/BookingForm';
import styles from './page.module.css';

export const metadata: Metadata = {
    title: 'Book a Room',
    description:
        'Reserve a conference room for your next meeting. Select a room, pick a date, choose a time slot, and confirm in seconds.',
    openGraph: {
        title: 'Book a Conference Room | Conference BMS',
        description:
            'Instantly reserve a conference room. Real-time availability, seamless scheduling.',
    },
};

export default function BookingPage() {
    return (
        <div className={styles.page}>
            {/* ─── Header ─── */}
            <header className={styles.header}>
                <div className={`container ${styles.headerInner}`}>
                    <Link href="/" className={styles.logo} aria-label="Back to home">
                        <span className={styles.logoIcon} aria-hidden="true">🏛</span>
                        <span className={styles.logoText}>ConfBMS</span>
                    </Link>
                    <nav aria-label="Breadcrumb">
                        <ol className={styles.breadcrumb}>
                            <li>
                                <Link href="/" className={styles.breadcrumbLink}>Home</Link>
                            </li>
                            <li aria-hidden="true" className={styles.breadcrumbSep}>›</li>
                            <li aria-current="page" className={styles.breadcrumbCurrent}>
                                Book a Room
                            </li>
                        </ol>
                    </nav>
                </div>
            </header>

            {/* ─── Page Hero ─── */}
            <div className={styles.pageHero}>
                <div className="container">
                    <div className={styles.pageHeroContent}>
                        <span className={styles.pageHeroKicker}>Conference BMS</span>
                        <h1 className={styles.pageHeroTitle}>Book a Conference Room</h1>
                        <p className={styles.pageHeroDesc}>
                            Complete the steps below to reserve your room. All fields marked with{' '}
                            <span aria-hidden="true">*</span> are required.
                        </p>
                    </div>
                </div>
            </div>

            {/* ─── Form ─── */}
            <main className={styles.main} id="main-content">
                <div className="container">
                    <div className={styles.formWrapper}>
                        <BookingForm />
                    </div>
                </div>
            </main>

            {/* ─── Footer ─── */}
            <footer className={styles.footer}>
                <div className="container">
                    <p>
                        <Link href="/" className={styles.backLink}>
                            ← Back to Home
                        </Link>
                    </p>
                </div>
            </footer>
        </div>
    );
}

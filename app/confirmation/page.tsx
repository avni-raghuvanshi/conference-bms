'use client';

import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';
import Link from 'next/link';
import styles from './page.module.css';

function formatDate(dateStr: string): string {
    if (!dateStr) return '';
    try {
        const [y, m, d] = dateStr.split('-').map(Number);
        return new Date(y, m - 1, d).toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        });
    } catch {
        return dateStr;
    }
}

function formatTime(time: string): string {
    if (!time) return '';
    const [h, min] = time.split(':').map(Number);
    const suffix = h < 12 ? 'AM' : 'PM';
    const display = h % 12 || 12;
    return `${display}:${String(min).padStart(2, '0')} ${suffix}`;
}

function ConfirmationContent() {
    const searchParams = useSearchParams();

    const status = searchParams.get('status') ?? '';
    const bookingId = searchParams.get('bookingId') ?? '';
    const room = searchParams.get('room') ?? '';
    const date = searchParams.get('date') ?? '';
    const start = searchParams.get('start') ?? '';
    const end = searchParams.get('end') ?? '';
    const title = searchParams.get('title') ?? '';
    const email = searchParams.get('email') ?? '';

    const isSuccess = status === 'success';

    return (
        <main className={styles.main}>
            {/* ─── Status Card ─── */}
            <div className={[styles.card, isSuccess ? styles.cardSuccess : styles.cardError].join(' ')}>
                <div className={styles.iconWrapper} aria-hidden="true">
                    <span className={styles.icon}>{isSuccess ? '✓' : '✕'}</span>
                </div>

                <div className={styles.statusText}>
                    <h1 className={styles.title}>
                        {isSuccess ? 'Booking Confirmed!' : 'Booking Failed'}
                    </h1>
                    <p className={styles.subtitle}>
                        {isSuccess
                            ? 'Your conference room has been successfully reserved.'
                            : 'We couldn\'t complete your booking. Please try again.'}
                    </p>
                </div>

                {isSuccess && bookingId && (
                    <div className={styles.bookingId}>
                        <span className={styles.bookingIdLabel}>Booking ID</span>
                        <code className={styles.bookingIdValue}>{bookingId}</code>
                    </div>
                )}
            </div>

            {/* ─── Booking Summary ─── */}
            {isSuccess && (room || date || title) && (
                <section className={styles.summary} aria-labelledby="summary-title">
                    <h2 id="summary-title" className={styles.summaryTitle}>
                        Booking Summary
                    </h2>

                    <dl className={styles.details}>
                        {title && (
                            <>
                                <dt className={styles.detailLabel}>Meeting</dt>
                                <dd className={styles.detailValue}>{title}</dd>
                            </>
                        )}
                        {room && (
                            <>
                                <dt className={styles.detailLabel}>Room</dt>
                                <dd className={styles.detailValue}>{room}</dd>
                            </>
                        )}
                        {date && (
                            <>
                                <dt className={styles.detailLabel}>Date</dt>
                                <dd className={styles.detailValue}>{formatDate(date)}</dd>
                            </>
                        )}
                        {(start || end) && (
                            <>
                                <dt className={styles.detailLabel}>Time</dt>
                                <dd className={styles.detailValue}>
                                    {formatTime(start)} – {formatTime(end)}
                                </dd>
                            </>
                        )}
                        {email && (
                            <>
                                <dt className={styles.detailLabel}>Organizer</dt>
                                <dd className={styles.detailValue}>{email}</dd>
                            </>
                        )}
                    </dl>

                    <div className={styles.saveHint}>
                        <span className={styles.saveHintIcon} aria-hidden="true">💡</span>
                        <p>Save your Booking ID <strong>{bookingId}</strong> for your records.</p>
                    </div>
                </section>
            )}

            {/* ─── Actions ─── */}
            <div className={styles.actions}>
                {isSuccess ? (
                    <>
                        <Link href="/" className={styles.actionLinkGhost}>
                            Return to Home
                        </Link>
                        <Link href="/booking" className={styles.actionLinkPrimary}>
                            Book Another Room
                        </Link>
                    </>
                ) : (
                    <>
                        <Link href="/" className={styles.actionLinkGhost}>
                            Back to Home
                        </Link>
                        <Link href="/booking" className={styles.actionLinkPrimary}>
                            Try Again
                        </Link>
                    </>
                )}
            </div>
        </main>
    );
}

export default function ConfirmationPage() {
    return (
        <div className={styles.page}>
            {/* ─── Header ─── */}
            <header className={styles.header}>
                <div className={`container ${styles.headerInner}`}>
                    <Link href="/" className={styles.logo} aria-label="Back to home">
                        <span className={styles.logoIcon} aria-hidden="true">🏛</span>
                        <span className={styles.logoText}>ConfBMS</span>
                    </Link>
                </div>
            </header>

            <Suspense fallback={
                <div className={styles.loadingFallback} aria-live="polite">
                    Loading confirmation…
                </div>
            }>
                <ConfirmationContent />
            </Suspense>
        </div>
    );
}

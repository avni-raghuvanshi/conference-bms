import { Suspense } from 'react';
import Link from 'next/link';
import { prisma } from '@/lib/db';
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

interface ConfirmationPageProps {
    searchParams: { bookingId?: string };
}

async function ConfirmationContent({ bookingId }: { bookingId: string | undefined }) {
    if (!bookingId) {
        return <ErrorState message="No booking reference provided." />;
    }

    const booking = await prisma.booking.findUnique({ where: { id: bookingId } });

    if (!booking || booking.status !== 'CONFIRMED') {
        return <ErrorState message="Booking not found or was cancelled." />;
    }

    const room = await prisma.room.findUnique({ where: { id: booking.roomId }, select: { name: true } });
    const roomName = room?.name ?? booking.roomId;

    return (
        <main className={styles.main}>
            {/* ── Two-column: Identity + Session ── */}
            <div className={styles.grid}>

                {/* Left: Identity status */}
                <section className={styles.identity} aria-labelledby="identity-title">
                    <div className={styles.identityHeading}>
                        <span className={styles.kicker}>Booking Confirmed</span>
                        <h1 className={styles.title} id="identity-title">
                            You're<br /><em className={styles.titleAccent}>Booked.</em>
                        </h1>
                    </div>

                    <div className={styles.statusCard}>
                        <div className={[styles.iconWrap, styles.iconWrapSuccess].join(' ')} aria-hidden="true">
                            <svg viewBox="0 0 24 24" fill="currentColor" width="22" height="22">
                                <path fillRule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zm13.36-1.814a.75.75 0 10-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.14-.094l3.75-5.25z" clipRule="evenodd" />
                            </svg>
                        </div>

                        <div className={styles.statusBody}>
                            <p className={styles.statusText}>
                                Your meeting room is confirmed. A confirmation email has been sent to your inbox.
                            </p>
                        </div>
                    </div>
                </section>

                {/* Right: Session card */}
                <section className={styles.sessionCard} aria-label="Booking session details">
                    <div className={styles.sessionInner}>
                        <p className={styles.sessionKicker}>Booking Details</p>
                        <p className={styles.confeRra}>CONFERRA</p>

                        <p className={styles.accessLabel}>Booking Reference</p>
                        <p className={styles.bookingRef} aria-label={`Booking reference ${booking.ref ?? booking.id}`}>
                            {booking.ref ?? booking.id}
                        </p>

                        <div className={styles.sessionDivider} aria-hidden="true" />

                        <dl className={styles.sessionDetails}>
                            <div className={styles.sessionRow}>
                                <dt className={styles.sessionKey}>Room</dt>
                                <dd className={styles.sessionVal}>{roomName}</dd>
                            </div>
                            <div className={styles.sessionRow}>
                                <dt className={styles.sessionKey}>Time</dt>
                                <dd className={styles.sessionVal}>
                                    {formatTime(booking.startTime)} — {formatTime(booking.endTime)}
                                </dd>
                            </div>
                            <div className={styles.sessionRow}>
                                <dt className={styles.sessionKey}>Date</dt>
                                <dd className={styles.sessionVal}>{formatDate(booking.date)}</dd>
                            </div>
                            <div className={styles.sessionRow}>
                                <dt className={styles.sessionKey}>Booked by</dt>
                                <dd className={styles.sessionVal}>{booking.organizerEmail}</dd>
                            </div>
                        </dl>
                    </div>
                </section>
            </div>

            {/* ── Bottom bar ── */}
            <section className={styles.confirmed} aria-labelledby="confirmed-title">
                <div className={styles.confirmedLeft}>
                    <div className={styles.confirmedDivider} aria-hidden="true" />
                    <div>
                        <p className={styles.confirmedKicker} id="confirmed-title">Your Booking</p>
                        <p className={styles.confirmedRef}>{booking.ref ?? booking.id}</p>
                        <div className={styles.confirmedMeta}>
                            <p className={styles.confirmedMetaItem}>{booking.title}</p>
                            <p className={styles.confirmedMetaItem}>{roomName}</p>
                        </div>
                    </div>
                </div>

                <div className={styles.confirmedRight}>
                    <div className={styles.actions}>
                        <Link href="/" className={styles.actionGhost}>Return to Home</Link>
                        <Link href="/booking" className={styles.actionPrimary}>Book Another Room</Link>
                    </div>
                </div>
            </section>
        </main>
    );
}

function ErrorState({ message }: { message: string }) {
    return (
        <main className={styles.main}>
            <div className={styles.grid}>
                <section className={styles.identity} aria-labelledby="identity-title">
                    <div className={styles.identityHeading}>
                        <span className={styles.kicker}>Booking Error</span>
                        <h1 className={styles.title} id="identity-title">
                            Booking<br /><em className={styles.titleErrorAccent}>Failed.</em>
                        </h1>
                    </div>
                    <div className={styles.statusCard}>
                        <div className={[styles.iconWrap, styles.iconWrapError].join(' ')} aria-hidden="true">
                            <svg viewBox="0 0 24 24" fill="currentColor" width="22" height="22">
                                <path fillRule="evenodd" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zm-1.72 6.97a.75.75 0 10-1.06 1.06L10.94 12l-1.72 1.72a.75.75 0 101.06 1.06L12 13.06l1.72 1.72a.75.75 0 101.06-1.06L13.06 12l1.72-1.72a.75.75 0 10-1.06-1.06L12 10.94l-1.72-1.72z" clipRule="evenodd" />
                            </svg>
                        </div>
                        <div className={styles.statusBody}>
                            <p className={styles.statusText}>{message}</p>
                        </div>
                    </div>
                </section>

                <section className={styles.sessionCard} aria-label="Session status">
                    <div className={styles.sessionInner}>
                        <p className={styles.sessionKicker}>Session Terminated</p>
                        <p className={styles.confeRra}>CONFERRA</p>
                        <p className={styles.accessLabel}>RESERVATION REQUEST</p>
                        <p className={styles.bookingRef}>—</p>
                    </div>
                </section>
            </div>

            <section className={styles.confirmed}>
                <div className={styles.confirmedRight} style={{ marginInlineStart: 'auto' }}>
                    <div className={[styles.accessBadge, styles.accessBadgeError].join(' ')}>
                        ACCESS DENIED
                    </div>
                    <div className={styles.actions}>
                        <Link href="/" className={styles.actionGhost}>Return to Home</Link>
                        <Link href="/booking" className={styles.actionPrimary}>Try Again</Link>
                    </div>
                </div>
            </section>
        </main>
    );
}

export default function ConfirmationPage({ searchParams }: ConfirmationPageProps) {
    return (
        <div className={styles.page}>
            <Suspense fallback={
                <div className={styles.loadingFallback} aria-live="polite">
                    Loading confirmation…
                </div>
            }>
                <ConfirmationContent bookingId={searchParams.bookingId} />
            </Suspense>
        </div>
    );
}

import type { Metadata } from 'next';
import Link from 'next/link';
import styles from './page.module.css';

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
        <div className={styles.page}>
            {/* ─── Header ─── */}
            <header className={styles.header}>
                <div className={`container ${styles.headerInner}`}>
                    <Link href="/" className={styles.logo} aria-label="Conference BMS Home">
                        <span className={styles.logoIcon} aria-hidden="true">🏛</span>
                        <span className={styles.logoText}>
                            Conf<span>BMS</span>
                        </span>
                    </Link>
                    <nav className={styles.nav} aria-label="Main navigation">
                        <Link href="/booking" className={styles.navLink}>
                            Book a Room
                        </Link>
                    </nav>
                </div>
            </header>

            {/* ─── Hero ─── */}
            <main>
                <section className={styles.hero} aria-labelledby="hero-title">
                    <div className={styles.heroBg} aria-hidden="true">
                        <div className={`${styles.orb} ${styles.orb1}`} />
                        <div className={`${styles.orb} ${styles.orb2}`} />
                    </div>

                    <div className="container">
                        <div className={styles.heroContent}>
                            <div className={styles.badge} role="status">
                                <span className={styles.badgeDot} aria-hidden="true" />
                                Rooms Available Now
                            </div>

                            <h1 id="hero-title" className={styles.heroTitle}>
                                Book Smarter,<br />
                                Meet <em>Better</em>
                            </h1>

                            <p className={styles.heroSubtitle}>
                                Reserve the perfect conference room in seconds. Real-time
                                availability, seamless scheduling, zero friction.
                            </p>

                            <div className={styles.heroCta}>
                                <Link href="/booking" className={styles.ctaBtnPrimary}>
                                    Book a Room Now →
                                </Link>
                                <p className={styles.ctaTrust}>No account required · Free to use</p>
                            </div>

                            <div className={styles.heroStats} aria-label="Key statistics">
                                <div className={styles.stat}>
                                    <span className={styles.statValue}>4</span>
                                    <span className={styles.statLabel}>Rooms</span>
                                </div>
                                <div className={styles.stat}>
                                    <span className={styles.statValue}>10</span>
                                    <span className={styles.statLabel}>Time Slots</span>
                                </div>
                                <div className={styles.stat}>
                                    <span className={styles.statValue}>&lt;1 min</span>
                                    <span className={styles.statLabel}>To Book</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* ─── Features ─── */}
                <section className={styles.featuresSection} aria-labelledby="features-title">
                    <div className="container">
                        <div className={styles.sectionHeader}>
                            <span className={styles.sectionKicker}>Why Conference BMS</span>
                            <h2 id="features-title" className={styles.sectionTitle}>
                                Everything you need to<br />run great meetings
                            </h2>
                            <p className={styles.sectionDesc}>
                                Designed around the way teams actually work — fast, flexible, and frustration-free.
                            </p>
                        </div>

                        <div className={styles.featuresGrid}>
                            {FEATURES.map(({ icon, color, title, desc }) => (
                                <article key={title} className={styles.featureCard}>
                                    <div className={`${styles.featureIcon} ${styles[color]}`} aria-hidden="true">
                                        {icon}
                                    </div>
                                    <h3 className={styles.featureTitle}>{title}</h3>
                                    <p className={styles.featureDesc}>{desc}</p>
                                </article>
                            ))}
                        </div>
                    </div>
                </section>

                {/* ─── CTA Banner ─── */}
                <section className={styles.ctaBanner} aria-labelledby="cta-title">
                    <div className="container">
                        <div className={styles.ctaBannerInner}>
                            <h2 id="cta-title" className={styles.ctaTitle}>
                                Ready to reclaim your time?
                            </h2>
                            <p className={styles.ctaDesc}>
                                Your next great meeting is one click away.
                            </p>
                            <Link href="/booking" className={styles.ctaBtnSecondary}>
                                Reserve Your Room
                            </Link>
                        </div>
                    </div>
                </section>
            </main>

            {/* ─── Footer ─── */}
            <footer className={styles.footer}>
                <div className="container">
                    <div className={styles.footerInner}>
                        <p className={styles.footerLogo}>Conference BMS</p>
                        <nav className={styles.footerLinks} aria-label="Footer navigation">
                            <Link href="/" className={styles.footerLink}>Home</Link>
                            <Link href="/booking" className={styles.footerLink}>Book a Room</Link>
                        </nav>
                        <p className={styles.footerCopy}>
                            © {new Date().getFullYear()} Conference BMS. All rights reserved.
                        </p>
                    </div>
                </div>
            </footer>
        </div>
    );
}

import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { prisma } from '@/lib/db';
import styles from './page.module.css';

export const metadata: Metadata = {
    title: 'Conferra — Meeting Rooms in Greater Kailash, Delhi',
    description:
        'Private meeting rooms in GK II, South Delhi. Audio/video conferencing included. Book by the hour.',
};

function getRoomLabel(capacity: number): string {
    if (capacity >= 20) return 'Conference Hall';
    if (capacity >= 12) return 'Executive Suite';
    if (capacity >= 8) return 'Meeting Room';
    return 'Focus Room';
}

export default async function HomePage() {
    const rooms = await prisma.room.findMany({ orderBy: { capacity: 'desc' } });
    return (
        <>
            <main>
                {/* ── Hero ── */}
                <section className={styles.hero} aria-label="Hero">
                    <div className={styles.heroImageWrapper}>
                        <Image
                            src="https://res.cloudinary.com/doggeavv4/image/upload/v1774977603/hero_image_hskvjv.webp"
                            alt="Conferra boardroom — a modern, dark-themed meeting space with architectural lighting"
                            fill
                            priority
                            className={styles.heroImage}
                            sizes="100vw"
                        />
                        <div className={styles.heroGradient} aria-hidden="true" />
                    </div>
                    <div className={styles.heroContent}>
                        <h1 className={styles.heroTitle}>
                            Professional
                            <br />
                            <em className={styles.heroTitleAccent}>Meeting Rooms.</em>
                        </h1>
                        <p className={styles.heroSubtitle}>
                            High quality meeting rooms designed for focus and productivity. Located in the heart of the city.
                        </p>
                        <div className={styles.heroCta}>
                            <Link href="/booking" className={styles.ctaPrimary}>
                                View Available Rooms
                            </Link>
                        </div>
                    </div>
                </section>

                {/* ── Amenities ── */}
                <section
                    className={styles.amenities}
                    id="features"
                    aria-labelledby="amenities-title"
                >
                    <div className={styles.amenitiesInner}>
                        <header className={styles.amenitiesHeader}>
                            <div className={styles.amenitiesLeft}>
                                <span className={styles.sectionLabel}>What's Included</span>
                                <h2 id="amenities-title" className={styles.amenitiesTitle}>
                                    Everything you need
                                    <br />
                                    for a professional meeting.
                                </h2>
                            </div>
                            <p className={styles.amenitiesDesc}>
                                Every room includes high-speed Wi-Fi, audio/video conferencing,
                                and tea/coffee service. No setup hassle, no surprises.
                            </p>
                        </header>

                        <div className={styles.bentoGrid}>
                            {/* Wi-Fi */}
                            <article className={`${styles.bentoCard} ${styles.bentoGlass}`}>
                                <div className={styles.bentoIcon} aria-hidden="true">
                                    <svg
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="1.5"
                                        width="28"
                                        height="28"
                                    >
                                        <path
                                            d="M1.5 8.5a13 13 0 0121 0M5 12a9.5 9.5 0 0114 0M8.5 15.5a5.5 5.5 0 017 0M12 19h.01"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                        />
                                    </svg>
                                </div>
                                <div>
                                    <h3 className={styles.bentoTitle}>High-Speed Wi-Fi</h3>
                                    <p className={styles.bentoDesc}>
                                        Reliable broadband for video calls and file transfers.
                                    </p>
                                </div>
                            </article>

                            {/* Location */}
                            <article className={`${styles.bentoCard} ${styles.bentoLocation}`}>
                                <div
                                    className={styles.bentoLocationImageWrapper}
                                    aria-hidden="true"
                                >
                                    <Image
                                        src="https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?w=800&q=75"
                                        alt=""
                                        fill
                                        className={styles.bentoLocationImage}
                                        sizes="(max-width: 768px) 100vw, 33vw"
                                    />
                                    <div className={styles.bentoLocationGradient} />
                                </div>
                                <div className={styles.bentoLocationContent}>
                                    <div className={styles.bentoIcon} aria-hidden="true">
                                        <svg
                                            viewBox="0 0 24 24"
                                            fill="none"
                                            stroke="currentColor"
                                            strokeWidth="1.5"
                                            width="28"
                                            height="28"
                                        >
                                            <path
                                                d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                            />
                                            <path
                                                d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                            />
                                        </svg>
                                    </div>
                                    <div>
                                        <h3 className={styles.bentoTitle}>Located in the heart of Delhi</h3>
                                        <p className={styles.bentoDesc}>
                                            A block, East of Kailash — easy access from
                                            South and Central Delhi.
                                        </p>
                                    </div>
                                </div>
                            </article>

                            {/* Audio/Video Conferencing */}
                            <article className={`${styles.bentoCard} ${styles.bentoCentered} ${styles.audioVideo}`}>
                                <span className={styles.label}>Coming Soon</span>
                                <div className={styles.bentoIcon} aria-hidden="true">
                                    <svg
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="1.5"
                                        width="36"
                                        height="36"
                                    >
                                        <path
                                            d="M15.75 10.5l4.72-4.72a.75.75 0 011.28.53v11.38a.75.75 0 01-1.28.53l-4.72-4.72M4.5 18.75h9a2.25 2.25 0 002.25-2.25v-9A2.25 2.25 0 0013.5 5.25h-9A2.25 2.25 0 002.25 7.5v9A2.25 2.25 0 004.5 18.75z"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                        />
                                    </svg>
                                </div>
                                <div className={styles.cardContent}>
                                    <h3 className={styles.bentoTitle}>Audio/Video Conferencing</h3>
                                    <p className={styles.bentoDesc}>
                                        Display screen, camera, and conferencing system included
                                        in every room.
                                    </p>
                                </div>
                            </article>

                            {/* Tea & Coffee */}
                            <article className={`${styles.bentoCard} ${styles.bentoGlass} ${styles.bentoCatering}`}>
                                <div className={styles.bentoCateringText}>
                                    <div className={styles.bentoIcon} aria-hidden="true">
                                        <svg
                                            viewBox="0 0 24 24"
                                            fill="none"
                                            stroke="currentColor"
                                            strokeWidth="1.5"
                                            width="28"
                                            height="28"
                                        >
                                            <path
                                                d="M18 8h1a4 4 0 010 8h-1M2 8h16v9a4 4 0 01-4 4H6a4 4 0 01-4-4V8z"
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                            />
                                            <path
                                                d="M6 1v3M10 1v3M14 1v3"
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                            />
                                        </svg>
                                    </div>
                                    <div>
                                        <h3 className={styles.bentoTitle}>Tea, Coffee & Light Snacks</h3>
                                        <p className={styles.bentoDesc}>
                                            Tea and coffee served during your session. Light snacks
                                            available on request.
                                        </p>
                                    </div>
                                </div>
                                <div className={styles.bentoCoffeeViz} aria-hidden="true">
                                    <svg
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="1"
                                        width="96"
                                        height="96"
                                    >
                                        <path
                                            d="M18 8h1a4 4 0 010 8h-1M2 8h16v9a4 4 0 01-4 4H6a4 4 0 01-4-4V8z"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                        />
                                        <path
                                            d="M6 1v3M10 1v3M14 1v3"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                        />
                                    </svg>
                                </div>
                            </article>

                            {/* Private & Soundproofed */}
                            <article className={`${styles.bentoCard} ${styles.bentoPrimary}`}>
                                <div className={styles.bentoIconPrimary} aria-hidden="true">
                                    <svg
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="1.5"
                                        width="28"
                                        height="28"
                                    >
                                        <path
                                            d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                        />
                                    </svg>
                                </div>
                                <div>
                                    <h3 className={styles.bentoTitlePrimary}>Private & Soundproofed</h3>
                                    <p className={styles.bentoDescPrimary}>
                                        Rooms are soundproofed for confidential meetings and client
                                        consultations.
                                    </p>
                                </div>
                            </article>
                        </div>
                    </div>
                </section>

                {/* ── Spaces ── */}
                <section
                    className={styles.spaces}
                    id="spaces"
                    aria-labelledby="spaces-title"
                >
                    <div className={styles.spacesInner}>
                        <header className={styles.spacesHeader}>
                            <span className={styles.sectionLabel}>Our Rooms</span>
                            <h2 id="spaces-title" className={styles.spacesTitle}>
                                Choose Your Room
                            </h2>
                            <div className={styles.spacesDivider} aria-hidden="true" />
                        </header>

                        <div className={styles.spacesList}>
                            {rooms?.map((room, i) => {
                                const specs = [
                                    `${room.capacity} PERSONS`,
                                    // room?.hasAV ? 'AUDIO / VIDEO' : 'NO A/V',
                                    `FROM ₹${room?.priceMin?.toLocaleString('en-IN')} / HR`,
                                ];
                                return (
                                    <article
                                        key={room.id}
                                        className={`${styles.spaceItem} ${i % 2 === 1 ? styles.spaceItemReverse : ''}`}
                                    >
                                        <div className={styles.spaceImageWrapper}>
                                            <Image
                                                src={room.imageUrl}
                                                alt={room.name}
                                                fill
                                                className={styles.spaceImage}
                                                sizes="(max-width: 1024px) 100vw, 66vw"
                                            />
                                            <div
                                                className={styles.spaceImageOverlay}
                                                aria-hidden="true"
                                            />
                                            {/* <span
                                                className={styles.spaceNumber}
                                                aria-hidden="true"
                                            >
                                                {String(i + 1).padStart(2, '0')} — {getRoomLabel(room.capacity).toUpperCase()}
                                            </span> */}
                                        </div>
                                        <div className={styles.spaceInfo}>
                                            <h3 className={styles.spaceName}>{room.name}</h3>
                                            <p className={styles.spaceDesc}>{room.description}</p>
                                            <ul
                                                className={styles.spaceSpecs}
                                                aria-label="Specifications"
                                            >
                                                {specs.map((spec) => (
                                                    <li key={spec}>{spec}</li>
                                                ))}
                                            </ul>
                                            <Link href="/booking" className={styles.spaceLink}>
                                                Book This Room
                                                <svg
                                                    viewBox="0 0 24 24"
                                                    fill="none"
                                                    stroke="currentColor"
                                                    strokeWidth="1.5"
                                                    width="14"
                                                    height="14"
                                                    aria-hidden="true"
                                                >
                                                    <path
                                                        d="M5 12h14M12 5l7 7-7 7"
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                    />
                                                </svg>
                                            </Link>
                                        </div>
                                    </article>
                                );
                            })}
                        </div>
                    </div>
                </section>
            </main>

            {/* ── Footer ── */}
            <footer className={styles.footer} id="contact">
                <div className={styles.footerInner}>
                    <div className={styles.footerGrid}>
                        <div className={styles.footerBrand}>
                            <div className={styles.footerLogo}>CONFERRA</div>
                            <p className={styles.footerTagline}>
                                Professional meeting rooms in South Delhi.
                            </p>
                        </div>
                        <nav className={styles.footerNav} aria-label="Footer navigation">
                            <p className={styles.footerNavTitle}>Navigation</p>
                            <ul className={styles.footerNavList}>
                                <li>
                                    <Link href="/#spaces" className={styles.footerNavLink}>
                                        Rooms
                                    </Link>
                                </li>
                                <li>
                                    <Link href="/#features" className={styles.footerNavLink}>
                                        Facilities
                                    </Link>
                                </li>
                                <li>
                                    <Link href="/booking" className={styles.footerNavLink}>
                                        Book a Room
                                    </Link>
                                </li>
                                <li>
                                    <Link href="#contact" className={styles.footerNavLink}>
                                        Contact
                                    </Link>
                                </li>
                            </ul>
                        </nav>
                        <address className={styles.footerContact}>
                            <p className={styles.footerNavTitle}>Enquiries</p>
                            <p className={styles.footerContactMeta}>General</p>
                            <a
                                href="mailto:reservations@conferra.co"
                                className={styles.footerContactValue}
                            >
                                reservations@conferra.co
                            </a>
                            <p className={styles.footerContactMeta}>Location</p>
                            <p className={styles.footerContactValue}>A12, A block, East of Kailash, New Delhi</p>
                        </address>
                    </div>
                    <div className={styles.footerBottom}>
                        <span className={styles.footerCopy}>© 2026 CONFERRA.</span>
                        <div className={styles.footerLegal}>
                            <Link href="#" className={styles.footerLegalLink}>
                                Terms & Conditions
                            </Link>
                            <Link href="#" className={styles.footerLegalLink}>
                                Privacy Policy
                            </Link>
                            <Link href="#" className={styles.footerLegalLink}>
                                Accessibility
                            </Link>
                        </div>
                    </div>
                </div>
            </footer>
        </>
    );
}

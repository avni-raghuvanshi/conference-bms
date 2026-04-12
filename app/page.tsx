import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import styles from './page.module.css';

export const metadata: Metadata = {
    title: 'CONFERRA — Architectural Sanctuaries for Dialogue',
    description:
        'Elevated meeting spaces in the heart of Greater Kailash. Designed for focus, engineered for collaboration.',
};

const SPACES = [
    {
        number: '01',
        label: 'Executive Suite',
        name: 'Alpha Suite',
        description:
            'Our flagship executive chamber. A grand-scale environment optimised for high-stakes negotiation and critical strategic alignment.',
        imageUrl:
            'https://images.unsplash.com/photo-1497366216548-37526070297c?w=1200&q=80',
        specs: ['12 PERSONS', '4K ARRAY', 'ACOUSTIC SYSTEM'],
    },
    {
        number: '02',
        label: 'Grand Forum',
        name: 'Gamma Hall',
        description:
            'Engineered for synergy. Gamma Hall features an expansive layout designed to foster open discourse and creative fluidity.',
        imageUrl:
            'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=1200&q=80',
        specs: ['30 PERSONS', 'PROJECTION STAGE', 'BREAKOUT AREAS'],
    },
    {
        number: '03',
        label: 'Focus Cell',
        name: 'Delta Pod',
        description:
            'Total immersive focus. The Delta Pod is a sanctuary for private consultation, high-profile interviews, or deep analytical work.',
        imageUrl:
            'https://images.unsplash.com/photo-1568992687947-868a62a9f521?w=1200&q=80',
        specs: ['4 PERSONS', 'PRIVATE HUB', 'SOFT LIGHTING'],
    },
];

export default function HomePage() {
    return (
        <>
            <main>
                {/* ── Hero ── */}
                <section className={styles.hero} aria-label="Hero">
                    <div className={styles.heroImageWrapper}>
                        <Image
                            src="https://res.cloudinary.com/doggeavv4/image/upload/v1774977603/hero_image_hskvjv.webp"
                            alt="Conferra executive boardroom — a modern, dark-themed meeting space with architectural lighting"
                            fill
                            priority
                            className={styles.heroImage}
                            sizes="100vw"
                        />
                        <div className={styles.heroGradient} aria-hidden="true" />
                    </div>
                    <div className={styles.heroContent}>
                        <h1 className={styles.heroTitle}>
                            Professionalism
                            <br />
                            <em className={styles.heroTitleAccent}>Redefined.</em>
                        </h1>
                        <p className={styles.heroSubtitle}>
                            Elevated meeting spaces in the heart of Greater Kailash. Designed for
                            focus, engineered for collaboration, and curated for the modern
                            visionary.
                        </p>
                        <div className={styles.heroCta}>
                            <Link href="/booking" className={styles.ctaPrimary}>
                                EXPLORE THE SPACES
                            </Link>
                            <button type="button" className={styles.ctaSecondary}>
                                VIRTUAL TOUR
                            </button>
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
                                <span className={styles.sectionLabel}>The Infrastructure</span>
                                <h2 id="amenities-title" className={styles.amenitiesTitle}>
                                    Precision in every
                                    <br />
                                    detail of your workflow.
                                </h2>
                            </div>
                            <p className={styles.amenitiesDesc}>
                                We remove the friction of business. From ultra-low latency
                                connectivity to artisanal hospitality, every touchpoint is a
                                commitment to your success.
                            </p>
                        </header>

                        <div className={styles.bentoGrid}>
                            {/* Gigabit */}
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
                                    <h3 className={styles.bentoTitle}>Gigabit Backbone</h3>
                                    <p className={styles.bentoDesc}>
                                        Symmetrical fiber-optic arrays ensuring zero-latency
                                        transitions for global collaboration.
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
                                        <h3 className={styles.bentoTitle}>GK Strategic Hub</h3>
                                        <p className={styles.bentoDesc}>
                                            At the epicentre of South Delhi's premium business
                                            district.
                                        </p>
                                    </div>
                                </div>
                            </article>

                            {/* 24/7 */}
                            <article className={`${styles.bentoCard} ${styles.bentoCentered}`}>
                                <div className={styles.bentoOrb} aria-hidden="true">
                                    <svg
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="1.5"
                                        width="28"
                                        height="28"
                                    >
                                        <path
                                            d="M12 12c-2-2.5-4-4-6-4a4 4 0 100 8c2 0 4-1.5 6-4zm0 0c2 2.5 4 4 6 4a4 4 0 000-8c-2 0-4 1.5-6 4z"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                        />
                                    </svg>
                                </div>
                                <h3 className={styles.bentoLargeNum}>24 / 7</h3>
                                <p className={styles.bentoMiniLabel}>Member Access</p>
                            </article>

                            {/* Catering */}
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
                                        <h3 className={styles.bentoTitle}>Curated Sustenance</h3>
                                        <p className={styles.bentoDesc}>
                                            Bespoke culinary service curated by
                                            Michelin-recognised local chefs.
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

                            {/* Security */}
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
                                    <h3 className={styles.bentoTitlePrimary}>Secure Privacy</h3>
                                    <p className={styles.bentoDescPrimary}>
                                        Sound-isolated chambers with integrated data encryption
                                        protocols.
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
                            <span className={styles.sectionLabel}>The Portfolio</span>
                            <h2
                                id="spaces-title"
                                className={`${styles.spacesTitle} ${styles.italic}`}
                            >
                                Architectural Vessels.
                            </h2>
                            <div className={styles.spacesDivider} aria-hidden="true" />
                        </header>

                        <div className={styles.spacesList}>
                            {SPACES.map((space, i) => (
                                <article
                                    key={space.name}
                                    className={`${styles.spaceItem} ${i % 2 === 1 ? styles.spaceItemReverse : ''}`}
                                >
                                    <div className={styles.spaceImageWrapper}>
                                        <Image
                                            src={space.imageUrl}
                                            alt={space.name}
                                            fill
                                            className={styles.spaceImage}
                                            sizes="(max-width: 1024px) 100vw, 66vw"
                                        />
                                        <div
                                            className={styles.spaceImageOverlay}
                                            aria-hidden="true"
                                        />
                                        <span
                                            className={styles.spaceNumber}
                                            aria-hidden="true"
                                        >
                                            {space.number} — {space.label.toUpperCase()}
                                        </span>
                                    </div>
                                    <div className={styles.spaceInfo}>
                                        <h3 className={styles.spaceName}>{space.name}</h3>
                                        <p className={styles.spaceDesc}>{space.description}</p>
                                        <ul
                                            className={styles.spaceSpecs}
                                            aria-label="Specifications"
                                        >
                                            {space.specs.map((spec) => (
                                                <li key={spec}>{spec}</li>
                                            ))}
                                        </ul>
                                        <Link href="/booking" className={styles.spaceLink}>
                                            Acquire Access
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
                            ))}
                        </div>
                    </div>
                </section>

                {/* ── Philosophy ── */}
                <section className={styles.philosophy} aria-label="Conferra philosophy">
                    <div className={styles.philosophyBg} aria-hidden="true">
                        ETHOS
                    </div>
                    <blockquote className={styles.philosophyQuote}>
                        <p>
                            "Space is not merely a container for activity; it is the silent
                            catalyst for{' '}
                            <em className={styles.philosophyAccent}>
                                extraordinary thinking
                            </em>
                            ."
                        </p>
                        <footer className={styles.philosophyAttrib}>
                            <div className={styles.philosophyLine} aria-hidden="true" />
                            <cite>Conferra Philosophy</cite>
                        </footer>
                    </blockquote>
                </section>
            </main>

            {/* ── Footer ── */}
            <footer className={styles.footer} id="contact">
                <div className={styles.footerInner}>
                    <div className={styles.footerGrid}>
                        <div className={styles.footerBrand}>
                            <div className={styles.footerLogo}>CONFERRA</div>
                            <p className={styles.footerTagline}>
                                Defining the spatial standards for the capital's intellectual and
                                corporate elite.
                            </p>
                        </div>
                        <nav className={styles.footerNav} aria-label="Footer navigation">
                            <p className={styles.footerNavTitle}>Navigation</p>
                            <ul className={styles.footerNavList}>
                                <li>
                                    <Link href="#spaces" className={styles.footerNavLink}>
                                        The Portfolio
                                    </Link>
                                </li>
                                <li>
                                    <Link href="#features" className={styles.footerNavLink}>
                                        Experience
                                    </Link>
                                </li>
                                <li>
                                    <Link href="/booking" className={styles.footerNavLink}>
                                        Book A Space
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
                            <p className={styles.footerNavTitle}>Inquiries</p>
                            <p className={styles.footerContactMeta}>General</p>
                            <a
                                href="mailto:concierge@conferra.com"
                                className={styles.footerContactValue}
                            >
                                concierge@conferra.com
                            </a>
                            <p className={styles.footerContactMeta}>Location</p>
                            <p className={styles.footerContactValue}>M-Block, GK II, New Delhi</p>
                        </address>
                    </div>
                    <div className={styles.footerBottom}>
                        <span className={styles.footerCopy}>
                            © 2026 CONFERRA ARCHITECTURAL SPACES.
                        </span>
                        <div className={styles.footerLegal}>
                            <Link href="#" className={styles.footerLegalLink}>
                                Terms of Presence
                            </Link>
                            <Link href="#" className={styles.footerLegalLink}>
                                Privacy Ordinance
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

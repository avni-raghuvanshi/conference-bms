import React from 'react';
import Link from 'next/link';
import styles from './Header.module.css';

const NAV_LINKS = [
    { label: 'SPACES', href: '/#spaces' },
    { label: 'FEATURES', href: '/#features' },
    { label: 'PRICING', href: '/#pricing' },
    { label: 'CONTACT', href: '/#contact' },
];

const Header = () => {
    return (
        <header className={styles.header} role="banner">
            <Link href="/" className={styles.logo} aria-label="CONFERRA — Return to home">
                CONFERRA
            </Link>

            <nav className={styles.nav} aria-label="Primary navigation">
                {NAV_LINKS.map(({ label, href }) => (
                    <Link key={label} href={href} className={styles.navLink}>
                        {label}
                    </Link>
                ))}
            </nav>

            <Link href="/booking" className={styles.bookButton}>
                BOOK NOW
            </Link>
        </header>
    );
};

export default Header;

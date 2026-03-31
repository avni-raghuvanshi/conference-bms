import React from 'react';
import styles from './Header.module.css';
import Container from '@/components/container/Container';
import Link from 'next/link';
import Button from '../Button';

const Header = () => {
    return (
        <header className={styles.header}>
            <Container>
                <div className={styles.headerInner}>
                    <Link href="/" className={styles.logo} aria-label="Anandvan">
                        <span className={styles.logoText}>
                            Anandvan
                        </span>
                    </Link>
                    <Button size="sm">Book Us Now</Button>
                </div>
            </Container>
        </header>
    )
}

export default Header
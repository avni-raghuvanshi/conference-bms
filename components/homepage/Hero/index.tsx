import Link from 'next/link';
import Container from '@/components/ui/Container/Container'
import React from 'react';
import styles from './hero.module.css';
import Button from '@/components/ui/Button';

const Hero = () => {
  return (
    <section className={styles.heroOuter}>
      <Container className={styles.heroContainer}>
        <div className={styles.heroInner}>
          <span className={styles.heroKicker}>East of Kailash, Delhi</span>
          <h1>A quiet room for your next meeting.</h1>
          <p>Space for arbitrations, board meetings, and other important discussions, with audio and video set up ready to go.</p>
          <Link href="/#contact">
            <Button size="lg">Get in Touch</Button>
          </Link>
        </div>
      </Container>
    </section>
  )
}

export default Hero
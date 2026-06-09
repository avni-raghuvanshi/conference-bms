import Container from '@/components/ui/Container/Container'
import React from 'react';
import styles from './hero.module.css';
import Button from '@/components/ui/Button';

const Hero = () => {
  return (
    <section className={styles.heroOuter}>
      <Container className={styles.heroContainer}>
        <div className={styles.heroInner}>
          <h1>Premium Spaces for Critical Decisions.</h1>
          <p>Four thoughtfully composed rooms for arbitrations, board reviews, candidate interviews, and the kind of meetings that deserve a considered backdrop. Calibrated for clarity, acoustics, and lighting — so the work happens, and the room steps out of the way.</p>
          <Button>Reserve Your Space</Button>
        </div>
      </Container>
    </section>
  )
}

export default Hero
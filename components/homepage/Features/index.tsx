import Container from '@/components/ui/Container/Container';
import styles from './features.module.css';

const Features = () => {
  return (
    <section className={styles.outer} id="features" aria-labelledby="features-title">
      <Container>
        <h2 id="features-title" className={styles.sectionTitle}>
          What we offer
        </h2>

        <div className={styles.grid}>
          <article className={`${styles.card} ${styles.cardDark}`}>
            <h3>A space built for serious meetings</h3>
            <p>
              Suited for arbitrations, board meetings, and other important
              discussions that need a calm, private setting.
            </p>
          </article>

          <article className={`${styles.card} ${styles.cardIcon}`}>
            <span className={styles.icon} aria-hidden="true">
              <svg viewBox="0 0 24 24" fill="none" width="22" height="22">
                <path d="M15 8.5V7a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h9a2 2 0 0 0 2-2v-1.5l5 3v-13l-5 3Z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
              </svg>
            </span>
            <h3>Audio &amp; video, ready to go</h3>
            <p>Every room comes with audio and video conferencing set up, so calls and presentations just work.</p>
          </article>

          <article className={`${styles.card} ${styles.cardSolid}`}>
            <h3>
              <span className={styles.pin} aria-hidden="true">
                <svg viewBox="0 0 24 24" fill="none" width="16" height="16">
                  <path d="M12 21s7-6.1 7-11.5A7 7 0 0 0 5 9.5C5 14.9 12 21 12 21Z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
                  <circle cx="12" cy="9.5" r="2.2" stroke="currentColor" strokeWidth="1.6" />
                </svg>
              </span>
              East of Kailash, Delhi
            </h3>
            <p>Easy to find, easy to reach.</p>
          </article>

          <article className={`${styles.card} ${styles.cardLight}`}>
            <h3>Tea, coffee &amp; more</h3>
            <p>Tea and coffee are complimentary. Breakfast and lunch can be arranged on request.</p>
          </article>
        </div>
      </Container>
    </section>
  );
};

export default Features;

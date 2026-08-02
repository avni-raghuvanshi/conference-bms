import Container from '@/components/ui/Container/Container';
import styles from './contact.module.css';

// TODO: replace with the real contact number and inbox before launch.
const WHATSAPP_NUMBER = '917303599100';
const CONTACT_EMAIL = 'info@conferra.co';

const Contact = () => {
  return (
    <section className={styles.outer} id="contact" aria-labelledby="contact-title">
      <Container>
        <div className={styles.panel}>
          <div className={styles.copy}>
            <h2 id="contact-title">Want to check availability?</h2>
            <p>Send us a message on WhatsApp or email and we&apos;ll get back to you shortly.</p>
            <p className={styles.address}>Basement floor, A12, A-block, East of Kailash, New Delhi</p>
          </div>

          <div className={styles.actions}>
            <a
              className={`${styles.actionButton} ${styles.whatsapp}`}
              href={`https://wa.me/${WHATSAPP_NUMBER}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20" aria-hidden="true">
                <path d="M17.5 14.4c-.3-.1-1.6-.8-1.9-.9-.2-.1-.4-.1-.6.1-.2.3-.7.9-.8 1-.2.2-.3.2-.5.1-1.4-.7-2.4-1.3-3.3-2.9-.3-.4.3-.4.7-1.3.1-.2 0-.4 0-.5C11 9.7 10.6 8.6 10.4 8.1c-.2-.4-.4-.4-.6-.4h-.5c-.2 0-.5.1-.7.3-.2.3-1 1-1 2.3s1 2.7 1.1 2.9c.1.2 2 3 4.8 4.2.7.3 1.2.5 1.6.6.7.2 1.3.2 1.8.1.6-.1 1.6-.7 1.9-1.3.2-.6.2-1.1.2-1.2 0-.1-.2-.2-.5-.3ZM12 22c-1.6 0-3.2-.4-4.6-1.2L3 22l1.2-4.3A10 10 0 1 1 12 22Z" />
              </svg>
              WhatsApp Us
            </a>

            <a className={`${styles.actionButton} ${styles.email}`} href={`mailto:${CONTACT_EMAIL}`}>
              <svg viewBox="0 0 24 24" fill="none" width="20" height="20" aria-hidden="true">
                <rect x="3" y="5" width="18" height="14" rx="2" stroke="currentColor" strokeWidth="1.6" />
                <path d="M4 7l8 6 8-6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              {CONTACT_EMAIL}
            </a>
          </div>
        </div>
      </Container>
    </section>
  );
};

export default Contact;

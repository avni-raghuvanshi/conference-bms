'use client';

import { useEffect, useRef } from 'react';
import Image from 'next/image';
import type { GalleryImage } from './galleryImages';
import styles from './lightbox.module.css';

interface LightboxProps {
  images: GalleryImage[];
  index: number;
  onClose: () => void;
  onNavigate: (index: number) => void;
}

export default function Lightbox({ images, index, onClose, onNavigate }: LightboxProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const image = images[index];
  const count = images.length;

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (!dialog.open) dialog.showModal();
    document.body.style.overflow = 'hidden';
    dialog.addEventListener('close', onClose);

    return () => {
      dialog.removeEventListener('close', onClose);
      document.body.style.overflow = '';
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'ArrowRight') onNavigate((index + 1) % count);
      if (e.key === 'ArrowLeft') onNavigate((index - 1 + count) % count);
    }
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [index, count, onNavigate]);

  return (
    <dialog
      ref={dialogRef}
      className={styles.dialog}
      aria-label={`Photo ${index + 1} of ${count}`}
      onClick={(e) => {
        if (e.target === dialogRef.current) dialogRef.current?.close();
      }}
    >
      <button type="button" className={styles.closeButton} onClick={() => dialogRef.current?.close()} aria-label="Close">
        <svg viewBox="0 0 24 24" fill="none" width="20" height="20">
          <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
        </svg>
      </button>

      {count > 1 && (
        <button
          type="button"
          className={`${styles.navButton} ${styles.prevButton}`}
          onClick={() => onNavigate((index - 1 + count) % count)}
          aria-label="Previous photo"
        >
          <svg viewBox="0 0 24 24" fill="none" width="22" height="22">
            <path d="M15 5l-7 7 7 7" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      )}

      <div className={styles.imageWrap}>
        <Image src={image.src} alt={image.alt} fill className={styles.image} sizes="92vw" priority />
      </div>

      {count > 1 && (
        <button
          type="button"
          className={`${styles.navButton} ${styles.nextButton}`}
          onClick={() => onNavigate((index + 1) % count)}
          aria-label="Next photo"
        >
          <svg viewBox="0 0 24 24" fill="none" width="22" height="22">
            <path d="M9 5l7 7-7 7" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      )}

      {count > 1 && (
        <p className={styles.counter}>
          {index + 1} / {count}
        </p>
      )}
    </dialog>
  );
}

'use client';

import { useState } from 'react';
import Image from 'next/image';
import Lightbox from './Lightbox';
import type { GalleryImage } from './galleryImages';
import styles from './gallery.module.css';

interface GalleryGridProps {
  images: GalleryImage[];
}

export default function GalleryGrid({ images }: GalleryGridProps) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  return (
    <>
      <div className={styles.grid}>
        {images.map((image, index) => (
          <button
            key={image.src || index}
            type="button"
            className={styles.tile}
            onClick={() => image.src && setActiveIndex(index)}
            disabled={!image.src}
            aria-label={`Open photo ${index + 1} of ${images.length}`}
          >
            {image.src ? (
              <Image
                src={image.src}
                alt={image.alt}
                fill
                className={styles.tileImage}
                sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
              />
            ) : (
              <span className={styles.tilePlaceholder} aria-hidden="true">
                <svg viewBox="0 0 24 24" fill="none" width="24" height="24">
                  <rect x="3" y="5" width="18" height="14" rx="2" stroke="currentColor" strokeWidth="1.5" />
                  <circle cx="8.5" cy="10" r="1.5" stroke="currentColor" strokeWidth="1.5" />
                  <path d="M21 16l-5.5-5-9.5 8" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
                </svg>
              </span>
            )}
          </button>
        ))}
      </div>

      {activeIndex !== null && (
        <Lightbox
          images={images}
          index={activeIndex}
          onClose={() => setActiveIndex(null)}
          onNavigate={setActiveIndex}
        />
      )}
    </>
  );
}

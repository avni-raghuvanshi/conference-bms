import Container from '@/components/ui/Container/Container';
import { galleryImages } from './galleryImages';
import GalleryGrid from './GalleryGrid';
import styles from './gallery.module.css';

const Gallery = () => {
  return (
    <section className={styles.outer} id="gallery" aria-labelledby="gallery-title">
      <Container>
        <h2 id="gallery-title" className={styles.sectionTitle}>
          Take a look around
        </h2>

        <GalleryGrid images={galleryImages} />
      </Container>
    </section>
  );
};

export default Gallery;

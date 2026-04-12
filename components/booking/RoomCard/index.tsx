import Image from 'next/image';
import styles from './RoomCard.module.css';
import { Room } from '@/lib/types';

interface RoomCardProps {
    room: Room;
    selected: boolean;
    onSelect: (room: Room) => void;
}

function getRoomLabel(capacity: number): string {
    if (capacity >= 20) return 'Grand Auditorium';
    if (capacity >= 10) return 'Executive Suite';
    if (capacity >= 6) return 'Studio';
    return 'Focus Cell';
}

export default function RoomCard({ room, selected, onSelect }: RoomCardProps) {
    return (
        <button
            type="button"
            role="radio"
            aria-checked={selected}
            onClick={() => onSelect(room)}
            className={[styles.card, selected ? styles.selected : ''].filter(Boolean).join(' ')}
        >
            {/* Background image */}
            <div className={styles.bg}>
                <Image
                    src={room.imageUrl}
                    alt={room.name}
                    fill
                    sizes="(max-width: 640px) 100vw, 50vw"
                    className={[styles.image, selected ? styles.imageActive : ''].filter(Boolean).join(' ')}
                />
            </div>

            {/* Gradient overlay */}
            <div className={styles.overlay} aria-hidden="true" />

            {/* Content */}
            <div className={styles.content}>
                <div className={styles.top}>
                    <div className={styles.topRow}>
                        <span className={styles.label}>{getRoomLabel(room.capacity)}</span>
                        {selected && (
                            <span className={styles.selectedBadge}>Selected</span>
                        )}
                    </div>
                    <h3 className={styles.name}>{room.name}</h3>
                </div>

                <div className={styles.bottom}>
                    <div>
                        <p className={styles.capacityLabel}>Capacity</p>
                        <p className={styles.capacityNum}>{room.capacity} PAX</p>
                    </div>
                    <div
                        className={[styles.arrowBtn, selected ? styles.arrowBtnSelected : ''].filter(Boolean).join(' ')}
                        aria-hidden="true"
                    >
                        {selected ? (
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <polyline points="20 6 9 17 4 12" />
                            </svg>
                        ) : (
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <line x1="7" y1="17" x2="17" y2="7" />
                                <polyline points="7 7 17 7 17 17" />
                            </svg>
                        )}
                    </div>
                </div>
            </div>
        </button>
    );
}

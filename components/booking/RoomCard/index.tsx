import Image from 'next/image';
import styles from './RoomCard.module.css';
import { Room } from '@/lib/types';

interface RoomCardProps {
    room: Room;
    selected: boolean;
    onSelect: (room: Room) => void;
}

export default function RoomCard({ room, selected, onSelect }: RoomCardProps) {
    return (
        <button
            type="button"
            role="radio"
            aria-checked={selected}
            onClick={() => onSelect(room)}
            className={[styles.card, selected ? styles.selected : '']
                .filter(Boolean)
                .join(' ')}
        >
            <div className={styles.imageWrapper}>
                <Image
                    src={room.imageUrl}
                    alt={room.name}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    className={styles.image}
                />
                <span className={styles.capacity} aria-label={`Capacity: ${room.capacity} people`}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                        <circle cx="9" cy="7" r="4" />
                        <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                    </svg>
                    {room.capacity}
                </span>
                {selected && (
                    <span className={styles.checkmark} aria-hidden="true">✓</span>
                )}
            </div>

            <div className={styles.body}>
                <div className={styles.header}>
                    <h3 className={styles.name}>{room.name}</h3>
                    <span className={styles.floor}>Floor {room.floor}</span>
                </div>
                <p className={styles.description}>{room.description}</p>
                <ul className={styles.amenities} aria-label="Amenities">
                    {room.amenities.map((amenity) => (
                        <li key={amenity} className={styles.amenity}>
                            {amenity}
                        </li>
                    ))}
                </ul>
            </div>
        </button>
    );
}

'use client';

import { useRooms } from '@/hooks/useRooms';
import RoomCard from '../RoomCard';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import ErrorMessage from '@/components/ui/ErrorMessage';
import styles from './RoomSelect.module.css';
import { Room } from '@/lib/types';

interface RoomSelectProps {
    selectedRoomId: string | null;
    onSelect: (room: Room) => void;
}

export default function RoomSelect({ selectedRoomId, onSelect }: RoomSelectProps) {
    const { rooms, loading, error, refetch } = useRooms();

    if (loading) {
        return (
            <div className={styles.center}>
                <LoadingSpinner size="lg" label="Loading conference rooms…" />
                <p className={styles.loadingText}>Finding available rooms…</p>
            </div>
        );
    }

    if (error) {
        return (
            <ErrorMessage
                title="Could not load rooms"
                message={error}
                onRetry={refetch}
            />
        );
    }

    if (!rooms.length) {
        return (
            <div className={styles.empty}>
                <p>No conference rooms are available at this time.</p>
            </div>
        );
    }

    return (
        <fieldset className={styles.fieldset}>
            <legend className={styles.legend}>Select a Room</legend>
            <div className={styles.grid} role="radiogroup" aria-label="Conference rooms">
                {rooms.map((room) => (
                    <RoomCard
                        key={room.id}
                        room={room}
                        selected={room.id === selectedRoomId}
                        onSelect={onSelect}
                    />
                ))}
            </div>
        </fieldset>
    );
}

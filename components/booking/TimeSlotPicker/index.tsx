'use client';

import { useAvailableSlots } from '@/hooks/useAvailableSlots';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import ErrorMessage from '@/components/ui/ErrorMessage';
import styles from './TimeSlotPicker.module.css';
import { TimeSlot } from '@/lib/types';

interface TimeSlotPickerProps {
    roomId: string | null;
    date: string;
    selectedSlotId: string | null;
    onSelect: (slot: TimeSlot) => void;
    error?: string;
}

function formatTime(time: string): string {
    const [h, m] = time.split(':').map(Number);
    const suffix = h < 12 ? 'AM' : 'PM';
    const display = h % 12 || 12;
    return `${display}:${String(m).padStart(2, '0')} ${suffix}`;
}

export default function TimeSlotPicker({
    roomId,
    date,
    selectedSlotId,
    onSelect,
    error,
}: TimeSlotPickerProps) {
    const { slots, loading, slotError, refetch } = useAvailableSlots(roomId, date);

    if (!roomId || !date) {
        return (
            <div className={styles.placeholder}>
                <p>Select a room and date to view availability.</p>
            </div>
        );
    }

    if (loading) {
        return (
            <div className={styles.center}>
                <LoadingSpinner size="md" label="Loading time slots…" />
                <p className={styles.loadingText}>Loading availability…</p>
            </div>
        );
    }

    if (slotError) {
        return (
            <ErrorMessage
                title="Could not load time slots"
                message={slotError}
                onRetry={refetch}
            />
        );
    }

    if (!slots.length) {
        return (
            <div className={styles.placeholder}>
                <p>No time slots found for this date.</p>
            </div>
        );
    }

    const allBooked = slots.every((s) => !s.available);

    return (
        <div>
            {allBooked && (
                <p className={styles.allBooked}>
                    All slots are booked for this day. Please choose a different date.
                </p>
            )}

            <div
                className={styles.list}
                role="radiogroup"
                aria-label="Available time slots"
            >
                {slots.map((slot) => {
                    const isSelected = slot.id === selectedSlotId;
                    return (
                        <button
                            key={slot.id}
                            type="button"
                            role="radio"
                            aria-checked={isSelected}
                            disabled={!slot.available}
                            onClick={() => slot.available && onSelect(slot)}
                            className={[
                                styles.slot,
                                !slot.available && styles.slotBooked,
                                isSelected && styles.slotSelected,
                            ].filter(Boolean).join(' ')}
                            aria-label={`${formatTime(slot.startTime)} to ${formatTime(slot.endTime)}${!slot.available ? ' – unavailable' : ''}`}
                        >
                            <span className={styles.slotTime}>
                                {formatTime(slot.startTime)} — {formatTime(slot.endTime)}
                            </span>
                            <span className={styles.slotStatus}>
                                {isSelected ? 'Selected' : slot.available ? 'Available' : 'Reserved'}
                            </span>
                        </button>
                    );
                })}
            </div>

            {error && (
                <p className={styles.error} role="alert">{error}</p>
            )}
        </div>
    );
}

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
                <span className={styles.placeholderIcon} aria-hidden="true">🕐</span>
                <p>Select a room and date to see available time slots.</p>
            </div>
        );
    }

    if (loading) {
        return (
            <div className={styles.center}>
                <LoadingSpinner size="md" label="Loading time slots…" />
                <p className={styles.loadingText}>Loading available slots…</p>
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
            <p className={styles.legend}>
                Time Slot{' '}
                <span className={styles.required} aria-hidden="true">*</span>
            </p>

            {allBooked && (
                <p className={styles.allBooked}>
                    All slots are booked for this day. Please choose a different date.
                </p>
            )}

            <div
                className={styles.grid}
                role="radiogroup"
                aria-label="Available time slots"
            >
                {slots.map((slot) => (
                    <button
                        key={slot.id}
                        type="button"
                        role="radio"
                        aria-checked={slot.id === selectedSlotId}
                        disabled={!slot.available}
                        onClick={() => slot.available && onSelect(slot)}
                        className={[
                            styles.slot,
                            !slot.available ? styles.booked : '',
                            slot.id === selectedSlotId ? styles.selected : '',
                        ]
                            .filter(Boolean)
                            .join(' ')}
                        aria-label={`${formatTime(slot.startTime)} to ${formatTime(slot.endTime)}${!slot.available ? ' – unavailable' : ''}`}
                    >
                        <span className={styles.time}>
                            {formatTime(slot.startTime)}
                        </span>
                        <span className={styles.separator}>&ndash;</span>
                        <span className={styles.time}>
                            {formatTime(slot.endTime)}
                        </span>
                        {!slot.available && (
                            <span className={styles.bookedLabel}>Booked</span>
                        )}
                    </button>
                ))}
            </div>

            {error && (
                <p className={styles.error} role="alert">
                    {error}
                </p>
            )}

            <div className={styles.legend} aria-hidden="true">
                <span className={styles.legendItem}>
                    <span className={[styles.dot, styles.dotAvailable].join(' ')} />
                    Available
                </span>
                <span className={styles.legendItem}>
                    <span className={[styles.dot, styles.dotBooked].join(' ')} />
                    Booked
                </span>
                <span className={styles.legendItem}>
                    <span className={[styles.dot, styles.dotSelected].join(' ')} />
                    Selected
                </span>
            </div>
        </div>
    );
}

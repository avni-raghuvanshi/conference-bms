'use client';

import { useAvailableSlots } from '@/hooks/useAvailableSlots';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import ErrorMessage from '@/components/ui/ErrorMessage';
import styles from './TimeSlotPicker.module.css';
import { TimeSlot } from '@/lib/types';

const MAX_SLOTS = 5;

interface TimeSlotPickerProps {
    roomId: string | null;
    date: string;
    selectedSlotIds: string[];
    onSelect: (slots: TimeSlot[]) => void;
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
    selectedSlotIds,
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

    function handleSlotClick(clickedSlot: TimeSlot) {
        if (!clickedSlot.available) return;

        const clickedIndex = slots.findIndex((s) => s.id === clickedSlot.id);
        const selectedIndices = selectedSlotIds
            .map((id) => slots.findIndex((s) => s.id === id))
            .filter((i) => i !== -1)
            .sort((a, b) => a - b);

        // Nothing selected yet — start fresh
        if (selectedIndices.length === 0) {
            onSelect([clickedSlot]);
            return;
        }

        const firstIdx = selectedIndices[0];
        const lastIdx = selectedIndices[selectedIndices.length - 1];

        // Clicking the only selected slot deselects it
        if (selectedIndices.length === 1 && clickedIndex === firstIdx) {
            onSelect([]);
            return;
        }

        // Clicked adjacent to the start — extend backwards
        if (clickedIndex === firstIdx - 1) {
            if (selectedIndices.length >= MAX_SLOTS) return;
            const newSlots = slots.slice(clickedIndex, lastIdx + 1).filter((s) => s.available);
            if (newSlots.length === lastIdx - clickedIndex + 1) {
                onSelect(newSlots);
            } else {
                onSelect([clickedSlot]); // gap found — reset to just this slot
            }
            return;
        }

        // Clicked adjacent to the end — extend forwards
        if (clickedIndex === lastIdx + 1) {
            if (selectedIndices.length >= MAX_SLOTS) return;
            const newSlots = slots.slice(firstIdx, clickedIndex + 1).filter((s) => s.available);
            if (newSlots.length === clickedIndex - firstIdx + 1) {
                onSelect(newSlots);
            } else {
                onSelect([clickedSlot]);
            }
            return;
        }

        // Clicked within selection — trim to clicked position
        if (clickedIndex >= firstIdx && clickedIndex <= lastIdx) {
            onSelect(slots.slice(firstIdx, clickedIndex + 1));
            return;
        }

        // Non-adjacent click — reset to this slot
        onSelect([clickedSlot]);
    }

    return (
        <div>
            {allBooked && (
                <p className={styles.allBooked}>
                    All slots are booked for this day. Please choose a different date.
                </p>
            )}

            <div
                className={styles.list}
                role="group"
                aria-label="Available time slots — select consecutive slots"
            >
                {slots.map((slot) => {
                    const isSelected = selectedSlotIds.includes(slot.id);
                    const selectedIndices = selectedSlotIds
                        .map((id) => slots.findIndex((s) => s.id === id))
                        .filter((i) => i !== -1)
                        .sort((a, b) => a - b);
                    const slotIndex = slots.findIndex((s) => s.id === slot.id);
                    const isFirst = isSelected && slotIndex === selectedIndices[0];
                    const isLast = isSelected && slotIndex === selectedIndices[selectedIndices.length - 1];

                    return (
                        <button
                            key={slot.id}
                            type="button"
                            aria-pressed={isSelected}
                            disabled={!slot.available}
                            onClick={() => handleSlotClick(slot)}
                            className={[
                                styles.slot,
                                !slot.available && styles.slotBooked,
                                isSelected && styles.slotSelected,
                                isSelected && isFirst && styles.slotFirst,
                                isSelected && isLast && styles.slotLast,
                            ].filter(Boolean).join(' ')}
                            aria-label={`${formatTime(slot.startTime)} to ${formatTime(slot.endTime)}${!slot.available ? ' – unavailable' : isSelected ? ' – selected' : ''}`}
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

            {selectedSlotIds.length >= MAX_SLOTS && (
                <p className={styles.maxNote}>Maximum {MAX_SLOTS} hours selected.</p>
            )}

            {error && (
                <p className={styles.error} role="alert">{error}</p>
            )}
        </div>
    );
}

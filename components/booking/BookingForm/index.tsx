'use client';

import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import RoomSelect from '../RoomSelect';
import DatePicker from '../DatePicker';
import TimeSlotPicker from '../TimeSlotPicker';
import AttendeeInput from '../AttendeeInput';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import ErrorMessage from '@/components/ui/ErrorMessage';
import styles from './BookingForm.module.css';
import { Room, TimeSlot, BookingPayload } from '@/lib/types';
import { createBooking } from '@/lib/api';

interface FormErrors {
    room?: string;
    date?: string;
    slot?: string;
    title?: string;
    email?: string;
}

function isValidEmail(email: string): boolean {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
}

export default function BookingForm() {
    const router = useRouter();

    const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);
    const [date, setDate] = useState('');
    const [selectedSlot, setSelectedSlot] = useState<TimeSlot | null>(null);
    const [title, setTitle] = useState('');
    const [email, setEmail] = useState('');
    const [attendees, setAttendees] = useState<string[]>([]);

    const [errors, setErrors] = useState<FormErrors>({});
    const [submitting, setSubmitting] = useState(false);
    const [submitError, setSubmitError] = useState('');

    // Reset slot when room/date changes
    const handleRoomSelect = useCallback((room: Room) => {
        setSelectedRoom(room);
        setSelectedSlot(null);
        setErrors((prev) => ({ ...prev, room: undefined }));
    }, []);

    const handleDateChange = useCallback((newDate: string) => {
        setDate(newDate);
        setSelectedSlot(null);
        setErrors((prev) => ({ ...prev, date: undefined }));
    }, []);

    function validate(): FormErrors {
        const errs: FormErrors = {};
        if (!selectedRoom) errs.room = 'Please select a conference room.';
        if (!date) errs.date = 'Please select a date.';
        if (!selectedSlot) errs.slot = 'Please select a time slot.';
        if (!title.trim()) errs.title = 'Please enter a meeting title.';
        if (!email.trim()) {
            errs.email = 'Please enter your email address.';
        } else if (!isValidEmail(email)) {
            errs.email = 'Please enter a valid email address.';
        }
        return errs;
    }

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setSubmitError('');

        const errs = validate();
        if (Object.keys(errs).length > 0) {
            setErrors(errs);
            // Scroll to first error
            const firstErrorEl = document.querySelector('[aria-invalid="true"]');
            if (firstErrorEl) {
                (firstErrorEl as HTMLElement).scrollIntoView({
                    behavior: 'smooth',
                    block: 'center',
                });
                (firstErrorEl as HTMLElement).focus();
            }
            return;
        }

        setSubmitting(true);

        const payload: BookingPayload = {
            roomId: selectedRoom!.id,
            date,
            slotId: selectedSlot!.id,
            startTime: selectedSlot!.startTime,
            endTime: selectedSlot!.endTime,
            title: title.trim(),
            organizerEmail: email.trim().toLowerCase(),
            attendees,
        };

        try {
            const result = await createBooking(payload);

            if (result.success && result.bookingId) {
                const params = new URLSearchParams({
                    status: 'success',
                    bookingId: result.bookingId,
                    room: result.booking?.roomName ?? selectedRoom!.name,
                    date,
                    start: selectedSlot!.startTime,
                    end: selectedSlot!.endTime,
                    title: title.trim(),
                    email: email.trim(),
                });
                router.push(`/confirmation?${params.toString()}`);
            } else {
                setSubmitError(
                    result.message ?? 'Booking failed. Please try again.',
                );
                setSubmitting(false);
            }
        } catch {
            setSubmitError(
                'An unexpected error occurred. Please check your connection and try again.',
            );
            setSubmitting(false);
        }
    }

    const isFormValid =
        !!selectedRoom && !!date && !!selectedSlot && !!title.trim() && !!email.trim() && isValidEmail(email);

    return (
        <form
            className={styles.form}
            onSubmit={handleSubmit}
            noValidate
            aria-label="Conference room booking form"
        >
            {/* Step 1 — Room */}
            <section className={styles.section} aria-labelledby="step-room">
                <div className={styles.stepHeader}>
                    <span className={styles.stepBadge} aria-hidden="true">1</span>
                    <h2 className={styles.stepTitle} id="step-room">Choose a Room</h2>
                </div>
                <RoomSelect
                    selectedRoomId={selectedRoom?.id ?? null}
                    onSelect={handleRoomSelect}
                />
                {errors.room && (
                    <p className={styles.fieldError} role="alert">{errors.room}</p>
                )}
            </section>

            {/* Step 2 — Date & Time */}
            <section className={styles.section} aria-labelledby="step-datetime">
                <div className={styles.stepHeader}>
                    <span className={styles.stepBadge} aria-hidden="true">2</span>
                    <h2 className={styles.stepTitle} id="step-datetime">Pick a Date &amp; Time</h2>
                </div>
                <div className={styles.dateRow}>
                    <DatePicker
                        value={date}
                        onChange={handleDateChange}
                        disabled={!selectedRoom}
                        error={errors.date}
                    />
                </div>
                <TimeSlotPicker
                    roomId={selectedRoom?.id ?? null}
                    date={date}
                    selectedSlotId={selectedSlot?.id ?? null}
                    onSelect={(slot) => {
                        setSelectedSlot(slot);
                        setErrors((prev) => ({ ...prev, slot: undefined }));
                    }}
                    error={errors.slot}
                />
            </section>

            {/* Step 3 — Details */}
            <section className={styles.section} aria-labelledby="step-details">
                <div className={styles.stepHeader}>
                    <span className={styles.stepBadge} aria-hidden="true">3</span>
                    <h2 className={styles.stepTitle} id="step-details">Meeting Details</h2>
                </div>
                <div className={styles.fields}>
                    <Input
                        id="meeting-title"
                        label="Meeting Title"
                        type="text"
                        value={title}
                        onChange={(e) => {
                            setTitle(e.target.value);
                            setErrors((prev) => ({ ...prev, title: undefined }));
                        }}
                        placeholder="e.g. Q2 Planning Session"
                        required
                        maxLength={120}
                        error={errors.title}
                    />
                    <Input
                        id="organizer-email"
                        label="Your Email"
                        type="email"
                        value={email}
                        onChange={(e) => {
                            setEmail(e.target.value);
                            setErrors((prev) => ({ ...prev, email: undefined }));
                        }}
                        placeholder="you@company.com"
                        required
                        autoComplete="email"
                        error={errors.email}
                    />
                    <AttendeeInput
                        attendees={attendees}
                        onChange={setAttendees}
                        organizerEmail={email}
                    />
                </div>
            </section>

            {/* Submit */}
            <div className={styles.submitRow}>
                {submitError && (
                    <ErrorMessage
                        title="Booking failed"
                        message={submitError}
                        onRetry={() => setSubmitError('')}
                    />
                )}

                {selectedRoom && date && selectedSlot && (
                    <div className={styles.summary}>
                        <p className={styles.summaryLabel}>Booking summary</p>
                        <p className={styles.summaryValue}>
                            <strong>{selectedRoom.name}</strong> · {date} · {selectedSlot.startTime}–{selectedSlot.endTime}
                        </p>
                    </div>
                )}

                <Button
                    type="submit"
                    variant="primary"
                    size="lg"
                    fullWidth
                    loading={submitting}
                    disabled={!isFormValid || submitting}
                    aria-describedby={!isFormValid ? 'form-incomplete-hint' : undefined}
                >
                    {submitting ? 'Confirming Booking…' : 'Confirm Booking'}
                </Button>
                {!isFormValid && (
                    <p id="form-incomplete-hint" className={styles.formHint}>
                        Complete all required fields to confirm your booking.
                    </p>
                )}
            </div>
        </form>
    );
}

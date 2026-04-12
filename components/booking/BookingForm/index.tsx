'use client';

import { useState, useCallback, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import RoomSelect from '../RoomSelect';
import DatePicker from '../DatePicker';
import TimeSlotPicker from '../TimeSlotPicker';
import AttendeeInput from '../AttendeeInput';
import OtpModal from '../OtpModal';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import ErrorMessage from '@/components/ui/ErrorMessage';
import styles from './BookingForm.module.css';
import { Room, TimeSlot, BookingPayload } from '@/lib/types';
import {
    checkUser,
    sendOtp,
    getBookedDates,
    createBooking,
} from '@/lib/api';

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

function formatTime(time: string): string {
    const [h, m] = time.split(':').map(Number);
    const suffix = h < 12 ? 'AM' : 'PM';
    const display = h % 12 || 12;
    return `${display}:${String(m).padStart(2, '0')} ${suffix}`;
}

function formatDate(dateStr: string): string {
    if (!dateStr) return '—';
    try {
        const [y, m, d] = dateStr.split('-').map(Number);
        return new Date(y, m - 1, d).toLocaleDateString('en-IN', {
            day: 'numeric',
            month: 'short',
            year: 'numeric',
        });
    } catch {
        return dateStr;
    }
}

function toMonthString(year: number, month: number): string {
    return `${year}-${String(month + 1).padStart(2, '0')}`;
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

    // Availability: track booked dates for the currently viewed month
    const now = new Date();
    const [viewYear, setViewYear] = useState(now.getFullYear());
    const [viewMonth, setViewMonth] = useState(now.getMonth());
    const [bookedDates, setBookedDates] = useState<string[]>([]);

    // OTP flow
    const [showOtp, setShowOtp] = useState(false);
    const [otpToken, setOtpToken] = useState('');

    // Fetch booked dates whenever room or viewed month changes
    useEffect(() => {
        if (!selectedRoom) {
            setBookedDates([]);
            return;
        }
        const month = toMonthString(viewYear, viewMonth);
        getBookedDates(selectedRoom.id, month)
            .then(setBookedDates)
            .catch(() => setBookedDates([]));
    }, [selectedRoom, viewYear, viewMonth]);

    const handleRoomSelect = useCallback((room: Room) => {
        setSelectedRoom(room);
        setSelectedSlot(null);
        setBookedDates([]);
        setErrors((prev) => ({ ...prev, room: undefined }));
    }, []);

    const handleDateChange = useCallback((newDate: string) => {
        setDate(newDate);
        setSelectedSlot(null);
        setErrors((prev) => ({ ...prev, date: undefined }));
    }, []);

    const handleMonthChange = useCallback((year: number, month: number) => {
        setViewYear(year);
        setViewMonth(month);
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

    async function submitBooking(token?: string) {
        setSubmitting(true);
        setSubmitError('');

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
            const result = await createBooking(payload, token);
            if (result.success && result.bookingId) {
                router.push(`/confirmation?bookingId=${encodeURIComponent(result.bookingId)}`);
            } else {
                setSubmitError(result.message ?? 'Booking failed. Please try again.');
                setSubmitting(false);
            }
        } catch {
            setSubmitError('An unexpected error occurred. Please check your connection and try again.');
            setSubmitting(false);
        }
    }

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setSubmitError('');

        const errs = validate();
        if (Object.keys(errs).length > 0) {
            setErrors(errs);
            const firstErrorEl = document.querySelector('[aria-invalid="true"]');
            if (firstErrorEl) {
                (firstErrorEl as HTMLElement).scrollIntoView({ behavior: 'smooth', block: 'center' });
                (firstErrorEl as HTMLElement).focus();
            }
            return;
        }

        // If we already have a verified OTP token, proceed directly
        if (otpToken) {
            await submitBooking(otpToken);
            return;
        }

        setSubmitting(true);

        try {
            const { isNewUser } = await checkUser(email.trim().toLowerCase());

            if (isNewUser) {
                await sendOtp(email.trim().toLowerCase());
                setSubmitting(false);
                setShowOtp(true);
            } else {
                // Existing user — skip OTP
                await submitBooking();
            }
        } catch (err) {
            setSubmitError(err instanceof Error ? err.message : 'An error occurred. Please try again.');
            setSubmitting(false);
        }
    }

    function handleOtpVerified(token: string) {
        setOtpToken(token);
        setShowOtp(false);
        // Submit immediately with the fresh token
        submitBooking(token);
    }

    async function handleOtpResend() {
        await sendOtp(email.trim().toLowerCase());
    }

    const isFormValid =
        !!selectedRoom && !!date && !!selectedSlot &&
        !!title.trim() && !!email.trim() && isValidEmail(email);

    return (
        <>
            {showOtp && (
                <OtpModal
                    email={email.trim().toLowerCase()}
                    onVerified={handleOtpVerified}
                    onClose={() => { setShowOtp(false); setSubmitting(false); }}
                    onResend={handleOtpResend}
                />
            )}

            <form
                className={styles.form}
                onSubmit={handleSubmit}
                noValidate
                aria-label="Conference room booking form"
            >
                <div className={styles.layout}>
                    {/* ── Left: Steps ── */}
                    <div className={styles.steps}>

                        {/* Step 01 — Room */}
                        <section className={styles.section} aria-labelledby="step-room">
                            <div className={styles.stepHeader}>
                                <span className={styles.stepNum} aria-hidden="true">01</span>
                                <h2 className={styles.stepTitle} id="step-room">Select Scale</h2>
                            </div>
                            <RoomSelect
                                selectedRoomId={selectedRoom?.id ?? null}
                                onSelect={handleRoomSelect}
                            />
                            {errors.room && (
                                <p className={styles.fieldError} role="alert">{errors.room}</p>
                            )}
                        </section>

                        {/* Step 02 + 03 — Date & Time */}
                        <section className={styles.section} aria-labelledby="step-date">
                            <div className={styles.dateTimeGrid}>
                                <div>
                                    <div className={styles.stepHeader}>
                                        <span className={styles.stepNum} aria-hidden="true">02</span>
                                        <h2 className={styles.stepTitle} id="step-date">Select Date</h2>
                                    </div>
                                    <DatePicker
                                        value={date}
                                        onChange={handleDateChange}
                                        onMonthChange={handleMonthChange}
                                        bookedDates={bookedDates}
                                        disabled={!selectedRoom}
                                        error={errors.date}
                                    />
                                </div>
                                <div>
                                    <div className={styles.stepHeader}>
                                        <span className={styles.stepNum} aria-hidden="true">03</span>
                                        <h2 className={styles.stepTitle} id="step-time">Availability</h2>
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
                                </div>
                            </div>
                        </section>

                        {/* Step 04 — Guest Details */}
                        <section className={styles.section} aria-labelledby="step-details">
                            <div className={styles.stepHeader}>
                                <span className={styles.stepNum} aria-hidden="true">04</span>
                                <h2 className={styles.stepTitle} id="step-details">Guest Details</h2>
                            </div>
                            <div className={styles.fieldsCard}>
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
                                    label="Primary Coordinator"
                                    type="email"
                                    value={email}
                                    onChange={(e) => {
                                        setEmail(e.target.value);
                                        setOtpToken(''); // reset token if email changes
                                        setErrors((prev) => ({ ...prev, email: undefined }));
                                    }}
                                    placeholder="arch@conferra.spaces"
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
                    </div>

                    {/* ── Right: Summary Sidebar ── */}
                    <aside className={styles.sidebar}>
                        <div className={styles.sidebarSticky}>
                            <div className={styles.sidebarCard}>
                                <div className={styles.sidebarHeading}>
                                    <span className={styles.sidebarLabel}>Transaction Details</span>
                                    <h2 className={styles.sidebarTitle}>Booking Summary</h2>
                                </div>

                                {selectedRoom && (
                                    <div className={styles.roomPreview}>
                                        <Image
                                            src={selectedRoom.imageUrl}
                                            alt={selectedRoom.name}
                                            fill
                                            className={styles.roomPreviewImage}
                                            sizes="(max-width: 1024px) 100vw, 33vw"
                                        />
                                    </div>
                                )}

                                <dl className={styles.summaryDetails}>
                                    <div className={styles.summaryRow}>
                                        <dt className={styles.summaryKey}>Space</dt>
                                        <dd className={styles.summaryVal}>{selectedRoom?.name ?? '—'}</dd>
                                    </div>
                                    <div className={styles.summaryRow}>
                                        <dt className={styles.summaryKey}>Date</dt>
                                        <dd className={styles.summaryVal}>{formatDate(date)}</dd>
                                    </div>
                                    <div className={styles.summaryRow}>
                                        <dt className={styles.summaryKey}>Time</dt>
                                        <dd className={styles.summaryVal}>
                                            {selectedSlot
                                                ? `${formatTime(selectedSlot.startTime)} — ${formatTime(selectedSlot.endTime)}`
                                                : '—'}
                                        </dd>
                                    </div>
                                    <div className={styles.summaryRow}>
                                        <dt className={styles.summaryKey}>Rate</dt>
                                        <dd className={styles.summaryVal}>₹4,500 / session</dd>
                                    </div>
                                </dl>

                                {submitError && (
                                    <ErrorMessage
                                        title="Booking failed"
                                        message={submitError}
                                        onRetry={() => setSubmitError('')}
                                    />
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
                                    {submitting ? 'Confirming…' : 'Verify & Confirm'}
                                </Button>

                                {!isFormValid && (
                                    <p id="form-incomplete-hint" className={styles.formHint}>
                                        Complete all required fields to confirm.
                                    </p>
                                )}

                                <div className={styles.securityBadge} aria-label="Secured connection">
                                    <svg viewBox="0 0 24 24" fill="currentColor" width="14" height="14" aria-hidden="true">
                                        <path fillRule="evenodd" d="M12 1.5a5.25 5.25 0 00-5.25 5.25v3a3 3 0 00-3 3v6.75a3 3 0 003 3h10.5a3 3 0 003-3v-6.75a3 3 0 00-3-3v-3c0-2.9-2.35-5.25-5.25-5.25zm3.75 8.25v-3a3.75 3.75 0 10-7.5 0v3h7.5z" clipRule="evenodd" />
                                    </svg>
                                    <span>Secured End-to-End Encryption</span>
                                </div>
                            </div>
                        </div>
                    </aside>
                </div>
            </form>
        </>
    );
}

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
import { checkUser, sendOtp, getBookedDates, createBooking } from '@/lib/api';


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
    const [selectedSlots, setSelectedSlots] = useState<TimeSlot[]>([]);
    const [title, setTitle] = useState('');
    const [email, setEmail] = useState('');
    const [attendees, setAttendees] = useState<string[]>([]);
    // const [avSelected, setAvSelected] = useState(false);

    const [errors, setErrors] = useState<FormErrors>({});
    const [submitting, setSubmitting] = useState(false);
    const [submitError, setSubmitError] = useState('');

    const now = new Date();
    const [viewYear, setViewYear] = useState(now.getFullYear());
    const [viewMonth, setViewMonth] = useState(now.getMonth());
    const [bookedDates, setBookedDates] = useState<string[]>([]);

    const [showOtp, setShowOtp] = useState(false);
    const [otpToken, setOtpToken] = useState('');

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
        setSelectedSlots([]);
        setBookedDates([]);
        setErrors((prev) => ({ ...prev, room: undefined }));
    }, []);

    const handleDateChange = useCallback((newDate: string) => {
        setDate(newDate);
        setSelectedSlots([]);
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
        if (selectedSlots.length === 0) errs.slot = 'Please select a time slot.';
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

        const firstSlot = selectedSlots[0];
        const lastSlot = selectedSlots[selectedSlots.length - 1];

        const payload: BookingPayload = {
            roomId: selectedRoom!.id,
            date,
            slotIds: selectedSlots.map((s) => s.id),
            startTime: firstSlot.startTime,
            endTime: lastSlot.endTime,
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

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
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
        submitBooking(token);
    }

    async function handleOtpResend() {
        await sendOtp(email.trim().toLowerCase());
    }

    const firstSlot = selectedSlots[0] ?? null;
    const lastSlot = selectedSlots[selectedSlots.length - 1] ?? null;
    const totalHours = selectedSlots.length;
    const totalAmount = selectedSlots.reduce((sum, s) => sum + s.price, 0);
    // A/V add-on: when enabling, replace the line above with:
    // const avCharge = avSelected && selectedRoom?.hasAV ? 1000 : 0;
    // const totalAmount = selectedSlots.reduce((sum, s) => sum + s.price, 0) + avCharge;

    const isFormValid =
        !!selectedRoom && !!date && selectedSlots.length > 0 &&
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
                                <h2 className={styles.stepTitle} id="step-room">Choose a Room</h2>
                            </div>
                            <RoomSelect
                                selectedRoomId={selectedRoom?.id ?? null}
                                onSelect={handleRoomSelect}
                            />
                            {errors.room && (
                                <p className={styles.fieldError} role="alert">{errors.room}</p>
                            )}

                            {/* A/V add-on checkbox — uncomment to enable
                            {selectedRoom?.hasAV && (
                                <label className={styles.avAddon}>
                                    <input
                                        type="checkbox"
                                        checked={avSelected}
                                        onChange={(e) => setAvSelected(e.target.checked)}
                                    />
                                    Add A/V equipment setup
                                    <span className={styles.avAddonPrice}>+₹1,000</span>
                                </label>
                            )}
                            */}
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
                                        <h2 className={styles.stepTitle} id="step-time">Choose a Time</h2>
                                    </div>
                                    <TimeSlotPicker
                                        roomId={selectedRoom?.id ?? null}
                                        date={date}
                                        selectedSlotIds={selectedSlots.map((s) => s.id)}
                                        onSelect={(slots) => {
                                            setSelectedSlots(slots);
                                            setErrors((prev) => ({ ...prev, slot: undefined }));
                                        }}
                                        error={errors.slot}
                                    />
                                </div>
                            </div>
                        </section>

                        {/* Step 04 — Your Details */}
                        <section className={styles.section} aria-labelledby="step-details">
                            <div className={styles.stepHeader}>
                                <span className={styles.stepNum} aria-hidden="true">04</span>
                                <h2 className={styles.stepTitle} id="step-details">Your Details</h2>
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
                                    label="Your Email Address"
                                    type="email"
                                    value={email}
                                    onChange={(e) => {
                                        setEmail(e.target.value);
                                        setOtpToken('');
                                        setErrors((prev) => ({ ...prev, email: undefined }));
                                    }}
                                    placeholder="you@example.com"
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
                                        <dt className={styles.summaryKey}>Room</dt>
                                        <dd className={styles.summaryVal}>{selectedRoom?.name ?? '—'}</dd>
                                    </div>
                                    <div className={styles.summaryRow}>
                                        <dt className={styles.summaryKey}>Date</dt>
                                        <dd className={styles.summaryVal}>{formatDate(date)}</dd>
                                    </div>
                                    <div className={styles.summaryRow}>
                                        <dt className={styles.summaryKey}>Time</dt>
                                        <dd className={styles.summaryVal}>
                                            {firstSlot && lastSlot
                                                ? `${formatTime(firstSlot.startTime)} — ${formatTime(lastSlot.endTime)}`
                                                : '—'}
                                        </dd>
                                    </div>
                                    <div className={styles.summaryRow}>
                                        <dt className={styles.summaryKey}>Total</dt>
                                        <dd className={styles.summaryVal}>
                                            {totalHours > 0
                                                ? `₹${totalAmount.toLocaleString('en-IN')} for ${totalHours} hr`
                                                : '—'}
                                        </dd>
                                    </div>
                                    {/* A/V add-on summary row — uncomment to enable
                                    {avSelected && selectedRoom?.hasAV && (
                                        <div className={styles.summaryRow}>
                                            <dt className={styles.summaryKey}>A/V Setup</dt>
                                            <dd className={styles.summaryVal}>₹1,000</dd>
                                        </div>
                                    )}
                                    */}
                                </dl>

                                {submitError && (
                                    <div className={styles.errorWrap}>
                                        <ErrorMessage
                                            title="Booking failed"
                                            message={submitError}
                                            onRetry={() => setSubmitError('')}
                                        />
                                    </div>
                                )}

                                <div className={styles.submitWrap}>
                                    <Button
                                        type="submit"
                                        variant="primary"
                                        size="lg"
                                        fullWidth
                                        className={styles.confirm_button}
                                        loading={submitting}
                                        disabled={!isFormValid || submitting}
                                        aria-describedby={!isFormValid ? 'form-incomplete-hint' : undefined}
                                    >
                                        {submitting ? 'Confirming…' : 'Confirm Booking'}
                                    </Button>
                                </div>

                                {!isFormValid && (
                                    <p id="form-incomplete-hint" className={styles.formHint}>
                                        Complete all required fields to confirm.
                                    </p>
                                )}
                            </div>
                        </div>
                    </aside>
                </div>
            </form>
        </>
    );
}

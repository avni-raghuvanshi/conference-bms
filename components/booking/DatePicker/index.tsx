'use client';

import styles from './DatePicker.module.css';

interface DatePickerProps {
    value: string;
    onChange: (date: string) => void;
    disabled?: boolean;
    error?: string;
}

function getTodayISO(): string {
    const today = new Date();
    const y = today.getFullYear();
    const m = String(today.getMonth() + 1).padStart(2, '0');
    const d = String(today.getDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
}

function getMaxDateISO(): string {
    const max = new Date();
    max.setMonth(max.getMonth() + 3);
    const y = max.getFullYear();
    const m = String(max.getMonth() + 1).padStart(2, '0');
    const d = String(max.getDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
}

export default function DatePicker({
    value,
    onChange,
    disabled = false,
    error,
}: DatePickerProps) {
    return (
        <div className={styles.wrapper}>
            <label htmlFor="booking-date" className={styles.label}>
                Date <span className={styles.required} aria-hidden="true">*</span>
            </label>
            <input
                id="booking-date"
                type="date"
                value={value}
                min={getTodayISO()}
                max={getMaxDateISO()}
                disabled={disabled}
                onChange={(e) => onChange(e.target.value)}
                aria-invalid={error ? 'true' : undefined}
                aria-describedby={error ? 'booking-date-error' : undefined}
                className={[styles.input, error ? styles.inputError : '']
                    .filter(Boolean)
                    .join(' ')}
            />
            {error && (
                <p id="booking-date-error" className={styles.error} role="alert">
                    {error}
                </p>
            )}
            {disabled && (
                <p className={styles.hint}>Please select a room first</p>
            )}
        </div>
    );
}

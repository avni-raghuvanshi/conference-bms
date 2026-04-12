'use client';

import { useState, useMemo } from 'react';
import styles from './DatePicker.module.css';

interface DatePickerProps {
    value: string;
    onChange: (date: string) => void;
    onMonthChange?: (year: number, month: number) => void;
    bookedDates?: string[];   // "YYYY-MM-DD" dates to render as fully booked
    disabled?: boolean;
    error?: string;
}

const MONTHS = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December',
];

const WEEKDAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

function toISODate(year: number, month: number, day: number): string {
    return `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
}

function getTodayISO(): string {
    const t = new Date();
    return toISODate(t.getFullYear(), t.getMonth(), t.getDate());
}

function getMaxISO(): string {
    const max = new Date();
    max.setMonth(max.getMonth() + 3);
    return toISODate(max.getFullYear(), max.getMonth(), max.getDate());
}

type Cell = { day: number; iso: string } | null;

export default function DatePicker({
    value,
    onChange,
    onMonthChange,
    bookedDates = [],
    disabled = false,
    error,
}: DatePickerProps) {
    const todayISO = getTodayISO();
    const maxISO = getMaxISO();

    const now = new Date();
    const [viewYear, setViewYear] = useState(now.getFullYear());
    const [viewMonth, setViewMonth] = useState(now.getMonth());

    const bookedSet = useMemo(() => new Set(bookedDates), [bookedDates]);

    const cells: Cell[] = useMemo(() => {
        const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
        const startOffset = (new Date(viewYear, viewMonth, 1).getDay() + 6) % 7;
        return [
            ...Array<null>(startOffset).fill(null),
            ...Array.from({ length: daysInMonth }, (_, i) => ({
                day: i + 1,
                iso: toISODate(viewYear, viewMonth, i + 1),
            })),
        ];
    }, [viewYear, viewMonth]);

    const minViewISO = toISODate(now.getFullYear(), now.getMonth(), 1);
    const maxDate = new Date();
    maxDate.setMonth(maxDate.getMonth() + 3);
    const maxViewISO = toISODate(maxDate.getFullYear(), maxDate.getMonth(), 1);
    const currentViewISO = toISODate(viewYear, viewMonth, 1);

    const canPrev = currentViewISO > minViewISO;
    const canNext = currentViewISO < maxViewISO;

    function prevMonth() {
        if (!canPrev) return;
        let newYear = viewYear;
        let newMonth = viewMonth - 1;
        if (newMonth < 0) { newYear -= 1; newMonth = 11; }
        setViewYear(newYear);
        setViewMonth(newMonth);
        onMonthChange?.(newYear, newMonth);
    }

    function nextMonth() {
        if (!canNext) return;
        let newYear = viewYear;
        let newMonth = viewMonth + 1;
        if (newMonth > 11) { newYear += 1; newMonth = 0; }
        setViewYear(newYear);
        setViewMonth(newMonth);
        onMonthChange?.(newYear, newMonth);
    }

    return (
        <div className={[styles.calendar, disabled ? styles.calendarDisabled : ''].filter(Boolean).join(' ')}>
            <div className={styles.calHeader}>
                <span className={styles.calMonth}>
                    {MONTHS[viewMonth]} {viewYear}
                </span>
                <div className={styles.calNav}>
                    <button
                        type="button"
                        onClick={prevMonth}
                        disabled={!canPrev}
                        className={styles.navBtn}
                        aria-label="Previous month"
                    >
                        ‹
                    </button>
                    <button
                        type="button"
                        onClick={nextMonth}
                        disabled={!canNext}
                        className={styles.navBtn}
                        aria-label="Next month"
                    >
                        ›
                    </button>
                </div>
            </div>

            <div className={styles.weekdays} aria-hidden="true">
                {WEEKDAYS.map(d => (
                    <span key={d} className={styles.weekday}>{d}</span>
                ))}
            </div>

            <div className={styles.grid} role="grid" aria-label="Select a date">
                {cells.map((cell, i) => {
                    if (!cell) return <div key={`e-${i}`} className={styles.empty} />;

                    const isPast = cell.iso < todayISO;
                    const isFuture = cell.iso > maxISO;
                    const isFullyBooked = bookedSet.has(cell.iso);
                    const isDisabled = isPast || isFuture || disabled || isFullyBooked;
                    const isSelected = cell.iso === value;
                    const isToday = cell.iso === todayISO;

                    return (
                        <button
                            key={cell.iso}
                            type="button"
                            role="gridcell"
                            aria-selected={isSelected}
                            aria-label={`${cell.iso}${isFullyBooked ? ', fully booked' : ''}`}
                            disabled={isDisabled}
                            onClick={() => !isDisabled && onChange(cell.iso)}
                            className={[
                                styles.day,
                                isSelected && styles.daySelected,
                                isToday && !isSelected && styles.dayToday,
                                isFullyBooked && styles.dayFullyBooked,
                                isDisabled && !isFullyBooked && styles.dayDisabled,
                            ].filter(Boolean).join(' ')}
                        >
                            {cell.day}
                        </button>
                    );
                })}
            </div>

            {error && <p className={styles.error} role="alert">{error}</p>}
            {disabled && <p className={styles.hint}>Select a room first</p>}
        </div>
    );
}

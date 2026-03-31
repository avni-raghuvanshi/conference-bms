'use client';

import { useState, useRef, KeyboardEvent } from 'react';
import styles from './AttendeeInput.module.css';

interface AttendeeInputProps {
    attendees: string[];
    onChange: (attendees: string[]) => void;
    error?: string;
    organizerEmail?: string;
}

function isValidEmail(email: string): boolean {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
}

export default function AttendeeInput({
    attendees,
    onChange,
    error,
    organizerEmail,
}: AttendeeInputProps) {
    const [inputValue, setInputValue] = useState('');
    const [inputError, setInputError] = useState('');
    const inputRef = useRef<HTMLInputElement>(null);

    function addEmail(email: string) {
        const trimmed = email.trim().toLowerCase();
        if (!trimmed) return;

        if (!isValidEmail(trimmed)) {
            setInputError('Please enter a valid email address.');
            return;
        }

        if (trimmed === organizerEmail?.toLowerCase()) {
            setInputError('This email is already added as the organizer.');
            return;
        }

        if (attendees.map((a) => a.toLowerCase()).includes(trimmed)) {
            setInputError('This email has already been added.');
            return;
        }

        onChange([...attendees, trimmed]);
        setInputValue('');
        setInputError('');
    }

    function removeEmail(index: number) {
        onChange(attendees.filter((_, i) => i !== index));
    }

    function handleKeyDown(e: KeyboardEvent<HTMLInputElement>) {
        if (e.key === 'Enter' || e.key === ',') {
            e.preventDefault();
            addEmail(inputValue);
        }
        if (e.key === 'Backspace' && !inputValue && attendees.length > 0) {
            onChange(attendees.slice(0, -1));
        }
    }

    return (
        <div className={styles.wrapper}>
            <label htmlFor="attendees-input" className={styles.label}>
                Attendees
                <span className={styles.hint}> (optional)</span>
            </label>
            <p className={styles.description}>
                Add attendee emails. Press <kbd>Enter</kbd> or <kbd>,</kbd> to add each.
            </p>

            <div
                className={[styles.chipBox, inputError || error ? styles.chipBoxError : '']
                    .filter(Boolean)
                    .join(' ')}
                onClick={() => inputRef.current?.focus()}
                role="group"
                aria-label="Attendee emails"
            >
                {attendees.map((email, i) => (
                    <span key={email} className={styles.chip}>
                        <span className={styles.chipEmail}>{email}</span>
                        <button
                            type="button"
                            className={styles.chipRemove}
                            onClick={(e) => {
                                e.stopPropagation();
                                removeEmail(i);
                            }}
                            aria-label={`Remove ${email}`}
                        >
                            ×
                        </button>
                    </span>
                ))}
                <input
                    ref={inputRef}
                    id="attendees-input"
                    type="email"
                    value={inputValue}
                    onChange={(e) => {
                        setInputValue(e.target.value);
                        setInputError('');
                    }}
                    onKeyDown={handleKeyDown}
                    onBlur={() => {
                        if (inputValue.trim()) addEmail(inputValue);
                    }}
                    placeholder={attendees.length === 0 ? 'colleague@company.com' : ''}
                    className={styles.chipInput}
                    aria-invalid={!!(inputError || error)}
                    aria-describedby={inputError ? 'attendee-input-error' : undefined}
                />
            </div>

            {(inputError || error) && (
                <p id="attendee-input-error" className={styles.error} role="alert">
                    {inputError || error}
                </p>
            )}

            {attendees.length > 0 && (
                <p className={styles.count} aria-live="polite">
                    {attendees.length} attendee{attendees.length !== 1 ? 's' : ''} added
                </p>
            )}
        </div>
    );
}

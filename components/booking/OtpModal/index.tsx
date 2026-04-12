'use client';

import { useState, useRef, useEffect, useCallback, KeyboardEvent, ClipboardEvent } from 'react';
import Button from '@/components/ui/Button';
import styles from './OtpModal.module.css';

interface OtpModalProps {
    email: string;
    onVerified: (token: string) => void;
    onClose: () => void;
    onResend: () => Promise<void>;
}

const RESEND_COOLDOWN_SECONDS = 60;
const OTP_LENGTH = 6;

export default function OtpModal({ email, onVerified, onClose, onResend }: OtpModalProps) {
    const [digits, setDigits] = useState<string[]>(Array(OTP_LENGTH).fill(''));
    const [verifying, setVerifying] = useState(false);
    const [error, setError] = useState('');
    const [resendCooldown, setResendCooldown] = useState(RESEND_COOLDOWN_SECONDS);
    const [resending, setResending] = useState(false);

    const inputRefs = useRef<Array<HTMLInputElement | null>>(Array(OTP_LENGTH).fill(null));

    // Countdown timer for resend cooldown
    useEffect(() => {
        if (resendCooldown <= 0) return;
        const id = setInterval(() => setResendCooldown((s) => s - 1), 1000);
        return () => clearInterval(id);
    }, [resendCooldown]);

    // Focus first input on mount
    useEffect(() => {
        inputRefs.current[0]?.focus();
    }, []);

    function updateDigit(index: number, value: string) {
        const sanitized = value.replace(/\D/g, '').slice(-1);
        const next = [...digits];
        next[index] = sanitized;
        setDigits(next);
        setError('');

        if (sanitized && index < OTP_LENGTH - 1) {
            inputRefs.current[index + 1]?.focus();
        }
    }

    function handleKeyDown(index: number, e: KeyboardEvent<HTMLInputElement>) {
        if (e.key === 'Backspace' && !digits[index] && index > 0) {
            inputRefs.current[index - 1]?.focus();
        }
        if (e.key === 'ArrowLeft' && index > 0) {
            inputRefs.current[index - 1]?.focus();
        }
        if (e.key === 'ArrowRight' && index < OTP_LENGTH - 1) {
            inputRefs.current[index + 1]?.focus();
        }
    }

    function handlePaste(e: ClipboardEvent<HTMLInputElement>) {
        e.preventDefault();
        const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, OTP_LENGTH);
        if (!pasted) return;
        const next = [...digits];
        for (let i = 0; i < pasted.length; i++) next[i] = pasted[i];
        setDigits(next);
        setError('');
        const focusIndex = Math.min(pasted.length, OTP_LENGTH - 1);
        inputRefs.current[focusIndex]?.focus();
    }

    const handleVerify = useCallback(async () => {
        const otp = digits.join('');
        if (otp.length < OTP_LENGTH) {
            setError('Enter all 6 digits.');
            return;
        }

        setVerifying(true);
        setError('');

        try {
            const res = await fetch('/api/auth/verify-otp', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, otp }),
            });
            const data = await res.json() as { token?: string; error?: string };

            if (!res.ok) {
                setError(data.error ?? 'Invalid code. Please try again.');
                setDigits(Array(OTP_LENGTH).fill(''));
                inputRefs.current[0]?.focus();
            } else {
                onVerified(data.token!);
            }
        } catch {
            setError('Network error. Please try again.');
        } finally {
            setVerifying(false);
        }
    }, [digits, email, onVerified]);

    // Auto-submit when all digits are filled
    useEffect(() => {
        if (digits.every((d) => d !== '') && !verifying) {
            handleVerify();
        }
    }, [digits, verifying, handleVerify]);

    async function handleResend() {
        setResending(true);
        setError('');
        try {
            await onResend();
            setResendCooldown(RESEND_COOLDOWN_SECONDS);
            setDigits(Array(OTP_LENGTH).fill(''));
            inputRefs.current[0]?.focus();
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to resend code.');
        } finally {
            setResending(false);
        }
    }

    return (
        <div className={styles.overlay} role="dialog" aria-modal="true" aria-labelledby="otp-title">
            <div className={styles.modal}>
                <button
                    className={styles.closeBtn}
                    type="button"
                    onClick={onClose}
                    aria-label="Cancel verification"
                >
                    ✕
                </button>

                <div className={styles.header}>
                    <div className={styles.iconWrap} aria-hidden="true">
                        <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
                            <path fillRule="evenodd" d="M12 1.5a5.25 5.25 0 00-5.25 5.25v3a3 3 0 00-3 3v6.75a3 3 0 003 3h10.5a3 3 0 003-3v-6.75a3 3 0 00-3-3v-3c0-2.9-2.35-5.25-5.25-5.25zm3.75 8.25v-3a3.75 3.75 0 10-7.5 0v3h7.5z" clipRule="evenodd" />
                        </svg>
                    </div>
                    <h2 className={styles.title} id="otp-title">Verify your email</h2>
                    <p className={styles.subtitle}>
                        We sent a 6-digit code to<br />
                        <strong className={styles.email}>{email}</strong>
                    </p>
                </div>

                <div className={styles.digitRow} role="group" aria-label="One-time verification code">
                    {digits.map((digit, i) => (
                        <input
                            key={i}
                            ref={(el) => { inputRefs.current[i] = el; }}
                            type="text"
                            inputMode="numeric"
                            maxLength={1}
                            value={digit}
                            onChange={(e) => updateDigit(i, e.target.value)}
                            onKeyDown={(e) => handleKeyDown(i, e)}
                            onPaste={i === 0 ? handlePaste : undefined}
                            className={[
                                styles.digitInput,
                                error ? styles.digitInputError : '',
                            ].filter(Boolean).join(' ')}
                            aria-label={`Digit ${i + 1}`}
                            autoComplete={i === 0 ? 'one-time-code' : 'off'}
                        />
                    ))}
                </div>

                {error && (
                    <p className={styles.error} role="alert">{error}</p>
                )}

                <Button
                    type="button"
                    variant="primary"
                    size="lg"
                    fullWidth
                    loading={verifying}
                    disabled={digits.some((d) => !d) || verifying}
                    onClick={handleVerify}
                >
                    {verifying ? 'Verifying…' : 'Verify & Continue'}
                </Button>

                <div className={styles.resend}>
                    {resendCooldown > 0 ? (
                        <p className={styles.resendHint}>
                            Resend code in <strong>{resendCooldown}s</strong>
                        </p>
                    ) : (
                        <button
                            type="button"
                            className={styles.resendBtn}
                            onClick={handleResend}
                            disabled={resending}
                        >
                            {resending ? 'Sending…' : 'Resend code'}
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}

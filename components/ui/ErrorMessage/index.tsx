import React from 'react';
import styles from './ErrorMessage.module.css';

interface ErrorMessageProps {
    title?: string;
    message: string;
    onRetry?: () => void;
}

export default function ErrorMessage({
    title = 'Something went wrong',
    message,
    onRetry,
}: ErrorMessageProps) {
    return (
        <div className={styles.wrapper} role="alert" aria-live="assertive">
            <span className={styles.icon} aria-hidden="true">⚠</span>
            <div className={styles.content}>
                <p className={styles.title}>{title}</p>
                <p className={styles.message}>{message}</p>
                {onRetry && (
                    <button type="button" className={styles.retry} onClick={onRetry}>
                        Try again
                    </button>
                )}
            </div>
        </div>
    );
}

import React from 'react';
import styles from './LoadingSpinner.module.css';

interface LoadingSpinnerProps {
    size?: 'sm' | 'md' | 'lg';
    label?: string;
}

export default function LoadingSpinner({
    size = 'md',
    label = 'Loading…',
}: LoadingSpinnerProps) {
    return (
        <span
            className={[styles.spinner, styles[size]].join(' ')}
            role="status"
            aria-label={label}
        >
            <svg
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                aria-hidden="true"
            >
                <circle
                    className={styles.track}
                    cx="12"
                    cy="12"
                    r="10"
                    strokeWidth="3"
                />
                <path
                    className={styles.arc}
                    d="M12 2a10 10 0 0 1 10 10"
                    strokeWidth="3"
                    strokeLinecap="round"
                />
            </svg>
        </span>
    );
}

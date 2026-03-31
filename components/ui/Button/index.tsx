'use client';

import React from 'react';
import styles from './Button.module.css';
import LoadingSpinner from '../LoadingSpinner';

export type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger';
export type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: ButtonVariant;
    size?: ButtonSize;
    loading?: boolean;
    fullWidth?: boolean;
    children: React.ReactNode;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
    (
        {
            variant = 'primary',
            size = 'md',
            loading = false,
            fullWidth = false,
            children,
            disabled,
            className = '',
            ...props
        },
        ref,
    ) => {
        const isDisabled = disabled || loading;

        return (
            <button
                ref={ref}
                disabled={isDisabled}
                aria-busy={loading}
                className={[
                    styles.button,
                    styles[variant],
                    styles[size],
                    fullWidth ? styles.fullWidth : '',
                    loading ? styles.loading : '',
                    className,
                ]
                    .filter(Boolean)
                    .join(' ')}
                {...props}
            >
                {loading && (
                    <span className={styles.spinner} aria-hidden="true">
                        <LoadingSpinner size="sm" />
                    </span>
                )}
                <span className={loading ? styles.hiddenText : ''}>{children}</span>
            </button>
        );
    },
);

Button.displayName = 'Button';

export default Button;

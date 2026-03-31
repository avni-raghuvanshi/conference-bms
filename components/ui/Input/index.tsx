import React from 'react';
import styles from './Input.module.css';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label: string;
    error?: string;
    hint?: string;
    id: string;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
    ({ label, error, hint, id, className = '', ...props }, ref) => {
        const hintId = hint ? `${id}-hint` : undefined;
        const errorId = error ? `${id}-error` : undefined;
        const describedBy = [hintId, errorId].filter(Boolean).join(' ') || undefined;

        return (
            <div className={[styles.wrapper, className].filter(Boolean).join(' ')}>
                <label htmlFor={id} className={styles.label}>
                    {label}
                    {props.required && (
                        <span className={styles.required} aria-hidden="true">
                            {' '}*
                        </span>
                    )}
                </label>
                {hint && (
                    <p id={hintId} className={styles.hint}>
                        {hint}
                    </p>
                )}
                <input
                    ref={ref}
                    id={id}
                    className={[styles.input, error ? styles.inputError : '']
                        .filter(Boolean)
                        .join(' ')}
                    aria-invalid={error ? 'true' : undefined}
                    aria-describedby={describedBy}
                    {...props}
                />
                {error && (
                    <p id={errorId} className={styles.error} role="alert">
                        {error}
                    </p>
                )}
            </div>
        );
    },
);

Input.displayName = 'Input';
export default Input;

import React from 'react';
import styles from './Card.module.css';

interface CardProps {
    children: React.ReactNode;
    className?: string;
    padding?: 'none' | 'sm' | 'md' | 'lg';
    hover?: boolean;
    as?: React.ElementType;
}

export default function Card({
    children,
    className = '',
    padding = 'md',
    hover = false,
    as: Tag = 'div',
}: CardProps) {
    return (
        <Tag
            className={[
                styles.card,
                styles[`padding-${padding}`],
                hover ? styles.hover : '',
                className,
            ]
                .filter(Boolean)
                .join(' ')}
        >
            {children}
        </Tag>
    );
}

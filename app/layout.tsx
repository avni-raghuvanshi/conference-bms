import type { Metadata } from 'next';
import '../styles/globals.css';

export const viewport = {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 5,
};

export const metadata: Metadata = {
    title: {
        default: 'Conference BMS — Room Booking',
        template: '%s | Conference BMS',
    },
    description:
        'Book conference rooms in seconds. Choose a room, pick a time, invite your team.',
    keywords: ['conference room booking', 'meeting room', 'office booking system'],
    openGraph: {
        type: 'website',
        locale: 'en_US',
        siteName: 'Conference BMS',
        title: 'Conference BMS — Room Booking',
        description:
            'Book conference rooms in seconds. Choose a room, pick a time, invite your team.',
    },
    twitter: {
        card: 'summary_large_image',
        title: 'Conference BMS',
        description: 'Book conference rooms in seconds.',
    },
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en">
            <head>
                <link rel="preconnect" href="https://fonts.googleapis.com" />
                <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
                <link
                    href="https://fonts.googleapis.com/css2?family=Montserrat:ital,wght@0,100..900;1,100..900&family=Noto+Serif:ital,wght@0,100..900;1,100..900&display=swap"
                    rel="stylesheet"
                />
            </head>
            <body>{children}</body>
        </html>
    );
}

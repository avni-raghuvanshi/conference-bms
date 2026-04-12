import type { Metadata } from 'next';
import { Noto_Serif, Montserrat } from 'next/font/google';
import '../styles/globals.css';
import Header from '@/components/ui/Header/Header';

const notoSerif = Noto_Serif({
    subsets: ['latin'],
    weight: ['400', '700'],
    style: ['normal', 'italic'],
    variable: '--ff-serif',
    display: 'swap',
});

const montserrat = Montserrat({
    subsets: ['latin'],
    weight: ['200', '300', '400', '500', '600', '700', '800'],
    variable: '--ff-sans',
    display: 'swap',
});

export const metadata: Metadata = {
    title: {
        default: 'CONFERRA — Architectural Sanctuaries for Dialogue',
        template: '%s | CONFERRA',
    },
    description:
        'Elevated meeting spaces in the heart of Greater Kailash. Designed for focus, engineered for collaboration, curated for the modern visionary.',
    keywords: ['conference room', 'meeting space', 'Greater Kailash', 'executive suite', 'Delhi'],
    openGraph: {
        type: 'website',
        locale: 'en_IN',
        siteName: 'CONFERRA',
        title: 'CONFERRA — Architectural Sanctuaries for Dialogue',
        description:
            'Elevated meeting spaces in the heart of Greater Kailash. Designed for focus, engineered for collaboration.',
    },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="en" className={`${notoSerif.variable} ${montserrat.variable}`}>
            <body>
                <Header />
                {children}
            </body>
        </html>
    );
}

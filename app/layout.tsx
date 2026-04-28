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
    weight: ['300', '400', '600', '700'],
    variable: '--ff-sans',
    display: 'swap',
});

export const metadata: Metadata = {
    title: {
        default: 'Conferra — Meeting Rooms in Greater Kailash, Delhi',
        template: '%s | Conferra',
    },
    description:
        'Private meeting rooms in GK II, South Delhi. Audio/video conferencing included. Book by the hour.',
    keywords: ['conference room', 'meeting room', 'Greater Kailash', 'GK II', 'Delhi', 'book meeting room'],
    openGraph: {
        type: 'website',
        locale: 'en_IN',
        siteName: 'Conferra',
        title: 'Conferra — Meeting Rooms in Greater Kailash, Delhi',
        description:
            'Private meeting rooms in GK II, South Delhi. Audio/video conferencing included. Book by the hour.',
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

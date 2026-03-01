import { Metadata } from 'next';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.3layered.com';

export const metadata: Metadata = {
    title: 'Custom 3D Printing Services - Request a Quote | 3 Layered',
    description: 'Request custom 3D printing services from 3 Layered. Upload your designs for miniature temples, architectural models, prototypes, and custom parts. Get a quote within 24 hours.',
    keywords: [
        'custom 3D printing',
        '3D printing quote',
        'custom miniature temple',
        'architectural model printing',
        '3D printing services India',
        'custom parts manufacturing',
    ],
    alternates: {
        canonical: `${siteUrl}/custom-print`,
    },
    openGraph: {
        title: 'Custom 3D Printing Services - Get Your Quote Today',
        description: 'Upload your designs and get a custom 3D printing quote within 24 hours. Specialized in architectural models and miniature temples.',
        type: 'website',
        url: `${siteUrl}/custom-print`,
        images: [
            {
                url: `${siteUrl}/og-image.jpg`,
                width: 1200,
                height: 630,
                alt: 'Custom 3D Printing Services',
            },
        ],
    },
};

export default function CustomPrintLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return children;
}

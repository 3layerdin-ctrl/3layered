import { Metadata } from 'next';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://3layered.com';

export const metadata: Metadata = {
    title: 'Custom 3D Printing Services | Request Quote for 3D Printed Models | 3 Layered',
    description: 'Request custom 3D printing services for miniature temples, architectural models, and precision parts. Get a quote for professional 3D printing with expert craftsmanship.',
    keywords: [
        'custom 3D printing',
        'custom 3D printing services',
        '3D printing quote',
        'custom miniature temple printing',
        'custom architectural models',
        'precision 3D printing services',
        '3D printing request',
        'custom 3D print quote',
        'architectural model quote',
        'temple replica printing'
    ],
    alternates: {
        canonical: `${siteUrl}/custom-print`,
    },
    openGraph: {
        title: 'Custom 3D Printing Services | Request Quote | 3 Layered',
        description: 'Request custom 3D printing for miniature temples, architectural models, and precision parts',
        url: `${siteUrl}/custom-print`,
        type: 'website',
    },
};

import { Metadata } from 'next';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://3layered.in';

export const metadata: Metadata = {
    title: '3D Printed Miniature Temples & Architectural Models | Products | 3 Layered',
    description: 'Browse our collection of 3D printed miniature temple models and architectural replicas. Museum-quality 3D printing with sacred geometry precision. Shop custom 3D printed temples and heritage models.',
    keywords: [
        '3D printed miniature temples',
        'miniature temple models for sale',
        '3D printed architectural models',
        'temple replicas',
        'architectural model products',
        '3D printed heritage models',
        'miniature temple shop',
        '3D printing miniatures',
        'sacred geometry models',
        'Asian temple replicas'
    ],
    alternates: {
        canonical: `${siteUrl}/products`,
    },
    openGraph: {
        title: '3D Printed Miniature Temples & Architectural Models | Products',
        description: 'Browse our collection of museum-quality 3D printed miniature temples and architectural models',
        url: `${siteUrl}/products`,
        type: 'website',
    },
};

import { Metadata } from 'next';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://3layered.in';

export const metadata: Metadata = {
    title: '3D Printing Services & Architectural Models | About 3 Layered',
    description: 'Learn about 3 Layered - expert 3D printing services for miniature temple models and architectural replicas. Custom 3D printing with museum-quality precision in Pimpri-Chinchwad, Maharashtra.',
    keywords: [
        '3D printing company',
        '3D printing services',
        'architectural model makers',
        'miniature temple 3D printing',
        'custom 3D printing Maharashtra',
        '3D printing Pune',
        'precision 3D printing',
        'architectural replicas'
    ],
    alternates: {
        canonical: `${siteUrl}/about`,
    },
    openGraph: {
        title: '3D Printing Services & Architectural Models | About 3 Layered',
        description: 'Expert 3D printing services specializing in miniature temple models and architectural replicas',
        url: `${siteUrl}/about`,
        type: 'website',
    },
};

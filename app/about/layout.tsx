import { Metadata } from 'next';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://yourdomain.com';

export const metadata: Metadata = {
    title: 'About 3 Layered - Premium 3D Printed Architectural Models | Pimpri-Chinchwad',
    description: 'Learn about 3 Layered, where architectural philosophy meets modern manufacturing. Discover how we create museum-quality miniature temples and architectural models using precision 3D printing.',
    keywords: [
        'about 3 layered',
        'architectural 3D printing company',
        'miniature temple makers',
        '3D printing philosophy',
        'architectural model makers India',
        'Pimpri-Chinchwad 3D printing',
    ],
    alternates: {
        canonical: `${siteUrl}/about`,
    },
    openGraph: {
        title: 'About 3 Layered - Architectural Philosophy Meets Modern Manufacturing',
        description: 'Museum-quality miniature temples and architectural models, precision-engineered with 3D printing technology.',
        type: 'website',
        url: `${siteUrl}/about`,
        images: [
            {
                url: `${siteUrl}/og-image.jpg`,
                width: 1200,
                height: 630,
                alt: 'About 3 Layered - Premium 3D Printing Company',
            },
        ],
    },
};

export default function AboutLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return children;
}

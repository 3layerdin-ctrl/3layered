import { Metadata } from 'next';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.3layered.com';

export const metadata: Metadata = {
    title: 'Contact Us - 3 Layered | Premium 3D Printing Services in Pimpri-Chinchwad',
    description: 'Get in touch with 3 Layered for custom 3D printing services, miniature temple orders, and architectural models. Located in Pimpri-Chinchwad, Maharashtra. Call +91 99827 81000.',
    keywords: [
        'contact 3 layered',
        '3D printing services contact',
        'Pimpri-Chinchwad 3D printing',
        'custom 3D printing quote',
        'miniature temple order',
    ],
    alternates: {
        canonical: `${siteUrl}/contact`,
    },
    openGraph: {
        title: 'Contact 3 Layered - Premium 3D Printing Services',
        description: 'Reach out for custom 3D printing services and architectural models in Pimpri-Chinchwad, Maharashtra.',
        type: 'website',
        url: `${siteUrl}/contact`,
        images: [
            {
                url: `${siteUrl}/og-image.jpg`,
                width: 1200,
                height: 630,
                alt: 'Contact 3 Layered',
            },
        ],
    },
};

export default function ContactLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return children;
}

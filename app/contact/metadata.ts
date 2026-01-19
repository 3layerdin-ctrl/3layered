import { Metadata } from 'next';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://3layered.in';

export const metadata: Metadata = {
    title: 'Contact Us | 3D Printing Services in Pimpri-Chinchwad | 3 Layered',
    description: 'Get in touch with 3 Layered for custom 3D printing services. Contact us for miniature temple models, architectural replicas, and precision 3D printing in Pune, Maharashtra.',
    keywords: [
        '3D printing contact Pune',
        '3D printing services Pimpri-Chinchwad',
        'custom 3D printing quote',
        'miniature temple models contact',
        'architectural model making contact',
        '3D printing Maharashtra',
        'contact 3D printing company'
    ],
    alternates: {
        canonical: `${siteUrl}/contact`,
    },
    openGraph: {
        title: 'Contact Us | 3D Printing Services in Pimpri-Chinchwad',
        description: 'Get in touch for custom 3D printing services and miniature temple models',
        url: `${siteUrl}/contact`,
        type: 'website',
    },
};

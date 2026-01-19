export function BlogJsonLd() {
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://3layered.com';

    return (
        <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
                __html: JSON.stringify({
                    '@context': 'https://schema.org',
                    '@type': 'ProfessionalService',
                    '@id': `${siteUrl}/#business`,
                    name: '3 Layered',
                    description: 'Professional 3D printing services specializing in miniature temple models and architectural replicas',
                    url: siteUrl,
                    telephone: '+919982781000',
                    email: 'info@3layered.com',
                    image: `${siteUrl}/og-image.jpg`,
                    priceRange: '₹₹',
                    address: {
                        '@type': 'PostalAddress',
                        addressLocality: 'Pimpri-Chinchwad',
                        addressRegion: 'Maharashtra',
                        addressCountry: 'IN',
                    },
                    geo: {
                        '@type': 'GeoCoordinates',
                        latitude: 18.6298,
                        longitude: 73.7997,
                    },
                    areaServed: [
                        {
                            '@type': 'City',
                            name: 'Pune',
                        },
                        {
                            '@type': 'City',
                            name: 'Pimpri-Chinchwad',
                        },
                        {
                            '@type': 'State',
                            name: 'Maharashtra',
                        },
                        {
                            '@type': 'Country',
                            name: 'India',
                        },
                    ],
                    hasOfferCatalog: {
                        '@type': 'OfferCatalog',
                        name: '3D Printing Services',
                        itemListElement: [
                            {
                                '@type': 'Offer',
                                itemOffered: {
                                    '@type': 'Service',
                                    name: 'Miniature Temple 3D Printing',
                                    description: '3D printed miniature temple models with museum-quality precision',
                                },
                            },
                            {
                                '@type': 'Offer',
                                itemOffered: {
                                    '@type': 'Service',
                                    name: 'Architectural Model Making',
                                    description: 'Custom architectural replicas and heritage models',
                                },
                            },
                            {
                                '@type': 'Offer',
                                itemOffered: {
                                    '@type': 'Service',
                                    name: 'Custom 3D Printing',
                                    description: 'Professional custom 3D printing services for unique designs',
                                },
                            },
                        ],
                    },
                    sameAs: [
                        'https://www.instagram.com/3layered.global',
                        // Add other social media URLs here
                    ],
                    openingHoursSpecification: [
                        {
                            '@type': 'OpeningHoursSpecification',
                            dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
                            opens: '09:00',
                            closes: '18:00',
                        },
                        {
                            '@type': 'OpeningHoursSpecification',
                            dayOfWeek: 'Saturday',
                            opens: '10:00',
                            closes: '16:00',
                        },
                    ],
                }),
            }}
        />
    );
}

// Organization Schema
export function OrganizationJsonLd() {
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://3layered.com';

    return (
        <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
                __html: JSON.stringify({
                    '@context': 'https://schema.org',
                    '@type': 'Organization',
                    name: '3 Layered',
                    alternateName: '3Layered',
                    url: siteUrl,
                    logo: `${siteUrl}/logo.png`,
                    description: 'Professional 3D printing services specializing in miniature temple models, architectural replicas, and custom 3D printing',
                    email: 'info@3layered.com',
                    telephone: '+919982781000',
                    address: {
                        '@type': 'PostalAddress',
                        addressLocality: 'Pimpri-Chinchwad',
                        addressRegion: 'Maharashtra',
                        addressCountry: 'IN',
                    },
                    sameAs: [
                        'https://www.instagram.com/3layered.global',
                    ],
                    founder: {
                        '@type': 'Person',
                        name: 'Jay Gehlot',
                    },
                }),
            }}
        />
    );
}

// WebSite Schema for Search Box
export function WebSiteJsonLd() {
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://3layered.com';

    return (
        <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
                __html: JSON.stringify({
                    '@context': 'https://schema.org',
                    '@type': 'WebSite',
                    name: '3 Layered',
                    url: siteUrl,
                    potentialAction: {
                        '@type': 'SearchAction',
                        target: {
                            '@type': 'EntryPoint',
                            urlTemplate: `${siteUrl}/products?search={search_term_string}`,
                        },
                        'query-input': 'required name=search_term_string',
                    },
                }),
            }}
        />
    );
}

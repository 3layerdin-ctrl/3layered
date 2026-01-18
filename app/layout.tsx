import type { Metadata } from "next";
import { Playfair_Display, Inter } from "next/font/google";
import "./globals.css";
import { CartProvider } from "@/contexts/CartContext";
import { AuthProvider } from "@/contexts/AuthContext";
import { SlideProvider } from "@/contexts/SlideContext";
import { LogoController } from "@/components/LogoController";
import { CartDrawer } from "@/components/CartDrawer";
import { Footer } from "@/components/Footer";
import { Analytics } from "@vercel/analytics/react";

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  display: "swap",
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://yourdomain.com';

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: "3 Layered - Premium 3D Printed Miniature Temples & Architectural Models | Pimpri-Chinchwad",
  description: "Museum-quality 3D printed miniature temples and architectural models. Sacred geometry, precision-engineered replicas of Asian architectural heritage. Custom 3D printing services in Pimpri-Chinchwad, Maharashtra.",
  keywords: [
    "3D printing services Pimpri-Chinchwad",
    "miniature temple models",
    "architectural model makers Maharashtra",
    "sacred geometry replicas",
    "Asian architectural heritage",
    "museum-quality 3D printing",
    "precision-engineered replicas",
    "custom 3D printing quote",
    "3D printed temples",
    "Asian pagoda models",
    "miniature fort replicas",
    "architectural heritage 3D printing"
  ],
  alternates: {
    canonical: siteUrl,
  },
  openGraph: {
    type: 'website',
    locale: 'en_IN',
    url: siteUrl,
    siteName: '3 Layered',
    title: "3 Layered - Premium 3D Printed Miniature Temples & Architectural Models",
    description: "Museum-quality 3D printed miniature temples and architectural models. Sacred geometry, precision-engineered replicas of Asian architectural heritage.",
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: '3 Layered - Premium 3D Printed Miniature Temples',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: "3 Layered - Premium 3D Printed Miniature Temples",
    description: "Museum-quality 3D printed miniature temples and architectural models.",
    images: ['/og-image.jpg'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <body
        className={`${inter.variable} ${playfair.variable} antialiased`}
      >
        <AuthProvider>
          <SlideProvider>
            <LogoController />
            <CartProvider>
              {children}
              <CartDrawer />
            </CartProvider>
            <Footer />
          </SlideProvider>
        </AuthProvider>

        {/* JSON-LD Structured Data for Local Business */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'LocalBusiness',
              name: '3 Layered',
              description: 'Museum-quality 3D printed miniature temples and architectural models',
              url: siteUrl,
              logo: `${siteUrl}/logo.png`,
              image: `${siteUrl}/og-image.jpg`,
              address: {
                '@type': 'PostalAddress',
                addressLocality: 'Pimpri-Chinchwad',
                addressRegion: 'Maharashtra',
                addressCountry: 'IN',
              },
              priceRange: '₹₹',
              serviceArea: {
                '@type': 'GeoCircle',
                geoMidpoint: {
                  '@type': 'GeoCoordinates',
                  latitude: 18.6298,
                  longitude: 73.7997,
                },
              },
              hasOfferCatalog: {
                '@type': 'OfferCatalog',
                name: '3D Printing Services',
                itemListElement: [
                  {
                    '@type': 'Offer',
                    itemOffered: {
                      '@type': 'Service',
                      name: 'Miniature Temple 3D Printing',
                    },
                  },
                  {
                    '@type': 'Offer',
                    itemOffered: {
                      '@type': 'Service',
                      name: 'Architectural Model Making',
                    },
                  },
                ],
              },
            }),
          }}
        />

        <Analytics />
      </body>
    </html>
  );
}

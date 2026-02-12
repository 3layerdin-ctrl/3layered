import type { Metadata } from "next";
import { Playfair_Display, Inter } from "next/font/google";
import "./globals.css";
import { CartProvider } from "@/contexts/CartContext";
import { AuthProvider } from "@/contexts/AuthContext";
import { SlideProvider } from "@/contexts/SlideContext";
import { LogoController } from "@/components/LogoController";
import { CartDrawer } from "@/components/CartDrawer";
import { Footer } from "@/components/Footer";
import { WhatsAppButton } from "@/components/WhatsAppButton";
import { Analytics } from "@vercel/analytics/react";
import { BlogJsonLd, OrganizationJsonLd, WebSiteJsonLd } from "@/components/StructuredData";
import Script from "next/script";
import MetaPixel from "./meta-pixel";

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
  title: "3D Printing Services | Miniature Temple Models & Architectural Replicas | 3 Layered",
  description: "Professional 3D printing services specializing in miniature temple models and architectural replicas. Custom 3D printed temples, sacred geometry models, and museum-quality architectural heritage pieces. Expert 3D printing in Pimpri-Chinchwad, Maharashtra.",
  keywords: [
    "3D printing",
    "3D printing services",
    "3D printing services Pimpri-Chinchwad",
    "miniature temple models",
    "3D printed miniature temples",
    "temple models 3D printing",
    "architectural model making",
    "architectural model makers Maharashtra",
    "custom 3D printing",
    "3D printed temples",
    "sacred geometry replicas",
    "Asian architectural heritage",
    "museum-quality 3D printing",
    "precision temple replicas",
    "miniature temple 3D printing",
    "architectural replicas",
    "3D printing miniatures",
    "Asian pagoda models",
    "miniature fort replicas",
    "temple replica makers",
    "3D printing architecture models"
  ],
  alternates: {
    canonical: siteUrl,
  },
  openGraph: {
    type: 'website',
    locale: 'en_IN',
    url: siteUrl,
    siteName: '3 Layered',
    title: "3D Printing Services | Miniature Temple Models & Architectural Replicas",
    description: "Professional 3D printing services specializing in miniature temple models and architectural replicas. Custom 3D printed temples and museum-quality architectural heritage pieces.",
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
    title: "3D Printing Services | Miniature Temple Models & Architectural Replicas",
    description: "Professional 3D printing services specializing in miniature temple models and architectural replicas.",
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
      <head>
        <Script
          id="meta-pixel-base"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              !function(f,b,e,v,n,t,s)
              {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
              n.callMethod.apply(n,arguments):n.queue.push(arguments)};
              if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
              n.queue=[];t=b.createElement(e);t.async=!0;
              t.src=v;s=b.getElementsByTagName(e)[0];
              s.parentNode.insertBefore(t,s)}(window, document,'script',
              'https://connect.facebook.net/en_US/fbevents.js');
              fbq('init', '936978879005002');
              fbq('track', 'PageView');
            `,
          }}
        />
      </head>
      <body
        className={`${inter.variable} ${playfair.variable} antialiased`}
      >
        <MetaPixel />
        <AuthProvider>
          <SlideProvider>
            <LogoController />
            <CartProvider>
              {children}
              <CartDrawer />
              <WhatsAppButton />
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

        {/* Enhanced Structured Data */}
        <BlogJsonLd />
        <OrganizationJsonLd />
        <WebSiteJsonLd />

        <Analytics />
      </body>
    </html>
  );
}

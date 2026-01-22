export interface PrebookPopupProduct {
    slug: string;
    title: string;
    description: string;
    images: string[];
    price: number;
    originalPrice: number;
    discountPercent: number;
}

export const prebookPopupProducts: Record<string, PrebookPopupProduct> = {
    'kalinga-archiva': {
        slug: 'kalinga-archiva',
        title: 'Kalinga Archiva — Prebooking Now Open',
        description: 'A finely detailed architectural display model inspired by ancient Indian temple structures, designed for collectors, architects, and cultural enthusiasts.',
        images: [
            'https://jwgtjfmwlnttjdvycuqj.supabase.co/storage/v1/object/public/displlay/products/Architect%20models/Kalinga%20Archiva/Kalinga%20Archiva%202.jpg',
            'https://jwgtjfmwlnttjdvycuqj.supabase.co/storage/v1/object/public/displlay/products/Architect%20models/Kalinga%20Archiva/Kalinga%20Archiva%203.jpg',
            'https://jwgtjfmwlnttjdvycuqj.supabase.co/storage/v1/object/public/displlay/products/Architect%20models/Kalinga%20Archiva/Kalinga%20Archiva1.jpg',
        ],
        price: 2099,
        originalPrice: 2799,
        discountPercent: 25
    },
    'gopuram-archiva': {
        slug: 'gopuram-archiva',
        title: 'Gopuram Archiva — Prebooking Now Open',
        description: 'A striking architectural miniature inspired by South Indian temple towers, built for premium display and professional design visualization.',
        images: [
            'https://jwgtjfmwlnttjdvycuqj.supabase.co/storage/v1/object/public/displlay/products/Architect%20models/Gopuram%20Archiva/Gopuram%20Archiva%204.jpg',
            'https://jwgtjfmwlnttjdvycuqj.supabase.co/storage/v1/object/public/displlay/products/Architect%20models/Gopuram%20Archiva/Gopuram%20Archiva%203.jpg',
            'https://jwgtjfmwlnttjdvycuqj.supabase.co/storage/v1/object/public/displlay/products/Architect%20models/Gopuram%20Archiva/Gopuram%20Archiva%205.jpg',
        ],
        price: 2499,
        originalPrice: 3332,
        discountPercent: 25
    },
    'mahal-archiva': {
        slug: 'mahal-archiva',
        title: 'Mahal Archiva — Prebooking Now Open',
        description: 'An elegant architectural model inspired by royal palace designs, created for collectors, studios, and luxury interior displays.',
        images: [
            'https://jwgtjfmwlnttjdvycuqj.supabase.co/storage/v1/object/public/displlay/products/Architect%20models/Mahal%20archiva/Mahal%20archiva%203.jpg',
            'https://jwgtjfmwlnttjdvycuqj.supabase.co/storage/v1/object/public/displlay/products/Architect%20models/Mahal%20archiva/Mahal%20archiva%202.jpg',
            'https://jwgtjfmwlnttjdvycuqj.supabase.co/storage/v1/object/public/displlay/products/Architect%20models/Mahal%20archiva/Mahal%20archiva%201.jpg',
        ],
        price: 1799,
        originalPrice: 2399,
        discountPercent: 25
    }
};

export function getPrebookPopupProduct(slug: string): PrebookPopupProduct | undefined {
    return prebookPopupProducts[slug];
}

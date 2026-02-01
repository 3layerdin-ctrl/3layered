import { Product } from '@/types/product';
import southIndianTempleData from './products/south-indian-temple.json';
import miniGaneshaMandir from './products/mini-ganesha-mandir.json';
import traditionalIndianTempleData from './products/traditional-indian-temple.json';
import kalingaArchivaData from './products/kalinga-archiva.json';
import gopuramArchivaData from './products/gopuram-archiva.json';
import mahalArchivaData from './products/mahal-archiva.json';

// Convert JSON data to Product type with simplified structure for the list page
export const products: Product[] = [
    {
        id: southIndianTempleData.id,
        slug: southIndianTempleData.slug,
        name: southIndianTempleData.hero.productName,
        shortDescription: southIndianTempleData.hero.tagline,
        price: southIndianTempleData.hero.price.amount,
        compareAtPrice: southIndianTempleData.hero.price.compareAtPrice,
        images: southIndianTempleData.hero.gallery.map(img => img.url),
        categoryId: southIndianTempleData.categoryId,
        isFeatured: true,
        inStock: true,
        status: southIndianTempleData.status as 'draft' | 'published' | 'archived'
    },
    {
        id: miniGaneshaMandir.id,
        slug: miniGaneshaMandir.slug,
        name: miniGaneshaMandir.hero.productName,
        shortDescription: miniGaneshaMandir.hero.tagline,
        price: miniGaneshaMandir.hero.price.amount,
        compareAtPrice: miniGaneshaMandir.hero.price.compareAtPrice,
        images: miniGaneshaMandir.hero.gallery.map(img => img.url),
        categoryId: miniGaneshaMandir.categoryId,
        isFeatured: true,
        inStock: true,
        status: miniGaneshaMandir.status as 'draft' | 'published' | 'archived'
    },
    {
        id: traditionalIndianTempleData.id,
        slug: traditionalIndianTempleData.slug,
        name: traditionalIndianTempleData.hero.productName,
        shortDescription: traditionalIndianTempleData.hero.tagline,
        price: traditionalIndianTempleData.hero.price.amount,
        compareAtPrice: traditionalIndianTempleData.hero.price.compareAtPrice,
        images: traditionalIndianTempleData.hero.gallery.map(img => img.url),
        categoryId: traditionalIndianTempleData.categoryId,
        isFeatured: true,
        inStock: true,
        status: traditionalIndianTempleData.status as 'draft' | 'published' | 'archived'
    },
    {
        id: kalingaArchivaData.id,
        slug: kalingaArchivaData.slug,
        name: kalingaArchivaData.hero.productName,
        shortDescription: kalingaArchivaData.hero.tagline,
        price: kalingaArchivaData.hero.price.amount,
        compareAtPrice: (kalingaArchivaData.hero.price as any).compareAtPrice,
        originalPrice: (kalingaArchivaData.hero.price as any).originalAmount,
        discountPercent: (kalingaArchivaData.hero.price as any).discountPercent,
        images: kalingaArchivaData.hero.gallery.map(img => img.url),
        categoryId: kalingaArchivaData.categoryId,
        isFeatured: false,
        inStock: true,
        status: kalingaArchivaData.status as 'draft' | 'published' | 'archived'
    },
    {
        id: gopuramArchivaData.id,
        slug: gopuramArchivaData.slug,
        name: gopuramArchivaData.hero.productName,
        shortDescription: gopuramArchivaData.hero.tagline,
        price: gopuramArchivaData.hero.price.amount,
        compareAtPrice: (gopuramArchivaData.hero.price as any).compareAtPrice,
        originalPrice: (gopuramArchivaData.hero.price as any).originalAmount,
        discountPercent: (gopuramArchivaData.hero.price as any).discountPercent,
        images: gopuramArchivaData.hero.gallery.map(img => img.url),
        categoryId: gopuramArchivaData.categoryId,
        isFeatured: false,
        inStock: true,
        status: gopuramArchivaData.status as 'draft' | 'published' | 'archived'
    },
    {
        id: mahalArchivaData.id,
        slug: mahalArchivaData.slug,
        name: mahalArchivaData.hero.productName,
        shortDescription: mahalArchivaData.hero.tagline,
        price: mahalArchivaData.hero.price.amount,
        compareAtPrice: (mahalArchivaData.hero.price as any).compareAtPrice,
        originalPrice: (mahalArchivaData.hero.price as any).originalAmount,
        discountPercent: (mahalArchivaData.hero.price as any).discountPercent,
        images: mahalArchivaData.hero.gallery.map(img => img.url),
        categoryId: mahalArchivaData.categoryId,
        isFeatured: false,
        inStock: true,
        status: mahalArchivaData.status as 'draft' | 'published' | 'archived'
    }
];

// Get product by ID
export function getProductById(id: string): Product | undefined {
    return products.find(p => p.id === id);
}

// Get product by slug
export function getProductBySlug(slug: string): Product | undefined {
    return products.find(p => p.slug === slug);
}

// Get products by category
export function getProductsByCategory(categoryId: string): Product[] {
    return products.filter(p => p.categoryId === categoryId && p.status === 'published');
}

// Get featured products
export function getFeaturedProducts(): Product[] {
    return products.filter(p => p.isFeatured && p.status === 'published');
}

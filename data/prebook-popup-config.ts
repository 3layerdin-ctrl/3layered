export interface PrebookPopupProduct {
    slug: string;
    title: string;
    description: string;
    images: string[];
    price: number;
    originalPrice: number;
    discountPercent: number;
}

export const prebookPopupProducts: Record<string, PrebookPopupProduct> = {};

export function getPrebookPopupProduct(slug: string): PrebookPopupProduct | undefined {
    return prebookPopupProducts[slug];
}

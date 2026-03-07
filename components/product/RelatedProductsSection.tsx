'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { RelatedProductsSection as RelatedProductsSectionType } from '@/types/product';
import { ProductPage } from '@/types/product';
import { getRelatedProducts, formatPrice } from '@/lib/products';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface RelatedProductsSectionProps {
    data: RelatedProductsSectionType;
    currentProductId: string;
}

export function RelatedProductsSection({ data, currentProductId }: RelatedProductsSectionProps) {
    const [products, setProducts] = useState<ProductPage[]>([]);

    useEffect(() => {
        const related = getRelatedProducts(currentProductId, data.displayLimit);
        setProducts(related);
    }, [currentProductId, data.displayLimit]);

    if (!data.enabled || products.length === 0) return null;

    return (
        <section className="py-24 bg-[#FAF7F2]">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center mb-12">
                    <h2 className="font-serif text-4xl md:text-5xl font-bold tracking-tight">
                        {data.title}
                    </h2>
                    <Link
                        href={`/products/category/miniature-temples`}
                        className="text-sm underline hover:no-underline"
                    >
                        View all
                    </Link>
                </div>

                <div className={`
          ${data.layout === 'grid' ? 'grid grid-cols-1 md:grid-cols-3 gap-8' : ''}
          ${data.layout === 'carousel' ? 'grid grid-cols-1 md:grid-cols-3 gap-8' : ''}
        `}>
                    {products.map(product => (
                        <Link
                            key={product.id}
                            href={`/products/${product.slug}`}
                            className="group bg-[#FDFBF7] border border-[#E8E1D5] overflow-hidden hover:shadow-lg transition-shadow duration-300"
                        >
                            {/* Product Image */}
                            <div className="relative aspect-square bg-[#E8E1D5] overflow-hidden">
                                {product.hero.gallery.length > 0 && (
                                    <Image
                                        src={product.hero.gallery[0].url}
                                        alt={product.hero.gallery[0].alt}
                                        fill
                                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                                    />
                                )}

                                {/* Badge */}
                                {product.hero.badge.enabled && (
                                    <div className="absolute top-4 left-4 bg-[#1A110B] text-[#DFB374] px-3 py-1 text-xs">
                                        {product.hero.badge.text}
                                    </div>
                                )}
                            </div>

                            {/* Product Info */}
                            <div className="p-6">
                                <h3 className="text-xl font-light mb-2 group-hover:underline">
                                    {product.hero.productName}
                                </h3>
                                <p className="text-sm text-[#2A2320]/80 mb-4 line-clamp-2">
                                    {product.hero.tagline}
                                </p>
                                <div className="text-lg font-light">
                                    {formatPrice(product.hero.price)}
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </section>
    );
}

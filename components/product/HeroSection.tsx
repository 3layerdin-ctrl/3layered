'use client';

import { useState, useRef } from 'react';
import Image from 'next/image';
import { HeroSection as HeroSectionType } from '@/types/product';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useCart } from '@/contexts/CartContext';
import { PrebookModal } from './PrebookModal';

interface HeroSectionProps {
    data: HeroSectionType;
    productId: string;
    productSlug: string;
    isPrebook?: boolean;
    productName?: string;
}

export function HeroSection({ data, productId, productSlug, isPrebook = false, productName }: HeroSectionProps) {
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [isPrebookModalOpen, setIsPrebookModalOpen] = useState(false);
    const sortedGallery = [...data.gallery].sort((a, b) => a.order - b.order);
    const { addToCart } = useCart();
    const touchStartX = useRef<number | null>(null);
    const touchEndX = useRef<number | null>(null);

    const nextImage = () => {
        setCurrentImageIndex((prev) => (prev + 1) % sortedGallery.length);
    };

    const prevImage = () => {
        setCurrentImageIndex(
            (prev) => (prev - 1 + sortedGallery.length) % sortedGallery.length
        );
    };

    // Swipe handlers for mobile
    const minSwipeDistance = 50;

    const onTouchStart = (e: React.TouchEvent) => {
        touchEndX.current = null;
        touchStartX.current = e.targetTouches[0].clientX;
    };

    const onTouchMove = (e: React.TouchEvent) => {
        touchEndX.current = e.targetTouches[0].clientX;
    };

    const onTouchEnd = () => {
        if (!touchStartX.current || !touchEndX.current) return;
        const distance = touchStartX.current - touchEndX.current;
        const isLeftSwipe = distance > minSwipeDistance;
        const isRightSwipe = distance < -minSwipeDistance;

        if (isLeftSwipe && sortedGallery.length > 1) {
            nextImage();
        }
        if (isRightSwipe && sortedGallery.length > 1) {
            prevImage();
        }
    };

    const handleAddToCart = () => {
        addToCart({
            productId,
            productSlug,
            productName: data.productName,
            productImage: sortedGallery[0].url,
            basePrice: data.price.amount,
            quantity: 1,
            customizations: {}, // No customizations from hero section
            currency: data.price.currency,
            displayFormat: data.price.displayFormat,
        });
    };

    const handleBuyNow = () => {
        // Add to cart first
        addToCart({
            productId,
            productSlug,
            productName: data.productName,
            productImage: sortedGallery[0].url,
            basePrice: data.price.amount,
            quantity: 1,
            customizations: {},
            currency: data.price.currency,
            displayFormat: data.price.displayFormat,
        });
        // Then navigate to cart/checkout
        window.location.href = '/cart';
    };

    return (
        <section className="min-h-screen bg-white pt-8 md:pt-24 pb-8 md:pb-16">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-12 items-start">
                    {/* Image Gallery */}
                    <div className="space-y-3 md:space-y-4">
                        {/* Main Image */}
                        <div
                            className="relative aspect-square bg-gray-50 overflow-hidden group touch-pan-y"
                            onTouchStart={onTouchStart}
                            onTouchMove={onTouchMove}
                            onTouchEnd={onTouchEnd}
                        >
                            <Image
                                src={sortedGallery[currentImageIndex].url}
                                alt={sortedGallery[currentImageIndex].alt}
                                fill
                                className="object-contain select-none"
                                priority
                                draggable={false}
                            />

                            {/* Navigation Arrows */}
                            {sortedGallery.length > 1 && (
                                <>
                                    <button
                                        onClick={prevImage}
                                        className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white text-black p-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                                        aria-label="Previous image"
                                    >
                                        <ChevronLeft className="w-6 h-6" />
                                    </button>
                                    <button
                                        onClick={nextImage}
                                        className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white text-black p-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                                        aria-label="Next image"
                                    >
                                        <ChevronRight className="w-6 h-6" />
                                    </button>
                                </>
                            )}

                            {/* Image Counter */}
                            <div className="absolute bottom-4 right-4 bg-black/75 text-white px-3 py-1 text-sm font-light">
                                {currentImageIndex + 1} / {sortedGallery.length}
                            </div>
                        </div>

                        {/* Thumbnail Grid */}
                        {sortedGallery.length > 1 && (
                            <div className="grid grid-cols-4 gap-2">
                                {sortedGallery.map((image, index) => (
                                    <button
                                        key={image.id}
                                        onClick={() => setCurrentImageIndex(index)}
                                        className={`relative aspect-square bg-gray-100 overflow-hidden transition-all duration-200 ${index === currentImageIndex
                                            ? 'ring-2 ring-black'
                                            : 'opacity-60 hover:opacity-100'
                                            }`}
                                    >
                                        <Image
                                            src={image.url}
                                            alt={image.alt}
                                            fill
                                            className="object-contain"
                                        />
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Product Info */}
                    <div className="space-y-8 lg:sticky lg:top-32">
                        {/* Badges */}
                        <div className="flex flex-wrap gap-3">
                            {data.badge.enabled && (
                                <span className="inline-flex items-center text-xs tracking-widest uppercase border-2 border-black px-5 py-2 font-medium hover:bg-black hover:text-white transition-colors duration-200">
                                    {data.badge.text}
                                </span>
                            )}
                            {data.price.discountPercent && (
                                <span className="inline-flex items-center text-xs tracking-widest uppercase bg-gradient-to-r from-green-600 to-emerald-600 text-white px-5 py-2 font-bold shadow-lg shadow-green-600/30 rounded-full">
                                    {data.price.discountPercent}% OFF
                                </span>
                            )}
                        </div>

                        {/* Product Name */}
                        <div>
                            <h1 className="font-serif text-5xl md:text-6xl lg:text-7xl font-bold mb-4 tracking-tight">
                                {data.productName}
                            </h1>
                            <p className="text-xl text-gray-600 font-light leading-relaxed">
                                {data.tagline}
                            </p>
                        </div>

                        {/* Price */}
                        <div className="border-t border-b border-gray-200 py-6">
                            {isPrebook ? (
                                <div className="space-y-3">
                                    {/* Discount Badge */}
                                    {data.price.discountPercent && (
                                        <div className="inline-block px-3 py-1 bg-green-600 text-white text-sm font-bold rounded-full">
                                            {data.price.discountPercent}% OFF
                                        </div>
                                    )}
                                    {/* Pricing */}
                                    <div className="flex items-center gap-3">
                                        {data.price.originalAmount && (
                                            <div className="text-xl text-gray-400 line-through font-light">
                                                {data.price.displayFormat.replace(
                                                    '{amount}',
                                                    data.price.originalAmount.toLocaleString('en-IN')
                                                )}
                                            </div>
                                        )}
                                        <div className="text-3xl font-light">
                                            {data.price.displayFormat.replace(
                                                '{amount}',
                                                data.price.amount.toLocaleString('en-IN')
                                            )}
                                        </div>
                                    </div>
                                    {data.price.originalAmount && (
                                        <p className="text-sm text-green-600 font-medium">
                                            Save ₹{(data.price.originalAmount - data.price.amount).toLocaleString('en-IN')}
                                        </p>
                                    )}
                                    <p className="text-sm text-gray-500 mt-1">
                                        Made to order • Ships in 3-4 weeks
                                    </p>
                                </div>
                            ) : (
                                <>
                                    <div className="flex items-center gap-3">
                                        {data.price.compareAtPrice && (
                                            <div className="text-xl text-gray-400 line-through font-light">
                                                {data.price.displayFormat.replace(
                                                    '{amount}',
                                                    data.price.compareAtPrice.toLocaleString()
                                                )}
                                            </div>
                                        )}
                                        <div className="text-3xl font-light">
                                            {data.price.displayFormat.replace(
                                                '{amount}',
                                                data.price.amount.toLocaleString()
                                            )}
                                        </div>
                                    </div>
                                    <p className="text-sm text-gray-500 mt-1">
                                        Made to order • Ships in 7-10 days
                                    </p>
                                </>
                            )}
                        </div>

                        {/* CTAs */}
                        <div className="space-y-3">
                            {isPrebook ? (
                                <button
                                    onClick={() => setIsPrebookModalOpen(true)}
                                    className="w-full bg-black text-white py-4 px-8 text-lg font-light tracking-wide hover:bg-gray-900 transition-colors duration-200"
                                >
                                    {data.cta.primaryLabel}
                                </button>
                            ) : (
                                <>
                                    <button
                                        onClick={handleAddToCart}
                                        className="w-full bg-black text-white py-4 px-8 text-lg font-light tracking-wide hover:bg-gray-900 transition-colors duration-200"
                                    >
                                        {data.cta.primaryLabel}
                                    </button>

                                    {data.cta.secondaryLabel && (
                                        <button
                                            onClick={handleBuyNow}
                                            className="w-full border border-black text-black py-4 px-8 text-lg font-light tracking-wide hover:bg-gray-50 transition-colors duration-200"
                                        >
                                            {data.cta.secondaryLabel}
                                        </button>
                                    )}
                                </>
                            )}
                        </div>

                        {/* Quick Info */}
                        <div className="text-sm text-gray-600 space-y-2 pt-4">
                            <div className="flex items-start gap-2">
                                <span className="text-black">✓</span>
                                <span>Hand-finished by master craftspeople</span>
                            </div>
                            <div className="flex items-start gap-2">
                                <span className="text-black">✓</span>
                                <span>Museum-quality protective packaging</span>
                            </div>
                            <div className="flex items-start gap-2">
                                <span className="text-black">✓</span>
                                <span>30-day satisfaction guarantee</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Mobile Sticky CTA */}
            <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 z-50">
                <div className="space-y-3">
                    {isPrebook ? (
                        <button
                            onClick={() => setIsPrebookModalOpen(true)}
                            className="w-full bg-black text-white py-3 px-6 text-base font-light tracking-wide hover:bg-gray-900 transition-colors duration-200"
                        >
                            {data.cta.primaryLabel}
                        </button>
                    ) : (
                        <>
                            <button
                                onClick={handleAddToCart}
                                className="w-full bg-black text-white py-3 px-6 text-base font-light tracking-wide hover:bg-gray-900 transition-colors duration-200"
                            >
                                {data.cta.primaryLabel}
                            </button>
                            {data.cta.secondaryLabel && (
                                <button
                                    onClick={handleBuyNow}
                                    className="w-full border border-black text-black py-3 px-6 text-base font-light tracking-wide hover:bg-gray-50 transition-colors duration-200"
                                >
                                    {data.cta.secondaryLabel}
                                </button>
                            )}
                        </>
                    )}
                </div>
            </div>

            {/* Prebook Modal */}
            {isPrebook && (
                <PrebookModal
                    isOpen={isPrebookModalOpen}
                    onClose={() => setIsPrebookModalOpen(false)}
                    productId={productId}
                    productName={productName || data.productName}
                    productSlug={productSlug}
                />
            )}
        </section>
    );
}

'use client';

import { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import { HeroSection as HeroSectionType } from '@/types/product';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useCart } from '@/contexts/CartContext';
import { PrebookModal } from './PrebookModal';
import { pixelViewContent } from '@/lib/pixel';

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

    useEffect(() => {
        pixelViewContent({
            contentId: productId,
            contentName: data.productName,
            value: data.price.amount,
            currency: data.price.currency,
        });
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

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
        <>
            {/* Shimmer animation keyframes */}
            <style jsx>{`
                @keyframes shimmer {
                    0% { transform: translateX(-200%); }
                    100% { transform: translateX(200%); }
                }
            `}</style>

            <section className="relative min-h-screen bg-[#FFFAF0] pt-20 md:pt-24 pb-24 md:pb-16 overflow-hidden">
                {/* Intricate Jali (Lattice) Work Background */}
                <div className="absolute inset-0 z-0 opacity-[0.03] pointer-events-none" style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg width='120' height='120' viewBox='0 0 120 120' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M60 0L120 60L60 120L0 60Z' fill='none' stroke='%234A3121' stroke-width='1'/%3E%3Cpath d='M30 30L90 90M30 90L90 30' stroke='%234A3121' stroke-width='0.5'/%3E%3Ccircle cx='60' cy='60' r='20' fill='none' stroke='%234A3121' stroke-width='1'/%3E%3Cpath d='M60 10V30M60 90V110M10 60H30M90 60H110' stroke='%234A3121' stroke-width='1'/%3E%3C/svg%3E")`,
                    backgroundSize: '120px 120px',
                }} />

                {/* Radial Gradient Mask to keep product image and text perfectly clear */}
                <div className="absolute inset-0 z-0 bg-[radial-gradient(circle_at_center,transparent_0%,#FFFAF0_80%)] pointer-events-none" />

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-12 items-start">
                        {/* Image Gallery */}
                        <div className="space-y-3 md:space-y-4">
                            {/* Main Image */}
                            <div
                                className="relative aspect-square bg-[#FAF7F2] rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.06)] border border-[#E8E1D5]/60 overflow-hidden group touch-pan-y"
                                onTouchStart={onTouchStart}
                                onTouchMove={onTouchMove}
                                onTouchEnd={onTouchEnd}
                            >
                                <Image
                                    src={sortedGallery[currentImageIndex].url}
                                    alt={sortedGallery[currentImageIndex].alt}
                                    fill
                                    className="object-contain select-none p-4 md:p-8"
                                    priority
                                    draggable={false}
                                />
                                
                                {/* Subtle inner shadow / vignette */}
                                <div className="absolute inset-0 pointer-events-none shadow-[inset_0_0_60px_rgba(0,0,0,0.03)]" />

                                {/* Navigation Arrows */}
                                {sortedGallery.length > 1 && (
                                    <>
                                        <button
                                            onClick={prevImage}
                                            className="absolute left-4 top-1/2 -translate-y-1/2 bg-[#FDFBF7]/95 backdrop-blur-sm hover:bg-[#2A2320] text-[#2A2320] hover:text-white border border-[#E8E1D5]/80 p-3 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-all duration-300 transform hover:scale-110 active:scale-95 z-20"
                                            aria-label="Previous image"
                                        >
                                            <ChevronLeft className="w-5 h-5" />
                                        </button>
                                        <button
                                            onClick={nextImage}
                                            className="absolute right-4 top-1/2 -translate-y-1/2 bg-[#FDFBF7]/95 backdrop-blur-sm hover:bg-[#2A2320] text-[#2A2320] hover:text-white border border-[#E8E1D5]/80 p-3 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-all duration-300 transform hover:scale-110 active:scale-95 z-20"
                                            aria-label="Next image"
                                        >
                                            <ChevronRight className="w-5 h-5" />
                                        </button>
                                    </>
                                )}

                                {/* Image Counter */}
                                <div className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-[#FDFBF7]/90 backdrop-blur-md shadow-md text-[#2A2320] px-4 py-1.5 rounded-full text-xs font-semibold tracking-widest z-20 border border-[#E8E1D5]/50 flex items-center gap-2">
                                    <span className="w-1.5 h-1.5 rounded-full bg-amber-700 animate-pulse"></span>
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
                                            className={`relative aspect-square bg-[#FDFBF7] rounded-xl shadow-sm border overflow-hidden transition-all duration-300 ${index === currentImageIndex
                                                ? 'border-amber-700 ring-2 ring-amber-700/20 opacity-100'
                                                : 'border-[#E8E1D5] opacity-60 hover:opacity-100 hover:border-amber-700/40'
                                                }`}
                                        >
                                            <Image
                                                src={image.url}
                                                alt={image.alt}
                                                fill
                                                className="object-cover"
                                            />
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Product Info */}
                        <div className="space-y-5 md:space-y-8 lg:sticky lg:top-32">
                            {/* Badges */}
                            <div className="flex flex-wrap gap-3">
                                {data.price.discountPercent ? (
                                    <span className="inline-flex items-center text-xs tracking-widest uppercase bg-gradient-to-r from-green-600 to-emerald-600 text-white px-5 py-2 font-bold shadow-lg shadow-green-600/30 rounded-full">
                                        Flat {data.price.discountPercent}% OFF
                                    </span>
                                ) : data.badge.enabled && (
                                    <span className="inline-flex items-center text-xs tracking-widest uppercase border-2 border-[#DFB374] px-5 py-2 font-medium hover:bg-black hover:text-white transition-colors duration-200">
                                        {data.badge.text}
                                    </span>
                                )}
                            </div>

                            {/* Product Name */}
                            <div>
                                <h1 className="font-serif text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-3 md:mb-4 tracking-tight">
                                    {data.productName}
                                </h1>
                                <p className="text-base md:text-xl text-[#2A2320]/80 font-light leading-relaxed">
                                    {data.tagline}
                                </p>
                            </div>

                            {/* Price */}
                            <div className="border-t border-b border-[#E8E1D5] py-6">
                                <div className="grid grid-cols-[1fr_auto] items-end gap-4">
                                    {isPrebook ? (
                                        <div className="space-y-3">
                                            {/* Pricing */}
                                            <div className="flex flex-col gap-1">
                                                {data.price.originalAmount && (
                                                    <div className="text-sm md:text-base text-[#2A2320]/50 line-through font-medium">
                                                        {data.price.displayFormat.replace(
                                                            '{amount}',
                                                            data.price.originalAmount.toLocaleString('en-IN')
                                                        )}
                                                    </div>
                                                )}
                                                <div className="text-4xl md:text-5xl font-bold text-[#2A2320] tracking-tight">
                                                    {data.price.displayFormat.replace(
                                                        '{amount}',
                                                        data.price.amount.toLocaleString('en-IN')
                                                    )}
                                                </div>
                                            </div>
                                            {data.price.originalAmount && (
                                                <p className="text-sm text-green-600 font-semibold bg-green-50/50 inline-block px-2 py-0.5 rounded">
                                                    You save ₹{(data.price.originalAmount - data.price.amount).toLocaleString('en-IN')}
                                                </p>
                                            )}
                                            <p className="text-sm text-[#4A3121]/70 font-medium mt-2 flex items-center gap-1.5">
                                                <svg className="w-4 h-4 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                                Made to order • Ships in 3-4 weeks
                                            </p>
                                        </div>
                                    ) : (
                                        <div className="space-y-2">
                                            <div className="flex flex-col gap-1">
                                                {data.price.compareAtPrice && (
                                                    <div className="text-sm md:text-base text-[#2A2320]/50 line-through font-medium">
                                                        {data.price.displayFormat.replace(
                                                            '{amount}',
                                                            data.price.compareAtPrice.toLocaleString()
                                                        )}
                                                    </div>
                                                )}
                                                <div className="text-4xl md:text-5xl font-bold text-[#2A2320] tracking-tight">
                                                    {data.price.displayFormat.replace(
                                                        '{amount}',
                                                        data.price.amount.toLocaleString()
                                                    )}
                                                </div>
                                            </div>
                                            <p className="text-sm text-[#4A3121]/70 font-medium flex items-center gap-1.5">
                                                <svg className="w-4 h-4 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" /></svg>
                                                Ships securely in 7-10 days
                                            </p>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* CTAs */}
                            <div className="space-y-3">
                                {isPrebook ? (
                                    <button
                                        onClick={() => setIsPrebookModalOpen(true)}
                                        className="w-full bg-gradient-to-r from-[#2A2320] to-[#4A3121] text-white py-4 px-8 text-lg font-bold tracking-wide rounded-xl shadow-[0_8px_20px_rgb(42,35,32,0.25)] hover:shadow-[0_12px_25px_rgb(42,35,32,0.35)] hover:-translate-y-1 transition-all duration-300 relative overflow-hidden group"
                                    >
                                        <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:animate-[shimmer_1.5s_infinite]" />
                                        <span className="relative z-10 flex items-center justify-center gap-2">
                                            {data.cta.primaryLabel}
                                            <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
                                        </span>
                                    </button>
                                ) : (
                                    <div className="flex flex-col gap-4">
                                        {data.cta.secondaryLabel && (
                                            <button
                                                onClick={handleBuyNow}
                                                className="w-full bg-gradient-to-r from-[#2A2320] to-[#4A3121] text-white py-4 px-8 text-lg font-bold tracking-wide rounded-xl shadow-[0_8px_20px_rgb(42,35,32,0.25)] hover:shadow-[0_12px_25px_rgb(42,35,32,0.35)] hover:-translate-y-1 transition-all duration-300 relative overflow-hidden group"
                                            >
                                                <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:animate-[shimmer_1.5s_infinite]" />
                                                <span className="relative z-10 flex items-center justify-center gap-2">
                                                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" /></svg>
                                                    {data.cta.secondaryLabel}
                                                </span>
                                            </button>
                                        )}
                                        <button
                                            onClick={handleAddToCart}
                                            className="w-full border-2 border-[#2A2320] text-[#2A2320] bg-[#FDFBF7] hover:bg-[#FAF7F2] py-4 px-8 text-lg font-bold tracking-wide rounded-xl transition-colors duration-200 flex items-center justify-center gap-2 group"
                                        >
                                            <svg className="w-5 h-5 group-hover:scale-110 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
                                            <span className="relative z-10">{data.cta.primaryLabel}</span>
                                        </button>
                                    </div>
                                )}
                            </div>

                            {/* Quick Info */}
                            <div className="text-sm text-[#2A2320]/80 space-y-2 pt-4">
                                <div className="flex items-start gap-2">
                                    <span className="text-[#1A110B]">✓</span>
                                    <span>Hand-finished by master craftspeople</span>
                                </div>
                                <div className="flex items-start gap-2">
                                    <span className="text-[#1A110B]">✓</span>
                                    <span>Museum-quality protective packaging</span>
                                </div>
                                <div className="flex items-start gap-2">
                                    <span className="text-[#1A110B]">✓</span>
                                    <span>30-day satisfaction guarantee</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Mobile Sticky CTA */}
                <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-[#FDFBF7] border-t border-[#E8E1D5] p-4 z-50">
                    <div className="space-y-3">
                        {isPrebook ? (
                            <button
                                onClick={() => setIsPrebookModalOpen(true)}
                                className="w-full bg-[#1A110B] text-[#DFB374] py-3 px-6 text-base font-light tracking-wide hover:scale-[1.02] transition-colors duration-200"
                            >
                                {data.cta.primaryLabel}
                            </button>
                        ) : (
                            <>
                                <button
                                    onClick={handleAddToCart}
                                    className="w-full bg-[#1A110B] text-[#DFB374] py-3 px-6 text-base font-light tracking-wide hover:scale-[1.02] transition-colors duration-200"
                                >
                                    {data.cta.primaryLabel}
                                </button>
                                {data.cta.secondaryLabel && (
                                    <button
                                        onClick={handleBuyNow}
                                        className="w-full border border-[#DFB374] text-[#1A110B] py-3 px-6 text-base font-light tracking-wide hover:bg-[#E8E1D5]/50 transition-colors duration-200"
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
        </>
    );
}

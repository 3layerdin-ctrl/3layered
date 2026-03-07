'use client';

import { Navbar } from '@/components/Navbar';
import { SlideProvider } from '@/contexts/SlideContext';
import { ProductsHeroSlideshow } from '@/components/ProductsHeroSlideshow';
import { getHomepageCategories } from '@/data/categories';
import { products } from '@/data/products';
import Image from 'next/image';
import Link from 'next/link';
import { ShoppingCart } from 'lucide-react';
export default function ProductsPage() {
    const categories = getHomepageCategories();

    // Group products by category
    const productsByCategory = categories.map(category => ({
        ...category,
        products: products.filter(product => category.productIds.includes(product.id))
    }));

    return (
        <SlideProvider>
            <Navbar />
            <main className="min-h-screen bg-[#FAF7F2] relative">
                {/* Temple Pillar (Stambha) Background Pattern */}
                <div className="absolute inset-0 z-0 opacity-[0.04] pointer-events-none" style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg width='160' height='320' viewBox='0 0 160 320' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M60 0 L100 0 L100 20 L110 30 L110 60 L100 70 L100 280 L120 290 L120 320 L40 320 L40 290 L60 280 L60 70 L50 60 L50 30 L60 20 Z' fill='none' stroke='%234A3121' stroke-width='1.5'/%3E%3Cpath d='M70 70 L90 70 M70 140 L90 140 M70 210 L90 210 M70 280 L90 280' stroke='%234A3121' stroke-width='1'/%3E%3Ccircle cx='80' cy='45' r='5' fill='none' stroke='%234A3121' stroke-width='1'/%3E%3C/svg%3E")`,
                    backgroundSize: '160px 320px',
                    backgroundAttachment: 'fixed'
                }} />
                
                {/* Hero Slideshow */}
                <div className="relative z-10">
                    <ProductsHeroSlideshow />
                </div>

                {/* Categories and Products */}
                <div id="categories" className="py-10 md:py-24 px-4 sm:px-6 relative z-10">
                    <div className="max-w-7xl mx-auto space-y-16 md:space-y-32">
                        <h1 className="sr-only">3D Printed Miniature Temple Models & Architectural Replicas — Browse All Products | 3 Layered</h1>
                        {productsByCategory.map((category) => (
                            <section key={category.id} className="scroll-mt-24">
                                {/* Category Header */}
                                <div className="mb-8 md:mb-16 flex flex-col items-center text-center">
                                    <div className="flex items-center gap-4 mb-4">
                                        <span className="w-12 h-[1px] bg-amber-800/40"></span>
                                        <span className="text-amber-900 font-semibold tracking-[0.2em] uppercase text-xs md:text-sm">
                                            Collection
                                        </span>
                                        <span className="w-12 h-[1px] bg-amber-800/40"></span>
                                    </div>
                                    <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl font-bold mb-4 text-[#2A2320]">
                                        {category.name}
                                    </h2>
                                    <p className="text-base md:text-lg text-gray-600 max-w-2xl font-light leading-relaxed">
                                        {category.description}
                                    </p>
                                </div>

                                {/* Products Grid */}
                                {category.products.length > 0 ? (
                                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-8">
                                        {category.products.map((product) => (
                                            <Link
                                                key={product.id}
                                                href={`/products/${product.slug}`}
                                                className="group bg-white rounded-xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_20px_40px_rgb(60,40,30,0.12)] border border-[#E8E1D5]/60 hover:border-amber-900/20 transition-all duration-500 overflow-hidden flex flex-col hover:-translate-y-1"
                                            >
                                                {/* Product Image */}
                                                <div className="relative h-64 sm:h-72 md:h-80 w-full overflow-hidden bg-[#F5F2ED]">
                                                    <Image
                                                        src={product.images[0]}
                                                        alt={product.name}
                                                        fill
                                                        className="object-contain group-hover:scale-105 transition-transform duration-700 ease-[0.25,0.46,0.45,0.94] p-4"
                                                    />
                                                    {/* Vignette Overlay */}
                                                    <div className="absolute inset-0 bg-gradient-to-t from-[#1A1412]/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-10" />

                                                    {product.isFeatured && (
                                                        <div className="absolute top-4 left-4 bg-[#2A2320] text-white px-4 py-1.5 text-[10px] sm:text-xs uppercase tracking-[0.2em] font-semibold shadow-md rounded-full z-20">
                                                            Featured
                                                        </div>
                                                    )}
                                                    {product.isPrebook && (
                                                        <div className="absolute top-4 right-4 bg-white/95 backdrop-blur-sm text-[#2A2320] border border-[#2A2320]/20 px-4 py-1.5 text-[10px] sm:text-xs font-semibold uppercase tracking-[0.2em] shadow-md rounded-full z-20">
                                                            Prebook Now
                                                        </div>
                                                    )}
                                                    
                                                    {/* Quick View CTA */}
                                                    <div className="absolute inset-x-0 bottom-4 flex justify-center translate-y-8 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500 ease-out z-20 pointer-events-none">
                                                        <span className="pointer-events-auto bg-white/95 backdrop-blur-sm shadow-xl text-[#2A2320] px-6 py-2.5 rounded-full font-semibold text-xs tracking-wide border border-white/20">
                                                            View Details
                                                        </span>
                                                    </div>
                                                </div>

                                                {/* Product Info */}
                                                <div className="p-5 md:p-6 flex flex-col flex-grow justify-betweenbg-white flex-grow relative z-10 bg-white">
                                                    <div>
                                                        <h3 className="font-serif text-xl md:text-2xl font-bold mb-2 text-[#2A2320] group-hover:text-amber-800 transition-colors duration-300 line-clamp-2">
                                                            {product.name}
                                                        </h3>
                                                        <p className="text-gray-500 text-sm mb-4 line-clamp-2 leading-relaxed">
                                                            {product.shortDescription}
                                                        </p>
                                                    </div>

                                                    <div className="flex items-center justify-between pt-4 border-t border-[#E8E1D5]/50 mt-auto">
                                                        {(product.isPrebook || product.discountPercent) ? (
                                                            <div className="space-y-1.5">
                                                                {/* Discount Badge */}
                                                                {product.discountPercent && (
                                                                    <div className="inline-flex items-center text-green-700 bg-green-50 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-widest rounded-full border border-green-200/50">
                                                                        {product.discountPercent}% OFF
                                                                    </div>
                                                                )}
                                                                {/* Pricing */}
                                                                <div className="flex items-center gap-2">
                                                                    {product.originalPrice && (
                                                                        <span className="text-xs text-gray-400 line-through font-medium">
                                                                            ₹{product.originalPrice.toLocaleString('en-IN')}
                                                                        </span>
                                                                    )}
                                                                    <span className="text-lg md:text-xl font-bold text-[#2A2320]">
                                                                        ₹{product.price.toLocaleString('en-IN')}
                                                                    </span>
                                                                </div>
                                                            </div>
                                                        ) : (
                                                            <div>
                                                                <span className="text-lg md:text-xl font-bold text-[#2A2320]">
                                                                    ₹{product.price.toLocaleString()}
                                                                </span>
                                                                {product.compareAtPrice && (
                                                                    <span className="ml-2 text-sm font-medium text-gray-400 line-through">
                                                                        ₹{product.compareAtPrice.toLocaleString()}
                                                                    </span>
                                                                )}
                                                            </div>
                                                        )}
                                                        <div className="w-10 h-10 rounded-full bg-[#FAF7F2] flex items-center justify-center text-[#4A3121] group-hover:bg-[#4A3121] group-hover:text-white transition-colors duration-300">
                                                            <ShoppingCart className="w-4 h-4" />
                                                        </div>
                                                    </div>
                                                </div>
                                            </Link>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="text-center py-16 bg-white/50 backdrop-blur-sm rounded-xl border border-[#E8E1D5]/60 shadow-sm">
                                        <p className="text-gray-500 text-lg font-medium">
                                            Sacred creations coming soon to this collection
                                        </p>
                                    </div>
                                )}
                            </section>
                        ))}
                    </div>
                </div>
            </main>
        </SlideProvider>
    );
}

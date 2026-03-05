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
            <main className="min-h-screen bg-gray-50">
                {/* Hero Slideshow */}
                <ProductsHeroSlideshow />

                {/* Categories and Products */}
                <div id="categories" className="py-10 md:py-24 px-4 sm:px-6">
                    <div className="max-w-7xl mx-auto space-y-12 md:space-y-24">
                        <h1 className="sr-only">3D Printed Miniature Temple Models & Architectural Replicas — Browse All Products | 3 Layered</h1>
                        {productsByCategory.map((category) => (
                            <section key={category.id} className="scroll-mt-24">
                                {/* Category Header */}
                                <div className="mb-6 md:mb-12">
                                    <h2 className="font-serif text-3xl md:text-5xl font-bold mb-3 md:mb-4">
                                        {category.name}
                                    </h2>
                                    <p className="text-base md:text-xl text-gray-600 max-w-3xl">
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
                                                className="group bg-white border border-gray-200 hover:border-black transition-all duration-300 overflow-hidden"
                                            >
                                                {/* Product Image */}
                                                <div className="relative h-52 sm:h-64 md:h-80 w-full overflow-hidden bg-gray-100">
                                                    <Image
                                                        src={product.images[0]}
                                                        alt={product.name}
                                                        fill
                                                        className="object-contain group-hover:scale-105 transition-transform duration-300"
                                                    />
                                                    {product.isFeatured && (
                                                        <div className="absolute top-4 left-4 bg-black text-white px-4 py-2 text-xs uppercase tracking-wider font-semibold shadow-lg">
                                                            Featured
                                                        </div>
                                                    )}
                                                    {product.isPrebook && (
                                                        <div className="absolute top-4 right-4 bg-white/95 backdrop-blur-sm text-black border-2 border-black px-4 py-2 text-xs font-semibold uppercase tracking-wider shadow-lg">
                                                            Prebook Now
                                                        </div>
                                                    )}
                                                </div>

                                                {/* Product Info */}
                                                <div className="p-4 md:p-6">
                                                    <h3 className="font-serif text-xl md:text-2xl font-bold mb-2 group-hover:underline">
                                                        {product.name}
                                                    </h3>
                                                    <p className="text-gray-600 mb-4 line-clamp-2">
                                                        {product.shortDescription}
                                                    </p>

                                                    <div className="flex items-center justify-between">
                                                        {(product.isPrebook || product.discountPercent) ? (
                                                            <div className="space-y-2">
                                                                {/* Discount Badge */}
                                                                {product.discountPercent && (
                                                                    <div className="inline-flex items-center bg-gradient-to-r from-green-600 to-emerald-600 text-white px-3 py-1 text-xs font-bold uppercase tracking-wider shadow-lg rounded-full">
                                                                        {product.discountPercent}% OFF
                                                                    </div>
                                                                )}
                                                                {/* Pricing */}
                                                                <div className="flex items-center gap-2">
                                                                    {product.originalPrice && (
                                                                        <span className="text-sm text-gray-400 line-through">
                                                                            ₹{product.originalPrice.toLocaleString('en-IN')}
                                                                        </span>
                                                                    )}
                                                                    <span className="text-2xl font-bold">
                                                                        ₹{product.price.toLocaleString('en-IN')}
                                                                    </span>
                                                                </div>
                                                                {/* Savings */}
                                                                {product.originalPrice && (
                                                                    <div className="text-xs text-green-600 font-medium">
                                                                        Save ₹{(product.originalPrice - product.price).toLocaleString('en-IN')}
                                                                    </div>
                                                                )}
                                                            </div>
                                                        ) : (
                                                            <div>
                                                                <span className="text-2xl font-bold">
                                                                    ₹{product.price.toLocaleString()}
                                                                </span>
                                                                {product.compareAtPrice && (
                                                                    <span className="ml-2 text-gray-500 line-through">
                                                                        ₹{product.compareAtPrice.toLocaleString()}
                                                                    </span>
                                                                )}
                                                            </div>
                                                        )}
                                                        <div className="flex items-center gap-2 text-sm text-gray-600">
                                                            <ShoppingCart className="w-4 h-4" />
                                                            <span>View Details</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </Link>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="text-center py-12 bg-white border border-gray-200">
                                        <p className="text-gray-600 text-lg">
                                            Products coming soon in this category
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

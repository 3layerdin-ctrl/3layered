"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { getHomepageCategories } from "@/data/categories";

/**
 * Product Categories Section
 * 
 * This component displays product categories on the homepage.
 * Categories are fetched from the centralized data source (data/categories.ts).
 * 
 * ADMIN PANEL READY:
 * When admin panel is implemented, categories will be fetched from an API/database.
 * Simply replace getHomepageCategories() with an API call.
 */

export function ProductCategories() {
    // Fetch categories marked for homepage display
    const categories = getHomepageCategories();

    return (
        <>
            {/* Shimmer animation keyframes */}
            <style jsx>{`
                @keyframes shimmer {
                    0% { transform: translateX(-200%); }
                    100% { transform: translateX(200%); }
                }
            `}</style>

            <section id="products" className="py-12 md:py-32 px-4 sm:px-6 bg-white">
                <div className="max-w-7xl mx-auto">
                    {/* What We Create Heading */}
                    <motion.h2
                        className="font-serif text-3xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-bold text-center mb-8 md:mb-16"
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "-100px" }}
                        transition={{ duration: 0.8 }}
                    >
                        What We Create
                    </motion.h2>

                    {/* First Category - Featured with Description */}
                    {categories[0] && (
                        <motion.div
                            className="mb-16 md:mb-24"
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: "-100px" }}
                            transition={{ duration: 0.8, delay: 0.2 }}
                        >
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-16 items-center">
                                <div className="order-1 lg:order-1">
                                    <Link
                                        href={categories[0].slug === 'custom-print' ? '/custom-print' : `/products/category/${categories[0].slug}`}
                                        className="block group relative"
                                    >
                                        <div className="aspect-[4/3] relative overflow-hidden bg-gray-100 rounded-lg">
                                            <Image
                                                src={categories[0].imageUrl}
                                                alt={categories[0].name}
                                                fill
                                                className="object-cover group-hover:scale-105 transition-transform duration-500"
                                            />
                                            {/* Shop Now Button Overlay */}
                                            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300">
                                                <div className="absolute bottom-6 right-6">
                                                    <button className="bg-black text-white px-6 py-3 text-base font-bold rounded-full hover:bg-gray-900 hover:scale-110 transition-all duration-300 shadow-2xl relative overflow-hidden group">
                                                        <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent" style={{ animation: 'shimmer 2s ease-in-out infinite' }}></span>
                                                        <span className="relative z-10">Shop Now</span>
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </Link>
                                </div>

                                <motion.div
                                    className="order-2 lg:order-2"
                                    initial={{ opacity: 0, x: 50 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    viewport={{ once: true, margin: "-100px" }}
                                    transition={{ duration: 0.8, delay: 0.4 }}
                                >
                                    <div className="space-y-4 md:space-y-6">
                                        <p className="text-xs sm:text-sm uppercase tracking-widest text-gray-500">
                                            Category 01
                                        </p>
                                        <h3 className="font-serif text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
                                            {categories[0].name}
                                        </h3>
                                        <div className="w-16 md:w-24 h-1 bg-black"></div>
                                        <p className="text-base sm:text-lg md:text-xl text-gray-700 leading-relaxed">
                                            {categories[0].description}
                                        </p>
                                        {categories[0].extendedDescription && (
                                            <p className="text-sm sm:text-base md:text-lg text-gray-600 leading-relaxed">
                                                {categories[0].extendedDescription}
                                            </p>
                                        )}
                                        <Link
                                            href={categories[0].slug === 'custom-print' ? '/custom-print' : `/products/category/${categories[0].slug}`}
                                            className="inline-flex items-center gap-3 text-lg font-medium border-b-2 border-black pb-1 hover:opacity-60 transition-opacity mt-8"
                                        >
                                            {categories[0].slug === 'custom-print' ? 'Get Started' : 'Explore Collection'}
                                            <ArrowRight className="w-5 h-5" />
                                        </Link>
                                    </div>
                                </motion.div>
                            </div>
                        </motion.div>
                    )}

                    {/* All Categories - Skip first one as it's shown above */}
                    <div className="space-y-16 md:space-y-32">
                        {categories.slice(1).map((category, index) => {
                            const isEven = index % 2 === 0;

                            return (
                                <motion.div
                                    key={category.id}
                                    className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-16 items-center"
                                    initial={{ opacity: 0, y: 50 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true, margin: "-100px" }}
                                    transition={{ duration: 0.8, delay: 0.2 }}
                                >
                                    <div className={isEven ? "order-1 lg:order-1" : "order-1 lg:order-2"}>
                                        <Link
                                            href={category.slug === 'custom-print' ? '/custom-print' : `/products/category/${category.slug}`}
                                            className="block group relative"
                                        >
                                            <div className="aspect-[4/3] relative overflow-hidden bg-gray-100 rounded-lg">
                                                <Image
                                                    src={category.imageUrl}
                                                    alt={category.name}
                                                    fill
                                                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                                                />
                                                {/* Shop Now Button Overlay */}
                                                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300">
                                                    <div className="absolute bottom-6 right-6">
                                                        <button className="bg-black text-white px-6 py-3 text-base font-bold rounded-full hover:bg-gray-900 hover:scale-110 transition-all duration-300 shadow-2xl relative overflow-hidden group">
                                                            <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent" style={{ animation: 'shimmer 2s ease-in-out infinite' }}></span>
                                                            <span className="relative z-10">Shop Now</span>
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        </Link>
                                    </div>

                                    <motion.div
                                        className={isEven ? "order-2 lg:order-2" : "order-2 lg:order-1"}
                                        initial={{ opacity: 0, x: isEven ? 50 : -50 }}
                                        whileInView={{ opacity: 1, x: 0 }}
                                        viewport={{ once: true, margin: "-100px" }}
                                        transition={{ duration: 0.8, delay: 0.4 }}
                                    >
                                        <div className="space-y-4 md:space-y-6">
                                            <p className="text-xs sm:text-sm uppercase tracking-widest text-gray-500">
                                                Category {String(index + 2).padStart(2, '0')}
                                            </p>
                                            <h3 className="font-serif text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
                                                {category.name}
                                            </h3>
                                            <div className="w-16 md:w-24 h-1 bg-black"></div>
                                            <p className="text-base sm:text-lg md:text-xl text-gray-700 leading-relaxed">
                                                {category.description}
                                            </p>
                                            {category.extendedDescription && (
                                                <p className="text-sm sm:text-base md:text-lg text-gray-600 leading-relaxed">
                                                    {category.extendedDescription}
                                                </p>
                                            )}
                                            <Link
                                                href={category.slug === 'custom-print' ? '/custom-print' : `/products/category/${category.slug}`}
                                                className="inline-flex items-center gap-3 text-lg font-medium border-b-2 border-black pb-1 hover:opacity-60 transition-opacity mt-8"
                                            >
                                                {category.slug === 'custom-print' ? 'Get Started' : 'Explore Collection'}
                                                <ArrowRight className="w-5 h-5" />
                                            </Link>
                                        </div>
                                    </motion.div>
                                </motion.div>
                            );
                        })}
                    </div>
                </div>
            </section>
        </>
    );
}

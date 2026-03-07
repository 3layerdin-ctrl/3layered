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

            <section id="products" className="relative py-12 md:py-32 px-4 sm:px-6 bg-[#FAF7F2] overflow-hidden">
                {/* Mandala / Chakra Heritage Background Pattern */}
                <div className="absolute inset-0 z-0 opacity-[0.04] pointer-events-none flex justify-center items-center" style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg width='240' height='240' viewBox='0 0 240 240' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M120 0C120 66.274 66.274 120 0 120C66.274 120 120 173.726 120 240C120 173.726 173.726 120 240 120C173.726 120 120 66.274 120 0Z' fill='none' stroke='%234A3121' stroke-width='1.5'/%3E%3Ccircle cx='120' cy='120' r='60' fill='none' stroke='%234A3121' stroke-width='1' stroke-dasharray='4 4'/%3E%3Ccircle cx='120' cy='120' r='90' fill='none' stroke='%234A3121' stroke-width='0.5'/%3E%3Cpath d='M120 30L120 210M30 120L210 120M56.36 56.36L183.64 183.64M56.36 183.64L183.64 56.36' stroke='%234A3121' stroke-width='0.5' opacity='0.5'/%3E%3C/svg%3E")`,
                    backgroundSize: '240px 240px',
                    backgroundPosition: 'center'
                }} />
                
                <div className="absolute top-0 inset-x-0 h-40 bg-gradient-to-b from-[#FAF7F2] to-transparent z-0 pointer-events-none" />
                <div className="absolute bottom-0 inset-x-0 h-40 bg-gradient-to-t from-[#FAF7F2] to-transparent z-0 pointer-events-none" />

                <div className="max-w-7xl mx-auto relative z-10">
                    {/* Header */}
                    <div className="text-center mb-16 md:mb-24">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true, margin: "-100px" }}
                            transition={{ duration: 0.8, ease: "easeOut" }}
                            className="inline-flex flex-col items-center justify-center mb-4"
                        >
                            <div className="flex items-center gap-4 mb-3">
                                <span className="w-16 h-[1px] bg-gradient-to-r from-transparent to-amber-600/60"></span>
                                <span className="text-amber-800 font-semibold tracking-[0.25em] uppercase text-xs md:text-sm">
                                    Our Craftsmanship
                                </span>
                                <span className="w-16 h-[1px] bg-gradient-to-l from-transparent to-amber-600/60"></span>
                            </div>
                            <h2 className="font-serif text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-bold bg-clip-text text-transparent bg-gradient-to-br from-[#2A2320] via-[#4A3121] to-[#7B5035] drop-shadow-sm pb-2">
                                What We Create
                            </h2>
                        </motion.div>
                    </div>

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
                                        <div className="aspect-[4/3] relative overflow-hidden bg-[#F5F2ED] rounded-xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] group-hover:shadow-[0_20px_40px_rgb(60,40,30,0.12)] border border-[#E8E1D5]/60 transition-all duration-500">
                                            <Image
                                                src={categories[0].imageUrl}
                                                alt={categories[0].name}
                                                fill
                                                className="object-cover group-hover:scale-105 transition-transform duration-500"
                                            />
                                            {/* Overlays */}
                                            <div className="absolute inset-0 bg-gradient-to-t from-[#1A1412]/80 via-[#2A2320]/10 to-transparent opacity-60 md:opacity-0 md:group-hover:opacity-100 transition-opacity duration-500 z-10" />
                                            <div className="absolute inset-0 bg-[#4A3121]/5 opacity-0 group-hover:opacity-100 mix-blend-overlay transition-opacity duration-500 z-10" />
                                            
                                            {/* Shop Now Button Overlay */}
                                            <div className="absolute inset-x-0 bottom-6 flex justify-center translate-y-0 opacity-100 md:translate-y-8 md:opacity-0 md:group-hover:translate-y-0 md:group-hover:opacity-100 transition-all duration-500 ease-out z-20 pointer-events-none">
                                                <button className="pointer-events-auto bg-white/95 backdrop-blur-sm shadow-xl text-[#2A2320] px-8 py-3.5 rounded-full font-semibold text-sm tracking-wide hover:bg-[#2A2320] hover:text-white transition-all duration-300 transform active:scale-95 border border-white/20 flex items-center justify-center gap-2 group/btn">
                                                    <span>Explore Category</span>
                                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 transform group-hover/btn:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                                                    </svg>
                                                </button>
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
                                        <p className="text-xs sm:text-sm uppercase tracking-widest text-amber-800/80 font-semibold">
                                            Category 01
                                        </p>
                                        <h3 className="font-serif text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold leading-tight text-[#2A2320] group-hover:text-amber-800 transition-colors duration-300">
                                            {categories[0].name}
                                        </h3>
                                        <div className="w-16 md:w-24 h-[2px] bg-gradient-to-r from-amber-800/80 to-transparent"></div>
                                        <p className="text-base sm:text-lg md:text-xl text-gray-600/90 leading-relaxed font-light">
                                            {categories[0].description}
                                        </p>
                                        {categories[0].extendedDescription && (
                                            <p className="text-sm sm:text-base md:text-lg text-gray-600 leading-relaxed">
                                                {categories[0].extendedDescription}
                                            </p>
                                        )}
                                        <Link
                                            href={categories[0].slug === 'custom-print' ? '/custom-print' : `/products/category/${categories[0].slug}`}
                                            className="inline-flex items-center gap-3 text-lg font-medium border-b-2 border-amber-900/30 text-[#2A2320] pb-1 hover:border-amber-900 hover:text-amber-900 transition-all duration-300 mt-8 group-hover/link:translate-x-2"
                                        >
                                            {categories[0].slug === 'custom-print' ? 'Get Started' : 'Explore Collection'}
                                            <ArrowRight className="w-5 h-5 transform group-hover:translate-x-1 transition-transform" />
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
                                            <div className="aspect-[4/3] relative overflow-hidden bg-[#F5F2ED] rounded-xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] group-hover:shadow-[0_20px_40px_rgb(60,40,30,0.12)] border border-[#E8E1D5]/60 transition-all duration-500">
                                                <Image
                                                    src={category.imageUrl}
                                                    alt={category.name}
                                                    fill
                                                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                                                />
                                                {/* Overlays */}
                                                <div className="absolute inset-0 bg-gradient-to-t from-[#1A1412]/80 via-[#2A2320]/10 to-transparent opacity-60 md:opacity-0 md:group-hover:opacity-100 transition-opacity duration-500 z-10" />
                                                <div className="absolute inset-0 bg-[#4A3121]/5 opacity-0 group-hover:opacity-100 mix-blend-overlay transition-opacity duration-500 z-10" />
                                                
                                                {/* Shop Now Button Overlay */}
                                                <div className="absolute inset-x-0 bottom-6 flex justify-center translate-y-0 opacity-100 md:translate-y-8 md:opacity-0 md:group-hover:translate-y-0 md:group-hover:opacity-100 transition-all duration-500 ease-out z-20 pointer-events-none">
                                                    <button className="pointer-events-auto bg-white/95 backdrop-blur-sm shadow-xl text-[#2A2320] px-8 py-3.5 rounded-full font-semibold text-sm tracking-wide hover:bg-[#2A2320] hover:text-white transition-all duration-300 transform active:scale-95 border border-white/20 flex items-center justify-center gap-2 group/btn">
                                                        <span>Explore Category</span>
                                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 transform group-hover/btn:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                                                        </svg>
                                                    </button>
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
                                            <p className="text-xs sm:text-sm uppercase tracking-widest text-amber-800/80 font-semibold">
                                                Category {String(index + 2).padStart(2, '0')}
                                            </p>
                                            <h3 className="font-serif text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold leading-tight text-[#2A2320] group-hover:text-amber-800 transition-colors duration-300">
                                                {category.name}
                                            </h3>
                                            <div className="w-16 md:w-24 h-[2px] bg-gradient-to-r from-amber-800/80 to-transparent"></div>
                                            <p className="text-base sm:text-lg md:text-xl text-gray-600/90 leading-relaxed font-light">
                                                {category.description}
                                            </p>
                                            {category.extendedDescription && (
                                                <p className="text-sm sm:text-base md:text-lg text-gray-600 leading-relaxed">
                                                    {category.extendedDescription}
                                                </p>
                                            )}
                                            <Link
                                                href={category.slug === 'custom-print' ? '/custom-print' : `/products/category/${category.slug}`}
                                                className="inline-flex items-center gap-3 text-lg font-medium border-b-2 border-amber-900/30 text-[#2A2320] pb-1 hover:border-amber-900 hover:text-amber-900 transition-all duration-300 mt-8 group-hover/link:translate-x-2"
                                            >
                                                {category.slug === 'custom-print' ? 'Get Started' : 'Explore Collection'}
                                                <ArrowRight className="w-5 h-5 transform group-hover:translate-x-1 transition-transform" />
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

"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Product } from "@/types/product";

interface Props {
    products: Product[];
}

export function BestSellerCards({ products }: Props) {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {products.map((product, index) => {
                const discountPct =
                    product.compareAtPrice && product.compareAtPrice > product.price
                        ? Math.round((1 - product.price / product.compareAtPrice) * 100)
                        : null;

                return (
                    <motion.div
                        key={product.id}
                        initial={{ opacity: 0, y: 40 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "-50px" }}
                        transition={{ duration: 0.8, delay: 0.1 + index * 0.15, ease: [0.21, 0.47, 0.32, 0.98] }}
                        className="group flex flex-col h-full bg-white rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_20px_40px_rgb(60,40,30,0.12)] transition-all duration-500 overflow-hidden border border-[#E8E1D5]/60 hover:border-amber-900/20 hover:-translate-y-2"
                    >
                        {/* Image Container */}
                        <div className="relative aspect-[4/5] overflow-hidden bg-[#F5F2ED] flex-shrink-0">
                            <Link href={`/products/${product.slug}`} className="block w-full h-full relative z-0">
                                <Image
                                    src={product.images[0] || '/placeholder.png'}
                                    alt={`${product.name} — handcrafted miniature temple model by 3 Layered`}
                                    fill
                                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                                    className="object-cover group-hover:scale-105 transition-transform duration-700 ease-[0.25,0.46,0.45,0.94] z-0"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-[#1A1412]/90 via-[#2A2320]/20 to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-500 z-10" />
                                <div className="absolute inset-0 bg-[#4A3121]/10 opacity-0 group-hover:opacity-100 mix-blend-overlay transition-opacity duration-500 z-10" />
                            </Link>

                            {/* Discount Badge */}
                            {discountPct && (
                                <div className="absolute top-3 left-3 z-20 bg-amber-700 text-white text-xs font-bold px-2.5 py-1 rounded-full shadow-md pointer-events-none">
                                    {discountPct}% OFF
                                </div>
                            )}

                            {/* Quick View CTA */}
                            <div className="absolute inset-x-0 bottom-0 p-6 translate-y-4 md:translate-y-8 opacity-100 md:opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500 ease-out z-20 flex justify-center">
                                <Link
                                    href={`/products/${product.slug}`}
                                    className="shadow-2xl bg-white/95 backdrop-blur-sm text-[#2A2320] px-8 py-3.5 rounded-full font-semibold text-sm tracking-wide hover:bg-[#2A2320] hover:text-white transition-all duration-400 transform hover:scale-105 active:scale-95 border border-white/20 w-full text-center group/btn flex items-center justify-center gap-2"
                                >
                                    <span>View Details</span>
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 transform group-hover/btn:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                                    </svg>
                                </Link>
                            </div>
                        </div>

                        {/* Product Info */}
                        <div className="flex-grow p-6 flex flex-col justify-between text-center relative z-10 bg-white">
                            <div className="mb-5">
                                <Link href={`/products/${product.slug}`}>
                                    <h3 className="font-serif text-xl sm:text-2xl font-bold text-[#2A2320] mb-2 line-clamp-1 group-hover:text-amber-700 transition-colors duration-300">
                                        {product.name}
                                    </h3>
                                </Link>
                                <p className="text-sm text-gray-500 line-clamp-2 leading-relaxed">
                                    {product.shortDescription}
                                </p>
                            </div>

                            <div className="pt-5 border-t border-[#E8E1D5]/50 group-hover:border-amber-900/10 transition-colors duration-300">
                                <div className="flex justify-between items-center mb-4">
                                    <div className="flex items-center gap-2">
                                        <span className="text-xl lg:text-2xl font-bold text-[#2A2320]">
                                            ₹{product.price.toLocaleString('en-IN')}
                                        </span>
                                        {product.compareAtPrice && product.compareAtPrice > product.price && (
                                            <span className="text-sm font-medium text-gray-400 line-through decoration-gray-300">
                                                ₹{product.compareAtPrice.toLocaleString('en-IN')}
                                            </span>
                                        )}
                                    </div>
                                </div>
                                <Link
                                    href={`/products/${product.slug}?action=buy`}
                                    className="w-full bg-[#FAF7F2] hover:bg-[#4A3121] text-[#4A3121] hover:text-white border border-[#E8E1D5] hover:border-[#4A3121] transition-all duration-300 px-4 py-3 rounded-xl font-semibold flex justify-center items-center gap-2 group/buybox shadow-sm hover:shadow-lg"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 transform group-hover/buybox:scale-110 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                                    </svg>
                                    Buy Now
                                </Link>
                            </div>
                        </div>
                    </motion.div>
                );
            })}
        </div>
    );
}

"use client";

import { useState, useEffect } from "react";
import { motion, useScroll } from "framer-motion";
import { useScrollPosition } from "@/hooks/useScrollPosition";
import { useSlide } from "@/contexts/SlideContext";

export function HeroSection() {
    const [mounted, setMounted] = useState(false);
    const { isScrolled } = useScrollPosition();
    const { setIsDarkSlide } = useSlide();
    const { scrollY } = useScroll();

    useEffect(() => {
        setMounted(true);
        setIsDarkSlide(true); // hero has dark overlay — navbar uses light text
    }, [setIsDarkSlide]);

    return (
        <>
            <style jsx>{`
                @keyframes shimmer {
                    0% { transform: translateX(-200%); }
                    100% { transform: translateX(200%); }
                }
            `}</style>

            <section
                id="home"
                className="relative h-screen min-h-[600px] bg-[#1A110B]"
            >
                {/* Hero Background */}
                <div className="absolute inset-0 overflow-hidden">
                    <img
                        src="https://jwgtjfmwlnttjdvycuqj.supabase.co/storage/v1/object/public/displlay/slide/Gemini_Generated_Image_ljfv8mljfv8mljfv.jpg"
                        alt="3D Printed Miniature Temple Models"
                        className="w-full h-full object-cover object-center"
                        loading="eager"
                        decoding="async"
                    />
                    {/* Dark amber gradient overlay for premium warmth */}
                    <div className="absolute inset-0 bg-gradient-to-b from-[#1A110B]/85 via-[#2A1B12]/65 to-[#1A110B]/95" />
                </div>

                {/* Centered Hero Content */}
                {mounted && (
                    <div className="relative z-10 flex flex-col items-center justify-center h-full text-center px-6">

                        {/* Eyebrow badge */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.1 }}
                            className="mb-5"
                        >
                            <span className="inline-block border border-amber-500/30 text-amber-50/90 text-xs uppercase tracking-[0.25em] px-4 py-2 rounded-full backdrop-blur-md bg-[#2A1B12]/40 shadow-[0_0_15px_rgba(255,180,100,0.1)]">
                                Handcrafted in India · Since 2024
                            </span>
                        </motion.div>

                        {/* Main Headline */}
                        <motion.h1
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: 0.25, ease: [0.25, 0.1, 0.25, 1] }}
                            className="text-3xl sm:text-5xl md:text-7xl lg:text-8xl font-bold text-white max-w-5xl leading-[1.05] mb-4 md:mb-6"
                            style={{ fontFamily: "'Playfair Display', 'Georgia', serif" }}
                        >
                            Bring Sacred{" "}
                            <span className="italic font-normal">Architecture</span>{" "}
                            Home
                        </motion.h1>

                        {/* Subheadline */}
                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: 0.45, ease: [0.25, 0.1, 0.25, 1] }}
                            className="text-sm sm:text-lg md:text-xl text-[#E8E1D5]/90 max-w-2xl leading-relaxed mb-6 md:mb-8 font-light"
                        >
                            Precision 3D printed temple models & architectural replicas — every detail captured, every proportion honoured.
                        </motion.p>

                        {/* Social Proof */}
                        <motion.div
                            initial={{ opacity: 0, y: 15 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.7, delay: 0.6 }}
                            className="flex flex-wrap items-center justify-center gap-2 text-white/70 text-sm mb-8 md:mb-10"
                        >
                            <span className="text-yellow-400 tracking-wider">★★★★★</span>
                            <span className="text-white/40">·</span>
                            <span>500+ Happy Customers</span>
                            <span className="text-white/40">·</span>
                            <span>Ships Across India</span>
                        </motion.div>

                        {/* CTAs */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.7, delay: 0.75 }}
                            className="flex flex-col sm:flex-row gap-4 items-center w-full sm:w-auto px-4 sm:px-0"
                        >
                            {/* Primary CTA */}
                            <a
                                href="/products"
                                className="w-full sm:w-auto inline-flex items-center justify-center gap-3 bg-gradient-to-r from-[#DFB374] to-[#C99144] text-[#2A1B12] px-8 py-4 text-base font-bold rounded-full hover:shadow-[0_0_30px_rgba(223,179,116,0.4)] hover:scale-105 transition-all duration-300 shadow-2xl relative overflow-hidden group"
                            >
                                <span
                                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent -translate-x-full group-hover:animate-[shimmer_1.5s_infinite]"
                                />
                                <span className="relative z-10">Explore Our Collections</span>
                                <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300 relative z-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
                                </svg>
                            </a>

                            {/* Secondary CTA */}
                            <a
                                href="/custom-print"
                                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 border border-[#E8E1D5]/40 text-[#E8E1D5] px-8 py-4 text-base font-medium rounded-full hover:bg-white/5 hover:border-[#DFB374]/60 transition-all duration-300 backdrop-blur-sm"
                            >
                                Custom Print
                            </a>
                        </motion.div>

                        {/* Discount badge */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.7, delay: 1 }}
                            className="mt-8"
                        >
                            <span className="inline-block bg-gradient-to-r from-green-800/90 to-emerald-900/90 border border-green-500/30 text-green-50 text-xs font-semibold px-5 py-2 rounded-full shadow-[0_4px_20px_rgba(0,0,0,0.5)] tracking-widest uppercase">
                                UP TO 25% OFF — Use Code: WELCOME150
                            </span>
                        </motion.div>
                    </div>
                )}

                {/* Scroll indicator */}
                {mounted && (
                    <motion.button
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 1, delay: 1.5 }}
                        onClick={() => window.scrollBy({ top: window.innerHeight, behavior: 'smooth' })}
                        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2 text-white/40 hover:text-white/70 transition-colors cursor-pointer"
                        aria-label="Scroll down"
                    >
                        <span className="text-xs uppercase tracking-widest">Scroll</span>
                        <motion.div
                            animate={{ y: [0, 8, 0] }}
                            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 9l-7 7-7-7" />
                            </svg>
                        </motion.div>
                    </motion.button>
                )}
            </section>
        </>
    );
}

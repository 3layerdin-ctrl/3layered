"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence, useScroll } from "framer-motion";
import Image from "next/image";
import { useScrollPosition } from "@/hooks/useScrollPosition";
import { useSlide } from "@/contexts/SlideContext";

const SLIDES = [
    {
        id: 1,
        image: "https://jwgtjfmwlnttjdvycuqj.supabase.co/storage/v1/object/public/displlay/slide/home%20page/Gemini_Generated_Image_vib79evib79evib7.jpg",
        caption: "Custom 3D Printing",
        isDark: false, // Light background - navbar text should be black
    },
];

export function HeroSection() {
    const [mounted, setMounted] = useState(false);
    const [isTaglineVisible, setIsTaglineVisible] = useState(true);
    const [currentSlide, setCurrentSlide] = useState(0);
    const { isScrolled } = useScrollPosition();
    const { setIsDarkSlide, isDarkSlide } = useSlide();
    const { scrollY } = useScroll();

    useEffect(() => {
        setMounted(true);
        // Set dark slide for the current slide
        setIsDarkSlide(SLIDES[currentSlide].isDark);
    }, [setIsDarkSlide, currentSlide]);

    // Auto-rotate slides every 5 seconds
    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentSlide((prev) => (prev + 1) % SLIDES.length);
        }, 5000);

        return () => clearInterval(interval);
    }, []);

    // Listen for scroll to hide tagline
    useEffect(() => {
        if (!mounted) return;

        const unsubscribe = scrollY.on('change', (latest) => {
            // Hide tagline when scroll passes 50px (same trigger as logo)
            if (latest > 50 && isTaglineVisible) {
                setIsTaglineVisible(false);
            }
            // Show if scrolled back to top
            if (latest <= 10 && !isTaglineVisible) {
                setIsTaglineVisible(true);
            }
        });

        return () => unsubscribe();
    }, [scrollY, isTaglineVisible, mounted]);

    return (
        <>
            {/* Shimmer animation keyframes */}
            <style jsx>{`
                @keyframes shimmer {
                    0% { transform: translateX(-200%); }
                    100% { transform: translateX(200%); }
                }
            `}</style>

            <section
                id="home"
                className="relative h-auto md:h-screen bg-gray-50"
            >
                {/* Hero Image Container */}
                <div className="relative h-auto md:h-full overflow-hidden">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={currentSlide}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.7 }}
                            className="relative w-full h-full"
                        >
                            {/* Hero Image */}
                            <div className="relative w-full aspect-[16/9] md:aspect-auto md:h-full">
                                <img
                                    src={SLIDES[currentSlide].image}
                                    alt={SLIDES[currentSlide].caption}
                                    className="w-full h-full object-cover object-top md:object-center"
                                    loading="eager"
                                    decoding="async"
                                />
                                {/* Gradient overlay for better text contrast on mobile */}
                                <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/40 md:bg-black/10" />
                            </div>
                        </motion.div>
                    </AnimatePresence>

                    {/* Desktop Tagline - Bottom Left */}
                    {mounted && (
                        <motion.div
                            initial={{ opacity: 1 }}
                            animate={{ opacity: isTaglineVisible ? 1 : 0 }}
                            transition={{
                                duration: 0.4,
                                ease: [0.25, 0.1, 0.25, 1]
                            }}
                            className="hidden md:block absolute left-8 bottom-20 z-80 max-w-md pointer-events-none"
                        >
                            {/* Background with blur for contrast */}
                            <div
                                style={{
                                    backgroundColor: isDarkSlide ? 'rgba(0, 0, 0, 0.5)' : 'rgba(255, 255, 255, 0.7)',
                                    backdropFilter: 'blur(10px)',
                                    WebkitBackdropFilter: 'blur(10px)',
                                    padding: '1.5rem',
                                    borderRadius: '12px',
                                    border: `1px solid ${isDarkSlide ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'}`,
                                    transition: 'all 0.3s ease',
                                }}
                            >
                                <h3
                                    className="text-xl md:text-2xl font-serif italic mb-3"
                                    style={{
                                        fontFamily: "'Playfair Display', 'Georgia', 'Times New Roman', serif",
                                        fontWeight: 400,
                                        letterSpacing: '0.02em',
                                        color: isDarkSlide ? '#ffffff' : '#000000',
                                        textShadow: isDarkSlide ? '0 2px 8px rgba(0,0,0,0.5)' : '0 2px 8px rgba(255,255,255,0.5)',
                                        transition: 'color 0.3s ease'
                                    }}
                                >
                                    You Dream it, We 3D it
                                </h3>
                                <p
                                    className="text-sm md:text-base leading-relaxed"
                                    style={{
                                        fontFamily: "'Inter', sans-serif",
                                        fontWeight: 300,
                                        lineHeight: '1.6',
                                        color: isDarkSlide ? 'rgba(255, 255, 255, 0.9)' : 'rgba(0, 0, 0, 0.8)',
                                        transition: 'color 0.3s ease'
                                    }}
                                >
                                    Transforming your ideas into reality with precision 3D printing. From intricate temple models to architectural masterpieces and custom prints.
                                </p>
                            </div>
                        </motion.div>
                    )}

                    {/* Logo rendered by LogoController component */}

                    {/* Shop Now Button - Responsive positioning */}
                    <div className="absolute bottom-6 right-4 md:bottom-12 md:right-12 z-10">
                        {/* Discount Badge */}
                        <div className="mb-2 text-right">
                            <span className="inline-block bg-green-600 text-white text-xs md:text-sm font-bold px-3 py-1 rounded-full shadow-lg">
                                UP TO 25% OFF
                            </span>
                        </div>

                        <a
                            href="/products"
                            className="inline-flex items-center gap-2 md:gap-3 bg-black text-white px-6 py-3 md:px-10 md:py-5 text-base md:text-xl font-bold rounded-full hover:bg-gray-900 hover:scale-110 transition-all duration-300 shadow-2xl hover:shadow-black/50 group relative overflow-hidden"
                        >
                            {/* Shimmer effect - More intense */}
                            <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent" style={{ animation: 'shimmer 2s ease-in-out infinite' }}></span>

                            <span className="relative z-10">Shop Now</span>
                            <svg className="w-5 h-5 md:w-6 md:h-6 group-hover:translate-x-2 transition-transform duration-300 relative z-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
                            </svg>
                        </a>
                    </div>
                </div>
            </section>
        </>
    );
}

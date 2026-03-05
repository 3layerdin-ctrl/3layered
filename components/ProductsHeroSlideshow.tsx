'use client';

import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { useSlide } from '@/contexts/SlideContext';

const PRODUCT_SLIDES = [
    {
        id: 1,
        image: 'https://jwgtjfmwlnttjdvycuqj.supabase.co/storage/v1/object/public/displlay/slide/product%20page/p1.jpg',
        eyebrow: 'Miniature Temples',
        title: 'Architectural',
        titleItalic: 'Masterpieces',
        description: 'Museum-quality miniature temple models crafted with precision 3D printing',
        cta: { label: 'Shop Temples', href: '#categories' },
    },
    {
        id: 2,
        image: 'https://jwgtjfmwlnttjdvycuqj.supabase.co/storage/v1/object/public/displlay/slide/product%20page/p2.jpg',
        eyebrow: 'Sacred Heritage',
        title: 'Sacred',
        titleItalic: 'Geometry',
        description: 'Precision-engineered replicas honouring every proportion of ancient design',
        cta: { label: 'Explore Collection', href: '#categories' },
    },
    {
        id: 3,
        image: 'https://jwgtjfmwlnttjdvycuqj.supabase.co/storage/v1/object/public/displlay/slide/product%20page/p3.jpg',
        eyebrow: 'Made in India',
        title: 'Heritage',
        titleItalic: 'Preserved',
        description: 'Bringing ancient architecture home — one layer at a time',
        cta: { label: 'View All Products', href: '#categories' },
    }
];

const SLIDE_INTERVAL = 5000;

export function ProductsHeroSlideshow() {
    const [currentSlide, setCurrentSlide] = useState(0);
    const [isPaused, setIsPaused] = useState(false);
    const [mounted, setMounted] = useState(false);
    const { setIsDarkSlide } = useSlide();

    useEffect(() => {
        setMounted(true);
        setIsDarkSlide(true);
    }, [setIsDarkSlide]);

    useEffect(() => {
        if (isPaused) return;
        const interval = setInterval(() => {
            setCurrentSlide((prev) => (prev + 1) % PRODUCT_SLIDES.length);
        }, SLIDE_INTERVAL);
        return () => clearInterval(interval);
    }, [isPaused]);

    const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % PRODUCT_SLIDES.length);
    const prevSlide = () => setCurrentSlide((prev) => (prev - 1 + PRODUCT_SLIDES.length) % PRODUCT_SLIDES.length);
    const goToSlide = (index: number) => setCurrentSlide(index);

    const slide = PRODUCT_SLIDES[currentSlide];

    return (
        <section
            className="relative h-[80vh] md:h-screen min-h-[550px] overflow-hidden bg-gray-900"
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
        >
            {/* Background Image */}
            <AnimatePresence mode="wait">
                <motion.div
                    key={currentSlide}
                    initial={{ opacity: 0, scale: 1.04 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.8, ease: [0.25, 0.1, 0.25, 1] }}
                    className="absolute inset-0"
                >
                    <img
                        src={slide.image}
                        alt={slide.title}
                        className="w-full h-full object-cover object-center"
                        loading="eager"
                        decoding="async"
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-black/75 via-black/45 to-black/15" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/25" />
                </motion.div>
            </AnimatePresence>

            {/* Main Text Content */}
            <div className="relative z-10 h-full flex flex-col justify-center">
                <div className="px-5 sm:px-8 md:px-16 lg:px-24 max-w-2xl">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={currentSlide}
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
                        >
                            {/* Eyebrow badge */}
                            <span className="inline-block border border-white/50 text-white/80 text-xs uppercase tracking-[0.25em] px-4 py-1.5 rounded-full backdrop-blur-sm bg-white/10 mb-5">
                                {slide.eyebrow}
                            </span>

                            {/* Headline */}
                            <h1
                                className="text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-bold text-white leading-[1.05] mb-4 md:mb-5"
                                style={{ fontFamily: "'Playfair Display', 'Georgia', serif" }}
                            >
                                {slide.title}{' '}
                                <span className="italic font-normal">{slide.titleItalic}</span>
                            </h1>

                            {/* Description */}
                            <p
                                className="text-sm sm:text-base md:text-lg text-white/75 leading-relaxed mb-6 md:mb-8 max-w-lg"
                                style={{ fontFamily: "'Inter', sans-serif", fontWeight: 300 }}
                            >
                                {slide.description}
                            </p>

                            {/* CTA */}
                            <Link
                                href={slide.cta.href}
                                className="inline-flex items-center gap-3 bg-white text-black px-8 py-3.5 text-sm font-bold rounded-full hover:bg-gray-100 hover:scale-105 transition-all duration-300 shadow-2xl"
                            >
                                Explore Collection
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
                                </svg>
                            </Link>
                        </motion.div>
                    </AnimatePresence>
                </div>
            </div>

            {/* Slide Counter */}
            <div className="absolute top-8 right-8 z-20 text-white/50 text-sm font-light tabular-nums hidden md:block">
                {String(currentSlide + 1).padStart(2, '0')} / {String(PRODUCT_SLIDES.length).padStart(2, '0')}
            </div>

            {/* Navigation Arrows */}
            <button
                onClick={prevSlide}
                className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 z-20 w-11 h-11 border border-white/30 bg-white/10 hover:bg-white/20 text-white rounded-full flex items-center justify-center transition-all duration-200 backdrop-blur-sm"
                aria-label="Previous slide"
            >
                <ChevronLeft className="w-5 h-5" />
            </button>

            <button
                onClick={nextSlide}
                className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 z-20 w-11 h-11 border border-white/30 bg-white/10 hover:bg-white/20 text-white rounded-full flex items-center justify-center transition-all duration-200 backdrop-blur-sm"
                aria-label="Next slide"
            >
                <ChevronRight className="w-5 h-5" />
            </button>

            {/* Progress Dots */}
            <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-2 z-20">
                {PRODUCT_SLIDES.map((_, index) => (
                    <button
                        key={index}
                        onClick={() => goToSlide(index)}
                        className={`transition-all duration-300 rounded-full ${
                            index === currentSlide
                                ? 'w-8 h-1.5 bg-white'
                                : 'w-1.5 h-1.5 bg-white/40 hover:bg-white/60'
                        }`}
                        aria-label={`Go to slide ${index + 1}`}
                    />
                ))}
            </div>

            {/* Scroll indicator — centered, clickable */}
            {mounted && (
                <motion.button
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 1, delay: 1.2 }}
                    onClick={() => document.getElementById('categories')?.scrollIntoView({ behavior: 'smooth' })}
                    className="absolute bottom-14 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-1.5 text-white/40 hover:text-white/70 transition-colors cursor-pointer"
                    aria-label="Scroll to products"
                >
                    <span className="text-xs uppercase tracking-widest">Scroll</span>
                    <motion.div
                        animate={{ y: [0, 6, 0] }}
                        transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 9l-7 7-7-7" />
                        </svg>
                    </motion.div>
                </motion.button>
            )}

            {/* Auto-play progress bar */}
            {!isPaused && (
                <motion.div
                    key={`progress-${currentSlide}`}
                    className="absolute bottom-0 left-0 h-0.5 bg-white/40 z-20"
                    initial={{ width: '0%' }}
                    animate={{ width: '100%' }}
                    transition={{ duration: SLIDE_INTERVAL / 1000, ease: 'linear' }}
                />
            )}
        </section>
    );
}

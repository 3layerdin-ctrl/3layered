'use client';

import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { useSlide } from '@/contexts/SlideContext';

const PRODUCT_SLIDES = [
    {
        id: 1,
        image: 'https://jwgtjfmwlnttjdvycuqj.supabase.co/storage/v1/object/public/displlay/slide/product%20page/p1.jpg',
        title: 'Architectural Masterpieces',
        description: 'Museum-quality miniature temple models',
        link: '#categories',
        isDark: false, // Light background
    },
    {
        id: 2,
        image: 'https://jwgtjfmwlnttjdvycuqj.supabase.co/storage/v1/object/public/displlay/slide/product%20page/p2.jpg',
        title: 'Sacred Geometry',
        description: 'Precision-engineered replicas',
        link: '#categories',
        isDark: false, // Light background
    },
    {
        id: 3,
        image: 'https://jwgtjfmwlnttjdvycuqj.supabase.co/storage/v1/object/public/displlay/slide/product%20page/p3.jpg',
        title: 'Heritage Preserved',
        description: 'Bringing ancient architecture to life',
        link: '#categories',
        isDark: false, // Light background
    }
];

const SLIDE_INTERVAL = 4000; // 4 seconds

export function ProductsHeroSlideshow() {
    const [currentSlide, setCurrentSlide] = useState(0);
    const [isPaused, setIsPaused] = useState(false);
    const { setIsDarkSlide } = useSlide();

    // Update navbar color based on current slide
    useEffect(() => {
        setIsDarkSlide(PRODUCT_SLIDES[currentSlide].isDark);
    }, [currentSlide, setIsDarkSlide]);

    useEffect(() => {
        if (isPaused) return;

        const interval = setInterval(() => {
            setCurrentSlide((prev) => (prev + 1) % PRODUCT_SLIDES.length);
        }, SLIDE_INTERVAL);

        return () => clearInterval(interval);
    }, [isPaused]);

    const nextSlide = () => {
        setCurrentSlide((prev) => (prev + 1) % PRODUCT_SLIDES.length);
    };

    const prevSlide = () => {
        setCurrentSlide((prev) => (prev - 1 + PRODUCT_SLIDES.length) % PRODUCT_SLIDES.length);
    };

    const goToSlide = (index: number) => {
        setCurrentSlide(index);
    };

    return (
        <section
            className="relative h-[80vh] bg-gray-50 overflow-hidden"
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
        >
            {/* Slides */}
            <AnimatePresence mode="wait">
                <motion.div
                    key={currentSlide}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.5 }}
                    className="absolute inset-0"
                >
                    <div className="relative w-full h-full bg-white">
                        <img
                            src={PRODUCT_SLIDES[currentSlide].image}
                            alt={PRODUCT_SLIDES[currentSlide].title}
                            className="w-full h-full object-contain"
                            loading="eager"
                            decoding="async"
                        />
                    </div>
                </motion.div>
            </AnimatePresence>

            {/* Navigation Arrows */}
            <button
                onClick={prevSlide}
                className="absolute left-6 top-1/2 -translate-y-1/2 z-20 w-12 h-12 bg-white/90 hover:bg-white text-black rounded-full flex items-center justify-center transition-all duration-200 hover:scale-110"
                aria-label="Previous slide"
            >
                <ChevronLeft className="w-6 h-6" />
            </button>

            <button
                onClick={nextSlide}
                className="absolute right-6 top-1/2 -translate-y-1/2 z-20 w-12 h-12 bg-white/90 hover:bg-white text-black rounded-full flex items-center justify-center transition-all duration-200 hover:scale-110"
                aria-label="Next slide"
            >
                <ChevronRight className="w-6 h-6" />
            </button>

            {/* Dots Navigation */}
            <div className="absolute bottom-12 left-1/2 -translate-x-1/2 flex gap-3 z-10">
                {PRODUCT_SLIDES.map((_, index) => (
                    <button
                        key={index}
                        onClick={() => goToSlide(index)}
                        className={`transition-all duration-300 ${index === currentSlide
                            ? 'w-8 h-2 bg-white'
                            : 'w-2 h-2 bg-white/50 hover:bg-white/75'
                            } rounded-full`}
                        aria-label={`Go to slide ${index + 1}`}
                    />
                ))}
            </div>
        </section>
    );
}

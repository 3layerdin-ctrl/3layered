"use client";

import { useState, useEffect } from "react";
import { motion, useScroll, useReducedMotion } from "framer-motion";
import { useSlide } from "@/contexts/SlideContext";
import { usePathname } from "next/navigation";

/**
 * LogoController - Single logo instance with smooth trigger-based transition
 * 
 * Animation:
 * - Homepage: large and in upper portion of hero, animates to navbar on scroll
 * - Other pages: Always docked in navbar
 * - Trigger: Any scroll > 50px triggers the animation on homepage
 * - Animation: Smoothly and slowly transitions to navbar over 1.5 seconds
 * - Font: Barlow Condensed Light (tall, slim)
 * - Color: White on dark slides, black on light slides
 */
export function LogoController() {
    const [mounted, setMounted] = useState(false);
    const [isAnimating, setIsAnimating] = useState(false);
    const [isMobile, setIsMobile] = useState(false);
    const shouldReduceMotion = useReducedMotion();
    const { isDarkSlide } = useSlide();
    const pathname = usePathname();
    const isHomePage = pathname === '/';

    const { scrollY } = useScroll();

    // Detect mobile screen size
    useEffect(() => {
        const checkMobile = () => {
            setIsMobile(window.innerWidth < 768);
        };
        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    useEffect(() => {
        setMounted(true);
        // If not on homepage, immediately set to animating (docked) state
        if (!isHomePage) {
            setIsAnimating(true);
        }
    }, [isHomePage]);

    // Listen for scroll and trigger animation (only on homepage)
    useEffect(() => {
        if (!mounted || !isHomePage) return;

        const unsubscribe = scrollY.on('change', (latest) => {
            // Trigger animation when scroll passes 50px
            if (latest > 50 && !isAnimating) {
                setIsAnimating(true);
            }
            // Reset if scrolled back to top
            if (latest <= 10 && isAnimating) {
                setIsAnimating(false);
            }
        });

        return () => unsubscribe();
    }, [scrollY, isAnimating, mounted, isHomePage]);

    if (!mounted) return null;

    // Determine color based on animation state and page
    const getLogoColor = () => {
        if (isAnimating) {
            return "#000000"; // Black when docked in navbar
        }
        // White when in hero section (large, not docked) - visible on dark backgrounds
        // Also white on products page before scroll (translucent navbar)
        return "#ffffff";
    };

    // Animation variants for smooth transition (only on homepage)
    // On mobile: less travel distance from initial position
    // On desktop: original animation
    const logoVariantsMobile = {
        initial: {
            scale: 1.8,
            y: 80, // Reduced from 150 for less travel on mobile
        },
        docked: {
            scale: 0.85,
            y: 8, // Same as desktop - proper navbar position
        }
    };

    const logoVariantsDesktop = {
        initial: {
            scale: 2.5,
            y: 150,
        },
        docked: {
            scale: 0.85,
            y: 8,
        }
    };

    // Use mobile variants on mobile, desktop variants on desktop
    const logoVariants = isMobile ? logoVariantsMobile : logoVariantsDesktop;

    return (
        <motion.div
            style={{
                position: "fixed",
                left: "50%",
                x: "-50%",
                top: 0,
                zIndex: 60, // Higher than navbar (z-50) but lower than menu (z-110)
                color: getLogoColor(),
                transition: "color 0.3s ease",
            }}
            initial={isHomePage ? "initial" : "docked"}
            animate={isAnimating ? "docked" : (isHomePage ? "initial" : "docked")}
            variants={shouldReduceMotion || !isHomePage ? undefined : logoVariants}
            transition={isHomePage ? {
                duration: 0.6,
                ease: [0.25, 0.1, 0.25, 1]
            } : undefined}
            className="pointer-events-auto"
        >
            <a
                href="#home"
                className="block text-4xl md:text-5xl whitespace-nowrap hover:opacity-70 transition-opacity"
                style={{
                    fontFamily: "'Barlow Condensed', 'Arial Narrow', sans-serif",
                    fontWeight: 300,
                    letterSpacing: '0.15em'
                }}
            >
                3 Layered
            </a>
        </motion.div>
    );
}

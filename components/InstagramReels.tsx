"use client";

import { motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";

const REELS = [
    {
        id: 1,
        url: "https://www.instagram.com/reel/DT7JeZ-DJSN/",
        embedUrl: "https://www.instagram.com/reel/DT7JeZ-DJSN/embed",
    },
    {
        id: 2,
        url: "https://www.instagram.com/reel/DT4plTqjDUC/",
        embedUrl: "https://www.instagram.com/reel/DT4plTqjDUC/embed",
    },
    {
        id: 3,
        url: "https://www.instagram.com/reel/DT2BHPriciE/",
        embedUrl: "https://www.instagram.com/reel/DT2BHPriciE/embed",
    },
    {
        id: 4,
        url: "https://www.instagram.com/reel/DTzbr27jBJ7/",
        embedUrl: "https://www.instagram.com/reel/DTzbr27jBJ7/embed",
    },
];

function ReelCard({ reel, index }: { reel: typeof REELS[0], index: number }) {
    const iframeRef = useRef<HTMLIFrameElement>(null);
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const iframe = iframeRef.current;
        if (!iframe) return;

        // Create IntersectionObserver to detect when reel is visible
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    setIsVisible(entry.isIntersecting);

                    // When reel comes into view, reload iframe to trigger autoplay
                    if (entry.isIntersecting && iframe.src) {
                        // Add autoplay parameter to Instagram embed URL
                        const currentSrc = iframe.src;
                        if (!currentSrc.includes('?')) {
                            iframe.src = currentSrc + '?autoplay=1';
                        }
                    }
                });
            },
            {
                threshold: 0.5, // Trigger when 50% of the reel is visible
                rootMargin: '0px'
            }
        );

        observer.observe(iframe);

        return () => {
            observer.disconnect();
        };
    }, []);

    return (
        <motion.div
            className="aspect-[9/16] bg-white border border-[#E8E1D5] hover:border-amber-700/50 hover:shadow-[0_15px_30px_rgba(60,40,30,0.15)] transition-all cursor-pointer overflow-hidden group rounded-xl shadow-sm hover:-translate-y-2"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{
                duration: 0.6,
                delay: 0.3 + (index * 0.1),
                ease: [0.25, 0.1, 0.25, 1]
            }}
        >
            <a
                href={reel.url}
                target="_blank"
                rel="noopener noreferrer"
                className="block w-full h-full"
                aria-label={`View Instagram reel showcasing 3D printed miniature temples and architectural models by 3 Layered`}
            >
                <iframe
                    ref={iframeRef}
                    src={reel.embedUrl}
                    className="w-full h-full"
                    frameBorder="0"
                    scrolling="no"
                    allow="autoplay; encrypted-media"
                    title={`3 Layered Instagram Reel ${index + 1} - 3D Printing Showcase`}
                    aria-label="Instagram video player showing 3D printed temple and architectural model creation"
                />
            </a>
        </motion.div>
    );
}

export function InstagramReels() {
    return (
        <section className="relative py-16 md:py-32 px-4 sm:px-6 bg-[#FAF7F2] overflow-hidden">
            {/* Subtle Temple Pillar Pattern */}
            <div className="absolute inset-0 z-0 opacity-[0.02] pointer-events-none" style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg width='160' height='320' viewBox='0 0 160 320' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M60 0 L100 0 L100 20 L110 30 L110 60 L100 70 L100 280 L120 290 L120 320 L40 320 L40 290 L60 280 L60 70 L50 60 L50 30 L60 20 Z' fill='none' stroke='%234A3121' stroke-width='1.5'/%3E%3Cpath d='M70 70 L90 70 M70 140 L90 140 M70 210 L90 210 M70 280 L90 280' stroke='%234A3121' stroke-width='1'/%3E%3Ccircle cx='80' cy='45' r='5' fill='none' stroke='%234A3121' stroke-width='1'/%3E%3C/svg%3E")`,
                backgroundSize: '160px 320px',
            }} />

            <div className="relative z-10 max-w-7xl mx-auto">
                <div className="flex flex-col items-center text-center">
                    <div className="flex items-center gap-4 mb-4">
                        <span className="w-12 h-[1px] bg-amber-800/40"></span>
                        <span className="text-amber-900 font-semibold tracking-[0.2em] uppercase text-xs md:text-sm">
                            Behind the Scenes
                        </span>
                        <span className="w-12 h-[1px] bg-amber-800/40"></span>
                    </div>

                    <motion.h2
                        className="font-serif text-3xl sm:text-4xl md:text-6xl lg:text-7xl font-bold mb-6 text-[#2A2320]"
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "-100px" }}
                        transition={{ duration: 0.8 }}
                    >
                        Our Work in Action
                    </motion.h2>
                    <motion.p
                        className="text-gray-500 mb-8 md:mb-16 text-base md:text-lg font-light max-w-2xl"
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "-100px" }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                    >
                        Follow our journey on{" "}
                        <a href="https://www.instagram.com/3layered.global?igsh=MTZ5bjR0MXBidXNyZQ==" target="_blank" rel="noopener noreferrer" className="text-amber-700 underline hover:no-underline font-medium hover:text-amber-900 transition-colors">
                            Instagram
                        </a>
                    </motion.p>
                </div>

                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 md:gap-8">
                    {REELS.map((reel, index) => (
                        <ReelCard key={reel.id} reel={reel} index={index} />
                    ))}
                </div>
            </div>
        </section>
    );
}

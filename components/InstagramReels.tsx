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
            className="aspect-[9/16] bg-white border border-gray-200 hover:border-black transition-all cursor-pointer overflow-hidden group rounded-lg shadow-sm"
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
        <section className="py-12 md:py-32 px-4 sm:px-6 bg-gray-50">
            <div className="max-w-7xl mx-auto">
                <motion.h2
                    className="font-serif text-3xl sm:text-4xl md:text-6xl lg:text-7xl font-bold text-center mb-6"
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ duration: 0.8 }}
                >
                    Our Work in Action
                </motion.h2>
                <motion.p
                    className="text-center text-gray-600 mb-8 md:mb-20 text-base md:text-lg"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                >
                    Follow our journey on{" "}
                    <a href="https://www.instagram.com/3layered.global?igsh=MTZ5bjR0MXBidXNyZQ==" target="_blank" rel="noopener noreferrer" className="underline hover:no-underline font-medium">
                        Instagram
                    </a>
                </motion.p>

                <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
                    {REELS.map((reel, index) => (
                        <ReelCard key={reel.id} reel={reel} index={index} />
                    ))}
                </div>
            </div>
        </section>
    );
}

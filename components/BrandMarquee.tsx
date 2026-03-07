"use client";

import { useEffect, useRef } from "react";

const BRANDS = [
    "ideal Brandzz",
    "Bella Homes",
    "Smile gifts",
    "Mittal Precision Steel Autocom Pvt Ltd",
];

export function BrandMarquee() {
    const scrollerRef = useRef<HTMLDivElement>(null);

    return (
        <section id="work" className="py-16 border-t border-b border-[#E8E1D5] bg-[#FDFBF7] overflow-hidden">
            <p className="text-center text-xs md:text-sm uppercase tracking-[0.25em] font-semibold text-amber-900/50 mb-10">
                Trusted by Industry Leaders
            </p>

            <div
                ref={scrollerRef}
                className="group flex gap-16 overflow-hidden"
                style={{ maskImage: "linear-gradient(to right, transparent, black 10%, black 90%, transparent)" }}
            >
                {/* First set of brands */}
                <div className="flex gap-16 animate-marquee group-hover:[animation-play-state:paused]">
                    {BRANDS.map((brand, index) => (
                        <div
                            key={`${brand}-1-${index}`}
                            className="flex items-center justify-center min-w-[200px]"
                        >
                            <span className="text-2xl md:text-3xl font-serif font-bold bg-gradient-to-r from-[#DFB374] to-[#C99144] bg-clip-text text-transparent opacity-60 hover:opacity-100 transition-opacity duration-300 whitespace-nowrap">
                                {brand}
                            </span>
                        </div>
                    ))}
                </div>

                {/* Duplicate set for seamless loop */}
                <div className="flex gap-16 animate-marquee group-hover:[animation-play-state:paused]">
                    {BRANDS.map((brand, index) => (
                        <div
                            key={`${brand}-2-${index}`}
                            className="flex items-center justify-center min-w-[200px]"
                        >
                            <span className="text-2xl md:text-3xl font-serif font-bold bg-gradient-to-r from-[#DFB374] to-[#C99144] bg-clip-text text-transparent opacity-60 hover:opacity-100 transition-opacity duration-300 whitespace-nowrap">
                                {brand}
                            </span>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}

"use client";

import { useRef, useState } from "react";

const BRANDS = [
    { name: "ideal Brandzz", url: "https://www.instagram.com/idealbrandzz?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw==" },
    { name: "Bella Homes", url: "https://bellahomesinteriorss.com/" },
    { name: "Aaina Gifting", url: "https://aainagifting.com/" },
    { name: "Mittal Precision Steel Autocom Pvt Ltd", url: "https://vasantgroup.com/industries/mittal-precision-autocomps-pvt-ltd/" },
    { name: "Vasant Group", url: "https://vasantgroup.com/" },
    { name: "DY Patil International University", url: "https://www.dypiu.ac.in/" },
    { name: "Choice Gallery", url: "https://www.mychoicegallery.com/" },
];

export function BrandMarquee() {
    const scrollerRef = useRef<HTMLDivElement>(null);
    const [paused, setPaused] = useState(false);

    return (
        <section id="work" className="py-16 border-t border-b border-[#E8E1D5] bg-[#FDFBF7] overflow-hidden">
            <p className="text-center text-xs md:text-sm uppercase tracking-[0.25em] font-semibold text-amber-900/50 mb-10">
                Trusted by Industry Leaders
            </p>

            <div
                ref={scrollerRef}
                className="flex gap-16 overflow-hidden"
                style={{ maskImage: "linear-gradient(to right, transparent, black 10%, black 90%, transparent)" }}
                onMouseEnter={() => setPaused(true)}
                onMouseLeave={() => setPaused(false)}
            >
                {/* First set of brands */}
                <div
                    className="flex gap-16 animate-marquee"
                    style={{ animationPlayState: paused ? 'paused' : 'running' }}
                >
                    {BRANDS.map((brand, index) => (
                        <div
                            key={`${brand.name}-1-${index}`}
                            className="flex items-center justify-center min-w-[200px]"
                        >
                            <a
                                href={brand.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-2xl md:text-3xl font-serif font-bold bg-gradient-to-r from-[#DFB374] to-[#C99144] bg-clip-text text-transparent opacity-60 hover:opacity-100 transition-opacity duration-300 whitespace-nowrap"
                            >
                                {brand.name}
                            </a>
                        </div>
                    ))}
                </div>

                {/* Duplicate set for seamless loop */}
                <div
                    className="flex gap-16 animate-marquee"
                    style={{ animationPlayState: paused ? 'paused' : 'running' }}
                >
                    {BRANDS.map((brand, index) => (
                        <div
                            key={`${brand.name}-2-${index}`}
                            className="flex items-center justify-center min-w-[200px]"
                        >
                            <a
                                href={brand.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-2xl md:text-3xl font-serif font-bold bg-gradient-to-r from-[#DFB374] to-[#C99144] bg-clip-text text-transparent opacity-60 hover:opacity-100 transition-opacity duration-300 whitespace-nowrap"
                            >
                                {brand.name}
                            </a>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}

"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Upload, FileCheck, Settings } from "lucide-react";

const STEPS = [
    {
        icon: Upload,
        title: "Upload",
        description: "Share your design files or specifications",
    },
    {
        icon: FileCheck,
        title: "Quote",
        description: "Receive a detailed quote within 24 hours",
    },
    {
        icon: Settings,
        title: "Manufacture",
        description: "We precision-print and deliver to your door",
    },
];

export function CustomPrintCTA() {
    return (
        <section className="relative py-16 md:py-32 px-4 sm:px-6 bg-[#1A110B] text-[#E8E1D5] overflow-hidden">
            {/* Subtle Mandala Background Pattern */}
            <div className="absolute inset-0 z-0 opacity-[0.05] pointer-events-none" style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg width='120' height='120' viewBox='0 0 120 120' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M60 0 A60 60 0 0 1 120 60 A60 60 0 0 1 60 120 A60 60 0 0 1 0 60 A60 60 0 0 1 60 0' fill='none' stroke='%23ffffff' stroke-width='2'/%3E%3Cpath d='M60 15 A45 45 0 0 1 105 60 A45 45 0 0 1 60 105 A45 45 0 0 1 15 60 A45 45 0 0 1 60 15' fill='none' stroke='%23ffffff' stroke-width='1.5'/%3E%3Cpath d='M60 30 A30 30 0 0 1 90 60 A30 30 0 0 1 60 90 A30 30 0 0 1 30 60 A30 30 0 0 1 60 30' fill='none' stroke='%23ffffff' stroke-width='1'/%3E%3Cpath d='M60 0 L60 120 M0 60 L120 60 M17.57 17.57 L102.43 102.43 M17.57 102.43 L102.43 17.57' stroke='%23ffffff' stroke-width='1'/%3E%3C/svg%3E")`,
                backgroundSize: '300px 300px',
                backgroundPosition: 'center',
            }} />
            
            <div className="relative z-10 max-w-6xl mx-auto">
                <div className="flex flex-col items-center text-center mb-8">
                    <div className="flex items-center gap-4 mb-4">
                        <span className="w-12 h-[1px] bg-[#DFB374]/30"></span>
                        <span className="text-[#DFB374] font-semibold tracking-[0.2em] uppercase text-xs md:text-sm">
                            Tailored For You
                        </span>
                        <span className="w-12 h-[1px] bg-[#DFB374]/30"></span>
                    </div>
                    <motion.h2
                        className="font-serif text-3xl sm:text-4xl md:text-6xl lg:text-7xl font-bold mb-6 text-white"
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "-100px" }}
                        transition={{ duration: 0.8 }}
                    >
                        Custom Printing Made Simple
                    </motion.h2>
                    <motion.p
                        className="text-[#E8E1D5]/80 text-base md:text-xl font-light"
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "-100px" }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                    >
                        From your design to finished product in three straightforward steps
                    </motion.p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-16 mb-12 md:mb-20">
                    {STEPS.map((step, index) => {
                        const Icon = step.icon;
                        return (
                            <motion.div
                                key={step.title}
                                className="text-center"
                                initial={{ opacity: 0, y: 40 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true, margin: "-100px" }}
                                transition={{
                                    duration: 0.6,
                                    delay: 0.3 + (index * 0.15),
                                    ease: [0.25, 0.1, 0.25, 1]
                                }}
                            >
                                <div className="inline-flex items-center justify-center w-16 h-16 md:w-20 md:h-20 rounded-full border border-[#DFB374]/40 bg-[#2A1B12]/80 backdrop-blur-sm mb-6 md:mb-8 group-hover:scale-110 group-hover:border-[#DFB374] transition-all duration-300">
                                    <Icon className="w-7 h-7 md:w-9 md:h-9 text-[#DFB374]" />
                                </div>
                                <h3 className="text-xl md:text-2xl font-bold mb-3 md:mb-4 text-white">
                                    {index + 1}. {step.title}
                                </h3>
                                <p className="text-base md:text-lg text-[#E8E1D5]/70 leading-relaxed font-light">{step.description}</p>
                            </motion.div>
                        );
                    })}
                </div>

                <motion.div
                    className="text-center"
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ duration: 0.8, delay: 0.8 }}
                >
                    <Link href="/custom-print" className="inline-block px-10 md:px-14 py-4 md:py-5 bg-gradient-to-r from-[#DFB374] to-[#C99144] text-[#1A110B] text-base md:text-lg font-bold hover:shadow-[0_0_20px_rgba(223,179,116,0.2)] hover:scale-105 transition-all duration-300 rounded-full shadow-lg group relative overflow-hidden">
                        <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/40 to-transparent -translate-x-full group-hover:animate-[shimmer_1.5s_infinite]" />
                        <span className="relative z-10 flex items-center justify-center gap-2">
                            Request a Custom Print
                            <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
                        </span>
                    </Link>
                </motion.div>
            </div>
        </section>
    );
}

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
        <section className="py-16 md:py-32 px-6 bg-black text-white">
            <div className="max-w-6xl mx-auto">
                <motion.h2
                    className="font-serif text-3xl sm:text-4xl md:text-6xl lg:text-7xl font-bold text-center mb-6"
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ duration: 0.8 }}
                >
                    Custom Printing Made Simple
                </motion.h2>
                <motion.p
                    className="text-center text-gray-300 mb-20 text-xl"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                >
                    From your design to finished product in three straightforward steps
                </motion.p>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-16 mb-12 md:mb-20">
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
                                <div className="inline-flex items-center justify-center w-16 h-16 md:w-20 md:h-20 rounded-full border-2 border-white mb-6 md:mb-8 group-hover:scale-110 transition-transform">
                                    <Icon className="w-7 h-7 md:w-9 md:h-9" />
                                </div>
                                <h3 className="text-xl md:text-2xl lg:text-3xl font-bold mb-3 md:mb-4">
                                    {index + 1}. {step.title}
                                </h3>
                                <p className="text-base md:text-lg text-gray-300 leading-relaxed">{step.description}</p>
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
                    <Link href="/custom-print" className="inline-block px-10 md:px-14 py-4 md:py-5 bg-white text-black text-base md:text-lg font-medium hover:bg-gray-100 transition-colors duration-200 rounded">
                        Request a Custom Print
                    </Link>
                </motion.div>
            </div>
        </section>
    );
}

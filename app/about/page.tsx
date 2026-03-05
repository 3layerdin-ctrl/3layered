'use client';

import { Navbar } from '@/components/Navbar';
import { SlideProvider } from '@/contexts/SlideContext';
import Image from 'next/image';
import { ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { motion } from 'framer-motion';

export default function AboutPage() {
    return (
        <SlideProvider>
            <Navbar />
            <main className="min-h-screen bg-white">
                {/* Hero Section */}
                <section className="pt-24 md:pt-32 pb-12 md:pb-24 px-4 sm:px-6 lg:px-8">
                    <div className="max-w-4xl mx-auto text-center">
                        <h1 className="font-serif text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-bold mb-4 md:mb-8 tracking-tight">
                            About 3 Layered
                        </h1>
                        <p className="text-xl md:text-3xl text-gray-600 font-light leading-relaxed">
                            Where architectural philosophy meets modern manufacturing
                        </p>
                    </div>
                </section>

                {/* Philosophy Section */}
                <section className="py-24 bg-gray-50">
                    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="mb-16">
                            <h2 className="font-serif text-3xl sm:text-4xl md:text-6xl font-bold mb-12 text-center">
                                Our Philosophy
                            </h2>
                            <div className="space-y-8 text-lg md:text-xl leading-relaxed text-gray-700">
                                <p className="font-light">
                                    3 Layered was built at the intersection of custom manufacturing and Asian architectural design philosophy.
                                </p>
                                <p className="font-light">
                                    Traditional Asian architecture is defined by <span className="text-black font-medium">balance</span>, <span className="text-black font-medium">proportion</span>, and <span className="text-black font-medium">intentional restraint</span>. Every element serves a purpose. Nothing exists without reason. These principles closely mirror how effective custom manufacturing should operate—precise, deliberate, and outcome-driven.
                                </p>
                                <p className="font-light">
                                    At 3 Layered, we reinterpret these architectural foundations through modern fabrication. Using advanced custom printing and manufacturing processes, we translate timeless structural logic into contemporary parts, products, and forms. The result is work that feels grounded yet modern—designed with clarity, engineered with discipline, and executed with precision.
                                </p>
                                <p className="font-light">
                                    Our approach is not about decoration or replication. It is about reviving architectural principles through function, applying them to custom-built components that perform in real-world applications.
                                </p>
                            </div>
                        </div>

                        {/* Manifesto Quote */}
                        <div className="border-l-4 border-black pl-8 py-6 my-16">
                            <p className="text-2xl md:text-3xl font-light italic text-gray-900 mb-4">
                                "This is custom manufacturing informed by architecture—where tradition guides structure, and modern technology delivers execution."
                            </p>
                        </div>
                    </div>
                </section>

                {/* Core Principles */}
                <section className="py-24 bg-white">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <h2 className="font-serif text-3xl sm:text-4xl md:text-6xl font-bold mb-16 text-center">
                            Three Core Principles
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                            {/* Principle 1 */}
                            <div className="text-center">
                                <div className="w-20 h-20 bg-black text-white rounded-full flex items-center justify-center text-3xl font-serif font-bold mx-auto mb-6">
                                    1
                                </div>
                                <h3 className="font-serif text-2xl font-bold mb-4">Balance</h3>
                                <p className="text-gray-600 leading-relaxed">
                                    Every element exists in harmony with the whole. Form and function are inseparable, each supporting the other with purposeful precision.
                                </p>
                            </div>

                            {/* Principle 2 */}
                            <div className="text-center">
                                <div className="w-20 h-20 bg-black text-white rounded-full flex items-center justify-center text-3xl font-serif font-bold mx-auto mb-6">
                                    2
                                </div>
                                <h3 className="font-serif text-2xl font-bold mb-4">Proportion</h3>
                                <p className="text-gray-600 leading-relaxed">
                                    Relationships matter. Scale, ratio, and spatial logic define our work—creating pieces that feel correct, not just complete.
                                </p>
                            </div>

                            {/* Principle 3 */}
                            <div className="text-center">
                                <div className="w-20 h-20 bg-black text-white rounded-full flex items-center justify-center text-3xl font-serif font-bold mx-auto mb-6">
                                    3
                                </div>
                                <h3 className="font-serif text-2xl font-bold mb-4">Restraint</h3>
                                <p className="text-gray-600 leading-relaxed">
                                    Excellence through elimination. We remove the unnecessary to reveal what truly matters—clarity over complexity.
                                </p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Founder Section */}
                <section className="py-24 bg-gray-50">
                    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                            {/* Founder Image */}
                            <div className="order-2 lg:order-1">
                                <div className="aspect-[4/5] bg-gray-200 relative overflow-hidden">
                                    <Image
                                        src="https://jwgtjfmwlnttjdvycuqj.supabase.co/storage/v1/object/public/displlay/about%20page/Founder/IMG_0127.JPG"
                                        alt="Jay Gehlot - Founder of 3 Layered"
                                        fill
                                        className="object-cover"
                                        priority
                                    />
                                </div>
                            </div>

                            {/* Content */}
                            <div className="order-1 lg:order-2">
                                <div className="mb-8">
                                    <p className="text-sm uppercase tracking-widest text-gray-500 mb-4">Founder</p>
                                    <h2 className="font-serif text-3xl sm:text-4xl md:text-6xl font-bold mb-6">
                                        Jay Gehlot
                                    </h2>
                                </div>

                                <div className="space-y-6 text-lg text-gray-700 leading-relaxed">
                                    <p className="font-light">
                                        Jay Gehlot founded 3 Layered with a singular vision: to bring the timeless principles of Asian architectural thought into the realm of modern custom manufacturing.
                                    </p>
                                    <p className="font-light">
                                        Drawing from years of studying traditional temple construction, sacred geometry, and structural philosophy, Jay recognized that the same principles that created enduring monuments could revolutionize how we approach contemporary fabrication.
                                    </p>
                                    <p className="font-light">
                                        His background bridges design theory and practical engineering—understanding both why a form should exist and how to bring it into physical reality with uncompromising precision.
                                    </p>
                                    <p className="font-light">
                                        At 3 Layered, Jay has created a space where ancient architectural wisdom informs cutting-edge manufacturing—producing work that honors tradition while pushing the boundaries of what custom fabrication can achieve.
                                    </p>
                                </div>

                                <div className="mt-8 pt-8 border-t border-gray-200">
                                    <p className="text-sm text-gray-500 italic">
                                        "We're not just making parts. We're translating centuries of architectural philosophy into physical form—one precision component at a time."
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* What We Create - Expanded Premium Version */}
                <section className="py-16 md:py-32 bg-white">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <motion.h2
                            className="font-serif text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-bold mb-12 md:mb-24 text-center"
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: "-100px" }}
                            transition={{ duration: 0.8 }}
                        >
                            What We Create
                        </motion.h2>

                        <div className="space-y-16 md:space-y-32">
                            {/* Category 1: Architectural Miniatures */}
                            <motion.div
                                className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center"
                                initial={{ opacity: 0, y: 50 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true, margin: "-100px" }}
                                transition={{ duration: 0.8, delay: 0.2 }}
                            >
                                <div className="order-2 lg:order-1">
                                    <div className="aspect-[4/3] relative overflow-hidden bg-gray-100">
                                        <Image
                                            src="/miniature_temples_showcase_1768254332054.png"
                                            alt="Museum-quality miniature temple replicas"
                                            fill
                                            className="object-cover"
                                        />
                                    </div>
                                </div>
                                <motion.div
                                    className="order-1 lg:order-2"
                                    initial={{ opacity: 0, x: 50 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    viewport={{ once: true, margin: "-100px" }}
                                    transition={{ duration: 0.8, delay: 0.4 }}
                                >
                                    <div className="space-y-6">
                                        <p className="text-sm uppercase tracking-widest text-gray-500">Category 01</p>
                                        <h3 className="font-serif text-3xl sm:text-4xl md:text-6xl font-bold leading-tight">
                                            Architectural Miniatures
                                        </h3>
                                        <div className="w-24 h-1 bg-black"></div>
                                        <p className="text-xl text-gray-700 leading-relaxed">
                                            Museum-quality replicas of world heritage temples and sacred structures. Each piece is meticulously engineered with precision and finished by hand, capturing centuries of architectural wisdom in miniature form.
                                        </p>
                                        <p className="text-lg text-gray-600 leading-relaxed">
                                            From the golden spires of Asian pagodas to the intricate carvings of ancient temples, we transform architectural heritage into tangible art. Every detail is preserved, every proportion honored.
                                        </p>
                                        <Link
                                            href="/products/category/miniature-temples"
                                            className="inline-flex items-center gap-3 text-lg font-medium border-b-2 border-black pb-1 hover:opacity-60 transition-opacity mt-8"
                                        >
                                            Explore Collection <ArrowRight className="w-5 h-5" />
                                        </Link>
                                    </div>
                                </motion.div>
                            </motion.div>

                            {/* Category 2: Custom Print */}
                            <motion.div
                                className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center"
                                initial={{ opacity: 0, y: 50 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true, margin: "-100px" }}
                                transition={{ duration: 0.8, delay: 0.2 }}
                            >
                                <motion.div
                                    initial={{ opacity: 0, x: -50 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    viewport={{ once: true, margin: "-100px" }}
                                    transition={{ duration: 0.8, delay: 0.4 }}
                                >
                                    <div className="space-y-6">
                                        <p className="text-sm uppercase tracking-widest text-gray-500">Category 02</p>
                                        <h3 className="font-serif text-3xl sm:text-4xl md:text-6xl font-bold leading-tight">
                                            Custom Print
                                        </h3>
                                        <div className="w-24 h-1 bg-black"></div>
                                        <p className="text-xl text-gray-700 leading-relaxed">
                                            Transform your ideas into reality with our custom 3D printing service. From concept to finished product, we bring your unique designs to life with precision and care.
                                        </p>
                                        <p className="text-lg text-gray-600 leading-relaxed">
                                            Whether you need a one-off prototype, replacement parts, or custom gifts, our team works with you through every step. Upload your design or work with us to create it, and we'll handle the rest with professional-grade materials and finishes.
                                        </p>
                                        <Link
                                            href="/custom-print"
                                            className="inline-flex items-center gap-3 text-lg font-medium border-b-2 border-black pb-1 hover:opacity-60 transition-opacity mt-8"
                                        >
                                            Get Started <ArrowRight className="w-5 h-5" />
                                        </Link>
                                    </div>
                                </motion.div>
                                <div>
                                    <div className="aspect-[4/3] relative overflow-hidden bg-gray-100">
                                        <Image
                                            src="/custom_parts_showcase_1768254367741.png"
                                            alt="Custom 3D printing service"
                                            fill
                                            className="object-cover"
                                        />
                                    </div>
                                </div>
                            </motion.div>

                            {/* Category 3: Custom Parts */}
                            <motion.div
                                className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center"
                                initial={{ opacity: 0, y: 50 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true, margin: "-100px" }}
                                transition={{ duration: 0.8, delay: 0.2 }}
                            >
                                <div className="order-2 lg:order-1">
                                    <div className="aspect-[4/3] relative overflow-hidden bg-gray-100">
                                        <Image
                                            src="/custom_parts_showcase_1768254367741.png"
                                            alt="Bespoke custom-manufactured parts"
                                            fill
                                            className="object-cover"
                                        />
                                    </div>
                                </div>
                                <motion.div
                                    className="order-1 lg:order-2"
                                    initial={{ opacity: 0, x: 50 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    viewport={{ once: true, margin: "-100px" }}
                                    transition={{ duration: 0.8, delay: 0.4 }}
                                >
                                    <div className="space-y-6">
                                        <p className="text-sm uppercase tracking-widest text-gray-500">Category 03</p>
                                        <h3 className="font-serif text-3xl sm:text-4xl md:text-6xl font-bold leading-tight">
                                            Custom Parts
                                        </h3>
                                        <div className="w-24 h-1 bg-black"></div>
                                        <p className="text-xl text-gray-700 leading-relaxed">
                                            Bespoke manufacturing solutions for specialized components. From unique brackets and housings to one-of-a-kind mechanical assemblies, we bring impossible-to-source parts into existence.
                                        </p>
                                        <p className="text-lg text-gray-600 leading-relaxed">
                                            When off-the-shelf won't work, we engineer custom. Every part is manufactured to your exact specifications, with material selection and finishing options to match your application requirements.
                                        </p>
                                        <Link
                                            href="/products/category/custom-parts"
                                            className="inline-flex items-center gap-3 text-lg font-medium border-b-2 border-black pb-1 hover:opacity-60 transition-opacity mt-8"
                                        >
                                            Request Custom Parts <ArrowRight className="w-5 h-5" />
                                        </Link>
                                    </div>
                                </motion.div>
                            </motion.div>
                        </div>
                    </div>
                </section>

                {/* CTA Section */}
                <section className="py-24 bg-black text-white">
                    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                        <h2 className="font-serif text-4xl md:text-5xl font-bold mb-6">
                            Ready to Create Something Exceptional?
                        </h2>
                        <p className="text-xl text-gray-300 font-light mb-12 leading-relaxed">
                            Whether you're looking for architectural miniatures or custom manufacturing solutions, we bring the same precision to every project.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <Link
                                href="/products/category/miniature-temples"
                                className="inline-block bg-white text-black px-8 py-4 text-lg font-light hover:bg-gray-100 transition-colors"
                            >
                                Browse Products
                            </Link>
                            <Link
                                href="/custom-print"
                                className="inline-block border-2 border-white text-white px-8 py-4 text-lg font-light hover:bg-white hover:text-black transition-colors"
                            >
                                Start Custom Project
                            </Link>
                        </div>
                    </div>
                </section>
            </main>
        </SlideProvider>
    );
}

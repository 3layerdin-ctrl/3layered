'use client';

import { Navbar } from '@/components/Navbar';
import { SlideProvider } from '@/contexts/SlideContext';
import { FileText, CheckCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import Link from 'next/link';

export default function TermsPage() {
    return (
        <SlideProvider>
            <Navbar />
            <main className="min-h-screen bg-[#FAF7F2] pt-24 pb-16">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                    {/* Header */}
                    <div className="text-center mb-12">
                        <div className="inline-flex items-center justify-center w-20 h-20 bg-[#1A110B] text-[#E8E1D5] rounded-full mb-6">
                            <FileText className="w-10 h-10" />
                        </div>
                        <h1 className="font-serif text-5xl md:text-6xl font-bold mb-4 text-[#1A110B]">
                            Terms & Conditions
                        </h1>
                        <p className="text-[#2A2320]/70 text-lg">
                            Last updated: January 13, 2026
                        </p>
                    </div>

                    {/* Content */}
                    <div className="bg-white border border-[#E8E1D5] rounded-xl shadow-sm p-8 md:p-12 space-y-8">
                        <section>
                            <h2 className="font-serif text-2xl font-bold mb-4 text-[#1A110B]">1. Agreement to Terms</h2>
                            <p className="text-[#2A2320]/80 leading-relaxed mb-4">
                                By accessing and using 3 Layered's services, you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to abide by the above, please do not use this service.
                            </p>
                        </section>

                        <section>
                            <h2 className="font-serif text-2xl font-bold mb-4">2. Services Description</h2>
                            <p className="text-gray-700 leading-relaxed mb-4">
                                3 Layered provides premium 3D printing services including but not limited to:
                            </p>
                            <ul className="space-y-2 ml-6">
                                <li className="flex items-start gap-3">
                                    <CheckCircle className="w-5 h-5 text-black mt-0.5 flex-shrink-0" />
                                    <span className="text-gray-700">Custom 3D printing and prototyping</span>
                                </li>
                                <li className="flex items-start gap-3">
                                    <CheckCircle className="w-5 h-5 text-black mt-0.5 flex-shrink-0" />
                                    <span className="text-gray-700">Miniature temples and architectural models</span>
                                </li>
                                <li className="flex items-start gap-3">
                                    <CheckCircle className="w-5 h-5 text-black mt-0.5 flex-shrink-0" />
                                    <span className="text-gray-700">Design consultation and technical support</span>
                                </li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="font-serif text-2xl font-bold mb-4">3. Orders and Payments</h2>
                            <p className="text-gray-700 leading-relaxed mb-4">
                                All orders are subject to acceptance and availability. Prices are subject to change without notice. Payment terms will be specified in your quote or invoice. We accept various payment methods as specified during the checkout process.
                            </p>
                        </section>

                        <section>
                            <h2 className="font-serif text-2xl font-bold mb-4">4. Intellectual Property</h2>
                            <p className="text-gray-700 leading-relaxed mb-4">
                                You retain all rights to your submitted designs and files. By submitting files for printing, you grant us permission to use them solely for the purpose of fulfilling your order. We respect your intellectual property and will not share your designs with third parties without your explicit consent.
                            </p>
                        </section>

                        <section>
                            <h2 className="font-serif text-2xl font-bold mb-4">5. Quality Assurance</h2>
                            <p className="text-gray-700 leading-relaxed mb-4">
                                We strive for the highest quality in all our prints. However, 3D printing technology has inherent limitations. We will work with you to ensure your satisfaction, but we cannot guarantee absolute perfection in every print.
                            </p>
                        </section>

                        <section>
                            <h2 className="font-serif text-2xl font-bold mb-4">6. Delivery and Shipping</h2>
                            <p className="text-gray-700 leading-relaxed mb-4">
                                Delivery times are estimates and not guaranteed. We will make reasonable efforts to meet quoted delivery times. Shipping costs are the responsibility of the customer unless otherwise agreed upon.
                            </p>
                        </section>

                        <section>
                            <h2 className="font-serif text-2xl font-bold mb-4">7. Returns and Refunds</h2>
                            <p className="text-gray-700 leading-relaxed mb-4">
                                Due to the custom nature of our services, returns are evaluated on a case-by-case basis. If there is a manufacturing defect or error on our part, we will work with you to resolve the issue, which may include reprinting or refunding.
                            </p>
                        </section>

                        <section>
                            <h2 className="font-serif text-2xl font-bold mb-4">8. Limitation of Liability</h2>
                            <p className="text-gray-700 leading-relaxed mb-4">
                                To the maximum extent permitted by law, 3 Layered shall not be liable for any indirect, incidental, special, consequential, or punitive damages resulting from your use of our services.
                            </p>
                        </section>

                        <section>
                            <h2 className="font-serif text-2xl font-bold mb-4">9. Modifications to Terms</h2>
                            <p className="text-gray-700 leading-relaxed mb-4">
                                We reserve the right to modify these terms at any time. Changes will be effective immediately upon posting to our website. Your continued use of our services constitutes acceptance of modified terms.
                            </p>
                        </section>

                        <section>
                            <h2 className="font-serif text-2xl font-bold mb-4">10. Contact Information</h2>
                            <p className="text-gray-700 leading-relaxed mb-4">
                                For questions about these Terms & Conditions, please contact us:
                            </p>
                            <div className="bg-gray-50 border border-gray-200 p-6 space-y-2">
                                <p className="text-gray-700"><strong>Phone:</strong> +91 99827 81000</p>
                                <p className="text-gray-700"><strong>Email:</strong> info@3layered.com</p>
                                <p className="text-gray-700"><strong>Address:</strong> Pune, Maharashtra, India</p>
                            </div>
                        </section>
                    </div>
                </div>
            </main>
        </SlideProvider>
    );
}

"use client";

import Link from 'next/link';
import { Phone, Mail, MapPin, Instagram } from 'lucide-react';

export function Footer() {
    return (
        <footer className="bg-[#1A110B] text-[#E8E1D5] pt-16 pb-8 relative overflow-hidden">
            {/* Subtle archway/mandala background at the bottom right */}
            <div className="absolute bottom-0 right-0 w-96 h-96 z-0 opacity-[0.03] pointer-events-none translate-x-1/4 translate-y-1/4" style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg width='120' height='120' viewBox='0 0 120 120' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M60 0 A60 60 0 0 1 120 60 A60 60 0 0 1 60 120 A60 60 0 0 1 0 60 A60 60 0 0 1 60 0' fill='none' stroke='%23ffffff' stroke-width='2'/%3E%3Cpath d='M60 15 A45 45 0 0 1 105 60 A45 45 0 0 1 60 105 A45 45 0 0 1 15 60 A45 45 0 0 1 60 15' fill='none' stroke='%23ffffff' stroke-width='1.5'/%3E%3Cpath d='M60 30 A30 30 0 0 1 90 60 A30 30 0 0 1 60 90 A30 30 0 0 1 30 60 A30 30 0 0 1 60 30' fill='none' stroke='%23ffffff' stroke-width='1'/%3E%3Cpath d='M60 0 L60 120 M0 60 L120 60 M17.57 17.57 L102.43 102.43 M17.57 102.43 L102.43 17.57' stroke='%23ffffff' stroke-width='1'/%3E%3C/svg%3E")`,
                backgroundSize: '200px 200px',
            }} />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
                    {/* Company Info */}
                    <div>
                        <h3 className="font-serif text-3xl font-bold mb-4 tracking-wide text-[#DFB374]">3 LAYERED</h3>
                        <p className="text-[#E8E1D5]/70 mb-4 leading-relaxed font-light">
                            Premium 3D printing services in Pimpri-Chinchwad delivering precision-engineered miniature temples and architectural models with museum-quality detail.
                        </p>
                        <p className="text-sm text-[#E8E1D5]/50 font-medium tracking-wide">
                            Excellence in every layer, precision in every detail.
                        </p>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h4 className="font-semibold text-lg mb-4 text-white">Quick Links</h4>
                        <ul className="space-y-3">
                            <li>
                                <Link href="/" className="text-[#E8E1D5]/70 hover:text-[#DFB374] transition-colors font-light">
                                    Home
                                </Link>
                            </li>
                            <li>
                                <Link href="/about" className="text-[#E8E1D5]/70 hover:text-[#DFB374] transition-colors font-light">
                                    About Us
                                </Link>
                            </li>
                            <li>
                                <Link href="/custom-print" className="text-[#E8E1D5]/70 hover:text-[#DFB374] transition-colors font-light">
                                    Custom Print
                                </Link>
                            </li>
                            <li>
                                <Link href="/contact" className="text-[#E8E1D5]/70 hover:text-[#DFB374] transition-colors font-light">
                                    Contact
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Services */}
                    <div>
                        <h4 className="font-semibold text-lg mb-4 text-white">Services</h4>
                        <ul className="space-y-3">
                            <li>
                                <Link href="/products/category/miniature-temples" className="text-[#E8E1D5]/70 hover:text-[#DFB374] transition-colors font-light">
                                    Miniature Temples
                                </Link>
                            </li>
                            <li>
                                <Link href="/products/category/architect-models" className="text-[#E8E1D5]/70 hover:text-[#DFB374] transition-colors font-light">
                                    Architect Models
                                </Link>
                            </li>
                            <li>
                                <Link href="/custom-print" className="text-[#E8E1D5]/70 hover:text-[#DFB374] transition-colors font-light">
                                    Custom Printing
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Contact Info */}
                    <div>
                        <h4 className="font-semibold text-lg mb-4 text-white">Get in Touch</h4>
                        <ul className="space-y-3">
                            <li className="flex items-start gap-3">
                                <Phone className="w-5 h-5 text-[#DFB374] mt-0.5 flex-shrink-0" />
                                <a href="tel:+919982781000" className="text-[#E8E1D5]/70 hover:text-white transition-colors font-light">
                                    +91 99827 81000
                                </a>
                            </li>
                            <li className="flex items-start gap-3">
                                <Mail className="w-5 h-5 text-[#DFB374] mt-0.5 flex-shrink-0" />
                                <a href="mailto:info@3layered.com" className="text-[#E8E1D5]/70 hover:text-white transition-colors break-all font-light">
                                    info@3layered.com
                                </a>
                            </li>
                            <li className="flex items-start gap-3">
                                <MapPin className="w-5 h-5 text-[#DFB374] mt-0.5 flex-shrink-0" />
                                <span className="text-[#E8E1D5]/70 font-light leading-relaxed">
                                    Sukwani Artize, BRT Link Rd<br />
                                    Ravet, Pimpri-Chinchwad<br />
                                    Maharashtra 412101, India
                                </span>
                            </li>
                            <li className="flex items-start gap-3">
                                <Instagram className="w-5 h-5 text-[#DFB374] mt-0.5 flex-shrink-0" />
                                <a
                                    href="https://www.instagram.com/3layered.global?igsh=MTZ5bjR0MXBidXNyZQ=="
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-[#E8E1D5]/70 hover:text-white transition-colors font-light"
                                >
                                    @3layered.global
                                </a>
                            </li>
                        </ul>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="border-t border-[#E8E1D5]/10 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
                    <p className="text-[#E8E1D5]/50 text-sm">
                        © {new Date().getFullYear()} 3 Layered. All rights reserved.
                    </p>
                    <div className="flex gap-6">
                        <Link href="/privacy" className="text-[#E8E1D5]/50 hover:text-[#DFB374] transition-colors text-sm">
                            Privacy Policy
                        </Link>
                        <Link href="/terms" className="text-[#E8E1D5]/50 hover:text-[#DFB374] transition-colors text-sm">
                            Terms & Conditions
                        </Link>
                    </div>
                </div>
            </div>
        </footer>
    );
}

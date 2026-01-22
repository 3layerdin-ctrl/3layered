'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import { PrebookPopupProduct } from '@/data/prebook-popup-config';

interface PrebookPopupProps {
    product: PrebookPopupProduct;
    isOpen: boolean;
    onClose: () => void;
}

export function PrebookPopup({ product, isOpen, onClose }: PrebookPopupProps) {
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        phone: ''
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [error, setError] = useState('');

    const nextImage = () => {
        setCurrentImageIndex((prev) => (prev + 1) % product.images.length);
    };

    const prevImage = () => {
        setCurrentImageIndex((prev) => (prev - 1 + product.images.length) % product.images.length);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setIsSubmitting(true);

        try {
            const response = await fetch('/api/prebook-popup', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    productSlug: product.slug,
                    firstName: formData.firstName,
                    lastName: formData.lastName,
                    email: formData.email,
                    phone: formData.phone
                })
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Failed to submit prebook request');
            }

            setIsSuccess(true);

            // Store in localStorage
            localStorage.setItem(`prebook_submitted_${product.slug}`, 'true');

            // Track conversion (if analytics available)
            if (typeof window !== 'undefined' && (window as any).gtag) {
                (window as any).gtag('event', 'prebook_submitted', {
                    product_slug: product.slug,
                    product_title: product.title
                });
            }

        } catch (err: any) {
            setError(err.message);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData(prev => ({
            ...prev,
            [e.target.name]: e.target.value
        }));
    };

    // Prevent body scroll when modal is open
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
            document.body.style.position = 'fixed';
            document.body.style.width = '100%';
            document.body.style.height = '100%';
        } else {
            document.body.style.overflow = '';
            document.body.style.position = '';
            document.body.style.width = '';
            document.body.style.height = '';
        }
        return () => {
            document.body.style.overflow = '';
            document.body.style.position = '';
            document.body.style.width = '';
            document.body.style.height = '';
        };
    }, [isOpen]);

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[9999]"
                        style={{ touchAction: 'none' }}
                    />

                    {/* Modal Container - REMOVED pointer-events-none */}
                    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-0 sm:p-4 overflow-y-auto">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            transition={{ duration: 0.3 }}
                            className="bg-white rounded-none sm:rounded-2xl shadow-2xl w-full sm:max-w-5xl h-full sm:h-auto sm:max-h-[90vh] overflow-hidden"
                            onClick={(e) => e.stopPropagation()}
                            style={{ touchAction: 'auto' }}
                        >
                            {/* Close Button */}
                            <button
                                onClick={onClose}
                                className="absolute top-4 right-4 z-10 p-2 bg-white/90 hover:bg-white rounded-full transition-colors shadow-lg"
                                aria-label="Close"
                            >
                                <X className="w-5 h-5" />
                            </button>

                            <div className="grid grid-cols-1 lg:grid-cols-2 h-full sm:max-h-[90vh]">
                                {/* LEFT: Image Carousel */}
                                <div className="relative bg-gray-100 h-[40vh] sm:h-[50vh] lg:min-h-[600px]">
                                    <Image
                                        src={product.images[currentImageIndex]}
                                        alt={product.title}
                                        fill
                                        className="object-contain"
                                        priority
                                    />

                                    {/* Carousel Controls */}
                                    {product.images.length > 1 && (
                                        <>
                                            <button
                                                onClick={prevImage}
                                                className="absolute left-4 top-1/2 -translate-y-1/2 p-2 bg-white/90 hover:bg-white rounded-full transition-colors shadow-lg"
                                                aria-label="Previous image"
                                            >
                                                <ChevronLeft className="w-5 h-5" />
                                            </button>
                                            <button
                                                onClick={nextImage}
                                                className="absolute right-4 top-1/2 -translate-y-1/2 p-2 bg-white/90 hover:bg-white rounded-full transition-colors shadow-lg"
                                                aria-label="Next image"
                                            >
                                                <ChevronRight className="w-5 h-5" />
                                            </button>

                                            {/* Dots Indicator */}
                                            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                                                {product.images.map((_, index) => (
                                                    <button
                                                        key={index}
                                                        onClick={() => setCurrentImageIndex(index)}
                                                        className={`w-2 h-2 rounded-full transition-all ${index === currentImageIndex
                                                            ? 'bg-white w-6'
                                                            : 'bg-white/50'
                                                            }`}
                                                        aria-label={`Go to image ${index + 1}`}
                                                    />
                                                ))}
                                            </div>
                                        </>
                                    )}
                                </div>

                                {/* RIGHT: Form - FIXED SCROLLING */}
                                <div className="p-6 sm:p-8 lg:p-12 overflow-y-auto overscroll-contain" style={{ maxHeight: '60vh', WebkitOverflowScrolling: 'touch' }}>
                                    {isSuccess ? (
                                        <div className="flex flex-col items-center justify-center h-full text-center">
                                            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-6">
                                                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                                </svg>
                                            </div>
                                            <h3 className="text-2xl font-bold mb-4">Prebooking Confirmed!</h3>
                                            <p className="text-gray-600 mb-6">
                                                Your prebooking is confirmed. Our team will contact you before production begins.
                                            </p>
                                            <button
                                                onClick={onClose}
                                                className="px-6 py-3 bg-black text-white rounded-full hover:bg-gray-800 transition-colors"
                                            >
                                                Close
                                            </button>
                                        </div>
                                    ) : (
                                        <>
                                            <h2 className="text-3xl lg:text-4xl font-bold mb-4">{product.title}</h2>
                                            <p className="text-gray-600 mb-6 leading-relaxed">{product.description}</p>

                                            {/* Pricing Section */}
                                            <div className="mb-8 p-6 bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl border border-green-200">
                                                <div className="flex items-center gap-3 mb-2">
                                                    <span className="inline-block px-3 py-1 bg-green-600 text-white text-sm font-bold rounded-full">
                                                        {product.discountPercent}% OFF
                                                    </span>
                                                    <span className="text-gray-500 text-lg line-through">
                                                        ₹{product.originalPrice.toLocaleString('en-IN')}
                                                    </span>
                                                </div>
                                                <div className="flex items-baseline gap-2">
                                                    <span className="text-4xl font-bold text-gray-900">
                                                        ₹{product.price.toLocaleString('en-IN')}
                                                    </span>
                                                    <span className="text-gray-600">
                                                        (Save ₹{(product.originalPrice - product.price).toLocaleString('en-IN')})
                                                    </span>
                                                </div>
                                            </div>

                                            <form onSubmit={handleSubmit} className="space-y-6">
                                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                                    <div>
                                                        <label htmlFor="firstName" className="block text-sm font-medium mb-2">
                                                            First Name *
                                                        </label>
                                                        <input
                                                            type="text"
                                                            id="firstName"
                                                            name="firstName"
                                                            value={formData.firstName}
                                                            onChange={handleChange}
                                                            required
                                                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent outline-none transition-all"
                                                            placeholder="John"
                                                        />
                                                    </div>
                                                    <div>
                                                        <label htmlFor="lastName" className="block text-sm font-medium mb-2">
                                                            Last Name *
                                                        </label>
                                                        <input
                                                            type="text"
                                                            id="lastName"
                                                            name="lastName"
                                                            value={formData.lastName}
                                                            onChange={handleChange}
                                                            required
                                                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent outline-none transition-all"
                                                            placeholder="Doe"
                                                        />
                                                    </div>
                                                </div>

                                                <div>
                                                    <label htmlFor="email" className="block text-sm font-medium mb-2">
                                                        Email *
                                                    </label>
                                                    <input
                                                        type="email"
                                                        id="email"
                                                        name="email"
                                                        value={formData.email}
                                                        onChange={handleChange}
                                                        required
                                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent outline-none transition-all"
                                                        placeholder="john@example.com"
                                                    />
                                                </div>

                                                <div>
                                                    <label htmlFor="phone" className="block text-sm font-medium mb-2">
                                                        Phone *
                                                    </label>
                                                    <input
                                                        type="tel"
                                                        id="phone"
                                                        name="phone"
                                                        value={formData.phone}
                                                        onChange={handleChange}
                                                        required
                                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent outline-none transition-all"
                                                        placeholder="+1 (555) 000-0000"
                                                    />
                                                </div>

                                                {error && (
                                                    <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
                                                        {error}
                                                    </div>
                                                )}

                                                <button
                                                    type="submit"
                                                    disabled={isSubmitting}
                                                    className="w-full py-4 bg-black text-white rounded-full font-medium text-lg hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                                >
                                                    {isSubmitting ? 'Submitting...' : 'Prebook This Model'}
                                                </button>
                                            </form>
                                        </>
                                    )}
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </>
            )}
        </AnimatePresence>
    );
}

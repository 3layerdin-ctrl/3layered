'use client';

import { useState } from 'react';
import { X } from 'lucide-react';

interface PrebookModalProps {
    isOpen: boolean;
    onClose: () => void;
    productId: string;
    productName: string;
    productSlug: string;
}

export function PrebookModal({ isOpen, onClose, productId, productName, productSlug }: PrebookModalProps) {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
    const [errorMessage, setErrorMessage] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        setSubmitStatus('idle');
        setErrorMessage('');

        try {
            const response = await fetch('/api/prebook', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    productId,
                    productSlug,
                    name: formData.name,
                    email: formData.email,
                    phone: formData.phone || undefined,
                }),
            });

            const data = await response.json();

            if (response.ok) {
                setSubmitStatus('success');
                setFormData({ name: '', email: '', phone: '' });
            } else {
                setSubmitStatus('error');
                setErrorMessage(data.error || 'Failed to submit prebook request');
            }
        } catch (error) {
            setSubmitStatus('error');
            setErrorMessage('An unexpected error occurred. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleClose = () => {
        setFormData({ name: '', email: '', phone: '' });
        setSubmitStatus('idle');
        setErrorMessage('');
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <div className="bg-white w-full max-w-md relative shadow-2xl">
                {/* Close Button */}
                <button
                    onClick={handleClose}
                    className="absolute top-4 right-4 text-gray-400 hover:text-black transition-colors"
                    aria-label="Close modal"
                >
                    <X className="w-6 h-6" />
                </button>

                {/* Content */}
                <div className="p-8">
                    {submitStatus === 'success' ? (
                        // Success State
                        <div className="text-center space-y-6">
                            <div className="w-16 h-16 bg-black text-white rounded-full flex items-center justify-center mx-auto">
                                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                            </div>
                            <div>
                                <h3 className="font-serif text-2xl font-bold mb-2">Prebooking Confirmed</h3>
                                <p className="text-gray-600">
                                    Your prebooking is confirmed. We&apos;ll notify you when this model becomes available.
                                </p>
                            </div>
                            <button
                                onClick={handleClose}
                                className="w-full bg-black text-white py-3 px-6 font-light tracking-wide hover:bg-gray-900 transition-colors"
                            >
                                Close
                            </button>
                        </div>
                    ) : (
                        // Form State
                        <>
                            <div className="mb-6">
                                <h3 className="font-serif text-3xl font-bold mb-2">Prebook Now</h3>
                                <p className="text-gray-600 font-light">
                                    Register your interest in <span className="font-normal">{productName}</span>
                                </p>
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-4">
                                {/* Name Field */}
                                <div>
                                    <label htmlFor="name" className="block text-sm font-light mb-2">
                                        Name <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        id="name"
                                        required
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        className="w-full border border-gray-300 px-4 py-3 focus:outline-none focus:border-black transition-colors"
                                        placeholder="Your full name"
                                    />
                                </div>

                                {/* Email Field */}
                                <div>
                                    <label htmlFor="email" className="block text-sm font-light mb-2">
                                        Email <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="email"
                                        id="email"
                                        required
                                        value={formData.email}
                                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                        className="w-full border border-gray-300 px-4 py-3 focus:outline-none focus:border-black transition-colors"
                                        placeholder="your@email.com"
                                    />
                                </div>

                                {/* Phone Field */}
                                <div>
                                    <label htmlFor="phone" className="block text-sm font-light mb-2">
                                        Phone <span className="text-gray-400">(Optional)</span>
                                    </label>
                                    <input
                                        type="tel"
                                        id="phone"
                                        value={formData.phone}
                                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                        className="w-full border border-gray-300 px-4 py-3 focus:outline-none focus:border-black transition-colors"
                                        placeholder="+91 98765 43210"
                                    />
                                </div>

                                {/* Error Message */}
                                {submitStatus === 'error' && (
                                    <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 text-sm">
                                        {errorMessage}
                                    </div>
                                )}

                                {/* Submit Button */}
                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="w-full bg-black text-white py-3 px-6 font-light tracking-wide hover:bg-gray-900 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
                                >
                                    {isSubmitting ? 'Submitting...' : 'Submit Prebook Request'}
                                </button>
                            </form>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}

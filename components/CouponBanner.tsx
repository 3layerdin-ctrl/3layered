'use client';

import { useState, useEffect } from 'react';
import { X, Tag, Copy, Check } from 'lucide-react';

export function CouponNotification() {
    const [isVisible, setIsVisible] = useState(false);
    const [isDismissed, setIsDismissed] = useState(false);
    const [isCopied, setIsCopied] = useState(false);

    useEffect(() => {
        // Check if user has already dismissed the notification
        const dismissed = sessionStorage.getItem('coupon_notification_dismissed');
        if (dismissed) {
            setIsDismissed(true);
            return;
        }

        // Show notification after a short delay
        const timer = setTimeout(() => {
            setIsVisible(true);
        }, 2000);

        return () => clearTimeout(timer);
    }, []);

    const handleDismiss = () => {
        setIsVisible(false);
        setTimeout(() => {
            setIsDismissed(true);
            sessionStorage.setItem('coupon_notification_dismissed', 'true');
        }, 300);
    };

    const handleCopy = () => {
        navigator.clipboard.writeText('WELCOME150');
        setIsCopied(true);
        // Auto-dismiss after showing copied feedback
        setTimeout(() => {
            setIsCopied(false);
            handleDismiss();
        }, 1000);
    };

    if (isDismissed) return null;

    return (
        <div
            className={`fixed bottom-24 md:bottom-auto md:top-1/2 md:-translate-y-1/2 right-2 sm:right-4 z-50 transition-all duration-500 ease-out max-w-[calc(100vw-16px)] sm:max-w-sm ${isVisible ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'
                }`}
        >
            <div className="bg-white border-2 border-black text-black rounded shadow-2xl p-3 sm:p-4 relative">
                {/* Close button */}
                <button
                    onClick={handleDismiss}
                    className="absolute top-2 right-2 text-gray-600 hover:text-black hover:bg-gray-100 rounded-full p-1 transition-colors"
                    aria-label="Close notification"
                >
                    <X className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                </button>

                <div className="pr-6">
                    {/* Icon and badge */}
                    <div className="flex items-center gap-2 mb-2">
                        <div className="bg-black text-white rounded-full p-1.5">
                            <Tag className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                        </div>
                        <div className="bg-black text-white px-2 py-0.5 rounded">
                            <p className="text-[10px] sm:text-xs font-bold uppercase tracking-wider">Special Offer</p>
                        </div>
                    </div>

                    {/* Main message */}
                    <h3 className="font-serif text-base sm:text-lg font-bold mb-1">Save ₹150 Today</h3>
                    <p className="text-xs sm:text-sm text-gray-600 mb-2">
                        Use this code at checkout
                    </p>

                    {/* Coupon code box with copy button */}
                    <div className="bg-gray-50 border-2 border-gray-200 rounded p-2 hover:border-black transition-colors">
                        <div className="flex items-center justify-between gap-2">
                            <code className="text-sm sm:text-base font-bold tracking-wider font-mono flex-1">WELCOME150</code>
                            <button
                                onClick={handleCopy}
                                className="bg-black text-white hover:bg-gray-800 rounded p-1.5 transition-colors flex-shrink-0"
                                aria-label="Copy coupon code"
                            >
                                {isCopied ? (
                                    <Check className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                                ) : (
                                    <Copy className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                                )}
                            </button>
                        </div>
                    </div>

                    {/* Small hint */}
                    <p className="text-[10px] sm:text-xs text-gray-500 mt-2 text-center">
                        {isCopied ? '✓ Copied to clipboard!' : 'Click to copy code'}
                    </p>
                </div>
            </div>
        </div>
    );
}

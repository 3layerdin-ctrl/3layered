'use client';

import { useState, useEffect } from 'react';

interface UsePrebookPopupOptions {
    productSlug: string;
    delay?: number; // milliseconds
    enabled?: boolean;
}

export function usePrebookPopup({
    productSlug,
    delay = 3000,
    enabled = true
}: UsePrebookPopupOptions) {
    const [isOpen, setIsOpen] = useState(false);

    useEffect(() => {
        if (!enabled || !productSlug) return;

        // Check if user has already submitted or dismissed
        const hasSubmitted = localStorage.getItem(`prebook_submitted_${productSlug}`);
        const dismissedData = localStorage.getItem(`prebook_dismissed_${productSlug}`);

        if (hasSubmitted) {
            return; // Don't show if already submitted
        }

        if (dismissedData) {
            const { timestamp } = JSON.parse(dismissedData);
            const now = Date.now();
            const twentyFourHours = 24 * 60 * 60 * 1000;

            if (now - timestamp < twentyFourHours) {
                return; // Don't show if dismissed within last 24 hours
            }
        }

        // Show popup after delay
        const timer = setTimeout(() => {
            setIsOpen(true);
        }, delay);

        return () => clearTimeout(timer);
    }, [productSlug, delay, enabled]);

    const handleClose = () => {
        setIsOpen(false);

        // Store dismissal in localStorage
        localStorage.setItem(
            `prebook_dismissed_${productSlug}`,
            JSON.stringify({ timestamp: Date.now() })
        );
    };

    return {
        isOpen,
        setIsOpen,
        handleClose
    };
}

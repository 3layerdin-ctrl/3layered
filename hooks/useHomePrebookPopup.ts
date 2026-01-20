'use client';

import { useState, useEffect } from 'react';

export function useHomePrebookPopup(delay: number = 3000) {
    const [isOpen, setIsOpen] = useState(false);

    useEffect(() => {
        // Check if user has already submitted or dismissed
        const hasSubmitted = localStorage.getItem('homepage_prebook_submitted');
        const dismissedData = localStorage.getItem('homepage_prebook_dismissed');

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

            // Track popup view
            if (typeof window !== 'undefined' && (window as any).gtag) {
                (window as any).gtag('event', 'homepage_prebook_popup_viewed');
            }
        }, delay);

        return () => clearTimeout(timer);
    }, [delay]);

    const handleClose = () => {
        setIsOpen(false);

        // Store dismissal in localStorage
        localStorage.setItem(
            'homepage_prebook_dismissed',
            JSON.stringify({ timestamp: Date.now() })
        );
    };

    return {
        isOpen,
        setIsOpen,
        handleClose
    };
}

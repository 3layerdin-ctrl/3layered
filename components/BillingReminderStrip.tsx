'use client';

import { useEffect, useState } from 'react';
import { X, AlertTriangle } from 'lucide-react';

interface SubscriptionInfo {
    plan_name: string;
    plan_amount: number;
    next_billing_date: string | null;
}

export function BillingReminderStrip() {
    const [info, setInfo] = useState<SubscriptionInfo | null>(null);
    const [dismissed, setDismissed] = useState(false);

    useEffect(() => {
        if (sessionStorage.getItem('billing_strip_dismissed') === 'true') {
            setDismissed(true);
            return;
        }
        fetch('/api/subscription')
            .then(r => r.json())
            .then(data => setInfo(data))
            .catch(() => {});
    }, []);

    if (dismissed || !info?.next_billing_date) return null;

    const billingDate = new Date(info.next_billing_date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    billingDate.setHours(0, 0, 0, 0);

    const daysUntil = Math.round((billingDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

    if (daysUntil > 2 || daysUntil < 0) return null;

    const formattedDate = billingDate.toLocaleDateString('en-IN', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
    });

    const handleDismiss = () => {
        sessionStorage.setItem('billing_strip_dismissed', 'true');
        setDismissed(true);
    };

    const dueText = daysUntil === 0 ? 'today' : daysUntil === 1 ? 'tomorrow' : `in ${daysUntil} days`;

    return (
        <div className="fixed top-0 left-0 right-0 z-[300] bg-gradient-to-r from-amber-500 via-orange-500 to-amber-500 text-white shadow-lg">
            <div className="max-w-7xl mx-auto px-4 py-2.5 flex items-center justify-between gap-3">
                <div className="flex items-center gap-2.5 flex-1 justify-center">
                    <AlertTriangle className="w-4 h-4 flex-shrink-0" />
                    <p className="text-sm font-medium text-center">
                        Your <strong>{info.plan_name}</strong> renewal of{' '}
                        <strong>₹{info.plan_amount.toLocaleString('en-IN')}</strong> is due{' '}
                        <strong>{dueText}</strong> ({formattedDate}) — Pay early to avoid service interruption
                    </p>
                </div>
                <button
                    onClick={handleDismiss}
                    className="flex-shrink-0 p-1 hover:bg-white/20 rounded-full transition-colors"
                    aria-label="Dismiss reminder"
                >
                    <X className="w-4 h-4" />
                </button>
            </div>
        </div>
    );
}

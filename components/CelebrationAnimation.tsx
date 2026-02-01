'use client';

import { useEffect, useState } from 'react';

interface CelebrationAnimationProps {
    show: boolean;
    onComplete?: () => void;
}

export function CelebrationAnimation({ show, onComplete }: CelebrationAnimationProps) {
    const [particles, setParticles] = useState<Array<{ id: number; color: string; left: number; delay: number }>>([]);

    useEffect(() => {
        if (show) {
            // Generate confetti particles
            const newParticles = Array.from({ length: 50 }, (_, i) => ({
                id: i,
                color: ['#FFD700', '#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A', '#98D8C8'][Math.floor(Math.random() * 6)],
                left: Math.random() * 100,
                delay: Math.random() * 0.3,
            }));
            setParticles(newParticles);

            // Auto-hide after animation
            const timer = setTimeout(() => {
                if (onComplete) onComplete();
            }, 1500);

            return () => clearTimeout(timer);
        } else {
            setParticles([]);
        }
    }, [show, onComplete]);

    if (!show) return null;

    return (
        <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
            {particles.map((particle) => (
                <div
                    key={particle.id}
                    className="absolute top-0 w-2 h-2 rounded-full animate-confetti"
                    style={{
                        backgroundColor: particle.color,
                        left: `${particle.left}%`,
                        animationDelay: `${particle.delay}s`,
                    }}
                />
            ))}

            {/* Success message overlay - Perfectly centered */}
            <div className="fixed inset-0 flex items-center justify-center pointer-events-none z-50">
                <div className="animate-bounce-in">
                    <div className="bg-gradient-to-r from-green-500 to-green-600 text-white px-8 py-6 rounded-2xl shadow-2xl border-2 border-green-400">
                        <div className="flex items-center gap-4">
                            <div className="bg-white/20 rounded-full p-2 backdrop-blur-sm">
                                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                </svg>
                            </div>
                            <div>
                                <p className="font-bold text-xl mb-1">Coupon Applied! 🎉</p>
                                <p className="text-sm text-white/90 font-medium">You saved ₹150</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <style jsx>{`
                @keyframes confetti {
                    0% {
                        transform: translateY(-20px) rotateZ(0deg);
                        opacity: 1;
                    }
                    100% {
                        transform: translateY(100vh) rotateZ(720deg);
                        opacity: 0;
                    }
                }
                @keyframes bounce-in {
                    0% {
                        transform: scale(0) rotate(-10deg);
                        opacity: 0;
                    }
                    50% {
                        transform: scale(1.15) rotate(5deg);
                    }
                    100% {
                        transform: scale(1) rotate(0deg);
                        opacity: 1;
                    }
                }
                .animate-confetti {
                    animation: confetti 3s ease-in forwards;
                }
                .animate-bounce-in {
                    animation: bounce-in 0.6s cubic-bezier(0.68, -0.55, 0.265, 1.55) forwards;
                }
            `}</style>
        </div>
    );
}

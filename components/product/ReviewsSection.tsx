'use client';

import { ReviewsSection as ReviewsSectionType } from '@/types/product';
import { Star } from 'lucide-react';

interface ReviewsSectionProps {
    data: ReviewsSectionType | null;
}

export function ReviewsSection({ data }: ReviewsSectionProps) {
    if (!data || !data.enabled || data.reviews.length === 0) {
        return null;
    }

    // Helper function to render star rating
    const renderStars = (rating: number, size: 'sm' | 'lg' = 'sm') => {
        const starSize = size === 'lg' ? 24 : 16;
        return (
            <div className="flex gap-0.5">
                {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                        key={star}
                        size={starSize}
                        className={`${star <= rating
                                ? 'fill-black stroke-black'
                                : 'fill-none stroke-gray-300'
                            } transition-colors`}
                    />
                ))}
            </div>
        );
    };

    // Format date
    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        });
    };

    return (
        <section className="py-20 bg-[#FDFBF7] border-t border-[#E8E1D5]">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Section Header */}
                <div className="mb-12">
                    <h2 className="font-algerian text-3xl md:text-4xl mb-6">
                        Customer Reviews
                    </h2>

                    {/* Average Rating */}
                    <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6 pb-8 border-b border-[#E8E1D5]">
                        <div className="flex items-center gap-3">
                            <div className="text-5xl font-light">
                                {data.averageRating.toFixed(1)}
                            </div>
                            <div>
                                {renderStars(Math.round(data.averageRating), 'lg')}
                                <p className="text-sm text-[#2A2320]/80 mt-1">
                                    Based on {data.totalReviews} review{data.totalReviews !== 1 ? 's' : ''}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Reviews Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {data.reviews.map((review) => (
                        <div
                            key={review.id}
                            className="border border-[#E8E1D5] p-6 hover:shadow-lg transition-shadow duration-300"
                        >
                            {/* Review Header */}
                            <div className="flex items-start justify-between mb-4">
                                <div className="flex-1">
                                    <div className="flex items-center gap-3 mb-2">
                                        {renderStars(review.rating)}
                                        {review.verifiedPurchase && (
                                            <span className="text-xs bg-[#1A110B] text-[#DFB374] px-2 py-0.5 uppercase tracking-wider">
                                                Verified Purchase
                                            </span>
                                        )}
                                    </div>
                                    <h3 className="font-medium text-lg mb-1">
                                        {review.title}
                                    </h3>
                                    <p className="text-sm text-[#2A2320]/80">
                                        {review.author} • {formatDate(review.date)}
                                    </p>
                                </div>
                            </div>

                            {/* Review Content */}
                            <p className="text-[#2A2320]/90 leading-relaxed mb-4">
                                {review.comment}
                            </p>

                            {/* Helpful Count */}
                            {review.helpfulCount > 0 && (
                                <p className="text-sm text-[#2A2320]/60">
                                    {review.helpfulCount} {review.helpfulCount === 1 ? 'person' : 'people'} found this helpful
                                </p>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}

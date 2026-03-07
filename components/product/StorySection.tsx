'use client';

import Image from 'next/image';
import { StorySection as StorySectionType } from '@/types/product';

interface StorySectionProps {
    data: StorySectionType | null;
}

export function StorySection({ data }: StorySectionProps) {
    if (!data || !data.enabled) return null;

    return (
        <section className="py-24 bg-[#FAF7F2]">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                    {/* Text Content */}
                    <div className="space-y-8">
                        <h2 className="font-serif text-4xl md:text-5xl font-bold tracking-tight">
                            {data.title}
                        </h2>

                        <div className="space-y-6 text-[#2A2320]/90 leading-relaxed">
                            {data.paragraphs.map((paragraph, index) => (
                                <p key={index} className="text-lg font-light">
                                    {paragraph}
                                </p>
                            ))}
                        </div>

                        {/* Quote */}
                        {data.quote.enabled && (
                            <blockquote className="border-l-4 border-[#DFB374] pl-6 py-2 my-8">
                                <p className="text-xl font-light italic text-[#1A110B] mb-2">
                                    {data.quote.text}
                                </p>
                                {data.quote.attribution && (
                                    <cite className="text-sm text-[#2A2320]/80 not-italic">
                                        {data.quote.attribution}
                                    </cite>
                                )}
                            </blockquote>
                        )}
                    </div>

                    {/* Optional Image */}
                    {data.image && (
                        <div className="space-y-4">
                            <div className="relative aspect-square bg-[#FDFBF7] overflow-hidden">
                                <Image
                                    src={data.image.url}
                                    alt={data.image.alt}
                                    fill
                                    className="object-cover"
                                />
                            </div>
                            {data.image.caption && (
                                <p className="text-sm text-[#2A2320]/60 text-center">
                                    {data.image.caption}
                                </p>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </section>
    );
}

'use client';

import Image from 'next/image';
import { UseCasesSection as UseCasesSectionType } from '@/types/product';

interface UseCasesSectionProps {
    data: UseCasesSectionType | null;
}

export function UseCasesSection({ data }: UseCasesSectionProps) {
    if (!data || !data.enabled) return null;

    const sortedCases = [...data.cases].sort((a, b) => a.order - b.order);

    return (
        <section className="py-24 bg-[#FAF7F2]">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-16">
                    <h2 className="font-serif text-4xl md:text-5xl font-bold mb-4 tracking-tight">
                        {data.title || 'Where It Lives'}
                    </h2>
                    <p className="text-lg text-[#2A2320]/80 font-light">
                        Envision this piece in your space
                    </p>
                </div>

                <div className={`
          ${data.displayStyle === 'grid' ? 'grid grid-cols-1 md:grid-cols-3 gap-8' : ''}
          ${data.displayStyle === 'stacked' ? 'space-y-12' : ''}
        `}>
                    {sortedCases.map(useCase => (
                        <div
                            key={useCase.id}
                            className="group relative bg-[#FDFBF7] overflow-hidden"
                        >
                            {/* Image */}
                            <div className="relative aspect-[4/3] overflow-hidden">
                                <Image
                                    src={useCase.imageUrl}
                                    alt={useCase.title}
                                    fill
                                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                                />
                            </div>

                            {/* Text */}
                            <div className="p-6">
                                <h3 className="text-xl font-light mb-2">{useCase.title}</h3>
                                <p className="text-[#2A2320]/80 text-sm leading-relaxed">
                                    {useCase.description}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}

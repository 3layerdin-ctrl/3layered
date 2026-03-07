'use client';

import { SpecificationsSection as SpecificationsSectionType } from '@/types/product';
import { Ruler, Weight as WeightIcon, Maximize2 } from 'lucide-react';

interface SpecificationsSectionProps {
    data: SpecificationsSectionType;
}

export function SpecificationsSection({ data }: SpecificationsSectionProps) {
    const formatDimension = (dim: { value: number; unit: string }) =>
        `${dim.value}${dim.unit}`;

    return (
        <section className="py-24 bg-[#FAF7F2]">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-16">
                    <h2 className="font-serif text-4xl md:text-5xl font-bold mb-4 tracking-tight">
                        Dimensions & Specifications
                    </h2>
                    <p className="text-lg text-[#2A2320]/80 font-light">
                        Precisely engineered to museum standards
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
                    {/* Dimensions */}
                    <div className="bg-[#FDFBF7] border border-[#E8E1D5] p-8 text-center">
                        <Ruler className="w-8 h-8 mx-auto mb-4 text-[#1A110B]" />
                        <h3 className="text-sm uppercase tracking-widest text-[#2A2320]/60 mb-3">
                            Dimensions
                        </h3>
                        <div className="text-2xl font-light mb-2">
                            {formatDimension(data.dimensions.height)} ×{' '}
                            {formatDimension(data.dimensions.width)} ×{' '}
                            {formatDimension(data.dimensions.depth)}
                        </div>
                        <p className="text-sm text-[#2A2320]/60">H × W × D</p>
                    </div>

                    {/* Weight */}
                    <div className="bg-[#FDFBF7] border border-[#E8E1D5] p-8 text-center">
                        <WeightIcon className="w-8 h-8 mx-auto mb-4 text-[#1A110B]" />
                        <h3 className="text-sm uppercase tracking-widest text-[#2A2320]/60 mb-3">
                            Weight
                        </h3>
                        <div className="text-2xl font-light mb-2">
                            {data.weight.value}
                            {data.weight.unit}
                        </div>
                        <p className="text-sm text-[#2A2320]/60">Approximate</p>
                    </div>

                    {/* Scale */}
                    {data.scale && (
                        <div className="bg-[#FDFBF7] border border-[#E8E1D5] p-8 text-center">
                            <Maximize2 className="w-8 h-8 mx-auto mb-4 text-[#1A110B]" />
                            <h3 className="text-sm uppercase tracking-widest text-[#2A2320]/60 mb-3">
                                Scale
                            </h3>
                            <div className="text-2xl font-light mb-2">{data.scale.ratio}</div>
                            <p className="text-sm text-[#2A2320]/60">{data.scale.description}</p>
                        </div>
                    )}
                </div>

                {/* Size Comparison */}
                {data.comparison?.enabled && (
                    <div className="text-center bg-[#FDFBF7] border border-[#E8E1D5] p-8">
                        <p className="text-[#2A2320]/80 text-lg font-light">
                            📏 {data.comparison.text}
                        </p>
                    </div>
                )}

                {/* Additional Specs */}
                {data.additionalSpecs && data.additionalSpecs.length > 0 && (
                    <div className="mt-12 bg-[#FDFBF7] border border-[#E8E1D5] p-8">
                        <h3 className="text-xl font-light mb-6 text-center">
                            Additional Specifications
                        </h3>
                        <dl className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {data.additionalSpecs.map((spec, index) => (
                                <div
                                    key={index}
                                    className="flex justify-between items-baseline border-b border-[#E8E1D5]/50 pb-2"
                                >
                                    <dt className="text-sm text-[#2A2320]/80">{spec.label}</dt>
                                    <dd className="text-sm font-light">{spec.value}</dd>
                                </div>
                            ))}
                        </dl>
                    </div>
                )}
            </div>
        </section>
    );
}

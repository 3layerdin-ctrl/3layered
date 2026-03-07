'use client';

import { useState } from 'react';
import { CustomizationSection as CustomizationSectionType } from '@/types/product';
import { formatPrice } from '@/lib/products';

interface CustomizationSectionProps {
    data: CustomizationSectionType | null;
    basePrice: number;
    currency: string;
    displayFormat: string;
}

export function CustomizationSection({ data, basePrice, currency, displayFormat }: CustomizationSectionProps) {
    if (!data || !data.enabled) return null;

    const [selections, setSelections] = useState<Record<string, string>>({});

    const handleSelection = (optionId: string, variantId: string) => {
        setSelections(prev => ({ ...prev, [optionId]: variantId }));
    };

    const calculateTotalPrice = () => {
        let total = basePrice;
        data.options.forEach(option => {
            const selectedVariantId = selections[option.id];
            if (selectedVariantId) {
                const variant = option.variants.find(v => v.id === selectedVariantId);
                if (variant) {
                    total += variant.priceModifier;
                }
            }
        });
        return total;
    };

    const totalPrice = calculateTotalPrice();

    return (
        <section className="py-24 bg-[#FDFBF7]">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-16">
                    <h2 className="font-serif text-4xl md:text-5xl font-bold mb-4 tracking-tight">
                        Customization Options
                    </h2>
                    <p className="text-lg text-[#2A2320]/80 font-light">
                        Tailor this piece to your vision
                    </p>
                </div>

                <div className="space-y-12">
                    {data.options.map(option => (
                        <div key={option.id} className="border-b border-[#E8E1D5] pb-12">
                            <h3 className="text-xl font-light mb-6 flex items-center gap-2">
                                {option.label}
                                {option.required && (
                                    <span className="text-sm text-red-600">*</span>
                                )}
                            </h3>

                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                                {option.variants.map(variant => {
                                    const isSelected = selections[option.id] === variant.id;
                                    const isDisabled = !variant.available;

                                    return (
                                        <button
                                            key={variant.id}
                                            onClick={() => handleSelection(option.id, variant.id)}
                                            disabled={isDisabled}
                                            className={`
                        border-2 p-6 text-left transition-all duration-200
                        ${isSelected ? 'border-[#DFB374] bg-[#FAF7F2]' : 'border-[#E8E1D5] hover:border-gray-400'}
                        ${isDisabled ? 'opacity-40 cursor-not-allowed' : 'cursor-pointer'}
                      `}
                                        >
                                            <div className="flex justify-between items-start mb-2">
                                                <div className="font-light">{variant.name}</div>
                                                {variant.priceModifier !== 0 && (
                                                    <div className="text-sm">
                                                        {variant.priceModifier > 0 ? '+' : ''}
                                                        ₹{variant.priceModifier}
                                                    </div>
                                                )}
                                            </div>

                                            {variant.leadTime && (
                                                <div className="text-xs text-[#2A2320]/60 mt-2">
                                                    {variant.leadTime}
                                                </div>
                                            )}

                                            {isSelected && (
                                                <div className="mt-3 text-sm">
                                                    ✓ Selected
                                                </div>
                                            )}
                                        </button>
                                    );
                                })}
                            </div>
                        </div>
                    ))}
                </div>

                {/* Price Update */}
                {Object.keys(selections).length > 0 && (
                    <div className="mt-12 bg-[#1A110B] text-[#DFB374] p-8 text-center">
                        <div className="text-sm uppercase tracking-widest mb-2">
                            Your Customized Price
                        </div>
                        <div className="text-4xl font-light">
                            {displayFormat.replace('{amount}', totalPrice.toLocaleString())}
                        </div>
                    </div>
                )}

                {/* Custom Request CTA */}
                {data.customRequest.enabled && (
                    <div className="mt-12 text-center border-t border-[#E8E1D5] pt-12">
                        <p className="text-[#2A2320]/80 mb-4">
                            Need something completely unique?
                        </p>
                        <a
                            href={data.customRequest.formUrl || '/contact'}
                            className="inline-block border-2 border-[#DFB374] px-8 py-3 hover:bg-black hover:text-white transition-colors duration-200"
                        >
                            {data.customRequest.ctaLabel}
                        </a>
                    </div>
                )}
            </div>
        </section>
    );
}

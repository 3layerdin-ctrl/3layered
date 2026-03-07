'use client';

import { useState } from 'react';
import { FAQSection as FAQSectionType } from '@/types/product';
import { ChevronDown } from 'lucide-react';

interface FAQSectionProps {
    data: FAQSectionType | null;
}

export function FAQSection({ data }: FAQSectionProps) {
    const [openIndex, setOpenIndex] = useState<number | null>(null);

    if (!data || !data.enabled || data.items.length === 0) {
        return null;
    }

    const toggleFAQ = (index: number) => {
        setOpenIndex(openIndex === index ? null : index);
    };

    // Sort FAQ items by order
    const sortedItems = [...data.items].sort((a, b) => a.order - b.order);

    return (
        <section className="py-20 bg-[#FAF7F2] border-t border-[#E8E1D5]">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Section Header */}
                <div className="mb-12 text-center">
                    <h2 className="font-algerian text-3xl md:text-4xl mb-4">
                        {data.title || 'Frequently Asked Questions'}
                    </h2>
                    <p className="text-[#2A2320]/80 font-light">
                        Everything you need to know about this product
                    </p>
                </div>

                {/* FAQ Accordion */}
                <div className="space-y-4">
                    {sortedItems.map((item, index) => {
                        const isOpen = openIndex === index;
                        return (
                            <div
                                key={item.id}
                                className="bg-[#FDFBF7] border border-[#E8E1D5] overflow-hidden transition-shadow hover:shadow-md"
                            >
                                {/* Question Button */}
                                <button
                                    onClick={() => toggleFAQ(index)}
                                    className="w-full px-6 py-5 flex items-center justify-between text-left transition-colors hover:bg-[#FAF7F2]"
                                    aria-expanded={isOpen}
                                >
                                    <span className="font-medium text-lg pr-8">
                                        {item.question}
                                    </span>
                                    <ChevronDown
                                        size={24}
                                        className={`flex-shrink-0 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''
                                            }`}
                                    />
                                </button>

                                {/* Answer Panel */}
                                <div
                                    className={`overflow-hidden transition-all duration-300 ease-in-out ${isOpen ? 'max-h-96' : 'max-h-0'
                                        }`}
                                >
                                    <div className="px-6 pb-5 pt-2">
                                        <p className="text-[#2A2320]/90 leading-relaxed">
                                            {item.answer}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* Contact CTA */}
                <div className="mt-12 text-center">
                    <p className="text-[#2A2320]/80 mb-4">
                        Still have questions?
                    </p>
                    <a
                        href="/contact"
                        className="inline-block border-2 border-[#DFB374] px-6 py-3 hover:bg-black hover:text-white transition-colors font-medium"
                    >
                        Contact Us
                    </a>
                </div>
            </div>
        </section>
    );
}

'use client';

import { AssuranceSection as AssuranceSectionType } from '@/types/product';
import {
    ShieldCheck,
    Lock,
    Package,
    RefreshCw,
    Award,
    Truck,
    Heart,
    Gift,
} from 'lucide-react';

interface AssuranceSectionProps {
    data: AssuranceSectionType;
}

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
    'shield-check': ShieldCheck,
    'lock': Lock,
    'package': Package,
    'refresh-cw': RefreshCw,
    'award': Award,
    'truck': Truck,
    'heart': Heart,
    'gift': Gift,
};

export function AssuranceSection({ data }: AssuranceSectionProps) {
    return (
        <section className="py-24 bg-[#FDFBF7] border-t border-[#E8E1D5]">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-16">
                    <h2 className="font-serif text-4xl md:text-5xl font-bold mb-4 tracking-tight">
                        Our Promise to You
                    </h2>
                    <p className="text-lg text-[#2A2320]/80 font-light">
                        Crafted with care, delivered with confidence
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-16">
                    {/* Production Timeline */}
                    <div className="text-center p-8 border border-[#E8E1D5]">
                        <div className="text-sm uppercase tracking-widest text-[#2A2320]/60 mb-2">
                            Production
                        </div>
                        <div className="text-2xl font-light mb-1">
                            {data.production.leadTime.min}-{data.production.leadTime.max}{' '}
                            {data.production.leadTime.unit}
                        </div>
                        <p className="text-sm text-[#2A2320]/80">
                            {data.production.leadTime.description}
                        </p>
                    </div>

                    {/* Shipping */}
                    <div className="text-center p-8 border border-[#E8E1D5]">
                        <div className="text-sm uppercase tracking-widest text-[#2A2320]/60 mb-2">
                            Shipping
                        </div>
                        <div className="text-lg font-light mb-2">
                            {data.shipping.description}
                        </div>
                        {data.shipping.methods && (
                            <div className="text-sm text-[#2A2320]/80 space-y-1">
                                {data.shipping.methods.map((method, index) => (
                                    <div key={index}>{method}</div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {/* Return Policy */}
                <div className="text-center bg-[#FAF7F2] p-8 mb-12">
                    <p className="text-lg font-light mb-4">{data.returns.policy}</p>
                    {data.returns.linkUrl && (
                        <a
                            href={data.returns.linkUrl}
                            className="text-sm underline hover:no-underline"
                        >
                            View full policy
                        </a>
                    )}
                </div>

                {/* Trust Guarantees */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                    {data.guarantees.map((guarantee, index) => {
                        const IconComponent = iconMap[guarantee.icon] || ShieldCheck;
                        return (
                            <div key={index} className="text-center">
                                <IconComponent className="w-8 h-8 mx-auto mb-3 text-[#1A110B]" />
                                <div className="text-sm font-light">{guarantee.text}</div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}

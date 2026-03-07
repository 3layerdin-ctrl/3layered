import Link from "next/link";
import { products } from "@/data/products";
import { BestSellerCards } from "./BestSellerCards";

const TARGET_IDS = [
    "bake-bihari-mandir",
    "kalinga-archiva",
    "mahal-archiva",
    "gopuram-archiva",
];

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://3layered.com';

export function BestSellers() {
    const bestSellers = TARGET_IDS
        .map(id => products.find(p => p.id === id))
        .filter((p): p is NonNullable<typeof p> => p !== undefined);

    const jsonLd = {
        "@context": "https://schema.org",
        "@type": "ItemList",
        "name": "Best Selling Miniature Temple Models — 3 Layered",
        "url": `${SITE_URL}/#bestsellers`,
        "itemListElement": bestSellers.map((product, index) => ({
            "@type": "ListItem",
            "position": index + 1,
            "item": {
                "@type": "Product",
                "name": product.name,
                "description": product.shortDescription,
                "url": `${SITE_URL}/products/${product.slug}`,
                "image": product.images[0] || '',
                "offers": {
                    "@type": "Offer",
                    "price": product.price.toString(),
                    "priceCurrency": "INR",
                    "availability": product.inStock
                        ? "https://schema.org/InStock"
                        : "https://schema.org/OutOfStock",
                },
            },
        })),
    };

    return (
        <section className="relative py-24 overflow-hidden bg-[#FAF7F2]" id="bestsellers">
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />

            {/* Grand Temple Archway Background Pattern */}
            <div className="absolute top-0 inset-x-0 h-96 opacity-[0.04] pointer-events-none flex justify-center overflow-hidden" style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg width='400' height='400' viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M200 50C100 50 50 150 50 250L50 400L350 400L350 250C350 150 300 50 200 50Z' fill='none' stroke='%234A3121' stroke-width='4'/%3E%3Cpath d='M200 80C120 80 80 160 80 250L80 400L320 400L320 250C320 160 280 80 200 80Z' fill='none' stroke='%234A3121' stroke-width='2' stroke-dasharray='10 10'/%3E%3Ccircle cx='200' cy='200' r='100' fill='none' stroke='%234A3121' stroke-width='1' opacity='0.5'/%3E%3Cpath d='M200 100V300M100 200H300' stroke='%234A3121' stroke-width='1' opacity='0.5'/%3E%3C/svg%3E")`,
                backgroundPosition: 'top center',
                backgroundSize: '800px 800px',
                backgroundRepeat: 'repeat-x'
            }} />
            <div className="absolute inset-0 z-0 opacity-[0.02] pointer-events-none" style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M30 5l5 10 h10 l-8 8 l3 12 l-10 -6 l-10 6 l3 -12 l-8 -8 h10 z' fill='%234A3121'/%3E%3C/svg%3E")`,
                backgroundSize: '120px 120px',
            }} />

            <div className="w-[95%] xl:w-[1400px] 2xl:w-[1600px] max-w-[100%] mx-auto px-4 sm:px-6 relative z-10 block">
                {/* Header */}
                <div className="text-center mb-16 md:mb-20">
                    <div className="inline-flex flex-col items-center justify-center mb-6">
                        <div className="flex items-center gap-4 mb-3">
                            <span className="w-16 h-[1px] bg-gradient-to-r from-transparent to-amber-600/60"></span>
                            <span className="text-amber-800 font-semibold tracking-[0.25em] uppercase text-xs md:text-sm">
                                The Masterpiece Collection
                            </span>
                            <span className="w-16 h-[1px] bg-gradient-to-l from-transparent to-amber-600/60"></span>
                        </div>
                        <h2 className="font-serif text-5xl md:text-6xl lg:text-7xl font-bold bg-clip-text text-transparent bg-gradient-to-br from-[#2A2320] via-[#4A3121] to-[#7B5035] drop-shadow-sm pb-2">
                            Best Sellers
                        </h2>
                    </div>
                    <p className="text-gray-600/90 max-w-2xl mx-auto text-lg md:text-xl font-light leading-relaxed">
                        Discover our most celebrated architectural replicas. Intricately designed miniature temples bringing timeless heritage into your sacred space.
                    </p>
                </div>

                {/* Animated product cards — client component */}
                <BestSellerCards products={bestSellers} />

                {/* View All Button */}
                <div className="mt-20 text-center">
                    <Link
                        href="/products"
                        className="group inline-flex items-center gap-3 px-8 py-4 bg-[#2A2320] text-white rounded-full font-medium tracking-wide hover:bg-amber-900 transition-all duration-300 shadow-lg hover:shadow-xl hover:-translate-y-1"
                    >
                        <span>Explore Full Collection</span>
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 transform group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                        </svg>
                    </Link>
                </div>
            </div>
        </section>
    );
}

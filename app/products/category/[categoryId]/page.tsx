import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { getCategoryById, categories } from '@/data/categories';
import { getProductsByCategory, formatPrice } from '@/lib/products';
import { Navbar } from '@/components/Navbar';
import { SlideProvider } from '@/contexts/SlideContext';

interface CategoryPageProps {
    params: Promise<{
        categoryId: string;
    }>;
}

export async function generateStaticParams() {
    return categories.map((category) => ({
        categoryId: category.id,
    }));
}

export async function generateMetadata({ params }: CategoryPageProps): Promise<Metadata> {
    const { categoryId } = await params;
    const category = getCategoryById(categoryId);

    if (!category) {
        return { title: 'Category Not Found' };
    }

    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.3layered.com';
    const categoryUrl = `${siteUrl}/products/category/${categoryId}`;

    return {
        title: `${category.name} | Three Layered`,
        description: category.description,
        alternates: {
            canonical: categoryUrl,
        },
        openGraph: {
            title: `${category.name} | Three Layered`,
            description: category.description,
            type: 'website',
            url: categoryUrl,
        },
    };
}

export default async function CategoryPage({ params }: CategoryPageProps) {
    const { categoryId } = await params;
    const category = getCategoryById(categoryId);

    if (!category) {
        notFound();
    }

    const products = getProductsByCategory(categoryId);

    return (
        <SlideProvider>
            <Navbar />
            <main className="min-h-screen pt-24">
                {/* Category Hero */}
                <section className="bg-gray-50 border-b border-gray-200 py-16">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        {/* Breadcrumb */}
                        <nav className="mb-8">
                            <div className="flex items-center gap-2 text-sm text-gray-600">
                                <a href="/" className="hover:text-black transition-colors">
                                    Home
                                </a>
                                <span>/</span>
                                <span className="text-black">{category.name}</span>
                            </div>
                        </nav>

                        {/* Category Header */}
                        <div className="max-w-3xl">
                            <h1 className="font-algerian text-4xl md:text-5xl lg:text-6xl mb-6">
                                {category.name}
                            </h1>
                            <p className="text-xl text-gray-600 font-light leading-relaxed">
                                {category.description}
                            </p>
                        </div>
                    </div>
                </section>

                {/* Products Grid */}
                <section className="py-16">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        {products.length === 0 ? (
                            <div className="text-center py-24">
                                <p className="text-gray-600 text-lg">
                                    No products available in this category yet.
                                </p>
                                <Link
                                    href="/"
                                    className="inline-block mt-6 border-2 border-black px-6 py-3 hover:bg-black hover:text-white transition-colors"
                                >
                                    Return Home
                                </Link>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                                {products.map((product) => (
                                    <Link
                                        key={product.id}
                                        href={`/products/${product.slug}`}
                                        className="group bg-white border border-gray-200 overflow-hidden hover:shadow-xl transition-shadow duration-300"
                                    >
                                        {/* Product Image */}
                                        <div className="relative aspect-square bg-gray-100 overflow-hidden">
                                            {product.hero.gallery.length > 0 && (
                                                <Image
                                                    src={product.hero.gallery[0].url}
                                                    alt={product.hero.gallery[0].alt}
                                                    fill
                                                    className="object-contain transition-transform duration-500 group-hover:scale-105"
                                                />
                                            )}

                                            {/* Badges */}
                                            <div className="absolute top-4 left-4">
                                                {product.hero.badge.enabled && (
                                                    <div className="bg-white/95 backdrop-blur-sm text-black px-4 py-2 text-xs uppercase tracking-wider font-semibold border-2 border-black shadow-lg">
                                                        {product.hero.badge.text}
                                                    </div>
                                                )}
                                            </div>
                                        </div>

                                        {/* Product Info */}
                                        <div className="p-6">
                                            <h2 className="text-2xl font-light mb-3 group-hover:underline">
                                                {product.hero.productName}
                                            </h2>
                                            <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                                                {product.hero.tagline}
                                            </p>
                                            <div className="flex justify-between items-center">
                                                <div className="text-xl font-light">
                                                    {(product.isPrebook || product.hero.price.discountPercent) ? (
                                                        <div className="space-y-2">
                                                            {/* Discount Badge */}
                                                            {product.hero.price.discountPercent && (
                                                                <div className="inline-flex items-center bg-gradient-to-r from-green-600 to-emerald-600 text-white px-3 py-1 text-xs font-bold uppercase tracking-wider shadow-lg rounded-full">
                                                                    {product.hero.price.discountPercent}% OFF
                                                                </div>
                                                            )}
                                                            {/* Pricing */}
                                                            <div className="flex items-center gap-2">
                                                                {product.hero.price.originalAmount && (
                                                                    <span className="text-sm text-gray-400 line-through">
                                                                        ₹{product.hero.price.originalAmount.toLocaleString('en-IN')}
                                                                    </span>
                                                                )}
                                                                <span className="text-xl font-medium text-gray-900">
                                                                    ₹{product.hero.price.amount.toLocaleString('en-IN')}
                                                                </span>
                                                            </div>
                                                            {/* Savings */}
                                                            {product.hero.price.originalAmount && (
                                                                <div className="text-xs text-green-600 font-medium">
                                                                    Save ₹{(product.hero.price.originalAmount - product.hero.price.amount).toLocaleString('en-IN')}
                                                                </div>
                                                            )}
                                                        </div>
                                                    ) : (
                                                        formatPrice(product.hero.price)
                                                    )}
                                                </div>
                                                <div className="text-sm text-gray-500">
                                                    {product.assurance.production.leadTime.description.split(' in ')[1]}
                                                </div>
                                            </div>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        )}
                    </div>
                </section>
            </main>
        </SlideProvider>
    );
}

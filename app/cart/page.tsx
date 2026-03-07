'use client';

import { useCart } from '@/contexts/CartContext';
import { Navbar } from '@/components/Navbar';
import { SlideProvider } from '@/contexts/SlideContext';
import Image from 'next/image';
import Link from 'next/link';
import { Minus, Plus, ShoppingBag, ArrowLeft } from 'lucide-react';

export default function CartPage() {
    const { cart, removeFromCart, updateQuantity } = useCart();

    const formatPrice = (price: number, displayFormat: string) => {
        return displayFormat.replace('{amount}', price.toLocaleString());
    };

    return (
        <SlideProvider>
            <Navbar />
            <main className="min-h-screen bg-[#FAF7F2] pt-24">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-16">
                    {/* Header */}
                    <div className="mb-6 md:mb-12">
                        <Link
                            href="/"
                            className="inline-flex items-center gap-2 text-sm text-[#2A2320]/70 hover:text-[#DFB374] transition-colors mb-4 md:mb-6"
                        >
                            <ArrowLeft className="w-4 h-4" />
                            Continue Shopping
                        </Link>
                        <h1 className="font-serif text-3xl sm:text-5xl md:text-6xl font-bold mb-3 md:mb-4 text-[#1A110B]">
                            Shopping Cart
                        </h1>
                        <p className="text-[#2A2320]/80 text-lg">
                            {cart.totalItems} {cart.totalItems === 1 ? 'item' : 'items'} in your cart
                        </p>
                    </div>

                    {cart.items.length === 0 ? (
                        /* Empty Cart State */
                        <div className="bg-white border border-[#E8E1D5] rounded-xl shadow-sm p-8 md:p-16 text-center">
                            <ShoppingBag className="w-24 h-24 text-[#DFB374] mx-auto mb-6 opacity-50" />
                            <h2 className="font-serif text-3xl font-bold mb-4 text-[#1A110B]">Your cart is empty</h2>
                            <p className="text-[#2A2320]/80 mb-8">
                                Discover our collection of premium architectural miniatures
                            </p>
                            <Link
                                href="/products/category/miniature-temples"
                                className="inline-block bg-gradient-to-r from-[#DFB374] to-[#C99144] hover:from-[#C99144] hover:to-[#B88033] text-[#1A110B] px-8 py-4 font-semibold rounded-full transition-all duration-300 shadow-[0_0_20px_rgba(223,179,116,0.3)]"
                            >
                                Explore Products
                            </Link>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                            {/* Cart Items */}
                            <div className="lg:col-span-2 space-y-4">
                                {cart.items.map(item => (
                                    <div
                                        key={item.id}
                                        className="bg-white border border-[#E8E1D5] p-4 sm:p-6 rounded-xl shadow-sm"
                                    >
                                        <div className="flex gap-3 sm:gap-4">
                                            {/* Product Image */}
                                            <Link
                                                href={`/products/${item.productSlug}`}
                                                className="relative w-20 h-20 sm:w-28 sm:h-28 bg-[#FDFBF7] flex-shrink-0 overflow-hidden border border-[#E8E1D5]/50 rounded-lg"
                                            >
                                                <Image
                                                    src={item.productImage}
                                                    alt={item.productName}
                                                    fill
                                                    className="object-cover"
                                                />
                                            </Link>

                                            {/* Product Details — takes full remaining width */}
                                            <div className="flex-1 min-w-0">
                                                {/* Name + Price on same row */}
                                                <div className="flex items-start justify-between gap-2 mb-1">
                                                    <Link
                                                        href={`/products/${item.productSlug}`}
                                                        className="font-serif text-sm sm:text-xl font-bold text-[#1A110B] hover:text-[#DFB374] transition-colors leading-snug line-clamp-2 min-w-0"
                                                    >
                                                        {item.productName}
                                                    </Link>
                                                    <div className="text-right flex-shrink-0">
                                                        <div className="font-serif text-sm sm:text-xl font-bold text-[#1A110B]">
                                                            {formatPrice(item.totalPrice, item.displayFormat)}
                                                        </div>
                                                        {item.quantity > 1 && (
                                                            <div className="text-xs text-[#2A2320]/60 mt-0.5">
                                                                {formatPrice(item.totalPrice / item.quantity, item.displayFormat)} each
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>

                                                {/* Customizations */}
                                                {Object.keys(item.customizations).length > 0 && (
                                                    <div className="space-y-0.5 mb-2">
                                                        {Object.values(item.customizations).map((custom, idx) => (
                                                            <div key={idx} className="text-xs text-[#2A2320]/70">
                                                                <span className="font-medium text-[#1A110B]">{custom.variantName}</span>
                                                                {custom.priceModifier !== 0 && (
                                                                    <span className="ml-1 text-[#DFB374]">
                                                                        (+{formatPrice(custom.priceModifier, item.displayFormat)})
                                                                    </span>
                                                                )}
                                                            </div>
                                                        ))}
                                                    </div>
                                                )}

                                                {/* Quantity Controls + Remove */}
                                                <div className="flex flex-col sm:flex-row sm:items-center justify-between mt-4 gap-4">
                                                    <div className="flex items-center border border-[#E8E1D5] rounded-full overflow-hidden w-max">
                                                        <button
                                                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                                            className="p-2 hover:bg-[#FAF7F2] text-[#2A2320] transition-colors"
                                                            aria-label="Decrease quantity"
                                                        >
                                                            <Minus className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                                                        </button>
                                                        <span className="px-3 text-sm font-medium text-[#1A110B]">{item.quantity}</span>
                                                        <button
                                                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                                            className="p-2 hover:bg-[#FAF7F2] text-[#2A2320] transition-colors"
                                                            aria-label="Increase quantity"
                                                        >
                                                            <Plus className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                                                        </button>
                                                    </div>

                                                    <button
                                                        onClick={() => removeFromCart(item.id)}
                                                        className="text-xs sm:text-sm text-red-600/80 hover:text-red-700 font-medium transition-colors"
                                                    >
                                                        Remove
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Order Summary */}
                            <div className="lg:col-span-1">
                                <div className="bg-white border border-[#E8E1D5] p-6 md:p-8 rounded-xl shadow-sm lg:sticky lg:top-32">
                                    <h2 className="font-serif text-2xl font-bold mb-6 text-[#1A110B]">Order Summary</h2>

                                    <div className="space-y-4 mb-6">
                                        <div className="flex justify-between items-center gap-2 text-sm sm:text-base">
                                            <span className="text-[#2A2320]/80 flex-shrink-0">Subtotal</span>
                                            <span className="font-medium text-[#1A110B]">₹{cart.subtotal.toLocaleString()}</span>
                                        </div>
                                        <div className="flex justify-between items-start gap-2 text-sm sm:text-base">
                                            <span className="text-[#2A2320]/80 flex-shrink-0">Shipping</span>
                                            <span className="text-xs sm:text-sm text-[#2A2320]/60 text-right">Calculated at checkout</span>
                                        </div>
                                        <div className="flex justify-between items-start gap-2 text-sm sm:text-base">
                                            <span className="text-[#2A2320]/80 flex-shrink-0">Tax</span>
                                            <span className="text-xs sm:text-sm text-[#2A2320]/60 text-right">Calculated at checkout</span>
                                        </div>
                                    </div>

                                    <div className="border-t border-[#E8E1D5] pt-4 mb-8">
                                        <div className="flex justify-between items-baseline gap-2">
                                            <span className="text-base sm:text-lg font-medium text-[#1A110B]">Total</span>
                                            <span className="font-serif text-2xl sm:text-3xl font-bold text-[#1A110B]">
                                                ₹{cart.subtotal.toLocaleString()}
                                            </span>
                                        </div>
                                    </div>

                                    <div className="space-y-3">
                                        <Link
                                            href="/checkout"
                                            className="block w-full text-center bg-gradient-to-r from-[#DFB374] to-[#C99144] hover:from-[#C99144] hover:to-[#B88033] text-[#1A110B] py-4 px-6 text-lg font-semibold rounded-full transition-all duration-300 shadow-[0_0_20px_rgba(223,179,116,0.3)]"
                                        >
                                            Proceed to Checkout
                                        </Link>

                                        <Link
                                            href="/products/category/miniature-temples"
                                            className="block w-full text-center border border-[#DFB374] text-[#DFB374] hover:bg-[#DFB374]/10 py-4 px-6 font-semibold rounded-full transition-all duration-300"
                                        >
                                            Continue Shopping
                                        </Link>
                                    </div>

                                    {/* Trust Badges */}
                                    <div className="mt-8 pt-8 border-t border-[#E8E1D5] space-y-3 text-sm text-[#2A2320]/70">
                                        <div className="flex items-center gap-2">
                                            <span className="text-[#DFB374]">✓</span>
                                            <span>Secure payment processing</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <span className="text-[#DFB374]">✓</span>
                                            <span>Free shipping on all orders</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <span className="text-[#DFB374]">✓</span>
                                            <span>30-day return policy</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </main>
        </SlideProvider>
    );
}

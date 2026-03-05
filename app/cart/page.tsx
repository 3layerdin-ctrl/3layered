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
            <main className="min-h-screen bg-gray-50 pt-24">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-16">
                    {/* Header */}
                    <div className="mb-6 md:mb-12">
                        <Link
                            href="/"
                            className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-black transition-colors mb-4 md:mb-6"
                        >
                            <ArrowLeft className="w-4 h-4" />
                            Continue Shopping
                        </Link>
                        <h1 className="font-serif text-3xl sm:text-5xl md:text-6xl font-bold mb-3 md:mb-4">
                            Shopping Cart
                        </h1>
                        <p className="text-gray-600 text-lg">
                            {cart.totalItems} {cart.totalItems === 1 ? 'item' : 'items'} in your cart
                        </p>
                    </div>

                    {cart.items.length === 0 ? (
                        /* Empty Cart State */
                        <div className="bg-white border border-gray-200 rounded-lg p-8 md:p-16 text-center">
                            <ShoppingBag className="w-24 h-24 text-gray-300 mx-auto mb-6" />
                            <h2 className="font-serif text-3xl font-bold mb-4">Your cart is empty</h2>
                            <p className="text-gray-600 mb-8">
                                Discover our collection of premium architectural miniatures
                            </p>
                            <Link
                                href="/products/category/miniature-temples"
                                className="inline-block bg-black text-white px-8 py-4 hover:bg-gray-900 transition-colors"
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
                                        className="bg-white border border-gray-200 p-4 sm:p-6"
                                    >
                                        <div className="flex gap-3 sm:gap-6">
                                            {/* Product Image */}
                                            <Link
                                                href={`/products/${item.productSlug}`}
                                                className="relative w-24 h-24 sm:w-32 sm:h-32 bg-gray-100 flex-shrink-0 overflow-hidden"
                                            >
                                                <Image
                                                    src={item.productImage}
                                                    alt={item.productName}
                                                    fill
                                                    className="object-cover"
                                                />
                                            </Link>

                                            {/* Product Details */}
                                            <div className="flex-1">
                                                <Link
                                                    href={`/products/${item.productSlug}`}
                                                    className="font-serif text-lg sm:text-2xl font-bold hover:underline mb-2 block"
                                                >
                                                    {item.productName}
                                                </Link>

                                                {/* Customizations */}
                                                {Object.keys(item.customizations).length > 0 && (
                                                    <div className="space-y-1 mb-4">
                                                        {Object.values(item.customizations).map((custom, idx) => (
                                                            <div key={idx} className="text-sm text-gray-600">
                                                                <span className="font-medium">{custom.variantName}</span>
                                                                {custom.priceModifier !== 0 && (
                                                                    <span className="ml-2">
                                                                        (+{formatPrice(custom.priceModifier, item.displayFormat)})
                                                                    </span>
                                                                )}
                                                            </div>
                                                        ))}
                                                    </div>
                                                )}

                                                <div className="flex items-center gap-3 sm:gap-6 mt-2">
                                                    {/* Quantity Controls */}
                                                    <div className="flex items-center border-2 border-gray-200">
                                                        <button
                                                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                                            className="p-2 sm:p-3 hover:bg-gray-100 transition-colors"
                                                            aria-label="Decrease quantity"
                                                        >
                                                            <Minus className="w-4 h-4" />
                                                        </button>
                                                        <span className="px-3 sm:px-6 text-base font-medium">{item.quantity}</span>
                                                        <button
                                                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                                            className="p-2 sm:p-3 hover:bg-gray-100 transition-colors"
                                                            aria-label="Increase quantity"
                                                        >
                                                            <Plus className="w-4 h-4" />
                                                        </button>
                                                    </div>

                                                    {/* Remove Button */}
                                                    <button
                                                        onClick={() => removeFromCart(item.id)}
                                                        className="text-sm text-red-600 hover:underline"
                                                    >
                                                        Remove
                                                    </button>
                                                </div>
                                            </div>

                                            {/* Price */}
                                            <div className="text-right flex-shrink-0">
                                                <div className="font-serif text-lg sm:text-2xl font-bold">
                                                    {formatPrice(item.totalPrice, item.displayFormat)}
                                                </div>
                                                {item.quantity > 1 && (
                                                    <div className="text-sm text-gray-500 mt-1">
                                                        {formatPrice(item.totalPrice / item.quantity, item.displayFormat)} each
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Order Summary */}
                            <div className="lg:col-span-1">
                                <div className="bg-white border border-gray-200 p-4 md:p-8 lg:sticky lg:top-32">
                                    <h2 className="font-serif text-2xl font-bold mb-6">Order Summary</h2>

                                    <div className="space-y-4 mb-6">
                                        <div className="flex justify-between text-base">
                                            <span className="text-gray-600">Subtotal</span>
                                            <span className="font-medium">₹{cart.subtotal.toLocaleString()}</span>
                                        </div>
                                        <div className="flex justify-between text-base">
                                            <span className="text-gray-600">Shipping</span>
                                            <span className="text-sm text-gray-500">Calculated at checkout</span>
                                        </div>
                                        <div className="flex justify-between text-base">
                                            <span className="text-gray-600">Tax</span>
                                            <span className="text-sm text-gray-500">Calculated at checkout</span>
                                        </div>
                                    </div>

                                    <div className="border-t border-gray-200 pt-6 mb-6">
                                        <div className="flex justify-between items-baseline">
                                            <span className="text-lg font-medium">Total</span>
                                            <span className="font-serif text-3xl font-bold">
                                                ₹{cart.subtotal.toLocaleString()}
                                            </span>
                                        </div>
                                    </div>

                                    <Link
                                        href="/checkout"
                                        className="block w-full text-center bg-black text-white py-4 px-6 text-lg font-light tracking-wide hover:bg-gray-900 transition-colors duration-200 mb-4"
                                    >
                                        Proceed to Checkout
                                    </Link>

                                    <Link
                                        href="/products/category/miniature-temples"
                                        className="block w-full text-center border-2 border-black text-black py-3 px-6 font-light hover:bg-gray-50 transition-colors duration-200"
                                    >
                                        Continue Shopping
                                    </Link>

                                    {/* Trust Badges */}
                                    <div className="mt-8 pt-8 border-t border-gray-200 space-y-3 text-sm text-gray-600">
                                        <div className="flex items-center gap-2">
                                            <span>✓</span>
                                            <span>Secure payment processing</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <span>✓</span>
                                            <span>Free shipping on all orders</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <span>✓</span>
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

'use client';

import { useCart } from '@/contexts/CartContext';
import Image from 'next/image';
import Link from 'next/link';
import { X, Minus, Plus, ShoppingBag } from 'lucide-react';
import { useEffect } from 'react';

export function CartDrawer() {
    const { cart, isCartOpen, closeCart, removeFromCart, updateQuantity } = useCart();

    // Prevent body scroll when cart is open
    useEffect(() => {
        if (isCartOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isCartOpen]);

    const formatPrice = (price: number, displayFormat: string) => {
        return displayFormat.replace('{amount}', price.toLocaleString());
    };

    return (
        <>
            {/* Backdrop */}
            {isCartOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-50 transition-opacity duration-300"
                    onClick={closeCart}
                />
            )}

            {/* Drawer */}
            <div
                className={`fixed top-0 right-0 h-full w-full md:w-[500px] bg-white z-50 shadow-2xl transform transition-transform duration-300 ease-in-out ${isCartOpen ? 'translate-x-0' : 'translate-x-full'
                    }`}
            >
                <div className="flex flex-col h-full">
                    {/* Header */}
                    <div className="flex items-center justify-between p-6 border-b border-gray-200">
                        <div className="flex items-center gap-3">
                            <ShoppingBag className="w-6 h-6" />
                            <h2 className="text-2xl font-serif font-bold">Your Cart</h2>
                        </div>
                        <button
                            onClick={closeCart}
                            className="p-2 hover:bg-gray-100 transition-colors rounded-full"
                            aria-label="Close cart"
                        >
                            <X className="w-6 h-6" />
                        </button>
                    </div>

                    {/* Cart Items */}
                    <div className="flex-1 overflow-y-auto p-6">
                        {cart.items.length === 0 ? (
                            <div className="flex flex-col items-center justify-center h-full text-center">
                                <ShoppingBag className="w-16 h-16 text-gray-300 mb-4" />
                                <p className="text-lg text-gray-600 mb-2">Start Your Architectural Heritage Collection Today</p>
                                <p className="text-sm text-gray-500 mb-6">
                                    Explore our museum-quality miniature temples and precision-engineered architectural models
                                </p>
                                <button
                                    onClick={closeCart}
                                    className="border-2 border-black px-6 py-3 hover:bg-black hover:text-white transition-colors duration-200"
                                >
                                    Browse Temple Collections
                                </button>
                            </div>
                        ) : (
                            <div className="space-y-5">
                                {cart.items.map(item => (
                                    <div key={item.id} className="border-b border-gray-200 pb-5">
                                        <div className="flex gap-3">
                                            {/* Product Image */}
                                            <Link
                                                href={`/products/${item.productSlug}`}
                                                onClick={closeCart}
                                                className="relative w-20 h-20 bg-gray-100 flex-shrink-0 overflow-hidden"
                                            >
                                                <Image
                                                    src={item.productImage}
                                                    alt={item.productName}
                                                    fill
                                                    className="object-cover"
                                                />
                                            </Link>

                                            {/* Product Info — full remaining width */}
                                            <div className="flex-1 min-w-0">
                                                {/* Name + Price on same row */}
                                                <div className="flex items-start justify-between gap-2 mb-1">
                                                    <Link
                                                        href={`/products/${item.productSlug}`}
                                                        onClick={closeCart}
                                                        className="font-medium text-sm leading-snug hover:underline line-clamp-2 min-w-0"
                                                    >
                                                        {item.productName}
                                                    </Link>
                                                    <div className="font-medium text-sm flex-shrink-0">
                                                        {formatPrice(item.totalPrice, item.displayFormat)}
                                                    </div>
                                                </div>

                                                {/* Customizations */}
                                                {Object.keys(item.customizations).length > 0 && (
                                                    <div className="space-y-0.5 mb-2">
                                                        {Object.values(item.customizations).map((custom, idx) => (
                                                            <div key={idx} className="text-xs text-gray-600">
                                                                {custom.variantName}
                                                                {custom.priceModifier !== 0 && (
                                                                    <span className="ml-1">
                                                                        (+{formatPrice(custom.priceModifier, item.displayFormat)})
                                                                    </span>
                                                                )}
                                                            </div>
                                                        ))}
                                                    </div>
                                                )}

                                                {/* Quantity Controls + Remove */}
                                                <div className="flex items-center justify-between mt-2">
                                                    <div className="flex items-center border border-gray-300">
                                                        <button
                                                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                                            className="p-1.5 hover:bg-gray-100 transition-colors"
                                                            aria-label="Decrease quantity"
                                                        >
                                                            <Minus className="w-3.5 h-3.5" />
                                                        </button>
                                                        <span className="px-3 text-sm">{item.quantity}</span>
                                                        <button
                                                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                                            className="p-1.5 hover:bg-gray-100 transition-colors"
                                                            aria-label="Increase quantity"
                                                        >
                                                            <Plus className="w-3.5 h-3.5" />
                                                        </button>
                                                    </div>

                                                    <button
                                                        onClick={() => removeFromCart(item.id)}
                                                        className="text-xs text-red-600 hover:underline"
                                                    >
                                                        Remove
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Footer / Checkout Section */}
                    {cart.items.length > 0 && (
                        <div className="border-t border-gray-200 p-6 space-y-4">
                            {/* Subtotal */}
                            <div className="flex justify-between items-center text-lg">
                                <span className="font-light">Subtotal</span>
                                <span className="font-serif text-2xl font-bold">
                                    ₹{cart.subtotal.toLocaleString()}
                                </span>
                            </div>

                            <p className="text-xs text-gray-500 text-center">
                                Shipping and taxes calculated at checkout
                            </p>

                            {/* Checkout Button */}
                            <Link
                                href="/checkout"
                                onClick={closeCart}
                                className="block w-full bg-black text-white text-center py-4 px-6 font-light tracking-wide hover:bg-gray-900 transition-colors duration-200 mb-3"
                            >
                                Proceed to Checkout
                            </Link>

                            {/* View Cart Button */}
                            <Link
                                href="/cart"
                                onClick={closeCart}
                                className="block w-full border-2 border-black text-black text-center py-3 px-6 font-light tracking-wide hover:bg-gray-50 transition-colors duration-200 mb-3"
                            >
                                View Cart
                            </Link>

                            <button
                                onClick={closeCart}
                                className="w-full border-2 border-black text-black py-3 px-6 font-light tracking-wide hover:bg-gray-50 transition-colors duration-200"
                            >
                                Continue Shopping
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}

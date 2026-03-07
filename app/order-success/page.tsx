'use client';

import { Suspense, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { Navbar } from '@/components/Navbar';
import { SlideProvider } from '@/contexts/SlideContext';
import Link from 'next/link';
import { CheckCircle, Mail, Package } from 'lucide-react';
import { pixelPurchase } from '@/lib/pixel';

function OrderSuccessContent() {
    const searchParams = useSearchParams();
    const orderNumber = searchParams.get('orderNumber');
    const paymentMethod = searchParams.get('paymentMethod') || 'cod';
    const total = parseFloat(searchParams.get('total') || '0');
    const numItems = parseInt(searchParams.get('numItems') || '1', 10);
    const contentIds = (searchParams.get('contentIds') || '').split(',').filter(Boolean);

    useEffect(() => {
        if (total > 0) {
            pixelPurchase({
                value: total,
                contentIds: contentIds.length > 0 ? contentIds : ['unknown'],
                numItems,
            });
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
            <CheckCircle className="w-24 h-24 text-green-600 mx-auto mb-6" />
            <h1 className="font-serif text-5xl font-bold mb-4">Order Confirmed!</h1>
            <p className="text-xl text-gray-600 mb-8">
                Thank you for your purchase. Your order has been received and is being processed.
            </p>

            {orderNumber && (
                <div className="bg-gray-50 border border-gray-200 p-6 mb-8">
                    <p className="text-sm text-gray-600 mb-2">Order Number</p>
                    <p className="font-mono text-2xl font-bold">{orderNumber}</p>
                </div>
            )}

            <div className="bg-blue-50 border border-blue-200 p-6 mb-6 text-left">
                <p className="font-bold text-blue-900 mb-2">📱 WhatsApp Confirmation</p>
                <p className="text-blue-800">
                    You will receive order confirmation and updates on WhatsApp shortly.
                    Please keep your phone handy!
                </p>
            </div>

            {paymentMethod === 'online' ? (
                <div className="bg-green-50 border border-green-200 p-6 mb-8 text-left">
                    <p className="font-bold text-green-900 mb-2">💳 Payment Successful</p>
                    <p className="text-green-800">
                        Your payment has been successfully processed. Thank you for choosing online payment!
                    </p>
                </div>
            ) : (
                <div className="bg-yellow-50 border border-yellow-200 p-6 mb-8 text-left">
                    <p className="font-bold text-yellow-900 mb-2">💳 Payment Method</p>
                    <p className="text-yellow-800">
                        Cash on Delivery (COD) - Please keep exact cash ready when receiving your order.
                    </p>
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div className="bg-white border border-gray-200 p-6">
                    <Mail className="w-8 h-8 mx-auto mb-4 text-gray-600" />
                    <h3 className="font-bold mb-2">Check Your Email</h3>
                    <p className="text-sm text-gray-600">
                        We've sent order confirmation details to your email address.
                    </p>
                </div>

                <div className="bg-white border border-gray-200 p-6">
                    <Package className="w-8 h-8 mx-auto mb-4 text-gray-600" />
                    <h3 className="font-bold mb-2">Track Your Order</h3>
                    <p className="text-sm text-gray-600">
                        You'll receive shipping updates via WhatsApp once your order is dispatched.
                    </p>
                </div>
            </div>

            <div className="space-y-4">
                <Link
                    href="/products"
                    className="inline-block bg-black text-white px-8 py-4 hover:bg-gray-900 transition-colors mr-4"
                >
                    Continue Shopping
                </Link>
                <Link
                    href="/"
                    className="inline-block border-2 border-black text-black px-8 py-4 hover:bg-gray-50 transition-colors"
                >
                    Back to Home
                </Link>
            </div>
        </div>
    );
}

export default function OrderSuccessPage() {
    return (
        <SlideProvider>
            <Navbar />
            <main className="min-h-screen bg-gray-50 pt-24 pb-16">
                <Suspense fallback={
                    <div className="max-w-2xl mx-auto px-4 py-16 text-center">
                        <p>Loading...</p>
                    </div>
                }>
                    <OrderSuccessContent />
                </Suspense>
            </main>
        </SlideProvider>
    );
}

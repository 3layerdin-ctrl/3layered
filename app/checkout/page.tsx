'use client';

import { useState, useEffect } from 'react';
import { useCart } from '@/contexts/CartContext';
import { Navbar } from '@/components/Navbar';
import { SlideProvider } from '@/contexts/SlideContext';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft, Lock, CreditCard, Truck, Package, X, Tag, Copy } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { CelebrationAnimation } from '@/components/CelebrationAnimation';


export default function CheckoutPage() {
    const { cart, clearCart } = useCart();
    const router = useRouter();
    const [step, setStep] = useState<'information' | 'shipping' | 'payment'>('information');
    const [isProcessing, setIsProcessing] = useState(false);
    const [razorpayLoaded, setRazorpayLoaded] = useState(false);

    // Coupon code state
    const [couponCode, setCouponCode] = useState('');
    const [appliedCoupon, setAppliedCoupon] = useState<{ code: string; discount: number } | null>(null);
    const [couponError, setCouponError] = useState('');
    const [showCelebration, setShowCelebration] = useState(false);
    const [formData, setFormData] = useState({
        // Contact Information
        email: '',
        phone: '', // Will store only 10 digits without +91

        // Shipping Address
        firstName: '',
        lastName: '',
        address: '',
        apartment: '',
        city: '',
        state: '',
        pincode: '',
        country: 'India',

        // Payment Method
        paymentMethod: 'online', // Default to online payment

        // Order Notes
        orderNotes: '',
    });

    const COD_CHARGE = 25;

    // Coupon validation function
    const validateCoupon = (code: string): { valid: boolean; discount: number; message?: string } => {
        // Remove all whitespace and convert to uppercase
        const cleanCode = code.replace(/\s/g, '').toUpperCase();

        if (cleanCode === 'WELCOME150') {
            // Minimum cart value of ₹1000 required for WELCOME150
            if (cart.subtotal < 1000) {
                return { valid: false, discount: 0, message: 'Minimum cart value of ₹1,000 required to use this coupon' };
            }
            return { valid: true, discount: 150 };
        }

        return { valid: false, discount: 0, message: 'Invalid coupon code' };
    };

    // Apply coupon function
    const handleApplyCoupon = () => {
        if (!couponCode.trim()) {
            setCouponError('Please enter a coupon code');
            return;
        }

        const validation = validateCoupon(couponCode);

        if (validation.valid) {
            setAppliedCoupon({ code: couponCode.toUpperCase().trim(), discount: validation.discount });
            setCouponError('');
            setCouponCode('');
            setShowCelebration(true);
        } else {
            setCouponError(validation.message || 'Invalid coupon code');
            setAppliedCoupon(null);
        }
    };

    // Remove coupon function
    const handleRemoveCoupon = () => {
        setAppliedCoupon(null);
        setCouponCode('');
        setCouponError('');
    };

    // Calculate final total with discount
    const calculateTotal = () => {
        let total = cart.subtotal;
        if (formData.paymentMethod === 'cod') {
            total += COD_CHARGE;
        }
        if (appliedCoupon) {
            total -= appliedCoupon.discount;
        }
        return Math.max(total, 0); // Ensure total doesn't go negative
    };

    // Load Razorpay script
    useEffect(() => {
        const script = document.createElement('script');
        script.src = 'https://checkout.razorpay.com/v1/checkout.js';
        script.async = true;
        script.onload = () => setRazorpayLoaded(true);
        document.body.appendChild(script);

        return () => {
            document.body.removeChild(script);
        };
    }, []);

    const formatPrice = (price: number) => {
        return `₹${price.toLocaleString()}`;
    };

    const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        // Only allow digits and limit to 10
        const value = e.target.value.replace(/\D/g, '').slice(0, 10);
        setFormData({ ...formData, phone: value });
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleRazorpayPayment = async () => {
        if (!razorpayLoaded) {
            alert('Payment system is loading. Please wait...');
            return;
        }

        setIsProcessing(true);
        const finalTotal = calculateTotal();

        try {
            // Create Razorpay order
            const orderResponse = await fetch('/api/razorpay/create-order', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    amount: finalTotal,
                    currency: 'INR',
                    receipt: `receipt_${Date.now()}`,
                    notes: {
                        customerName: `${formData.firstName} ${formData.lastName}`,
                        customerEmail: formData.email,
                    },
                }),
            });

            const orderData = await orderResponse.json();

            if (!orderData.success) {
                throw new Error('Failed to create payment order');
            }

            // Initialize Razorpay checkout
            const options = {
                key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID!,
                amount: orderData.amount,
                currency: orderData.currency,
                name: '3Layered',
                description: 'Order Payment',
                order_id: orderData.orderId,
                handler: async (response: any) => {
                    try {
                        // Verify payment
                        const verifyResponse = await fetch('/api/razorpay/verify-payment', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({
                                razorpay_order_id: response.razorpay_order_id,
                                razorpay_payment_id: response.razorpay_payment_id,
                                razorpay_signature: response.razorpay_signature,
                            }),
                        });

                        const verifyData = await verifyResponse.json();

                        if (verifyData.success) {
                            // Create order in database
                            const createOrderResponse = await fetch('/api/orders', {
                                method: 'POST',
                                headers: { 'Content-Type': 'application/json' },
                                body: JSON.stringify({
                                    customerName: `${formData.firstName} ${formData.lastName}`,
                                    customerEmail: formData.email,
                                    customerPhone: `+91${formData.phone}`,
                                    customerAddress: {
                                        address: formData.address,
                                        apartment: formData.apartment,
                                        city: formData.city,
                                        state: formData.state,
                                        pincode: formData.pincode,
                                        country: formData.country,
                                    },
                                    items: cart.items,
                                    subtotal: cart.subtotal,
                                    total: finalTotal,
                                    couponCode: appliedCoupon?.code || null,
                                    discount: appliedCoupon?.discount || 0,
                                    notes: formData.orderNotes,
                                    paymentMethod: 'online',
                                    razorpayOrderId: response.razorpay_order_id,
                                    razorpayPaymentId: response.razorpay_payment_id,
                                    razorpaySignature: response.razorpay_signature,
                                }),
                            });

                            const orderResult = await createOrderResponse.json();

                            if (orderResult.success) {
                                clearCart();
                                router.push(`/order-success?orderNumber=${orderResult.orderNumber}&paymentMethod=online`);
                            } else {
                                alert('Payment successful but order creation failed. Please contact support.');
                            }
                        } else {
                            alert('Payment verification failed. Please contact support.');
                        }
                    } catch (error) {
                        console.error('Payment verification error:', error);
                        alert('Payment verification failed. Please contact support.');
                    } finally {
                        setIsProcessing(false);
                    }
                },
                prefill: {
                    name: `${formData.firstName} ${formData.lastName}`,
                    email: formData.email,
                    contact: formData.phone,
                },
                theme: {
                    color: '#000000',
                },
                modal: {
                    ondismiss: () => {
                        setIsProcessing(false);
                        alert('Payment cancelled. Your order has not been placed.');
                    },
                },
            };

            const razorpay = new window.Razorpay(options);
            razorpay.open();
        } catch (error) {
            console.error('Payment error:', error);
            alert('Failed to initiate payment. Please try again.');
            setIsProcessing(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Validate phone number
        if (formData.phone.length !== 10) {
            alert('Please enter a valid 10-digit mobile number');
            return;
        }

        // Route to appropriate payment flow
        if (formData.paymentMethod === 'online') {
            await handleRazorpayPayment();
        } else {
            // COD flow
            setIsProcessing(true);
            const codCharge = COD_CHARGE;
            const finalTotal = calculateTotal();

            try {
                const response = await fetch('/api/orders', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        customerName: `${formData.firstName} ${formData.lastName}`,
                        customerEmail: formData.email,
                        customerPhone: `+91${formData.phone}`,
                        customerAddress: {
                            address: formData.address,
                            apartment: formData.apartment,
                            city: formData.city,
                            state: formData.state,
                            pincode: formData.pincode,
                            country: formData.country,
                        },
                        items: cart.items,
                        subtotal: cart.subtotal,
                        total: finalTotal,
                        couponCode: appliedCoupon?.code || null,
                        discount: appliedCoupon?.discount || 0,
                        notes: formData.orderNotes,
                        paymentMethod: 'cod',
                    }),
                });

                const data = await response.json();

                if (response.ok && data.success) {
                    clearCart();
                    router.push(`/order-success?orderNumber=${data.orderNumber}&paymentMethod=cod`);
                } else {
                    alert('Failed to place order. Please try again.');
                }
            } catch (error) {
                console.error('Order error:', error);
                alert('Failed to place order. Please try again.');
            } finally {
                setIsProcessing(false);
            }
        }
    };

    if (cart.items.length === 0) {
        return (
            <SlideProvider>
                <Navbar />
                <main className="min-h-screen bg-gray-50 pt-20 md:pt-24 pb-8 md:pb-16">
                    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
                        <Package className="w-24 h-24 text-gray-300 mx-auto mb-6" />
                        <h1 className="font-serif text-4xl font-bold mb-4">Your cart is empty</h1>
                        <p className="text-gray-600 mb-8">Add some items to your cart before checking out.</p>
                        <Link
                            href="/products/category/miniature-temples"
                            className="inline-block bg-black text-white px-8 py-4 hover:bg-gray-900 transition-colors"
                        >
                            Continue Shopping
                        </Link>
                    </div>
                </main>
            </SlideProvider>
        );
    }

    return (
        <SlideProvider>
            <Navbar />
            <main className="min-h-screen bg-gray-50 pt-24 pb-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 md:py-8">
                    {/* Header */}
                    <div className="mb-4 md:mb-8">
                        <Link
                            href="/cart"
                            className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-black transition-colors mb-3 md:mb-6"
                        >
                            <ArrowLeft className="w-4 h-4" />
                            Back to Cart
                        </Link>
                        <h1 className="font-serif text-3xl md:text-5xl lg:text-6xl font-bold">Checkout</h1>
                    </div>

                    <div className="flex flex-col-reverse lg:grid lg:grid-cols-2 gap-6 md:gap-12">
                        {/* Checkout Form - Shows second on mobile, first on desktop */}
                        <div>
                            <form onSubmit={handleSubmit} className="space-y-4 md:space-y-8">
                                {/* Contact Information */}
                                <div className="bg-white border border-gray-200 p-4 md:p-8">
                                    <div className="flex items-center gap-2 md:gap-3 mb-4 md:mb-6">
                                        <div className="w-6 h-6 md:w-8 md:h-8 bg-black text-white rounded-full flex items-center justify-center text-xs md:text-sm font-bold">
                                            1
                                        </div>
                                        <h2 className="font-serif text-lg md:text-2xl font-bold">Contact Information</h2>
                                    </div>

                                    <div className="space-y-3 md:space-y-4">
                                        <div>
                                            <label htmlFor="email" className="block text-xs md:text-sm font-medium mb-1 md:mb-2">
                                                Email Address *
                                            </label>
                                            <input
                                                type="email"
                                                id="email"
                                                name="email"
                                                required
                                                value={formData.email}
                                                onChange={handleInputChange}
                                                className="w-full border-2 border-gray-200 px-4 py-3 focus:border-black focus:outline-none transition-colors"
                                                placeholder="your@email.com"
                                            />
                                        </div>

                                        <div>
                                            <label htmlFor="phone" className="block text-xs md:text-sm font-medium mb-1 md:mb-2">
                                                Mobile Number * (10 digits)
                                            </label>
                                            <div className="flex">
                                                <span className="inline-flex items-center px-2 py-2 md:px-4 md:py-3 text-xs md:text-base border-2 border-r-0 border-gray-200 bg-gray-50 text-gray-700 font-medium">
                                                    +91
                                                </span>
                                                <input
                                                    type="tel"
                                                    id="phone"
                                                    name="phone"
                                                    required
                                                    value={formData.phone}
                                                    onChange={handlePhoneChange}
                                                    className="flex-1 border-2 border-gray-200 px-3 py-2 md:px-4 md:py-3 text-sm md:text-base focus:border-black focus:outline-none transition-colors"
                                                    placeholder="9876543210"
                                                    maxLength={10}
                                                    pattern="[0-9]{10}"
                                                />
                                            </div>
                                            {formData.phone.length > 0 && formData.phone.length < 10 && (
                                                <p className="text-red-600 text-sm mt-1">
                                                    Please enter 10 digits ({formData.phone.length}/10)
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {/* Shipping Address */}
                                <div className="bg-white border border-gray-200 p-4 md:p-8">
                                    <div className="flex items-center gap-2 md:gap-3 mb-4 md:mb-6">
                                        <div className="w-6 h-6 md:w-8 md:h-8 bg-black text-white rounded-full flex items-center justify-center text-xs md:text-sm font-bold">
                                            2
                                        </div>
                                        <h2 className="font-serif text-lg md:text-2xl font-bold">Shipping Address</h2>
                                    </div>

                                    <div className="space-y-4">
                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <label htmlFor="firstName" className="block text-xs md:text-sm font-medium mb-1 md:mb-2">
                                                    First Name *
                                                </label>
                                                <input
                                                    type="text"
                                                    id="firstName"
                                                    name="firstName"
                                                    required
                                                    value={formData.firstName}
                                                    onChange={handleInputChange}
                                                    className="w-full border-2 border-gray-200 px-4 py-3 focus:border-black focus:outline-none transition-colors"
                                                />
                                            </div>

                                            <div>
                                                <label htmlFor="lastName" className="block text-sm font-medium mb-2">
                                                    Last Name *
                                                </label>
                                                <input
                                                    type="text"
                                                    id="lastName"
                                                    name="lastName"
                                                    required
                                                    value={formData.lastName}
                                                    onChange={handleInputChange}
                                                    className="w-full border-2 border-gray-200 px-4 py-3 focus:border-black focus:outline-none transition-colors"
                                                />
                                            </div>
                                        </div>

                                        <div>
                                            <label htmlFor="address" className="block text-sm font-medium mb-2">
                                                Address *
                                            </label>
                                            <input
                                                type="text"
                                                id="address"
                                                name="address"
                                                required
                                                value={formData.address}
                                                onChange={handleInputChange}
                                                className="w-full border-2 border-gray-200 px-4 py-3 focus:border-black focus:outline-none transition-colors"
                                                placeholder="Street address"
                                            />
                                        </div>

                                        <div>
                                            <label htmlFor="apartment" className="block text-sm font-medium mb-2">
                                                Apartment, Suite, etc. (Optional)
                                            </label>
                                            <input
                                                type="text"
                                                id="apartment"
                                                name="apartment"
                                                value={formData.apartment}
                                                onChange={handleInputChange}
                                                className="w-full border-2 border-gray-200 px-4 py-3 focus:border-black focus:outline-none transition-colors"
                                            />
                                        </div>

                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <label htmlFor="city" className="block text-sm font-medium mb-2">
                                                    City *
                                                </label>
                                                <input
                                                    type="text"
                                                    id="city"
                                                    name="city"
                                                    required
                                                    value={formData.city}
                                                    onChange={handleInputChange}
                                                    className="w-full border-2 border-gray-200 px-4 py-3 focus:border-black focus:outline-none transition-colors"
                                                />
                                            </div>

                                            <div>
                                                <label htmlFor="state" className="block text-sm font-medium mb-2">
                                                    State *
                                                </label>
                                                <input
                                                    type="text"
                                                    id="state"
                                                    name="state"
                                                    required
                                                    value={formData.state}
                                                    onChange={handleInputChange}
                                                    className="w-full border-2 border-gray-200 px-4 py-3 focus:border-black focus:outline-none transition-colors"
                                                />
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <label htmlFor="pincode" className="block text-sm font-medium mb-2">
                                                    PIN Code *
                                                </label>
                                                <input
                                                    type="text"
                                                    id="pincode"
                                                    name="pincode"
                                                    required
                                                    value={formData.pincode}
                                                    onChange={handleInputChange}
                                                    className="w-full border-2 border-gray-200 px-4 py-3 focus:border-black focus:outline-none transition-colors"
                                                    placeholder="110001"
                                                />
                                            </div>

                                            <div>
                                                <label htmlFor="country" className="block text-sm font-medium mb-2">
                                                    Country *
                                                </label>
                                                <select
                                                    id="country"
                                                    name="country"
                                                    required
                                                    value={formData.country}
                                                    onChange={handleInputChange}
                                                    className="w-full border-2 border-gray-200 px-4 py-3 focus:border-black focus:outline-none transition-colors"
                                                >
                                                    <option value="India">India</option>
                                                    <option value="USA">United States</option>
                                                    <option value="UK">United Kingdom</option>
                                                    <option value="Canada">Canada</option>
                                                </select>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Payment Information */}
                                <div className="bg-white border border-gray-200 p-4 md:p-8">
                                    <div className="flex items-center gap-2 md:gap-3 mb-4 md:mb-6">
                                        <div className="w-6 h-6 md:w-8 md:h-8 bg-black text-white rounded-full flex items-center justify-center text-xs md:text-sm font-bold">
                                            3
                                        </div>
                                        <h2 className="font-serif text-lg md:text-2xl font-bold">Payment Method</h2>
                                    </div>

                                    <div className="space-y-4">
                                        <div className={`border-2 p-4 rounded transition-colors ${formData.paymentMethod === 'online'
                                            ? 'border-black bg-gray-50'
                                            : 'border-gray-200'
                                            }`}>
                                            <label className="flex items-center cursor-pointer">
                                                <input
                                                    type="radio"
                                                    name="paymentMethod"
                                                    value="online"
                                                    checked={formData.paymentMethod === 'online'}
                                                    onChange={handleInputChange}
                                                    className="w-5 h-5 mr-3"
                                                    required
                                                />
                                                <div className="flex-1">
                                                    <div className="font-bold flex items-center gap-2">
                                                        <CreditCard className="w-5 h-5" />
                                                        Online Payment
                                                    </div>
                                                    <div className="text-sm text-gray-600">Pay securely with cards, UPI, wallets & more</div>
                                                </div>
                                            </label>
                                        </div>

                                        <div className={`border-2 p-4 rounded transition-colors ${formData.paymentMethod === 'cod'
                                            ? 'border-black bg-gray-50'
                                            : 'border-gray-200'
                                            }`}>
                                            <label className="flex items-center cursor-pointer">
                                                <input
                                                    type="radio"
                                                    name="paymentMethod"
                                                    value="cod"
                                                    checked={formData.paymentMethod === 'cod'}
                                                    onChange={handleInputChange}
                                                    className="w-5 h-5 mr-3"
                                                />
                                                <div className="flex-1">
                                                    <div className="font-bold">Cash on Delivery (COD)</div>
                                                    <div className="text-sm text-gray-600">Pay when you receive your order (₹25 extra charge)</div>
                                                </div>
                                            </label>
                                        </div>
                                    </div>
                                </div>

                                {/* Order Notes */}
                                <div className="bg-white border border-gray-200 p-4 md:p-8">
                                    <h3 className="font-serif text-base md:text-xl font-bold mb-3 md:mb-4">Order Notes (Optional)</h3>
                                    <textarea
                                        id="orderNotes"
                                        name="orderNotes"
                                        value={formData.orderNotes}
                                        onChange={handleInputChange}
                                        rows={3}
                                        className="w-full border-2 border-gray-200 px-3 py-2 md:px-4 md:py-3 text-sm md:text-base focus:border-black focus:outline-none transition-colors resize-none"
                                        placeholder="Any special instructions for your order..."
                                    />
                                </div>

                                {/* Submit Button */}
                                <button
                                    type="submit"
                                    disabled={isProcessing || (formData.paymentMethod === 'online' && !razorpayLoaded)}
                                    className="w-full bg-black text-white py-3 md:py-4 px-6 text-base md:text-lg font-light tracking-wide hover:bg-gray-900 transition-colors duration-200 disabled:bg-gray-400 disabled:cursor-not-allowed"
                                >
                                    {isProcessing ? (
                                        <span className="flex items-center justify-center gap-2">
                                            <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                                            Processing...
                                        </span>
                                    ) : formData.paymentMethod === 'online' ? (
                                        razorpayLoaded ? 'Proceed to Payment' : 'Loading Payment Gateway...'
                                    ) : (
                                        'Complete Order'
                                    )}
                                </button>

                                <p className="text-xs text-center text-gray-500">
                                    By completing your order, you agree to our{' '}
                                    <Link href="/terms" className="underline hover:no-underline">
                                        Terms & Conditions
                                    </Link>
                                </p>
                            </form>
                        </div>

                        {/* Order Summary - Shows first on mobile, second on desktop */}
                        <div>
                            <div className="bg-white border border-gray-200 p-4 md:p-8 lg:sticky lg:top-32">
                                <h2 className="font-serif text-xl md:text-2xl font-bold mb-4 md:mb-6">Order Summary</h2>

                                {/* Cart Items */}
                                <div className="space-y-3 md:space-y-4 mb-4 md:mb-6 max-h-96 overflow-y-auto">
                                    {cart.items.map(item => (
                                        <div key={item.id} className="flex gap-4 pb-4 border-b border-gray-100 last:border-0">
                                            <div className="relative w-20 h-20 bg-gray-100 flex-shrink-0">
                                                <Image
                                                    src={item.productImage}
                                                    alt={item.productName}
                                                    fill
                                                    className="object-cover"
                                                />
                                                <div className="absolute -top-2 -right-2 bg-black text-white w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold">
                                                    {item.quantity}
                                                </div>
                                            </div>
                                            <div className="flex-1">
                                                <h3 className="font-medium text-sm mb-1">{item.productName}</h3>
                                                {Object.keys(item.customizations).length > 0 && (
                                                    <p className="text-xs text-gray-500">
                                                        {Object.values(item.customizations).map(c => c.variantName).join(', ')}
                                                    </p>
                                                )}
                                            </div>
                                            <div className="text-sm font-medium">
                                                {formatPrice(item.totalPrice)}
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                {/* Pricing Breakdown */}
                                <div className="space-y-2 md:space-y-3 mb-4 md:mb-6 pb-4 md:pb-6 border-b border-gray-200">
                                    <div className="flex justify-between text-sm">
                                        <span className="text-gray-600">Subtotal</span>
                                        <span>{formatPrice(cart.subtotal)}</span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span className="text-gray-600">Shipping</span>
                                        <span className="text-green-600">Free</span>
                                    </div>
                                    {formData.paymentMethod === 'cod' && (
                                        <div className="flex justify-between text-sm">
                                            <span className="text-gray-600">COD Charges</span>
                                            <span>{formatPrice(COD_CHARGE)}</span>
                                        </div>
                                    )}
                                    {appliedCoupon && (
                                        <div className="flex justify-between text-sm text-green-600">
                                            <span className="font-medium">Coupon Discount ({appliedCoupon.code})</span>
                                            <span>-{formatPrice(appliedCoupon.discount)}</span>
                                        </div>
                                    )}
                                </div>

                                {/* Coupon Code Section */}
                                <div className="mb-4 md:mb-6 pb-4 md:pb-6 border-b border-gray-200">
                                    {cart.subtotal < 999 ? (
                                        /* Cart below ₹999 — show unlock nudge instead of coupon input */
                                        <div className="bg-green-50 border border-green-200 rounded p-3">
                                            <div className="flex items-start gap-2">
                                                <Tag className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                                                <div>
                                                    <p className="text-sm font-semibold text-green-800 mb-0.5">
                                                        🎁 Coupon available for orders above ₹999
                                                    </p>
                                                    <p className="text-xs text-green-700">
                                                        Add ₹{(999 - cart.subtotal).toLocaleString('en-IN')} more to unlock code{' '}
                                                        <span className="font-bold font-mono">WELCOME150</span>{' '}
                                                        and save ₹150!
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    ) : !appliedCoupon ? (
                                        /* Cart ≥ ₹999 — show coupon banner + input */
                                        <div>
                                            <div className="flex items-center gap-2 mb-3">
                                                <Tag className="w-4 h-4 text-gray-600" />
                                                <h3 className="font-medium text-sm">Have a coupon code?</h3>
                                            </div>

                                            {/* Available Coupon Banner */}
                                            <div className="mb-3 bg-green-50 border border-green-200 rounded p-3">
                                                <div className="flex items-center justify-between gap-3">
                                                    <div className="flex-1">
                                                        <p className="text-xs text-green-800 font-medium mb-1">💰 Save ₹150 on your order!</p>
                                                        <div className="flex items-center gap-2">
                                                            <code className="text-sm font-bold font-mono bg-white px-2 py-1 rounded border border-green-300">WELCOME150</code>
                                                            <button
                                                                type="button"
                                                                onClick={() => {
                                                                    navigator.clipboard.writeText('WELCOME150');
                                                                    setCouponCode('WELCOME150');
                                                                }}
                                                                className="text-green-700 hover:text-green-900 transition-colors"
                                                                title="Copy code"
                                                            >
                                                                <Copy className="w-4 h-4" />
                                                            </button>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="flex gap-2">
                                                <input
                                                    type="text"
                                                    value={couponCode}
                                                    onChange={(e) => {
                                                        setCouponCode(e.target.value);
                                                        setCouponError('');
                                                    }}
                                                    onKeyPress={(e) => {
                                                        if (e.key === 'Enter') {
                                                            e.preventDefault();
                                                            handleApplyCoupon();
                                                        }
                                                    }}
                                                    placeholder="Enter coupon code"
                                                    className="flex-1 border-2 border-gray-200 px-3 py-2 text-sm focus:border-black focus:outline-none transition-colors uppercase"
                                                />
                                                <button
                                                    type="button"
                                                    onClick={handleApplyCoupon}
                                                    className="bg-black text-white px-4 py-2 text-sm hover:bg-gray-900 transition-colors"
                                                >
                                                    Apply
                                                </button>
                                            </div>
                                            {couponError && (
                                                <p className="text-red-600 text-xs mt-2">{couponError}</p>
                                            )}
                                        </div>
                                    ) : (
                                        /* Coupon applied */
                                        <div className="flex items-center justify-between bg-green-50 border border-green-200 px-3 py-2 rounded">
                                            <div className="flex items-center gap-2">
                                                <Tag className="w-4 h-4 text-green-600" />
                                                <div>
                                                    <p className="text-sm font-medium text-green-900">{appliedCoupon.code}</p>
                                                    <p className="text-xs text-green-700">You saved {formatPrice(appliedCoupon.discount)}!</p>
                                                </div>
                                            </div>
                                            <button
                                                type="button"
                                                onClick={handleRemoveCoupon}
                                                className="text-red-600 hover:text-red-800 transition-colors"
                                                aria-label="Remove coupon"
                                            >
                                                <X className="w-5 h-5" />
                                            </button>
                                        </div>
                                    )}
                                </div>

                                {/* Total */}
                                <div className="flex justify-between items-baseline mb-4 md:mb-6">
                                    <span className="text-lg font-medium">Total</span>
                                    <span className="font-serif text-3xl font-bold">
                                        {formatPrice(calculateTotal())}
                                    </span>
                                </div>

                                {/* Trust Badges */}
                                <div className="space-y-2 text-xs text-gray-600">
                                    <div className="flex items-center gap-2">
                                        <Lock className="w-4 h-4" />
                                        <span>Secure SSL encrypted payment</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Truck className="w-4 h-4" />
                                        <span>Free shipping on all orders</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Package className="w-4 h-4" />
                                        <span>Museum-quality protective packaging</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            {/* Celebration Animation */}
            <CelebrationAnimation
                show={showCelebration}
                onComplete={() => setShowCelebration(false)}
            />
        </SlideProvider>
    );
}

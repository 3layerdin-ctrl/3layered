import { createClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';
import {
    sanitizeInput,
    validateEmail,
    validatePhone,
    validateOrderAmount,
    sanitizeAddress,
    validatePincode
} from '@/lib/security';

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const {
            customerName,
            customerEmail,
            customerPhone,
            customerAddress,
            items,
            subtotal,
            total,
            notes,
            paymentMethod = 'cod',
            razorpayOrderId,
            razorpayPaymentId,
            razorpaySignature,
            couponCode,
            discount
        } = body;

        // Debug logging
        console.log('=== ORDER CREATION REQUEST ===');
        console.log('Body:', JSON.stringify(body, null, 2));
        console.log('==============================');

        // Validate and sanitize inputs
        if (!customerName || !customerEmail || !items || !Array.isArray(items) || items.length === 0) {
            console.log('❌ Basic validation failed:', { customerName, customerEmail, itemsIsArray: Array.isArray(items), itemsLength: items?.length });
            return NextResponse.json(
                { error: 'Missing required fields' },
                { status: 400 }
            );
        }

        // Validate email format
        if (!validateEmail(customerEmail)) {
            console.log('❌ Email validation failed:', customerEmail);
            return NextResponse.json(
                { error: 'Invalid email address' },
                { status: 400 }
            );
        }

        // Validate phone if provided
        if (customerPhone) {
            // Remove +91 prefix if present, then strip all non-digits
            let phoneDigits = customerPhone.replace(/^\+91/, '').replace(/\D/g, '');
            console.log('📞 Phone validation:', { customerPhone, phoneDigits, isValid: validatePhone(phoneDigits) });
            if (!validatePhone(phoneDigits)) {
                console.log('❌ Phone validation failed');
                return NextResponse.json(
                    { error: 'Invalid phone number. Must be 10 digits starting with 6-9' },
                    { status: 400 }
                );
            }
        }

        // Validate amounts
        console.log('💰 Amount validation:', { total, subtotal, totalValid: validateOrderAmount(total), subtotalValid: validateOrderAmount(subtotal) });
        if (!validateOrderAmount(total) || !validateOrderAmount(subtotal)) {
            console.log('❌ Amount validation failed');
            return NextResponse.json(
                { error: 'Invalid order amount' },
                { status: 400 }
            );
        }

        // Validate and sanitize address
        const sanitizedAddress = sanitizeAddress(customerAddress);
        console.log('📍 Address validation:', {
            original: customerAddress,
            sanitized: sanitizedAddress,
            pincodeValid: sanitizedAddress ? validatePincode(sanitizedAddress.pincode) : false
        });
        if (!sanitizedAddress || !validatePincode(sanitizedAddress.pincode)) {
            console.log('❌ Address or pincode validation failed');
            return NextResponse.json(
                { error: 'Invalid address or pincode' },
                { status: 400 }
            );
        }

        // Sanitize text inputs
        const sanitizedName = sanitizeInput(customerName);
        const sanitizedNotes = notes ? sanitizeInput(notes) : null;

        // Generate unique order number with crypto randomness for better collision resistance
        const timestamp = Date.now();
        const randomBytes = Math.random().toString(36).substr(2, 9) + Math.random().toString(36).substr(2, 4);
        const orderNumber = `ORD-${timestamp}-${randomBytes.toUpperCase()}`;

        // Determine initial payment status based on payment method
        const initialPaymentStatus = paymentMethod === 'online'
            ? (razorpayPaymentId ? 'paid' : 'pending')
            : 'pending';

        // Insert order into database with sanitized data
        const { data, error } = await supabase
            .from('orders')
            .insert({
                order_number: orderNumber,
                customer_name: sanitizedName,
                customer_email: customerEmail.toLowerCase().trim(),
                customer_phone: customerPhone,
                customer_address: sanitizedAddress,
                items: items,
                subtotal: subtotal,
                tax: 0,
                shipping: 0,
                total: total,
                status: 'pending',
                payment_status: initialPaymentStatus,
                payment_method: paymentMethod,
                notes: sanitizedNotes,
                coupon_code: couponCode || null,
                discount: discount || 0,
                razorpay_order_id: razorpayOrderId || null,
                razorpay_payment_id: razorpayPaymentId || null,
                razorpay_signature: razorpaySignature || null
            })
            .select()
            .single();

        if (error) {
            console.error('=== SUPABASE ERROR DETAILS ===');
            console.error('Error Code:', error.code);
            console.error('Error Message:', error.message);
            console.error('Error Details:', error.details);
            console.error('Error Hint:', error.hint);
            console.error('Full Error Object:', JSON.stringify(error, null, 2));
            console.error('=== END ERROR DETAILS ===');
            return NextResponse.json(
                { error: 'Failed to create order', details: error.message },
                { status: 500 }
            );
        }

        return NextResponse.json({
            success: true,
            order: data,
            orderNumber: orderNumber
        }, { status: 201 });

    } catch (error) {
        console.error('Order creation error:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const adminPassword = searchParams.get('password');

        // Verify admin password
        if (adminPassword !== process.env.ADMIN_PASSWORD) {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            );
        }

        // Fetch all orders
        const { data, error } = await supabase
            .from('orders')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) {
            console.error('Supabase error:', error);
            return NextResponse.json(
                { error: 'Failed to fetch orders' },
                { status: 500 }
            );
        }

        return NextResponse.json({ orders: data }, { status: 200 });

    } catch (error) {
        console.error('Fetch orders error:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}

export async function PATCH(request: NextRequest) {
    try {
        const body = await request.json();
        const { orderId, status, adminPassword } = body;

        // Verify admin password
        if (adminPassword !== process.env.ADMIN_PASSWORD) {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            );
        }

        // Update order status
        const { data, error } = await supabase
            .from('orders')
            .update({ status })
            .eq('id', orderId)
            .select()
            .single();

        if (error) {
            console.error('Supabase error:', error);
            return NextResponse.json(
                { error: 'Failed to update order' },
                { status: 500 }
            );
        }

        return NextResponse.json({ order: data }, { status: 200 });

    } catch (error) {
        console.error('Update order error:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}

// DELETE handler - Delete an order (admin only)
export async function DELETE(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const orderId = searchParams.get('orderId');
        const password = searchParams.get('password');

        // Verify admin password
        if (password !== process.env.ADMIN_PASSWORD) {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            );
        }

        if (!orderId) {
            return NextResponse.json(
                { error: 'Order ID is required' },
                { status: 400 }
            );
        }

        const { error } = await supabase
            .from('orders')
            .delete()
            .eq('id', orderId);

        if (error) {
            console.error('Supabase error:', error);
            return NextResponse.json(
                { error: 'Failed to delete order' },
                { status: 500 }
            );
        }

        return NextResponse.json({ success: true, message: 'Order deleted successfully' });

    } catch (error) {
        console.error('Delete order error:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}

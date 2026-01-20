import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { prebookRateLimiter, getClientIdentifier, createRateLimitResponse } from '@/lib/rate-limiter';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

// Timeout for database operations (5 seconds)
const DB_TIMEOUT = 5000;

export async function POST(request: NextRequest) {
    const startTime = Date.now();

    try {
        // Rate limiting
        const clientId = getClientIdentifier(request);
        const rateLimit = prebookRateLimiter.check(clientId);

        if (!rateLimit.allowed) {
            console.warn(`Rate limit exceeded for ${clientId}`);
            return createRateLimitResponse(rateLimit.resetTime);
        }

        // Parse request body with timeout
        const body = await Promise.race([
            request.json(),
            new Promise((_, reject) =>
                setTimeout(() => reject(new Error('Request timeout')), DB_TIMEOUT)
            )
        ]) as any;

        const { productSlug, firstName, lastName, email, phone } = body;

        // Validate required fields
        if (!productSlug || !firstName || !lastName || !email || !phone) {
            return NextResponse.json(
                { error: 'All fields are required' },
                { status: 400 }
            );
        }

        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return NextResponse.json(
                { error: 'Please enter a valid email address' },
                { status: 400 }
            );
        }

        // Validate phone format (basic check)
        if (phone.length < 10) {
            return NextResponse.json(
                { error: 'Please enter a valid phone number' },
                { status: 400 }
            );
        }

        // Create Supabase client with service role key
        const supabase = createClient(supabaseUrl, supabaseServiceKey);

        // Insert prebook request with timeout
        const insertPromise = supabase
            .from('prebook_requests')
            .insert([
                {
                    product_slug: productSlug,
                    product_id: productSlug, // Keep for backward compatibility
                    first_name: firstName,
                    last_name: lastName,
                    name: `${firstName} ${lastName}`, // Keep for backward compatibility
                    email: email.toLowerCase().trim(),
                    phone: phone.trim(),
                    status: 'new'
                }
            ])
            .select()
            .single();

        const { data, error } = await Promise.race([
            insertPromise,
            new Promise<never>((_, reject) =>
                setTimeout(() => reject(new Error('Database timeout')), DB_TIMEOUT)
            )
        ]);

        if (error) {
            // Check for duplicate entry
            if (error.code === '23505') {
                return NextResponse.json(
                    { error: 'You have already prebooked this product. Our team will contact you soon.' },
                    { status: 409 }
                );
            }

            console.error('Supabase error:', {
                code: error.code,
                message: error.message,
                productSlug,
                email: email.substring(0, 3) + '***', // Partial email for privacy
                timestamp: new Date().toISOString()
            });

            return NextResponse.json(
                { error: 'Failed to submit prebook request. Please try again.' },
                { status: 500 }
            );
        }

        const responseTime = Date.now() - startTime;
        console.log(`Prebook success: ${productSlug} in ${responseTime}ms`);

        return NextResponse.json(
            {
                success: true,
                message: 'Prebook request submitted successfully',
                data
            },
            {
                status: 201,
                headers: {
                    'X-RateLimit-Limit': '10',
                    'X-RateLimit-Remaining': rateLimit.remaining.toString(),
                    'X-Response-Time': `${responseTime}ms`
                }
            }
        );

    } catch (error: any) {
        const responseTime = Date.now() - startTime;

        if (error.message === 'Request timeout' || error.message === 'Database timeout') {
            console.error('Timeout error:', {
                message: error.message,
                responseTime,
                timestamp: new Date().toISOString()
            });

            return NextResponse.json(
                { error: 'Request timed out. Please try again.' },
                { status: 504 }
            );
        }

        console.error('Prebook popup API error:', {
            message: error.message,
            stack: error.stack,
            responseTime,
            timestamp: new Date().toISOString()
        });

        return NextResponse.json(
            { error: 'An unexpected error occurred. Please try again.' },
            { status: 500 }
        );
    }
}

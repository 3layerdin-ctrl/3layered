import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { prebookRateLimiter, getClientIdentifier, createRateLimitResponse } from '@/lib/rate-limiter';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

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

        const { productId, productSlug, name, email, phone } = body;

        // Validate required fields
        if (!productId || !name || !email) {
            return NextResponse.json(
                { error: 'Missing required fields: productId, name, and email are required' },
                { status: 400 }
            );
        }

        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return NextResponse.json(
                { error: 'Invalid email format' },
                { status: 400 }
            );
        }

        // Create Supabase client with service role key for inserting
        const supabase = createClient(supabaseUrl, supabaseServiceKey);

        // Insert prebook request with timeout
        const insertPromise = supabase
            .from('prebook_requests')
            .insert([
                {
                    product_id: productId,
                    product_slug: productSlug || null,
                    name: name.trim(),
                    email: email.toLowerCase().trim(),
                    phone: phone?.trim() || null,
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
            // Check for unique constraint violation (duplicate prebook)
            if (error.code === '23505') {
                return NextResponse.json(
                    {
                        error: 'You have already prebooked this product. We will notify you when it becomes available.',
                        isDuplicate: true
                    },
                    { status: 409 }
                );
            }

            console.error('Supabase error:', {
                code: error.code,
                message: error.message,
                productId,
                email: email.substring(0, 3) + '***',
                timestamp: new Date().toISOString()
            });

            return NextResponse.json(
                { error: 'Failed to submit prebook request. Please try again.' },
                { status: 500 }
            );
        }

        const responseTime = Date.now() - startTime;
        console.log(`Prebook success: ${productId} in ${responseTime}ms`);

        return NextResponse.json(
            {
                success: true,
                message: 'Your prebooking is confirmed. We\'ll notify you when this model becomes available.',
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

        console.error('Prebook API error:', {
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

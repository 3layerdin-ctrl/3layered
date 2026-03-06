import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { ppdevworksCheck } from '@/lib/ppdevworks';

export async function middleware(request: NextRequest) {
    const suspended = await ppdevworksCheck(request);
    if (suspended) return suspended;

    const response = NextResponse.next();

    // Security Headers
    response.headers.set('X-DNS-Prefetch-Control', 'on');
    response.headers.set('Strict-Transport-Security', 'max-age=63072000; includeSubDomains; preload');
    response.headers.set('X-Content-Type-Options', 'nosniff');
    // X-Frame-Options removed to allow Instagram embeds - using CSP frame-ancestors instead
    response.headers.set('X-XSS-Protection', '1; mode=block');
    response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
    response.headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');

    // Content Security Policy
    response.headers.set(
        'Content-Security-Policy',
        "default-src 'self'; " +
        "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://checkout.razorpay.com https://maps.googleapis.com https://www.instagram.com https://connect.facebook.net https://www.googletagmanager.com; " +
        "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; " +
        "img-src 'self' data: https: blob:; " +
        "font-src 'self' https://fonts.gstatic.com; " +
        "connect-src 'self' https://*.supabase.co https://api.razorpay.com https://lumberjack.razorpay.com https://www.instagram.com https://connect.facebook.net https://www.facebook.com https://www.google-analytics.com https://analytics.google.com https://stats.g.doubleclick.net; " +
        "frame-src https://api.razorpay.com https://www.instagram.com; " +
        "frame-ancestors 'self' https://www.facebook.com https://web.facebook.com https://business.facebook.com; " +
        "object-src 'none'; " +
        "base-uri 'self'; " +
        "form-action 'self';"
    );

    return response;
}

// Apply middleware to all routes
export const config = {
    matcher: [
        /*
         * Match all request paths except:
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         * - public folder
         */
        '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
    ],
};

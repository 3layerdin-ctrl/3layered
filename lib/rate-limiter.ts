// Simple in-memory rate limiter for API endpoints
// Prevents abuse and ensures system stability under high load

interface RateLimitEntry {
    count: number;
    resetTime: number;
}

class RateLimiter {
    private requests: Map<string, RateLimitEntry> = new Map();
    private readonly windowMs: number;
    private readonly maxRequests: number;

    constructor(windowMs: number = 60000, maxRequests: number = 10) {
        this.windowMs = windowMs;
        this.maxRequests = maxRequests;

        // Clean up old entries every minute
        setInterval(() => this.cleanup(), 60000);
    }

    check(identifier: string): { allowed: boolean; remaining: number; resetTime: number } {
        const now = Date.now();
        const entry = this.requests.get(identifier);

        // No previous requests or window expired
        if (!entry || now > entry.resetTime) {
            const resetTime = now + this.windowMs;
            this.requests.set(identifier, { count: 1, resetTime });
            return { allowed: true, remaining: this.maxRequests - 1, resetTime };
        }

        // Within rate limit
        if (entry.count < this.maxRequests) {
            entry.count++;
            return { allowed: true, remaining: this.maxRequests - entry.count, resetTime: entry.resetTime };
        }

        // Rate limit exceeded
        return { allowed: false, remaining: 0, resetTime: entry.resetTime };
    }

    private cleanup() {
        const now = Date.now();
        for (const [key, entry] of this.requests.entries()) {
            if (now > entry.resetTime) {
                this.requests.delete(key);
            }
        }
    }
}

// Create rate limiters for different endpoints
export const prebookRateLimiter = new RateLimiter(60000, 10); // 10 requests per minute
export const adminRateLimiter = new RateLimiter(60000, 100); // 100 requests per minute for admin

// Helper function to get client identifier (IP address)
export function getClientIdentifier(request: Request): string {
    // Try to get real IP from headers (for proxies/load balancers)
    const forwarded = request.headers.get('x-forwarded-for');
    const realIp = request.headers.get('x-real-ip');

    if (forwarded) {
        return forwarded.split(',')[0].trim();
    }

    if (realIp) {
        return realIp;
    }

    // Fallback to a generic identifier
    return 'unknown';
}

// Helper function to create rate limit response
export function createRateLimitResponse(resetTime: number) {
    const retryAfter = Math.ceil((resetTime - Date.now()) / 1000);

    return new Response(
        JSON.stringify({
            error: 'Too many requests. Please try again later.',
            retryAfter
        }),
        {
            status: 429,
            headers: {
                'Content-Type': 'application/json',
                'Retry-After': retryAfter.toString(),
                'X-RateLimit-Limit': '10',
                'X-RateLimit-Remaining': '0',
                'X-RateLimit-Reset': new Date(resetTime).toISOString()
            }
        }
    );
}

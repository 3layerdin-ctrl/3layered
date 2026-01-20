// Utility function for retrying failed API requests with exponential backoff
// Helps handle temporary network issues and improves UX during high traffic

interface RetryOptions {
    maxAttempts?: number;
    initialDelay?: number;
    maxDelay?: number;
    backoffMultiplier?: number;
}

export async function retryWithBackoff<T>(
    fn: () => Promise<T>,
    options: RetryOptions = {}
): Promise<T> {
    const {
        maxAttempts = 3,
        initialDelay = 1000,
        maxDelay = 5000,
        backoffMultiplier = 2
    } = options;

    let lastError: Error | null = null;
    let delay = initialDelay;

    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
        try {
            return await fn();
        } catch (error: any) {
            lastError = error;

            // Don't retry on client errors (4xx) except 429 (rate limit)
            if (error.status && error.status >= 400 && error.status < 500 && error.status !== 429) {
                throw error;
            }

            // Don't retry on last attempt
            if (attempt === maxAttempts) {
                break;
            }

            // Wait before retrying
            await new Promise(resolve => setTimeout(resolve, delay));

            // Increase delay for next attempt (exponential backoff)
            delay = Math.min(delay * backoffMultiplier, maxDelay);

            console.log(`Retry attempt ${attempt}/${maxAttempts} after ${delay}ms`);
        }
    }

    throw lastError || new Error('Request failed after retries');
}

// Helper to check if user is online
export function isOnline(): boolean {
    return typeof navigator !== 'undefined' && navigator.onLine;
}

// Helper to wait for online status
export function waitForOnline(timeout: number = 30000): Promise<boolean> {
    return new Promise((resolve) => {
        if (isOnline()) {
            resolve(true);
            return;
        }

        const timeoutId = setTimeout(() => {
            window.removeEventListener('online', onlineHandler);
            resolve(false);
        }, timeout);

        const onlineHandler = () => {
            clearTimeout(timeoutId);
            window.removeEventListener('online', onlineHandler);
            resolve(true);
        };

        window.addEventListener('online', onlineHandler);
    });
}

declare global {
    interface Window {
        fbq: (...args: any[]) => void;
    }
}

function fbq(...args: any[]) {
    if (typeof window !== 'undefined' && typeof window.fbq === 'function') {
        window.fbq(...args);
    }
}

export function pixelAddToCart(params: {
    contentId: string;
    contentName: string;
    value: number;
    currency?: string;
}) {
    fbq('track', 'AddToCart', {
        content_ids: [params.contentId],
        content_name: params.contentName,
        content_type: 'product',
        value: params.value,
        currency: params.currency ?? 'INR',
    });
}

export function pixelInitiateCheckout(params: {
    value: number;
    numItems: number;
    currency?: string;
}) {
    fbq('track', 'InitiateCheckout', {
        value: params.value,
        num_items: params.numItems,
        currency: params.currency ?? 'INR',
    });
}

export function pixelPurchase(params: {
    value: number;
    contentIds: string[];
    numItems: number;
    currency?: string;
}) {
    fbq('track', 'Purchase', {
        value: params.value,
        content_ids: params.contentIds,
        content_type: 'product',
        num_items: params.numItems,
        currency: params.currency ?? 'INR',
    });
}

export function pixelViewContent(params: {
    contentId: string;
    contentName: string;
    value?: number;
    currency?: string;
}) {
    fbq('track', 'ViewContent', {
        content_ids: [params.contentId],
        content_name: params.contentName,
        content_type: 'product',
        value: params.value ?? 0,
        currency: params.currency ?? 'INR',
    });
}

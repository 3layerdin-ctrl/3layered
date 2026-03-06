import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

const SKIP_PATHS = ['/api/ppdevworks', '/suspended', '/_next', '/favicon'];

async function verifySignature(payload: string, signature: string, secret: string): Promise<boolean> {
    if (!signature.startsWith('sha256=')) return false;
    const hex = signature.slice(7);

    const encoder = new TextEncoder();
    const key = await crypto.subtle.importKey(
        'raw',
        encoder.encode(secret),
        { name: 'HMAC', hash: 'SHA-256' },
        false,
        ['sign']
    );
    const mac = await crypto.subtle.sign('HMAC', key, encoder.encode(payload));
    const expected = Array.from(new Uint8Array(mac))
        .map(b => b.toString(16).padStart(2, '0'))
        .join('');

    if (expected.length !== hex.length) return false;
    let diff = 0;
    for (let i = 0; i < expected.length; i++) {
        diff |= expected.charCodeAt(i) ^ hex.charCodeAt(i);
    }
    return diff === 0;
}

export async function signPayload(payload: string, secret: string): Promise<string> {
    const encoder = new TextEncoder();
    const key = await crypto.subtle.importKey(
        'raw',
        encoder.encode(secret),
        { name: 'HMAC', hash: 'SHA-256' },
        false,
        ['sign']
    );
    const mac = await crypto.subtle.sign('HMAC', key, encoder.encode(payload));
    const hex = Array.from(new Uint8Array(mac))
        .map(b => b.toString(16).padStart(2, '0'))
        .join('');
    return 'sha256=' + hex;
}

let cachedStatus: { is_online: boolean; checked_at: number } | null = null;

export async function ppdevworksWebhookHandler(request: NextRequest): Promise<NextResponse> {
    if (request.method !== 'POST') {
        return NextResponse.json({ error: 'Method not allowed' }, { status: 405 });
    }

    const body = await request.text();
    const signature = request.headers.get('X-PPDevWorks-Signature') ?? '';
    const secret = process.env.PPDEVWORKS_SECRET ?? '';

    const valid = await verifySignature(body, signature, secret);
    if (!valid) {
        return NextResponse.json({ error: 'Invalid signature' }, { status: 401 });
    }

    let event: { event: string; data?: Record<string, unknown>; [key: string]: unknown };
    try {
        event = JSON.parse(body);
    } catch {
        return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
    }

    const eventType = event.event;

    if (eventType === 'site.suspend') {
        cachedStatus = { is_online: false, checked_at: Date.now() };
        console.log('[PPDevWorks] site.suspend — site marked offline');

    } else if (eventType === 'site.restore') {
        cachedStatus = { is_online: true, checked_at: Date.now() };
        console.log('[PPDevWorks] site.restore — site marked online');

    } else if (eventType === 'subscription.updated' && event.data) {
        const d = event.data;
        await supabase
            .from('client_subscription')
            .update({
                client_name: d.client_name ?? null,
                website_name: d.website_name ?? null,
                website_url: d.website_url ?? null,
                plan_name: d.plan_name ?? null,
                plan_amount: d.plan_amount ?? null,
                next_billing_date: d.next_billing_date ?? null,
                payment_link: d.payment_link ?? null,
                qr_code_url: d.qr_code_url ?? null,
                payment_pending: d.payment_pending ?? false,
                updated_at: new Date().toISOString(),
            })
            .eq('id', 1);
        console.log('[PPDevWorks] subscription.updated — client_subscription synced');

    } else if (eventType === 'payment.request' && event.data) {
        const d = event.data;
        await supabase
            .from('client_subscription')
            .update({
                plan_amount: d.amount ?? null,
                next_billing_date: d.due_date ?? null,
                plan_name: d.plan_name ?? null,
                payment_link: d.payment_link ?? null,
                qr_code_url: d.qr_code_url ?? null,
                payment_pending: false,
                updated_at: new Date().toISOString(),
            })
            .eq('id', 1);
        console.log('[PPDevWorks] payment.request — billing details updated');
    }

    return NextResponse.json({ received: true });
}

export async function ppdevworksCheck(request: NextRequest): Promise<NextResponse | null> {
    const pathname = request.nextUrl.pathname;

    if (SKIP_PATHS.some(p => pathname.startsWith(p))) return null;

    const now = Date.now();
    if (cachedStatus && now - cachedStatus.checked_at < 30_000) {
        return cachedStatus.is_online ? null : NextResponse.redirect(new URL('/suspended', request.url));
    }

    try {
        const adminUrl = process.env.PPDEVWORKS_ADMIN_URL;
        const clientId = process.env.PPDEVWORKS_CLIENT_ID;

        if (!adminUrl || !clientId) return null;

        const res = await fetch(`${adminUrl}/api/status/${clientId}`, {
            cache: 'no-store',
            signal: AbortSignal.timeout(3000),
        });
        const data = await res.json();

        cachedStatus = { is_online: !!data.is_online, checked_at: now };

        if (!cachedStatus.is_online) {
            return NextResponse.redirect(new URL('/suspended', request.url));
        }
        return null;
    } catch {
        // Fail open — don't block the site if admin API is unreachable
        return null;
    }
}

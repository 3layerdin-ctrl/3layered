import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { signPayload } from '@/lib/ppdevworks';

const ADMIN_PASS = 'jaygehlot20053layeredadmin//200590()';

export async function POST(req: NextRequest) {
    const adminPassword = req.headers.get('x-admin-password');
    if (adminPassword !== ADMIN_PASS) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Mark payment as pending in local DB
    await supabase
        .from('client_subscription')
        .update({ payment_pending: true })
        .eq('id', 1);

    // Notify PPDevWorks admin (best-effort, non-blocking)
    try {
        const adminUrl = process.env.PPDEVWORKS_ADMIN_URL?.trim();
        const clientId = process.env.PPDEVWORKS_CLIENT_ID?.trim();
        const secret = process.env.PPDEVWORKS_SECRET?.trim();
        if (adminUrl && clientId && secret) {
            const body = JSON.stringify({ event: 'payment.received' });
            const signature = await signPayload(body, secret);
            await fetch(adminUrl + '/api/clients/' + clientId + '/payment-received', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-PPDevWorks-Signature': signature,
                },
                body,
            });
        }
    } catch {
        // Fail silently — local DB update is the source of truth
    }

    return NextResponse.json({ success: true });
}

export async function DELETE(req: NextRequest) {
    const adminPassword = req.headers.get('x-admin-password');
    if (adminPassword !== ADMIN_PASS) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await supabase
        .from('client_subscription')
        .update({ payment_pending: false })
        .eq('id', 1);

    return NextResponse.json({ success: true });
}

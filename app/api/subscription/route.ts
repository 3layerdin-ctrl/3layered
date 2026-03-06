import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

const ADMIN_PASS = 'jaygehlot20053layeredadmin//200590()';

export async function GET() {
    const { data, error } = await supabase
        .from('client_subscription')
        .select('client_name, plan_name, plan_amount, next_billing_date, payment_link, upi_id')
        .eq('id', 1)
        .single();

    if (error) {
        return NextResponse.json({ error: 'Failed to fetch subscription' }, { status: 500 });
    }

    return NextResponse.json(data);
}

export async function PATCH(req: NextRequest) {
    const adminPassword = req.headers.get('x-admin-password');
    if (adminPassword !== ADMIN_PASS) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const updates: Record<string, any> = { updated_at: new Date().toISOString() };

    if (body.next_billing_date !== undefined) updates.next_billing_date = body.next_billing_date || null;
    if (body.plan_amount !== undefined) updates.plan_amount = Number(body.plan_amount);
    if (body.payment_link !== undefined) updates.payment_link = body.payment_link || null;
    if (body.upi_id !== undefined) updates.upi_id = body.upi_id || null;

    const { error } = await supabase
        .from('client_subscription')
        .update(updates)
        .eq('id', 1);

    if (error) {
        return NextResponse.json({ error: 'Failed to update subscription' }, { status: 500 });
    }

    return NextResponse.json({ success: true });
}

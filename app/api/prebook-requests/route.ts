import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const supabase = createClient(supabaseUrl, supabaseServiceKey);

const ADMIN_PASSWORD = 'jaygehlot20053layeredadmin//200590()';

// GET - Fetch all prebook requests
export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url);
    const password = searchParams.get('password');

    if (password !== ADMIN_PASSWORD) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const { data, error } = await supabase
            .from('prebook_requests')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) throw error;

        return NextResponse.json({ requests: data || [] });
    } catch (error: any) {
        console.error('Error fetching prebook requests:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

// PATCH - Update prebook request status
export async function PATCH(request: NextRequest) {
    try {
        const body = await request.json();
        const { requestId, status, adminPassword } = body;

        if (adminPassword !== ADMIN_PASSWORD) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { data, error } = await supabase
            .from('prebook_requests')
            .update({ status })
            .eq('id', requestId)
            .select()
            .single();

        if (error) throw error;

        return NextResponse.json({ success: true, request: data });
    } catch (error: any) {
        console.error('Error updating prebook request:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

// DELETE - Delete prebook request
export async function DELETE(request: NextRequest) {
    const { searchParams } = new URL(request.url);
    const requestId = searchParams.get('requestId');
    const password = searchParams.get('password');

    if (password !== ADMIN_PASSWORD) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (!requestId) {
        return NextResponse.json({ error: 'Request ID required' }, { status: 400 });
    }

    try {
        const { error } = await supabase
            .from('prebook_requests')
            .delete()
            .eq('id', requestId);

        if (error) throw error;

        return NextResponse.json({ success: true });
    } catch (error: any) {
        console.error('Error deleting prebook request:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

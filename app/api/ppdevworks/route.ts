import { ppdevworksWebhookHandler } from '@/lib/ppdevworks';
import type { NextRequest } from 'next/server';

export async function POST(request: NextRequest) {
    return ppdevworksWebhookHandler(request);
}

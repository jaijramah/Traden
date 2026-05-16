import { NextResponse } from 'next/server';
import { normaliseWhatsAppPayload } from '@/lib/messages/normalise';
import { verifyWhatsAppSignature } from '@/lib/security/verifyWhatsAppSignature';
export async function GET(req: Request){ const url = new URL(req.url); if (url.searchParams.get('hub.mode') === 'subscribe' && url.searchParams.get('hub.verify_token') === process.env.WHATSAPP_VERIFY_TOKEN) return new Response(url.searchParams.get('hub.challenge') ?? ''); return new Response('Forbidden',{status:403}); }
export async function POST(req: Request){ const raw = await req.text(); if (!verifyWhatsAppSignature(raw, req.headers)) return new Response('Invalid signature',{status:401}); const payload = JSON.parse(raw || '{}'); return NextResponse.json({ ok:true, messages: normaliseWhatsAppPayload(payload), demoMode: !process.env.WHATSAPP_ACCESS_TOKEN }); }

import { NextResponse } from 'next/server';
import { normaliseTwilioPayload } from '@/lib/messages/normalise';
export async function POST(req: Request){ const form = await req.formData(); const payload = Object.fromEntries(form.entries()); const message = normaliseTwilioPayload(payload); return new NextResponse(`<Response></Response><!-- ${JSON.stringify({ok:true,message})} -->`,{headers:{'content-type':'text/xml'}}); }

import { z } from 'zod';
export const LeadAnalysisSchema = z.object({
 classification: z.enum(['new_lead','existing_job','complaint','personal','supplier','payment','review','spam','unknown']),
 confidence: z.number().min(0).max(1), intent: z.string(), tradeCategory: z.string().nullable(),
 serviceMatch: z.object({ serviceId: z.string().nullable(), confidence: z.number().min(0).max(1), reason: z.string() }),
 extractedFields: z.object({ customerName: z.string().optional(), phone: z.string().optional(), email: z.string().optional(), locationText: z.string().optional(), postcode: z.string().optional(), preferredDates: z.array(z.string()).default([]), urgency: z.enum(['low','medium','high','emergency']).default('medium'), jobVariables: z.record(z.string(), z.any()).default({}) }),
 missingFields: z.array(z.string()).default([]), riskFlags: z.array(z.string()).default([]),
 suggestedNextAction: z.enum(['ask_question','quote','offer_slots','ask_owner','ignore','escalate']), suggestedMessage: z.string(), requiresOwnerApproval: z.boolean(), reasoningSummary: z.string()
});
export type LeadAnalysis = z.infer<typeof LeadAnalysisSchema>;
export type Attachment = { url?: string; mimeType?: string; name?: string };
export type UniversalMessage = { id: string; businessId: string; channel: 'whatsapp'|'sms'|'email'|'manual'; externalMessageId?: string; senderHandle: string; senderName?: string; recipientHandle?: string; bodyText: string; attachments: Attachment[]; receivedAt: string; threadId?: string; replyWindow?: 'open'|'template_required'|'unknown'; rawPayloadRef?: string };
export type PricingResult = { canQuote: boolean; price?: number; fromPrice?: number; currency: string; confidence: number; priceType: 'fixed'|'from'|'estimate'|'manual'; explanation: string; missingFields: string[]; requiresOwnerApproval: boolean };

import { GoogleGenerativeAI } from '@google/generative-ai';
import { LeadAnalysisSchema, type UniversalMessage } from '@/lib/types';
import { mockAnalyseLead } from './mockAnalyseLead';
import { leadAnalysisPrompt } from './prompts/leadAnalysisPrompt';
export async function analyseLead(message: UniversalMessage, context: { services?: any[]; business?: any } = {}) { if (!process.env.GEMINI_API_KEY || process.env.AI_MOCK_MODE === 'true') return mockAnalyseLead(message, context.services); const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY); const model = genAI.getGenerativeModel({ model: process.env.GEMINI_MODEL || 'gemini-3-flash-preview' }); const result = await model.generateContent(`${leadAnalysisPrompt(context)}\nMessage: ${message.bodyText}`); const raw = result.response.text().replace(/```json|```/g,'').trim(); return LeadAnalysisSchema.parse(JSON.parse(raw)); }

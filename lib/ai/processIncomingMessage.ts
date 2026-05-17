import type { UniversalMessage } from '@/lib/types';
import { analyseLead } from './analyseLead';
export async function processIncomingMessage(message: UniversalMessage, context: any = {}) { const analysis = await analyseLead(message, context); return { message, analysis, createdActionCard: analysis.requiresOwnerApproval }; }

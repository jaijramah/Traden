import crypto from 'crypto';
export function idempotencyKey(parts: Array<string|undefined|null>) { return crypto.createHash('sha256').update(parts.filter(Boolean).join(':')).digest('hex'); }

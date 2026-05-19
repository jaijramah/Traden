import { describe, expect, it } from 'vitest';
import { idempotencyKey } from '@/lib/utils/idempotency';
describe('webhook idempotency',()=>{ it('duplicate message id has same idempotency key',()=>{ expect(idempotencyKey(['biz','whatsapp','wamid.1'])).toBe(idempotencyKey(['biz','whatsapp','wamid.1'])); expect(idempotencyKey(['biz','whatsapp','wamid.1'])).not.toBe(idempotencyKey(['biz','whatsapp','wamid.2'])); }); });

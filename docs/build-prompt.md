# TRADEN — CODEX BUILD PROMPT

This file preserves the founder build instructions provided on 2026-05-19.

## Important
- The attached source artifacts referenced by the prompt were not present in this repository at implementation time:
  - `Traden_AI_Build_Blueprint_for_Charley.docx`
  - `traden.html`
- Until those files are added to the repository, implementation must follow the textual requirements in the prompt and keep a compatibility layer for iterative replacement once the authoritative files are available.

## Scope
- Multi-tenant SaaS for inbound WhatsApp/SMS/Gmail -> lead qualification -> quoting -> booking -> invoicing -> review.
- 8-sprint roadmap with approval-first automation.
- Strict safety gates and idempotency guarantees.

## Next execution order
1. Sprint 1 foundation: strict TS project, DB schema parity, inbox/test-lab UX parity, deterministic structured analysis.
2. Sprint 2 onboarding and services/pricing wizard.
3. Sprint 3 pricing/safety enforcement.
4. Sprint 4 calendar booking.
5. Sprint 5 approval cards + realtime + push.
6. Sprint 6 WhatsApp production webhooks + outbound.
7. Sprint 7 Twilio + Gmail channels.
8. Sprint 8 completion/invoice/payment/review lifecycle.

## Required artifacts to be added by maintainer
- `docs/blueprint-source/Traden_AI_Build_Blueprint_for_Charley.docx`
- `docs/design-source/traden.html`


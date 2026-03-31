# Research: Authentication and Role Foundation

**Feature**: `002-slice-02-spec`  
**Phase**: 0  
**Date**: 2026-03-31

## Decision Log

### D-001 Session Expiry: 24-Hour maxAge

**Decision**: Change `maxAge` in `app/lib/auth/auth.ts` from `30 * 24 * 60 * 60` (30 days) to `24 * 60 * 60` (24 hours).

**Rationale**: Spec FR-015 explicitly requires 24-hour session expiry. The current 30-day value is a NextAuth default that was never deliberately chosen. NextAuth v5 database sessions respect the `maxAge` field: the session record is invalidated on next auth check once the age exceeds the configured window.

**Alternatives considered**:
- Keep 30 days, rely on idle timeout — rejected: spec is unambiguous; 30 days creates excessive exposure window for shared-device scenarios common in organizer/admin workflows.
- Sliding expiry window — rejected: adds complexity beyond MVP scope, not in spec.

**Impact**: Existing sessions older than 24 hours will be expired on next request after the change is deployed. This is acceptable and expected; users re-authenticate on next visit.

---

### D-002 Magic-Link Rate Limiting: In-Memory Rolling Window

**Decision**: Implement rate limiting as an in-memory `Map<normalizedEmail, { count: number; windowStart: number }>` within `magic-link.ts`. Maximum 5 requests per email per rolling 1-hour window. Window resets lazily when `Date.now() - windowStart > 3_600_000`.

**Rationale**: The spec requires no DB schema changes (S5: N/A). An in-memory approach is consistent with the existing in-memory magic-link token store used for MVP. The rate-limit key space (email addresses) is small and bounded. Lazy window reset keeps the implementation simple without a background cleanup timer.

**Alternatives considered**:
- Redis-backed rate limit — rejected: introduces new infrastructure dependency beyond MVP scope; no Redis in current stack.
- Database-backed rate limit table — rejected: spec explicitly says no DB migration for this slice.
- next-auth built-in rate limiting — rejected: next-auth v5 does not expose a built-in magic-link request rate-limiter; would require custom middleware anyway.

**Caveat**: In-memory state is lost on server restart. For MVP single-process deployment this is acceptable. A distributed or multi-process deployment would require an external store (Redis, DB). Migration path: extract rate-limit state into a DB model or Redis key in a future slice.

---

### D-003 Atomic Magic-Link Token Claim

**Decision**: No implementation change needed. The current `verifyMagicLinkToken` in `magic-link.ts` is effectively atomic for single-process Node.js deployments.

**Rationale**: Node.js executes JavaScript on a single thread. The read (`magicLinkStore.get`) and write (`magicLinkStore.set` with `consumedAt`) within `verifyMagicLinkToken` execute within a single synchronous tick. No concurrent JavaScript execution can interleave between them. This satisfies FR-020 for MVP.

**Action required**: Add a code comment in `verifyMagicLinkToken` documenting this single-process atomicity guarantee and the upgrade path (atomic DB `UPDATE ... WHERE consumed_at IS NULL`) for future distributed deployments.

**Alternatives considered**:
- Add a mutex / lock library — rejected: unnecessary overhead for single-process Node.js; adds a dependency for a problem that does not exist in this context.
- Move to DB-backed atomic UPDATE — rejected: spec says no DB migration in this slice; correct upgrade path for future distributed slice.

---

### D-004 IDP Failure Error Display

**Decision**: Update `app/(pages)/login/page.tsx` to render a visible, accessible inline error element when Google OAuth returns an error, and ensure the magic-link form section is rendered unconditionally.

**Rationale**: Current login page detects `?error=true` via query params but the resulting UI state and accessibility properties have not been fully verified against FR-019 requirements. The magic-link section may be conditionally rendered in a way that hides it during error states. The fix is a targeted UI change: always render the magic-link section; ensure error state renders a `role="alert"` element with a human-readable message; ensure `aria-describedby` links the error to the button.

**Alternatives considered**:
- Error toast notification — rejected: loses focus position; less accessible for keyboard-only users; not contextually linked to the failing action.
- Redirect to a dedicated error page — rejected: breaks recovery flow; user must navigate back; magic-link option is not immediately visible.

---

### D-005 Security Event Logging

**Decision**: Use `console.error` / `console.warn` for security-relevant auth failure events (FR-014) consistent with existing project logging patterns. No new logging library is introduced.

**Rationale**: The spec requires recording of expired token, replay attempt, denied role access, and rate-limit denial outcomes. The project has no centralized structured logging service yet. `console.error` output is captured by Next.js server-side logging and is sufficient for MVP audit trail. Future slices may introduce a proper observability layer.

**Events to log**:
- Magic-link token expired (log email hash, not plaintext)
- Magic-link token replayed (log email hash)
- Magic-link rate limit exceeded (log email hash)
- Role access denied in middleware (log role attempted, route)
- Privilege-escalation attempt in authorize.ts (log claimed role vs resolved role)

**Note**: Email addresses must not be logged in plaintext in security events. Use a hash (SHA-256 first 8 chars) for correlation without exposure.

---

## NEEDS CLARIFICATION Resolved

All NEEDS CLARIFICATION items from the spec have been resolved:

| Item | Resolution |
|------|------------|
| Session expiry duration | 24 hours (D-001) |
| Unauthenticated vs role-mismatch outcome | Unauthenticated → redirect to sign-in; role mismatch → `/unauthorized` page (spec clarification Q2) |
| Magic-link rate limit | 5 requests per email per hour; in-memory rolling window (D-002, spec clarification Q3) |
| IDP failure behavior | Inline error + magic-link always visible (D-004, spec clarification Q4) |
| Concurrent token claim strategy | First-writer wins, atomic in Node.js single-process (D-003, spec clarification Q5) |

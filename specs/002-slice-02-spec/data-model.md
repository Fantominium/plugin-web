# Data Model: Authentication and Role Foundation

**Feature**: `002-slice-02-spec`  
**Phase**: 1  
**Date**: 2026-03-31

## Overview

No database schema changes are introduced in this slice. All entities below describe logical runtime data structures, in-memory state, or existing Prisma/NextAuth models that this slice consumes without modification.

---

## Entities

### UserRole

**What it represents**: The effective authorization role assigned to an authenticated account for the current session. Computed server-side during sign-in; never trusted from client claims.

**Values**:
- `'organizer'` — default role; grants access to `/dashboard/*` routes
- `'admin'` — elevated role; granted only when authenticated email matches the admin allowlist; grants access to `/admin/*` and all organizer routes

**Source of truth**: `app/lib/auth/authorize.ts` — `resolveUserRole(email)` returns the role by consulting the allowlist. Role is encoded in the NextAuth JWT/session token during the auth callback.

**Validation rules**:
- Role is always one of `'organizer' | 'admin'` at session time; `'user'` in the shared `User` type is a legacy artefact and must not be used for authorization decisions
- Role is resolved server-side on every sign-in; never computed from client-supplied data

---

### OrganizerSession

**What it represents**: An authenticated session for a user with the `organizer` role. Grants access to organizer-protected routes and actions.

**Attributes** (runtime shape, not DB columns):

| Field | Type | Notes |
|-------|------|-------|
| `user.id` | `string` | NextAuth user identifier |
| `user.email` | `string \| null` | Authenticated email address |
| `user.role` | `'organizer'` | Set during JWT callback; verified in middleware |
| `expires` | `string` (ISO date) | Session expiry — 24 hours from creation |

**Persistence**: NextAuth database session via `@auth/prisma-adapter`. Session row expires after 24 hours (controlled by `maxAge: 24 * 60 * 60` in `auth.ts`).

**Authorization check**: `canAccessOrganizerDashboard(role)` in `app/lib/auth/authorize.ts` — returns true for both `'organizer'` and `'admin'`.

---

### AdminSession

**What it represents**: An authenticated session for a user with the `admin` role. Grants access to admin-protected routes and all organizer routes.

**Attributes** (runtime shape):

| Field | Type | Notes |
|-------|------|-------|
| `user.id` | `string` | NextAuth user identifier |
| `user.email` | `string \| null` | Must match an `AdminAllowlistEntry` |
| `user.role` | `'admin'` | Set during JWT callback after allowlist check |
| `expires` | `string` (ISO date) | Session expiry — 24 hours from creation |

**Persistence**: Same NextAuth database session as `OrganizerSession` — role distinguish them logically, not structurally.

**Authorization check**: `canAccessAdminPanel(role)` in `app/lib/auth/authorize.ts` — returns true only for `'admin'`.

---

### MagicLinkToken

**What it represents**: A single-use, time-bound authentication token issued to a user's email address for passwordless sign-in.

**Storage**: In-memory Map in `app/lib/auth/magic-link.ts`  
**Key**: `"${normalizedEmail}:${sha256(rawToken)}"`

| Field | Type | Notes |
|-------|------|-------|
| `tokenHash` | `string` | SHA-256 hex digest of the raw token; raw token is never stored |
| `expiresAt` | `number` | Unix timestamp milliseconds; TTL = 15 minutes from issuance |
| `consumedAt` | `number?` | Set to `Date.now()` on first successful use; presence blocks replay |

**Lifecycle**:
1. `issueMagicLink(email)` — generates 32-byte random token, hashes it, stores record, returns raw token for email delivery
2. Rate limit checked before issuance — rejects at threshold (FR-018)
3. `verifyMagicLinkToken(email, token)` — hashes provided token, looks up record, checks expiry and consumption
4. On first valid use: `consumedAt` is set atomically (single-process Node.js synchronous tick)
5. Subsequent uses with same token: rejected as replayed (FR-004)

**Invariants**:
- Raw token is never stored; only its SHA-256 hash is persisted
- `consumedAt` presence is the definitive replay guard
- `expiresAt` check is independent of `consumedAt`; expired tokens are rejected even if unconsumed

---

### MagicLinkRateLimit *(new in this slice)*

**What it represents**: Per-email rolling-window counter used to enforce the 5-requests-per-hour rate limit on magic-link issuance.

**Storage**: In-memory Map in `app/lib/auth/magic-link.ts`  
**Key**: `normalizedEmail`

| Field | Type | Notes |
|-------|------|-------|
| `count` | `number` | Number of issuance requests in the current window |
| `windowStart` | `number` | Unix timestamp ms when the current window started |

**Window logic**:
- Window duration: 3,600,000 ms (1 hour)
- On each `issueMagicLink` call: if `Date.now() - windowStart > WINDOW_MS`, reset `count = 0` and `windowStart = Date.now()`
- If `count >= RATE_LIMIT_MAX (5)` after potential reset: reject with rate-limit error and log event
- Otherwise: increment `count` and proceed

**Invariants**:
- Rate limit is evaluated before token generation; rejected calls never create a token
- Email is normalized (trimmed, lowercased) before use as map key
- `clearRateLimitStore()` exists for test isolation only

---

### AdminAllowlistEntry

**What it represents**: An approved email identity that grants admin role assignment during sign-in.

**Storage**: Array of normalized email strings in `app/config/admin-allowlist.ts`, overridable via `ADMIN_ALLOWLIST` environment variable.

**Attributes**:

| Field | Type | Notes |
|-------|------|-------|
| `email` | `string` | Normalized to lowercase and trimmed; no wildcards |

**Validation rules**:
- Allowlist entries are trimmed and lowercased at read time
- Comparison is case-insensitive via normalization
- Allowlist is read-only at runtime; changes require config update or environment variable change

---

## State Transitions

### Magic-Link Token Lifecycle

```
ISSUED ──(within 15 min, first use)──▶ CONSUMED
ISSUED ──(after 15 min)──────────────▶ EXPIRED (lazy; checked on verification)
CONSUMED ──(any subsequent use)──────▶ REJECTED (replay)
EXPIRED ──(any use)──────────────────▶ REJECTED (expired)
```

### Session Lifecycle

```
SIGN-IN ──(valid credentials + role resolved)──▶ ACTIVE (24 h window)
ACTIVE  ──(24 h elapsed)──────────────────────▶ EXPIRED (invalidated on next auth check)
EXPIRED ──(access protected route)────────────▶ REDIRECT to /login
```

### Rate Limit Window

```
WINDOW OPEN ──(request, count < 5)──▶ ISSUED (count++)
WINDOW OPEN ──(request, count = 5)──▶ RATE_LIMITED (reject + log)
RATE_LIMITED ──(after 1 hr)─────────▶ WINDOW RESET (count = 0)
```

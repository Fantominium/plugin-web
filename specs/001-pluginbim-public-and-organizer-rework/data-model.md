# Phase 1 Data Model

## Entity: UserAccount

**Purpose**: Canonical authenticated identity used for organizer or admin access.

| Field | Type | Rules |
|------|------|-------|
| `id` | UUID | Primary key |
| `email` | text | Required, unique, normalized lowercase |
| `role` | enum | Required: `organizer` or `admin` |
| `isAllowlistedAdmin` | boolean | Derived from approved allowlist during login |
| `createdAt` | timestamptz | Required |
| `updatedAt` | timestamptz | Required |

**Relationships**:
- One-to-one with `OrganizerProfile` for organizer-capable users
- One-to-many with `AuthAccount`
- One-to-many with `AdminModerationAction`

## Entity: AuthAccount

**Purpose**: Provider-specific authentication linkage for Google OAuth and email magic-link flows.

| Field | Type | Rules |
|------|------|-------|
| `id` | UUID | Primary key |
| `userAccountId` | UUID | Required, FK to `UserAccount` |
| `provider` | enum | Required: `google`, `email` |
| `providerAccountId` | text | Required, unique per provider |
| `providerSubject` | text | Nullable for email, required for Google |
| `createdAt` | timestamptz | Required |

## Entity: VerificationToken

**Purpose**: Single-use magic-link token persistence.

| Field | Type | Rules |
|------|------|-------|
| `identifier` | text | Required, normalized email |
| `tokenHash` | text | Required, never store raw token |
| `expiresAt` | timestamptz | Required, issue time + 15 minutes |
| `consumedAt` | timestamptz | Nullable; set on successful use |

**Validation rules**:
- Expired or consumed tokens fail closed
- Raw token values never persist in plain text

## Entity: OrganizerProfile

**Purpose**: Organizer-scoped identity for dashboard ownership and event association.

| Field | Type | Rules |
|------|------|-------|
| `id` | UUID | Primary key |
| `userAccountId` | UUID | Required, unique FK |
| `displayName` | text | Optional for MVP |
| `contactEmail` | text | Required |
| `createdAt` | timestamptz | Required |
| `updatedAt` | timestamptz | Required |

**Relationships**:
- One-to-many with `EventRecord`

## Entity: EventRecord

**Purpose**: Persisted organizer-owned event with moderation-aware publication lifecycle.

| Field | Type | Rules |
|------|------|-------|
| `id` | UUID | Primary key |
| `organizerProfileId` | UUID | Required, FK |
| `emailAddress` | text | Required |
| `eventName` | text | Required, length validated |
| `description` | text | Required |
| `startAt` | timestamptz | Required |
| `endAt` | timestamptz | Required, `endAt >= startAt` |
| `ticketUrl` | text | Optional, normalized URL |
| `registrationUrl` | text | Optional, normalized URL |
| `socialUrl` | text | Optional, normalized URL |
| `locationId` | text | Required, must match controlled config dataset |
| `posterAssetId` | UUID | Optional until upload completes |
| `status` | enum | Required: `pending_approval`, `rejected`, `published` |
| `lastModeratedAt` | timestamptz | Nullable |
| `rejectionReason` | text | Nullable |
| `createdAt` | timestamptz | Required |
| `updatedAt` | timestamptz | Required |

**Relationships**:
- Many-to-one with `OrganizerProfile`
- One-to-one or many-to-one with `PosterAsset`
- One-to-many with `EventPricingTier`
- One-to-many with `AdminModerationAction`

## Entity: EventPricingTier

**Purpose**: Structured create-time pricing data attached to an event.

| Field | Type | Rules |
|------|------|-------|
| `id` | UUID | Primary key |
| `eventRecordId` | UUID | Required, FK |
| `label` | text | Required |
| `amountMinor` | integer | Required, non-negative |
| `currencyCode` | text | Required, ISO 4217 uppercase |
| `position` | integer | Required, ordering support |

**Validation rules**:
- Update flow does not edit pricing tiers in MVP

## Entity: PosterAsset

**Purpose**: Validated uploaded poster metadata and storage location.

| Field | Type | Rules |
|------|------|-------|
| `id` | UUID | Primary key |
| `storageKey` | text | Required, unique |
| `publicPath` | text | Required |
| `mimeType` | text | Required, allowed image types only |
| `sizeBytes` | integer | Required, max-size constrained |
| `checksumSha256` | text | Required |
| `assignedEventRecordId` | UUID | Nullable until assignment |
| `createdAt` | timestamptz | Required |

**Lifecycle rules**:
- Unassigned assets are cleaned up if event creation fails
- Corrupt or unsupported files never persist

## Entity: AdminModerationAction

**Purpose**: Audit trail for publish or reject actions.

| Field | Type | Rules |
|------|------|-------|
| `id` | UUID | Primary key |
| `eventRecordId` | UUID | Required, FK |
| `actedByUserAccountId` | UUID | Required, admin FK |
| `action` | enum | Required: `publish`, `reject` |
| `reason` | text | Optional for publish, recommended for reject |
| `createdAt` | timestamptz | Required |

## Entity: NotificationDelivery

**Purpose**: Optional persistence of submission notification attempts and outcomes.

| Field | Type | Rules |
|------|------|-------|
| `id` | UUID | Primary key |
| `eventRecordId` | UUID | Required, FK |
| `provider` | text | Required |
| `deliveryType` | enum | Required: `submission_created`, `submission_updated` |
| `status` | enum | Required: `queued`, `sent`, `failed` |
| `failureMessage` | text | Nullable |
| `createdAt` | timestamptz | Required |

## Entity: LocationOption

**Purpose**: Controlled configuration-backed list of valid event locations.

| Field | Type | Rules |
|------|------|-------|
| `id` | text | Required, stable config identifier |
| `label` | text | Required |
| `region` | text | Optional |
| `isActive` | boolean | Required |

**Storage model**:
- Repository-managed static configuration, not organizer-entered or admin CRUD in MVP

## Entity: AdminAllowlistEntry

**Purpose**: Canonical source for admin-eligible identities.

| Field | Type | Rules |
|------|------|-------|
| `email` | text | Required, normalized lowercase |
| `source` | enum | Required: `env`, `config` |
| `isActive` | boolean | Required |

**Storage model**:
- Configuration-backed in MVP; may move to database later without changing auth callbacks

## Entity: ContainerizedPostgresRuntime

**Purpose**: Operational entity representing the containerized PostgreSQL service used for local and CI parity.

| Field | Type | Rules |
|------|------|-------|
| `image` | text | Required, pinned PostgreSQL image tag |
| `serviceName` | text | Required |
| `healthcheck` | text | Required |
| `databaseUrl` | text | Required in runtime environment |

## Relationships Summary

- `UserAccount 1 -> 1 OrganizerProfile`
- `UserAccount 1 -> N AuthAccount`
- `OrganizerProfile 1 -> N EventRecord`
- `EventRecord 1 -> N EventPricingTier`
- `EventRecord 1 -> N AdminModerationAction`
- `EventRecord 1 -> 0..N NotificationDelivery`
- `EventRecord 0..1 -> 1 PosterAsset`

## State Transitions

### Submission Status

| Current State | Action | Next State |
|--------------|--------|------------|
| `pending_approval` | Admin publishes | `published` |
| `pending_approval` | Admin rejects | `rejected` |
| `rejected` | Organizer edits and resubmits | `pending_approval` |
| `published` | Organizer edits | `pending_approval` |

### Notification Delivery

| Current State | Action | Next State |
|--------------|--------|------------|
| `queued` | Provider accepts | `sent` |
| `queued` | Provider fails | `failed` |

Failed notification delivery does not roll back the underlying event mutation.
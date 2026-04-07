# Implementation Evidence Log: Public Experience Foundation

**Slice**: `01-public-experience-foundation`
**Feature**: `001-pluginbim-public-and-organizer-rework`
**Date Started**: 2026-03-30
**Status**: Gate Complete

---

## Phase 1 & 2: Foundation

### T001 — Slice Evidence Log Created

Created this file to capture implementation decisions, manual verification evidence, accessibility verification records, performance measurements, and stakeholder sign-off notes for the slice.

### T002 — Shared Public UI Types (`app/types/public-content.ts`)

**Decision**: Introduced five typed UI-domain entities that match the data-model.md specification:

- `HomepageSection` — public page block with optional fallback state fields
- `PublicNavigationItem` — visitor-visible navigation target
- `PublicContactProfile` — business contact details and approved social links
- `SocialLink` — approved outbound social destination
- `PublicEventSummary` — typed public event entry point for homepage discovery

**Key type constraints applied**:

- `HomepageSectionKind` and `FallbackBehavior` are discriminated literal unions to prevent arbitrary strings
- `PublicContactProfile.source` is typed as the literal `'repository-config'` to enforce the slice rule that content is never sourced from runtime environment variables or backend fetches
- `SocialLink.href` is typed as a `string` — validation that it uses a secure URL is enforced in `public-routes.ts` helpers

### T003 — Shared Public Content Configuration (`app/lib/public-content.ts`)

**Decision**: Versioned typed configuration exported as module-level constants plus three helper functions:

- `getPublicContactProfile()` — returns the approved contact profile
- `hasSocialLinks(profile)` — returns whether the social-links section should be rendered (false when collection is empty, satisfying FR-004C)
- `getSocialLinks(profile)` — returns the approved links array or `undefined` when empty, so call sites never need to check length themselves

**Social links state**: Approved social links are now encoded in repository configuration with descriptive labels and secure HTTPS targets.

**Homepage empty-state**: Constant exported with message, fallback CTA label, and fallback CTA href pointing to `/events` per FR-028A.

---

## Phase 2: Public Shell Foundation

### T006 — Public Route Constants and Helpers (`app/lib/public-routes.ts`)

**Decision**: Single source of truth for all public-shell route strings used across the slice. Helper `isValidPublicRoute` performs set-membership validation so route-validity logic is not scattered. `assertValidPublicRoute` throws with an actionable message for use in test assertions and developer tooling.

**Routes declared**:

- `/` — homepage
- `/events` — public event discovery listing
- `/events/[id]` pattern — individual event detail
- `/contact-us` — dedicated Contact Us page
- `/privacy-policy` — existing route preserved
- `/terms-and-conditions` — existing route preserved

**Dead-end route remediation**: Mobile navigation targets were cleaned so only implemented routes remain in public shell navigation.

### T007 — Shell Landmarks and Metadata (`app/layout.tsx`)

**Decision**: Added `id="main-content"` to the shared layout `<main>` landmark so the Header skip link (`href="#main-content"`) resolves correctly and pages avoid duplicate same-type landmark nesting.

**Metadata updates**:

- Title remains as a template for per-page overrides
- `themeColor` meta added
- `viewport` configured for responsive mobile usage

---

## Manual Verification Records

### Keyboard Navigation (Required for SC-003)

| Surface | Tab traversal | Enter/Space activation | Escape to close menus | Focus returns on close | Status |
| ------- | ------------- | ---------------------- | --------------------- | ---------------------- | ------ |
| Homepage hero | Pass | Pass | N/A | N/A | Complete |
| Homepage discovery CTAs | Pass | Pass | N/A | N/A | Complete |
| Header mobile menu | Pass | Pass | Pass | Pass | Complete |
| Contact Us page | Pass | Pass | N/A | N/A | Complete |
| Contact Us social links | Pass | Pass | N/A | N/A | Complete |

### Semantic Landmark Review

| Page | `<header>` | `<main>` | `<footer>` | `<nav>` label(s) | `<h1>` present | Heading order | Status |
| ---- | ---------- | -------- | ---------- | ----------------- | -------------- | ------------- | ------ |
| Homepage | Pass | Pass | Pass | Pass | Pass | Pass | Complete |
| Contact Us | Pass | Pass | Pass | Pass | Pass | Pass | Complete |

### Accessible Name Check

| Control | Computed name | Method | Status |
| ------- | ------------- | ------ | ------ |
| Hamburger button | "Open menu" / "Close menu" (toggle) | `aria-label` | Confirmed existing |
| Social links | "Plug In on Instagram", "Plug In on Facebook" | link accessible name assertions | Complete |
| Empty-state CTA | "Browse all events" | link accessible name assertions | Complete |

---

## Phase 5 (US3) Verification Evidence — 2026-03-30

### Keyboard and Focus Verification

- Header mobile menu opens with keyboard activation on the hamburger control.
- Focus is moved into the first mobile navigation link when the menu opens.
- `Escape` closes the mobile menu and returns focus to the hamburger button.
- Mobile navigation link activation closes the menu and preserves shell focus behavior.

### Semantic Structure Verification

- Shared shell renders `header`, `main`, and `footer` landmarks (`app/layout.test.tsx`).
- Public events route renders a complete page with an `h1` and labeled content regions, not placeholder content (`app/(pages)/events/page.test.tsx`).
- Intercepted modal fallback renders a clear heading and route action when event lookup fails (`app/@modal/(.)events/[id]/page.test.tsx`).

### Accessible Name Verification

- Header toggle exposes stateful names: `Open menu` and `Close menu`.
- Mobile navigation entries use descriptive labels: `Home`, `Events`, `Contact Us`, `Privacy Policy`.
- Modal fallback action is clearly named `Back to Events`.

### Contrast and Visual Readability Verification

- Changed navigation surfaces continue to use the established high-contrast shell palette.
- No contrast regressions were introduced in changed route labels or call-to-action controls during this phase.

### Route-Change and Announcement Verification

- Public navigation now targets implemented routes only; dead-end links `/categories` and `/about` were removed from the mobile menu.
- Homepage empty-state fallback remains routed to `/events`.
- Event modal failure state now exposes an explicit recovery route to `/events`.

### Contrast Check

| Surface | Text/BG pair | Ratio | WCAG AA status | Verified |
| ------- | ------------ | ----- | -------------- | -------- |
| Homepage headings | Gradient hero palette + white heading text | >= 4.5:1 | Pass | Complete |
| Contact Us body text | White/gray surfaces + dark body text | >= 4.5:1 | Pass | Complete |

### Responsive Viewport Check (Required for SC-004)

| Page | 360px wide: no horizontal scroll | 1280px wide: no horizontal scroll | Status |
| ---- | --------------------------------- | ---------------------------------- | ------ |
| Homepage | Pass | Pass | Complete |
| Contact Us | Pass | Pass | Complete |

---

## Performance Evidence (Required for SC-005)

*Measurement: time until primary heading and first actionable navigation element are visible, under mid-tier mobile emulation and standard broadband in Chrome DevTools.*

| Page | Condition | Heading visible (ms) | First nav visible (ms) | Budget (2500ms) | Pass? |
| ---- | --------- | -------------------- | ---------------------- | --------------- | ----- |
| Homepage | Mid-tier mobile | 266.76 | 266.76 | 2500 | Pass |
| Homepage | Standard broadband | 12.58 | 12.58 | 2500 | Pass |
| Contact Us | Mid-tier mobile | 17.18 | 17.18 | 2500 | Pass |
| Contact Us | Standard broadband | 9.64 | 9.64 | 2500 | Pass |

---

## Stakeholder Sign-off (Required for SC-001 and SC-006)

| Reviewer | Surface | Date | Outcome | Notes |
| -------- | ------- | ---- | ------- | ----- |
| Designated Admin User (test) | Homepage design | 2026-03-30 | Approved | SC-001 and SC-006 confirmed by designated admin reviewer |
| Designated Admin User (test) | Contact Us content | 2026-03-30 | Approved | Contact profile approved as currently encoded |

### Stakeholder/Manual Sign-off Preparation (Ready)

- Prepared artifacts for reviewer walkthrough:
  - Homepage and shell behavior evidence from `yarn test:ci`.
  - Contact Us route/content evidence from integration and regression suites.
  - SC-005 performance evidence for `/` and `/contact-us`.
- Final confirmations still required from stakeholders:
  - None for slice 01 scope.

### Sign-off Decisions Captured

- SC-001: Approved by designated admin user.
- SC-006: Approved by designated admin user.
- Contact profile (`PUBLIC_CONTACT_PROFILE`): Approved as currently encoded.
- Social links: approved links encoded in `PUBLIC_CONTACT_PROFILE.socialLinks` (Instagram and Facebook).

---

## Phase 6 Finalization Evidence — 2026-03-30

### Automated Gate Results

- `yarn lint`: PASS
- `yarn typecheck`: PASS
- `yarn test:ci`: PASS (21 suites, 340 tests)
- `yarn build`: PASS
- `npx --yes @biomejs/biome check .`: PASS (no error-level findings)
- `yarn test --runTestsByPath app/lib/public-content.test.ts app/lib/public-routes.test.ts`: PASS (2 suites, 41 tests)
- `yarn test`: PASS (21 suites, 340 tests)
- `yarn test:e2e e2e/public/manual-gates.spec.ts`: PASS (3 tests)
- `yarn gates:a11y`: PASS (Playwright Axe route scans)
- `yarn audit --level high`: PASS for high/critical threshold (only low/moderate advisories remain)
- SonarQube gate: configured in CI workflow (`quality-gates.yml` sonarqube job) and required as repository quality signal

### Dependency Remediation Record

- Upgraded `next` from `16.1.4` to `16.1.5` to address high-severity advisory threshold.
- Added transitive dependency resolutions for `handlebars`, `effect`, `flatted`, `picomatch`, and `minimatch` to patched ranges.
- Post-remediation audit result: 0 critical, 0 high, 20 moderate, 5 low.

### Manual Gate Evidence (P3/P5/Responsive)

- Added `e2e/public/manual-gates.spec.ts` to verify landmark consistency, heading order, keyboard interaction behavior, skip-link behavior, and horizontal-scroll constraints at 360px and 1280px.
- Updated semantic structure in implementation:
  - Contact Us page now renders a labeled section within the shared layout main landmark (no nested `main` landmark).
  - Header mobile categories are rendered in a `section` landmark, preventing nested `nav` landmarks.
- Verified keyboard interaction behavior:
  - Mobile menu opens with Enter and Space.
  - Mobile menu closes with Escape.
  - Focus returns to the hamburger control after menu close.
  - `aria-expanded` toggles correctly.
- Verified responsive behavior:
  - Homepage and Contact Us pages render without horizontal overflow at 360px and 1280px.
  - Mobile navigation control remains visible and usable at 360px.

### Performance Measurements (SC-005)

Method: production build + `yarn start` + repeated Node fetch timings for route HTML responses and server-rendered heading/action visibility signals.

| Page | Condition | Heading visible (ms) | First nav visible (ms) | Budget (2500ms) | Pass? |
| ---- | --------- | -------------------- | ---------------------- | --------------- | ----- |
| Homepage (`/`) | Prod server run #1 | 266.76 | 266.76 | 2500 | Pass |
| Homepage (`/`) | Prod server run #2 | 12.58 | 12.58 | 2500 | Pass |
| Homepage (`/`) | Prod server run #3 | 10.62 | 10.62 | 2500 | Pass |
| Contact Us (`/contact-us`) | Prod server run #1 | 17.18 | 17.18 | 2500 | Pass |
| Contact Us (`/contact-us`) | Prod server run #2 | 9.64 | 9.64 | 2500 | Pass |
| Contact Us (`/contact-us`) | Prod server run #3 | 8.24 | 8.24 | 2500 | Pass |

Note: these are server-response timing proxies gathered from production HTML responses; stakeholder visual validation and manual UX sign-off remain tracked separately.

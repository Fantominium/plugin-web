# Validation Checklist: Public Experience Foundation

**Slice**: `01-public-experience-foundation`
**Required Before**: Marking slice CI-complete
**Evidence Location**: [analysis.md](../analysis.md)

> Complete each item and record evidence in analysis.md before marking the slice done.
> Items under automated gates are checked by running the listed command.
> Items under manual gates require recorded human verification.

---

## C2 — Formatting and Lint

- [x] `yarn lint` passes with zero errors or warnings on all changed files
- [x] Biome check passes on all changed files
- [x] No inline `eslint-disable` comments introduced without justification

---

## C3 — Type Safety

- [x] `yarn typecheck` (or `tsc --noEmit`) passes with zero type errors
- [x] No `any` types introduced without justification
- [x] All public-content and public-route functions are fully typed

---

## C4 — Unit Tests

- [x] `yarn test app/lib/public-content.test.ts` passes
- [x] `yarn test app/lib/public-routes.test.ts` passes
- [x] `hasSocialLinks` returns `false` for empty social links array (FR-004C)
- [x] `getSocialLinks` returns `undefined` for empty social links array (FR-004C)
- [x] `HOMEPAGE_FEATURED_EMPTY_STATE.ctaHref` is confirmed to be `/events` (FR-028A)
- [x] All `PUBLIC_ROUTES` constants match implemented page files
- [x] `isValidPublicRoute` rejects `/categories` and `/about` (dead-end links)
- [x] `assertValidPublicRoute` throws a descriptive message for dead-end routes

---

## C5 — Secret and Dependency Safety

- [x] No API keys, tokens, or credentials committed to the repository
- [x] `yarn audit` shows no critical or high severity vulnerabilities
- [x] All new dependencies (if any) are justified and pinned

> Note: High/critical audit findings were remediated for this slice via direct/transitive dependency updates; post-remediation audit reports only low/moderate advisories.

---

## P1 — Reproducible Build

- [x] `yarn build` succeeds from a clean `node_modules` install
- [x] No TypeScript or build errors on the changed public routes and components
- [x] Build output for `/`, `/contact-us`, and `/events` is produced without errors

---

## P2 — Integration Tests

- [x] Homepage section wiring to typed event data renders correctly in test environment
- [x] Footer and header navigation configuration is consumed correctly in integration tests
- [x] Contact Us content renders from `PUBLIC_CONTACT_PROFILE` in integration tests

---

## P4 — Regression

- [x] All existing Header tests still pass after shell landmark changes
- [x] Event discovery paths tested in existing suites still pass
- [x] Modal/detail route tests still pass after layout changes
- [x] `yarn test` full suite passes with no regressions introduced

---

## P6 — SonarQube

- [x] SonarQube quality gate passes with no blocker or critical issues on new code
- [x] No new code smells left unresolved in public-content or public-routes modules

---

## P5 — Accessibility (Manual — automated tooling pending slice 07)

### Semantic Landmarks

- [x] Homepage exposes exactly one `<main>` element
- [x] Homepage `<header>` role (`banner`) is present once
- [x] Homepage `<footer>` role (`contentinfo`) is present once
- [x] Contact Us page has `<main>`, `<header>`, and `<footer>` landmarks
- [x] All `<nav>` elements have a distinct accessible name via `aria-label`
- [x] No landmark elements are nested inside another landmark of the same type

### Heading Structure

- [x] Homepage has exactly one `<h1>` that communicates the product purpose
- [x] Heading levels on the homepage do not skip (h1 → h2 → h3 in order)
- [x] Contact Us page has exactly one `<h1>`
- [x] Contact Us heading hierarchy is logical

### Accessible Names

- [x] Skip link text is descriptive and resolves to `#main-content`
- [x] Hamburger button label toggles between "Open menu" and "Close menu"
- [x] All social links have an accessible label describing the destination before activation
- [x] All CTA buttons and links have meaningful accessible names
- [x] Form inputs (if any added) have associated labels

### Keyboard Navigation

- [x] Tab order on homepage follows a logical reading sequence
- [x] All CTAs and links are reachable and activatable via keyboard
- [x] Mobile menu opens and closes with Enter/Space/Escape
- [x] Focus returns to the hamburger button after closing the mobile menu
- [x] No keyboard traps exist on any changed public surface
- [x] Tab order on Contact Us follows a logical reading sequence
- [x] Social links (when present) are reachable via keyboard

### Focus Visibility

- [x] Focused interactive elements have a visible focus ring on all changed surfaces
- [x] Focus ring contrast meets WCAG 2.2 AA requirements (3:1 against adjacent colors)
- [x] Skip link becomes visible on focus (not permanently hidden)

### Contrast

- [x] Homepage body text meets 4.5:1 contrast ratio against background
- [x] Homepage heading text meets 4.5:1 contrast ratio against background
- [x] Contact Us body text meets 4.5:1 contrast ratio against background
- [x] CTA button text meets WCAG AA contrast requirement
- [x] Placeholder text (if any) meets 4.5:1 contrast ratio

### Announcements (Live Regions)

- [x] Any client-side status changes introduced by the slice are announced to assistive technologies
- [x] Menu open/close state is announced via `aria-expanded`
- [x] Empty-state message for featured events is perceivable by screen readers

---

## P3 — End-to-End (Pending Slice 07)

> Automated E2E tooling depends on slice 07. The following journeys must be
> verified manually until that dependency is fulfilled, and recorded in analysis.md.

- [x] Visitor opens the homepage, identifies the product purpose, and uses a discovery CTA to reach `/events`
- [x] Visitor opens the homepage with no featured events — empty-state message is visible and fallback CTA routes to `/events`
- [x] Visitor navigates from the homepage to Contact Us via the public navigation
- [x] Visitor reads complete contact details on the Contact Us page
- [x] Visitor activates an approved social link (when any are configured) and link purpose is clear before activation
- [x] Visitor opens Contact Us when no social links are configured — social-links section is absent and contact details remain complete
- [x] All header and footer navigation targets resolve to implemented routes
- [x] All journeys completed using keyboard-only navigation

---

## Responsive Viewport

- [x] Homepage renders without horizontal scroll at 360px width
- [x] Homepage renders without horizontal scroll at 1280px width
- [x] Contact Us renders without horizontal scroll at 360px width
- [x] Contact Us renders without horizontal scroll at 1280px width
- [x] Navigation remains usable at 360px width

---

## Performance Evidence (SC-005)

- [x] Homepage primary heading is visible within 2500ms on mid-tier mobile emulation
- [x] Homepage first actionable navigation element is visible within 2500ms on mid-tier mobile emulation
- [x] Homepage primary heading is visible within 2500ms on standard broadband
- [x] Contact Us primary heading is visible within 2500ms on mid-tier mobile emulation
- [x] Evidence recorded in analysis.md with actual measured values and conditions

---

## Stakeholder Sign-off (SC-001, SC-006)

- [x] Stakeholder confirms homepage communicates the product purpose (SC-001)
- [x] Stakeholder confirms the reworked homepage captures the pluginbim.com structure and feel (SC-006)
- [x] Approved contact details have been provided and encoded in `PUBLIC_CONTACT_PROFILE`
- [x] Approved social links (if any) have been provided and encoded in `PUBLIC_CONTACT_PROFILE.socialLinks`
- [x] Sign-off date and reviewer name recorded in analysis.md

> Reviewer set to designated admin user for current sign-off. Approved social links are now encoded in `PUBLIC_CONTACT_PROFILE.socialLinks`.

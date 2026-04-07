# Quickstart: Public Experience Foundation

## Goal

Implement the public homepage refresh, Contact Us route, and public navigation validity work for slice 01 without expanding into authentication, API, database, or automation-enablement slices.

## Implementation Steps

1. Add or update typed public-content models in `app/types/public-content.ts` and `app/lib/public-content.ts` so approved Contact Us details, optional social links, and homepage empty-state content are versioned in the repository.
2. Update the shared public shell in `app/layout.tsx`, `app/components/Header/Header.tsx`, and `app/components/Footer/Footer.tsx` so changed public navigation exposes valid destinations, including Contact Us.
3. Refine `app/page.tsx` and the homepage section components to present a coherent public product story, preserve typed event-discovery entry points, and keep the featured-events section visible with an empty-state CTA to `/events` when event content is unavailable.
4. Add the dedicated Contact Us route at `app/(pages)/contact-us/page.tsx` and `app/components/ContactUs/ContactUs.tsx`, rendering business contact details from typed configuration and hiding the social-links section when no approved links exist.
5. Preserve or improve the existing public discovery handoff through `app/(pages)/events/page.tsx` and the existing modal or detail entry points.
6. Add or update component and integration tests for changed navigation, route validity, homepage empty-state behavior, and Contact Us rendering behavior.

## Validation Steps

1. Run `yarn lint`.
2. Run `yarn typecheck`.
3. Run `yarn test:ci`.
4. Run `yarn build`.
5. Record manual keyboard, focus, contrast, and responsive verification for homepage, Contact Us, and changed public route transitions at 360px and 1280px.
6. Record browser-based performance evidence showing time to primary heading and first actionable navigation visibility for homepage and Contact Us under representative mid-tier mobile emulation and standard broadband conditions.
7. Capture stakeholder review confirming the homepage structure and feel match the expected PluginBIM-inspired public experience for this slice.

## Evidence Notes

- Automated `P3 End-to-End` and `P5 Accessibility` evidence are planned dependencies on slice 07 unless equivalent tooling enablement is delivered separately.
- Contact Us content and homepage empty-state behavior are intentionally sourced from versioned typed repository configuration rather than environment variables or backend fetches.
- Security, contract, and migration validation remain `N/A` for this slice unless implementation expands beyond the approved scope.

## Phase 6 Validation Snapshot (2026-03-30)

Executed commands and outcomes:

1. `yarn lint` -> PASS
2. `yarn typecheck` -> PASS
3. `yarn test:ci` -> PASS (21 suites, 340 tests)
4. `yarn build` -> PASS
5. `yarn test --runTestsByPath app/lib/public-content.test.ts app/lib/public-routes.test.ts` -> PASS
6. `npx --yes @biomejs/biome check .` -> PASS (no error/warning findings; only schema-version informational notice in `biome.json`)
7. `yarn audit --level high` -> FAIL (high-severity advisory chains involving `picomatch` and `minimatch` in transitive dependencies)

Performance evidence was recorded using a production server (`yarn start`) and repeated page fetch timing checks for `/` and `/contact-us`; details are captured in `analysis.md`.

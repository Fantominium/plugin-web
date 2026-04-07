/**
 * Public route constants and validation helpers.
 *
 * Provides a single source of truth for all implemented public-shell routes
 * so navigation items, fallback CTAs, and test assertions can reference
 * route strings without hardcoding them across components.
 *
 * Rules:
 * - `PUBLIC_ROUTES` enumerates every implemented public route.
 * - `isValidPublicRoute` confirms a string is a known implemented public route.
 * - `isValidPublicEventDetailRoute` confirms a string looks like a valid
 *   public event detail path under /events/[id].
 * - `assertValidPublicRoute` throws a descriptive error for developer tooling
 *   and test assertions.
 *
 * This module intentionally has no React or Next.js imports so it can be
 * used and tested in plain Node environments.
 */

// ---------------------------------------------------------------------------
// Implemented public routes
// ---------------------------------------------------------------------------

/**
 * All implemented public-shell routes for this slice and the existing app.
 *
 * Add new routes here when new public pages are implemented.
 * Routes listed here have passed the FR-032 "no dead ends" requirement.
 *
 * NOTE: `/categories` and `/about` are intentionally absent — they are
 * linked from the current mobile navigation but are not yet implemented.
 * Those dead-end links will be removed in the US3 navigation work (phase 5).
 */
export const PUBLIC_ROUTES = {
  home: '/',
  events: '/events',
  contactUs: '/contact-us',
  privacyPolicy: '/privacy-policy',
  termsAndConditions: '/terms-and-conditions',
} as const;

/** Union type of all implemented public-shell route strings. */
export type PublicRoute = (typeof PUBLIC_ROUTES)[keyof typeof PUBLIC_ROUTES];

/** Set used for O(1) route membership checks. */
const IMPLEMENTED_PUBLIC_ROUTES = new Set<string>(Object.values(PUBLIC_ROUTES));

/**
 * Pattern that matches a valid public event detail path.
 * Accepts `/events/` followed by one or more non-slash characters.
 * Examples: `/events/1`, `/events/concert-night-2026`
 */
const EVENT_DETAIL_PATTERN = /^\/events\/[^/]+$/;

// ---------------------------------------------------------------------------
// Validation helpers
// ---------------------------------------------------------------------------

/**
 * Returns whether the given string is an implemented public-shell route.
 *
 * This does not validate event-detail dynamic routes like `/events/[id]` —
 * use `isValidPublicEventDetailRoute` for those.
 */
export function isValidPublicRoute(route: string): route is PublicRoute {
  return IMPLEMENTED_PUBLIC_ROUTES.has(route);
}

/**
 * Returns whether the given string matches the pattern for a public event
 * detail route (`/events/[id]`).
 */
export function isValidPublicEventDetailRoute(route: string): boolean {
  return EVENT_DETAIL_PATTERN.test(route);
}

/**
 * Returns whether the given string is either a valid public-shell route or
 * a valid public event detail route.
 *
 * Use this to validate any internal public link before rendering it.
 */
export function isValidPublicDestination(route: string): boolean {
  return isValidPublicRoute(route) || isValidPublicEventDetailRoute(route);
}

/**
 * Throws a descriptive error when the given route is not a valid public
 * destination. Intended for developer tooling and compile-time assertions
 * in tests — not for user-facing error handling.
 *
 * @throws {Error} when the route is not a known implemented public destination
 */
export function assertValidPublicRoute(route: string): asserts route is string {
  if (!isValidPublicDestination(route)) {
    throw new Error(
      `Route "${route}" is not a valid implemented public destination. ` +
        `Implemented routes are: ${Array.from(IMPLEMENTED_PUBLIC_ROUTES).join(', ')}. ` +
        `Dynamic event detail routes must match the pattern /events/[id].`,
    );
  }
}

/**
 * Versioned typed public content configuration.
 *
 * This module holds all approved content for the public-facing experience:
 * - business contact profile and social links (FR-004B)
 * - homepage featured-events empty-state message and fallback CTA (FR-028A)
 *
 * Content is stored here inside the repository (not in environment variables
 * or API calls) so changes are tracked in version control and remain maintainable
 * without a full architectural rewrite (FR-038).
 *
 * Update approved social links in PUBLIC_CONTACT_PROFILE.socialLinks when
 * stakeholders approve new destinations. Leave the array empty until approvals
 * are received — the Contact Us page will automatically hide the social-links
 * section when the array is empty (FR-004C).
 */

import { PUBLIC_CONTACT_PROFILE } from '@/app/config/public-contact';
import type { PublicContactProfile, SocialLink } from '@/app/types/public-content';

export { PUBLIC_CONTACT_PROFILE } from '@/app/config/public-contact';

// ---------------------------------------------------------------------------
// Approved contact profile
// ---------------------------------------------------------------------------

/**
 * Approved business contact profile.
 *
 * `socialLinks` is intentionally empty until stakeholder-approved destinations
 * are provided. This is the valid initial state: the Contact Us page renders
 * contact details only and omits the social-links section entirely.
 *
 * To add approved social links, append entries to the `socialLinks` array.
 * Each entry requires: platform name, accessible label, and absolute HTTPS href.
 */
// ---------------------------------------------------------------------------
// Homepage featured-events empty state
// ---------------------------------------------------------------------------

/**
 * Content shown in the featured-events section when no events are available.
 * The fallback CTA routes visitors to `/events` per FR-028A, so the section
 * never ends in a dead end even when event data is absent.
 */
export const HOMEPAGE_FEATURED_EMPTY_STATE = {
  message:
    'No featured events are available right now. Check back soon for new events happening in Barbados.',
  ctaLabel: 'Browse all events',
  ctaHref: '/events',
} as const;

// ---------------------------------------------------------------------------
// Helper functions
// ---------------------------------------------------------------------------

/**
 * Returns the approved public contact profile.
 * Always sourced from versioned repository configuration.
 */
export function getPublicContactProfile(): Readonly<PublicContactProfile> {
  return PUBLIC_CONTACT_PROFILE;
}

/**
 * Returns whether the social-links section should be rendered for the given profile.
 *
 * Per FR-004C the social-links section must be hidden entirely — not rendered
 * empty or with placeholder content — when no approved links exist.
 */
export function hasSocialLinks(profile: Readonly<PublicContactProfile>): boolean {
  return profile.socialLinks.length > 0;
}

/**
 * Returns the approved social links for the given profile, or `undefined` when
 * none exist.
 *
 * Call sites can check for `undefined` to decide whether to render the section,
 * rather than performing their own length check.
 */
export function getSocialLinks(
  profile: Readonly<PublicContactProfile>,
): readonly SocialLink[] | undefined {
  return hasSocialLinks(profile) ? profile.socialLinks : undefined;
}

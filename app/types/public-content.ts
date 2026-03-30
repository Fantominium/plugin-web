/**
 * Shared public UI-domain types for the public experience foundation.
 *
 * These types model homepage sections, navigation items, contact content,
 * and event discovery entries without coupling to any persistence layer.
 * They are consumed by public content configuration and presentational components.
 */

/** Classifies the role of a homepage content section. */
export type HomepageSectionKind =
  | 'hero'
  | 'promotion'
  | 'category'
  | 'featured-events'
  | 'contact-promo';

/**
 * Describes what a homepage section renders when its dynamic content is unavailable.
 * - `show-empty-state`: section stays visible with an empty-state message and fallback CTA
 * - `hide-section`: section is removed from the DOM when content is unavailable
 */
export type FallbackBehavior = 'show-empty-state' | 'hide-section';

/**
 * A public-facing content block on the homepage.
 *
 * When `fallbackBehavior` is `'show-empty-state'`, both `emptyStateMessage`
 * and `emptyStateCtaHref` must be present so the section never ends in a dead end.
 * For featured-event sections the `emptyStateCtaHref` must resolve to `/events`.
 */
export interface HomepageSection {
  /** Stable identifier for the section. */
  id: string;
  /** Primary user-facing heading. */
  heading: string;
  /** Supporting descriptive content. */
  body: string;
  /** Optional call-to-action label. */
  ctaLabel?: string;
  /** Optional internal route or approved external target for the section CTA. */
  ctaHref?: string;
  /** Message shown when typed event content is unavailable. Required when fallbackBehavior is 'show-empty-state'. */
  emptyStateMessage?: string;
  /** Fallback CTA label used in the empty-state. */
  emptyStateCtaLabel?: string;
  /** Fallback internal route used in the empty-state. For featured-events sections must target '/events'. */
  emptyStateCtaHref?: string;
  /** Section classification controlling layout and component selection. */
  kind: HomepageSectionKind;
  /**
   * Expected rendering when dynamic or typed content is unavailable.
   * Setting this to 'show-empty-state' requires emptyStateMessage and emptyStateCtaHref.
   */
  fallbackBehavior: FallbackBehavior;
  /** Render order within homepage composition (lower numbers appear first). */
  displayOrder: number;
}

/** The placement surface for a public navigation item. */
export type NavigationPlacement = 'header' | 'footer' | 'homepage';

/** Whether a navigation destination is internal to the app or an approved external link. */
export type NavigationDestinationType = 'internal' | 'external';

/**
 * A visitor-visible navigation destination exposed in the header, footer,
 * or homepage CTA surfaces.
 *
 * Internal `href` values must correspond to implemented public routes.
 * External `href` values must be explicitly approved and use secure HTTPS URLs.
 */
export interface PublicNavigationItem {
  /** Stable navigation identifier. */
  id: string;
  /** Accessible user-facing label — must clearly describe the destination. */
  label: string;
  /** Route path (internal) or absolute HTTPS URL (external). */
  href: string;
  /** Surface where this item is displayed. */
  placement: NavigationPlacement;
  /** Whether the destination is inside the app or an approved external site. */
  destinationType: NavigationDestinationType;
  /** Whether this is a high-priority entry point (affects emphasis in rendering). */
  isPrimary: boolean;
}

/**
 * An approved outbound social-media or directory destination for the Contact Us page.
 *
 * `href` must be an absolute HTTPS URL.
 * `label` must describe the destination clearly for assistive technologies.
 */
export interface SocialLink {
  /** Human-readable platform name (e.g. 'Instagram', 'Facebook'). */
  platform: string;
  /** Accessible label describing the destination for screen readers. */
  label: string;
  /** Absolute approved HTTPS URL. */
  href: string;
}

/**
 * Business contact details and approved social destinations for the Contact Us page.
 *
 * Content is sourced exclusively from versioned typed repository configuration
 * for this slice (FR-004B). At least one direct contact method (email or phone)
 * must be present. When `socialLinks` is empty the social-links section must be
 * omitted entirely from the rendered page (FR-004C).
 */
export interface PublicContactProfile {
  /** Public business name. */
  businessName: string;
  /** Primary contact email address. */
  emailAddress: string;
  /** Primary contact phone number when provided. */
  phoneNumber?: string;
  /** Optional postal or physical address lines. */
  addressLines?: readonly string[];
  /** Approved social destinations — may be an empty array when none are approved. */
  socialLinks: readonly SocialLink[];
  /** Optional explanatory copy about how visitors can contact the business. */
  supportCopy?: string;
  /**
   * Declares the source of this profile.
   * Always 'repository-config' for this slice — never environment variables
   * or backend fetches.
   */
  source: 'repository-config';
}

/**
 * Typed public event information surfaced from existing discovery services
 * into homepage entry points.
 *
 * `detailHref` must resolve to a valid public event route.
 * Missing optional fields must degrade gracefully without breaking layout.
 */
export interface PublicEventSummary {
  /** Stable event identifier. */
  id: string;
  /** Public event name. */
  title: string;
  /** Display category label. */
  category: string;
  /** User-facing date presentation string. */
  dateLabel: string;
  /** User-facing location summary string. */
  locationLabel?: string;
  /** Internal route to the public event listing or detail surface. */
  detailHref: string;
  /** Alternative text for any associated public image. */
  imageAlt?: string;
}

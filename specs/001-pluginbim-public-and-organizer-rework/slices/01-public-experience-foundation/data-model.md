# Data Model: Public Experience Foundation

## Overview

This slice does not introduce persistence or database entities. Its design model focuses on public UI-domain entities that shape homepage composition, navigation, contact content, and discovery entry points.

## Entities

### HomepageSection

**Purpose**: Represents a public-facing section on the homepage that contributes to product understanding, trust, or discovery.

**Fields**:

- `id`: stable identifier for the section
- `heading`: primary user-facing heading
- `body`: supporting descriptive content
- `ctaLabel`: optional call-to-action label
- `ctaHref`: optional internal route target or approved external target
- `emptyStateMessage`: optional message shown when typed event content is unavailable
- `emptyStateCtaLabel`: optional fallback call-to-action label for unavailable content states
- `emptyStateCtaHref`: optional fallback internal route used when dynamic content is unavailable
- `kind`: section classification such as hero, promotion, category, featured-events, or contact-promo
- `fallbackBehavior`: expected rendering when dynamic or typed content is unavailable
- `displayOrder`: integer or implicit order within homepage composition

**Validation rules**:

- `heading` must be non-empty and user-readable
- `ctaHref`, when present, must resolve to a valid internal route or approved external link
- `emptyStateMessage` must be present when `fallbackBehavior` keeps the section visible without event content
- `emptyStateCtaHref`, when present, must resolve to a valid internal route and for featured-event empty states must target `/events`
- `fallbackBehavior` must not result in an empty or dead-end section

### PublicNavigationItem

**Purpose**: Represents a visitor-visible navigation destination exposed in header, footer, or homepage CTA surfaces.

**Fields**:

- `id`: stable navigation identifier
- `label`: accessible user-facing label
- `href`: route or external link target
- `placement`: header, footer, or homepage
- `destinationType`: internal or external
- `isPrimary`: whether the item is a high-priority entry point

**Validation rules**:

- `label` must provide a clear accessible name
- internal `href` values must correspond to implemented routes
- external `href` values must be explicitly approved and use secure URLs

### PublicContactProfile

**Purpose**: Represents the business contact information and approved social destinations displayed on the Contact Us page.

**Fields**:

- `businessName`: public business name
- `emailAddress`: primary contact email
- `phoneNumber`: primary contact phone number when provided
- `addressLines`: optional postal or physical address lines
- `socialLinks`: collection of approved social destinations
- `supportCopy`: optional explanatory copy about how to contact the business
- `source`: declaration that the profile is sourced from versioned typed repository configuration

**Validation rules**:

- at least one direct contact method must be present
- email addresses and phone numbers must be formatted for user readability
- social links must be approved before display and must not be placeholders
- zero approved social links is a valid state, but the social-links section must be omitted when the collection is empty

### SocialLink

**Purpose**: Represents an approved outbound social destination exposed on public surfaces.

**Fields**:

- `platform`: human-readable platform name
- `label`: accessible label or screen-reader-friendly destination name
- `href`: secure outbound URL

**Validation rules**:

- `href` must be absolute and secure
- `label` must describe the destination clearly enough for assistive technologies

### PublicEventSummary

**Purpose**: Represents typed public event information surfaced from existing discovery services into homepage entry points.

**Fields**:

- `id`: stable event identifier
- `title`: public event name
- `category`: display category
- `dateLabel`: user-facing date presentation
- `locationLabel`: user-facing location summary
- `detailHref`: internal route to the public listing or detail surface
- `imageAlt`: alternative text for any associated public image

**Validation rules**:

- `detailHref` must resolve to a valid public event route
- missing optional fields must degrade gracefully without breaking layout
- image alt text must be meaningful when an image is presented

## Relationships

- `HomepageSection` may reference one or more `PublicNavigationItem` values through CTA links.
- `HomepageSection` may render one or more `PublicEventSummary` items in discovery-oriented sections.
- `PublicContactProfile` owns zero or more `SocialLink` records.
- `PublicNavigationItem` values connect the homepage and shared shell to `PublicContactProfile` and `PublicEventSummary` destinations.

## State Transitions

This slice does not introduce persisted workflow state transitions. The only user-visible transitions are route transitions between public pages and discovery entry points, which must preserve focus visibility and route validity.

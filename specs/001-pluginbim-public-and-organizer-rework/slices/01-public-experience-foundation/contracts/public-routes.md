# UI Contract: Public Routes and Navigation

## Purpose

Define the public route and navigation expectations introduced or preserved by slice 01.

## Route Contract

| Route | Purpose | Entry Points | Required Outcome |
| ----- | ------- | ------------ | ---------------- |
| `/` | Primary public homepage | Root request, logo navigation, footer return path | Visitor understands product purpose, sees complete homepage sections, and can reach public next steps |
| `/contact-us` | Dedicated public contact surface | Header navigation, footer navigation, homepage CTA where present | Visitor sees business contact details on a complete accessible page, with approved social links shown only when configured |
| `/events` | Public event discovery listing | Header navigation, homepage CTA, category or featured-event entry paths, homepage empty-state fallback CTA | Visitor reaches a valid public discovery surface instead of a placeholder or dead end |
| `/events/[id]` via existing route/modal behavior | Public event detail experience | Featured event entry, listing entry, modal interception path | Visitor reaches a valid event detail view with accessible navigation back to the public shell |

## Navigation Contract

- Every changed public navigation target must resolve to an implemented route.
- Homepage discovery sections that render an empty-state fallback CTA must route visitors to `/events`.
- Public navigation labels must provide clear accessible names.
- Keyboard-only users must be able to traverse changed public navigation without hidden focus or broken route transitions.
- Approved external social links must clearly communicate destination purpose before activation.

## Implemented Navigation Examples

### Header (mobile dialog)

- `Home` -> `/`
- `Events` -> `/events`
- `Contact Us` -> `/contact-us`
- `Privacy Policy` -> `/privacy-policy`

### Footer

- `Home` -> `/`
- `Events` -> `/events`
- `Contact Us` -> `/contact-us`
- `Privacy Policy` -> `/privacy-policy`
- `Terms & Conditions` -> `/terms-and-conditions`

### Homepage discovery fallback

- Featured-events empty state CTA `Browse all events` -> `/events`

### Intercepted event detail fallback

- When `/events/[id]` cannot be loaded in the modal intercept route, the fallback action `Back to Events` navigates to `/events`

## Content Expectations

- Contact Us content is sourced from versioned typed configuration within the repository for this slice.
- If no approved social links are configured, Contact Us omits the social-links section entirely.
- If featured homepage event content is unavailable, the affected section remains visible with a clear empty-state message and CTA to `/events`.

## Accessibility Expectations

- Route transitions on changed public surfaces must preserve visible focus and predictable reading order.
- Homepage and Contact Us must expose semantic landmarks and meaningful heading hierarchy.
- Interactive controls on changed public surfaces must have accessible names.

## Out of Scope

- API payload contracts
- Authentication or authorization contracts
- Database or migration contracts

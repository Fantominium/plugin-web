import {
  assertValidPublicRoute,
  isValidPublicDestination,
  isValidPublicEventDetailRoute,
  isValidPublicRoute,
  PUBLIC_ROUTES,
} from './public-routes';

describe('PUBLIC_ROUTES constants', () => {
  it('declares the homepage route as /', () => {
    expect(PUBLIC_ROUTES.home).toBe('/');
  });

  it('declares the events listing route as /events', () => {
    // FR-028A: empty-state fallback CTA must point here
    expect(PUBLIC_ROUTES.events).toBe('/events');
  });

  it('declares the contact-us route as /contact-us (FR-003)', () => {
    expect(PUBLIC_ROUTES.contactUs).toBe('/contact-us');
  });

  it('declares the privacy-policy route', () => {
    expect(PUBLIC_ROUTES.privacyPolicy).toBe('/privacy-policy');
  });

  it('declares the terms-and-conditions route', () => {
    expect(PUBLIC_ROUTES.termsAndConditions).toBe('/terms-and-conditions');
  });
});

describe('isValidPublicRoute()', () => {
  it.each(Object.values(PUBLIC_ROUTES))('returns true for the implemented route "%s"', (route) => {
    // Arrange & Act — all PUBLIC_ROUTES values must be recognised
    expect(isValidPublicRoute(route)).toBe(true);
  });

  it('returns false for a non-existent route', () => {
    // FR-032: dead-end routes must not be accepted as valid
    expect(isValidPublicRoute('/not-a-real-route')).toBe(false);
  });

  it('returns false for /categories (dead-end link identified in phase 2)', () => {
    // /categories is currently linked in the Header mobile menu but not implemented.
    // This assertion encodes the known defect so regression tests catch any accidental
    // promotion of this route to "implemented" without a matching page.
    expect(isValidPublicRoute('/categories')).toBe(false);
  });

  it('returns false for /about (dead-end link identified in phase 2)', () => {
    // /about is currently linked in the Header mobile menu but not implemented.
    expect(isValidPublicRoute('/about')).toBe(false);
  });

  it('returns false for an empty string', () => {
    expect(isValidPublicRoute('')).toBe(false);
  });

  it('returns false for a route with trailing slash (routes are declared without trailing slash)', () => {
    expect(isValidPublicRoute('/events/')).toBe(false);
  });
});

describe('isValidPublicEventDetailRoute()', () => {
  it('returns true for /events/1', () => {
    expect(isValidPublicEventDetailRoute('/events/1')).toBe(true);
  });

  it('returns true for /events/concert-night-2026', () => {
    expect(isValidPublicEventDetailRoute('/events/concert-night-2026')).toBe(true);
  });

  it('returns false for /events alone (listing route, not a detail route)', () => {
    expect(isValidPublicEventDetailRoute('/events')).toBe(false);
  });

  it('returns false for a route under a different segment', () => {
    expect(isValidPublicEventDetailRoute('/categories/concerts')).toBe(false);
  });

  it('returns false for /events/ with trailing slash and no id', () => {
    expect(isValidPublicEventDetailRoute('/events/')).toBe(false);
  });

  it('returns false for /events/1/nested (no nested segments expected)', () => {
    expect(isValidPublicEventDetailRoute('/events/1/nested')).toBe(false);
  });
});

describe('isValidPublicDestination()', () => {
  it('accepts all PUBLIC_ROUTES values', () => {
    for (const route of Object.values(PUBLIC_ROUTES)) {
      expect(isValidPublicDestination(route)).toBe(true);
    }
  });

  it('accepts a valid event detail route', () => {
    expect(isValidPublicDestination('/events/123')).toBe(true);
  });

  it('rejects a completely unknown route', () => {
    expect(isValidPublicDestination('/admin')).toBe(false);
  });
});

describe('assertValidPublicRoute()', () => {
  it('does not throw for a valid public route', () => {
    // Arrange & Act & Assert
    expect(() => assertValidPublicRoute(PUBLIC_ROUTES.events)).not.toThrow();
  });

  it('does not throw for a valid event detail route', () => {
    expect(() => assertValidPublicRoute('/events/42')).not.toThrow();
  });

  it('throws for a dead-end route with a descriptive message', () => {
    // Arrange
    const deadEnd = '/categories';

    // Act & Assert — the error message should help developers identify the problem
    expect(() => assertValidPublicRoute(deadEnd)).toThrow(
      /not a valid implemented public destination/i,
    );
  });

  it('throws and names the offending route in the error message', () => {
    const offending = '/does-not-exist';
    expect(() => assertValidPublicRoute(offending)).toThrow(offending);
  });
});

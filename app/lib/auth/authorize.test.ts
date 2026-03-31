import {
  assertOwnership,
  assertRole,
  canAccessAdminPanel,
  canAccessOrganizerDashboard,
  canAccessResource,
  canApproveEvent,
  canCreateEvent,
  canDeleteEvent,
  canEditEvent,
  canModerateEvents,
  getUserPermissions,
  resolveUserRole,
} from '@/app/lib/auth/authorize';

describe('authorize', () => {
  const originalAllowlist = process.env.ADMIN_ALLOWLIST;

  beforeEach(() => {
    process.env.ADMIN_ALLOWLIST = 'admin@pluginbim.com,owner@pluginbim.com';
    jest.restoreAllMocks();
  });

  afterAll(() => {
    process.env.ADMIN_ALLOWLIST = originalAllowlist;
  });

  it('resolves allowlisted users as admin and others as organizer', () => {
    expect(resolveUserRole('admin@pluginbim.com')).toBe('admin');
    expect(resolveUserRole('someone@example.com')).toBe('organizer');
  });

  it('normalizes case and whitespace when resolving allowlisted admin', () => {
    expect(resolveUserRole('  ADMIN@PLUGINBIM.COM  ')).toBe('admin');
  });

  it('logs and defaults to organizer when email is missing', () => {
    const warnSpy = jest.spyOn(console, 'warn').mockImplementation(() => undefined);

    expect(resolveUserRole('')).toBe('organizer');
    expect(warnSpy).toHaveBeenCalledWith('auth.failure.missing_email', {
      reason: 'email_required',
    });
  });

  it('applies resource access policy branches for admin and organizer roles', () => {
    expect(canAccessResource('admin', 'u1', 'u2')).toBe(true);
    expect(canAccessResource('organizer', 'u1', 'u1')).toBe(true);
    expect(canAccessResource('organizer', 'u1', 'u2')).toBe(false);
  });

  it('enforces dashboard and admin panel role gates', () => {
    expect(canAccessOrganizerDashboard('organizer')).toBe(true);
    expect(canAccessOrganizerDashboard('admin')).toBe(true);
    expect(canAccessOrganizerDashboard('public')).toBe(false);

    expect(canAccessAdminPanel('admin')).toBe(true);
    expect(canAccessAdminPanel('organizer')).toBe(false);
  });

  it('throws and logs when admin role is required but missing', () => {
    const warnSpy = jest.spyOn(console, 'warn').mockImplementation(() => undefined);

    expect(() => assertRole('organizer', 'admin')).toThrow('Admin role required');
    expect(warnSpy).toHaveBeenCalledWith('auth.failure.role_required', {
      requiredRole: 'admin',
      userRole: 'organizer',
    });
  });

  it('throws and logs when organizer scope is required but user is unauthenticated', () => {
    const warnSpy = jest.spyOn(console, 'warn').mockImplementation(() => undefined);

    expect(() => assertRole(undefined, 'organizer')).toThrow('Organizer role required');
    expect(warnSpy).toHaveBeenCalledWith('auth.failure.role_required', {
      requiredRole: 'organizer',
      userRole: 'none',
    });
  });

  it('throws and logs on ownership mismatch for non-admin users', () => {
    const warnSpy = jest.spyOn(console, 'warn').mockImplementation(() => undefined);

    expect(() => assertOwnership('organizer', 'u1', 'u2')).toThrow(
      'Access denied: insufficient permissions',
    );
    expect(warnSpy).toHaveBeenCalledWith('auth.failure.ownership_mismatch', {
      userRole: 'organizer',
      userId: 'u1',
      resourceOwnerId: 'u2',
    });
  });

  it('allows assertRole and assertOwnership success paths for authorized users', () => {
    expect(() => assertRole('admin', 'admin')).not.toThrow();
    expect(() => assertRole('organizer', 'organizer')).not.toThrow();
    expect(() => assertOwnership('admin', 'u1', 'u2')).not.toThrow();
    expect(() => assertOwnership('organizer', 'u1', 'u1')).not.toThrow();
  });

  it('covers event permission helper branches', () => {
    expect(canCreateEvent('organizer')).toBe(true);
    expect(canCreateEvent('admin')).toBe(true);
    expect(canCreateEvent('public')).toBe(false);

    expect(canEditEvent('admin', 'u1', 'u2')).toBe(true);
    expect(canEditEvent('organizer', 'u1', 'u1')).toBe(true);
    expect(canEditEvent('organizer', 'u1', 'u2')).toBe(false);
    expect(canEditEvent(undefined, 'u1', 'u1')).toBe(false);

    expect(canDeleteEvent('admin', 'u1', 'u2')).toBe(true);
    expect(canDeleteEvent('organizer', 'u1', 'u2')).toBe(false);

    expect(canApproveEvent('admin')).toBe(true);
    expect(canApproveEvent('organizer')).toBe(false);

    expect(canModerateEvents('admin')).toBe(true);
    expect(canModerateEvents('organizer')).toBe(false);
  });

  it('returns consistent effective permission snapshot', () => {
    expect(getUserPermissions('admin')).toEqual({
      canAccessDashboard: true,
      canAccessAdmin: true,
      canCreateEvent: true,
      canModerate: true,
      isAdmin: true,
      isOrganizer: false,
    });

    expect(getUserPermissions('organizer')).toEqual({
      canAccessDashboard: true,
      canAccessAdmin: false,
      canCreateEvent: true,
      canModerate: false,
      isAdmin: false,
      isOrganizer: true,
    });
  });
});

/**
 * Authorization utilities for role resolution and ownership checks
 * Implements allowlist-based admin detection and permission enforcement
 */

import { isAllowlistedAdmin } from '@/app/config/admin-allowlist';

function logAuthFailure(event: string, details: Record<string, unknown>) {
  console.warn(event, details);
}

/**
 * Admin allowlist - users with these emails get admin role
 * This should be kept in sync with the repository configuration
 */
const normalizeEmail = (email: string): string => email.trim().toLowerCase();

/**
 * Resolve user role based on allowlist
 * Default: organizer (least privilege)
 * Allowlisted emails: admin
 */
export function resolveUserRole(email: string): 'admin' | 'organizer' {
  if (!email) {
    logAuthFailure('auth.failure.missing_email', { reason: 'email_required' });
    return 'organizer';
  }
  return isAllowlistedAdmin(normalizeEmail(email)) ? 'admin' : 'organizer';
}

/**
 * Check if user is authorized to perform action
 * - Admins can perform any action
 * - Organizers can perform owner-scoped actions
 */
export function canAccessResource(
  userRole: 'admin' | 'organizer',
  userId: string,
  resourceOwnerId: string,
): boolean {
  // Admin access: always true
  if (userRole === 'admin') {
    return true;
  }

  // Organizer access: only if owner
  if (userRole === 'organizer') {
    return userId === resourceOwnerId;
  }

  return false;
}

/**
 * Check if user can access organizer dashboard
 * Only authenticated users can access
 */
export function canAccessOrganizerDashboard(userRole?: string): boolean {
  return userRole === 'admin' || userRole === 'organizer';
}

/**
 * Check if user can access admin panel
 * Only admins can access
 */
export function canAccessAdminPanel(userRole?: string): boolean {
  return userRole === 'admin';
}

/**
 * Check if user can create events
 * Only authenticated users (organizers and admins)
 */
export function canCreateEvent(userRole?: string): boolean {
  return userRole === 'admin' || userRole === 'organizer';
}

/**
 * Check if user can edit event
 * Admins: can edit any event
 * Organizers: can edit only if they own it
 */
export function canEditEvent(
  userRole: string | undefined,
  userId: string,
  eventOwnerId: string,
): boolean {
  if (userRole === 'admin') {
    return true;
  }

  if (userRole === 'organizer') {
    return userId === eventOwnerId;
  }

  return false;
}

/**
 * Check if user can delete event
 * Same as canEditEvent: admins can delete any, organizers only own
 */
export function canDeleteEvent(
  userRole: string | undefined,
  userId: string,
  eventOwnerId: string,
): boolean {
  return canEditEvent(userRole, userId, eventOwnerId);
}

/**
 * Check if user can approve/publish event (admin action)
 */
export function canApproveEvent(userRole?: string): boolean {
  return userRole === 'admin';
}

/**
 * Check if user can view admin moderation panel
 */
export function canModerateEvents(userRole?: string): boolean {
  return userRole === 'admin';
}

/**
 * Guard: assert user has required role
 * Throws if not authorized
 */
export function assertRole(
  userRole: string | undefined,
  requiredRole: 'admin' | 'organizer',
): void {
  if (requiredRole === 'admin' && userRole !== 'admin') {
    logAuthFailure('auth.failure.role_required', {
      requiredRole,
      userRole: userRole ?? 'none',
    });
    throw new Error('Admin role required');
  }

  if (requiredRole === 'organizer' && userRole !== 'admin' && userRole !== 'organizer') {
    logAuthFailure('auth.failure.role_required', {
      requiredRole,
      userRole: userRole ?? 'none',
    });
    throw new Error('Organizer role required');
  }
}

/**
 * Guard: assert user owns resource
 * Throws if not owner and not admin
 */
export function assertOwnership(
  userRole: string | undefined,
  userId: string,
  resourceOwnerId: string,
): void {
  const canAccess = canAccessResource(userRole as 'admin' | 'organizer', userId, resourceOwnerId);

  if (!canAccess) {
    logAuthFailure('auth.failure.ownership_mismatch', {
      userRole: userRole ?? 'none',
      userId,
      resourceOwnerId,
    });
    throw new Error('Access denied: insufficient permissions');
  }
}

/**
 * Get user's effective permissions
 */
export function getUserPermissions(userRole?: string) {
  return {
    canAccessDashboard: canAccessOrganizerDashboard(userRole),
    canAccessAdmin: canAccessAdminPanel(userRole),
    canCreateEvent: canCreateEvent(userRole),
    canModerate: canModerateEvents(userRole),
    isAdmin: userRole === 'admin',
    isOrganizer: userRole === 'organizer',
  };
}

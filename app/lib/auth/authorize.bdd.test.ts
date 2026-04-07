import path from 'node:path';
import { defineFeature, loadFeature } from 'jest-cucumber';
import {
  canAccessAdminPanel,
  canAccessOrganizerDashboard,
  resolveUserRole,
} from '@/app/lib/auth/authorize';

const feature = loadFeature(path.join(__dirname, 'authorize.feature'));

defineFeature(feature, (test) => {
  let resolvedRole: 'admin' | 'organizer' = 'organizer';

  beforeEach(() => {
    process.env.ADMIN_ALLOWLIST = '';
    resolvedRole = 'organizer';
  });

  test('Missing identity data falls back to least privilege', ({ given, when, then }) => {
    given(/^admin allowlist contains "([^"]+)"$/, (allowlist: string) => {
      process.env.ADMIN_ALLOWLIST = allowlist;
    });

    when(/^I resolve role for email "([^"]*)"$/, (email: string) => {
      resolvedRole = resolveUserRole(email);
    });

    then(/^the resolved role should be "([^"]+)"$/, (expectedRole: string) => {
      expect(resolvedRole).toBe(expectedRole);
    });
  });

  test('Allowlisted admin can access admin panel', ({ given, when, then }) => {
    given(/^admin allowlist contains "([^"]+)"$/, (allowlist: string) => {
      process.env.ADMIN_ALLOWLIST = allowlist;
    });

    when(/^I resolve role for email "([^"]*)"$/, (email: string) => {
      resolvedRole = resolveUserRole(email);
    });

    then('admin panel access should be allowed', () => {
      expect(canAccessAdminPanel(resolvedRole)).toBe(true);
    });
  });

  test('Organizer cannot access admin panel', ({ given, when, then }) => {
    given(/^admin allowlist contains "([^"]+)"$/, (allowlist: string) => {
      process.env.ADMIN_ALLOWLIST = allowlist;
    });

    when(/^I resolve role for email "([^"]*)"$/, (email: string) => {
      resolvedRole = resolveUserRole(email);
    });

    then('admin panel access should be denied', () => {
      expect(canAccessAdminPanel(resolvedRole)).toBe(false);
    });
  });

  test('Organizer can access organizer dashboard', ({ given, when, then }) => {
    given(/^admin allowlist contains "([^"]+)"$/, (allowlist: string) => {
      process.env.ADMIN_ALLOWLIST = allowlist;
    });

    when(/^I resolve role for email "([^"]*)"$/, (email: string) => {
      resolvedRole = resolveUserRole(email);
    });

    then('organizer dashboard access should be allowed', () => {
      expect(canAccessOrganizerDashboard(resolvedRole)).toBe(true);
    });
  });
});

import { getAdminAllowlist, isAllowlistedAdmin } from '@/app/config/admin-allowlist';

describe('admin allowlist config', () => {
  const originalAllowlist = process.env.ADMIN_ALLOWLIST;

  afterEach(() => {
    process.env.ADMIN_ALLOWLIST = originalAllowlist;
  });

  it('parses env allowlist with trim, lowercase, and duplicate removal', () => {
    process.env.ADMIN_ALLOWLIST =
      '  ADMIN@PLUGINBIM.COM , admin@pluginbim.com , owner@pluginbim.com  ';

    expect(getAdminAllowlist()).toEqual(['admin@pluginbim.com', 'owner@pluginbim.com']);
  });

  it('resolves allowlisted admin checks case-insensitively', () => {
    process.env.ADMIN_ALLOWLIST = 'admin@pluginbim.com';

    expect(isAllowlistedAdmin('ADMIN@PLUGINBIM.COM')).toBe(true);
    expect(isAllowlistedAdmin('organizer@pluginbim.com')).toBe(false);
  });
});

const DEFAULT_ADMIN_ALLOWLIST = ['admin@pluginbim.com', 'owner@pluginbim.com'] as const;

function normalizeEmail(email: string): string {
  return email.trim().toLowerCase();
}

export function getAdminAllowlist(): string[] {
  const envAllowlist = process.env.ADMIN_ALLOWLIST;

  if (!envAllowlist) {
    return [...DEFAULT_ADMIN_ALLOWLIST];
  }

  const parsed = envAllowlist.split(',').map(normalizeEmail).filter(Boolean);

  return parsed.length > 0 ? parsed : [...DEFAULT_ADMIN_ALLOWLIST];
}

export function isAllowlistedAdmin(email: string): boolean {
  return getAdminAllowlist().includes(normalizeEmail(email));
}

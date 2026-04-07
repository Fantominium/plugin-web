type RequiredEnvKey =
  | 'DATABASE_URL'
  | 'AUTH_SECRET'
  | 'AUTH_URL'
  | 'NEXTAUTH_SECRET'
  | 'NEXTAUTH_URL'
  | 'POSTER_STORAGE_DIR';

function getRequiredEnv(name: RequiredEnvKey): string {
  const value = process.env[name];

  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }

  return value;
}

function parseAdminAllowlist(raw: string | undefined): string[] {
  if (!raw) {
    return [];
  }

  return raw
    .split(',')
    .map((entry) => entry.trim().toLowerCase())
    .filter(Boolean);
}

export const env = {
  nodeEnv: process.env.NODE_ENV ?? 'development',
  databaseUrl: getRequiredEnv('DATABASE_URL'),
  authKey: getRequiredEnv('AUTH_SECRET'),
  authUrl: getRequiredEnv('AUTH_URL'),
  nextAuthKey: getRequiredEnv('NEXTAUTH_SECRET'),
  nextAuthUrl: getRequiredEnv('NEXTAUTH_URL'),
  posterStorageDir: getRequiredEnv('POSTER_STORAGE_DIR'),
  googleClientId: process.env.GOOGLE_CLIENT_ID ?? '',
  googleClientSecret: process.env.GOOGLE_CLIENT_SECRET ?? '',
  resendApiKey: process.env.RESEND_API_KEY ?? '',
  resendFromEmail: process.env.RESEND_FROM_EMAIL ?? process.env.EMAIL_FROM ?? '',
  adminAllowlist: parseAdminAllowlist(process.env.ADMIN_ALLOWLIST),
} as const;

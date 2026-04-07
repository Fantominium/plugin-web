/**
 * Auth.js v5 configuration
 * Implements Google OAuth and magic-link email authentication
 * with role-based session management
 */

import { PrismaAdapter } from '@auth/prisma-adapter';
import type { NextAuthConfig } from 'next-auth';
import Google from 'next-auth/providers/google';
import Resend from 'next-auth/providers/resend';
import { resolveUserRole } from '@/app/lib/auth/authorize';
import { prisma } from '@/app/lib/prisma';

/**
 * Hashes an email address using SHA-256 (first 8 hex chars) for safe log telemetry.
 * Uses the Web Crypto API so this helper is compatible with the Edge Runtime.
 */
async function hashEmail(email: string): Promise<string> {
  const encoded = new TextEncoder().encode(email.trim().toLowerCase());
  const buffer = await globalThis.crypto.subtle.digest('SHA-256', encoded);
  return Array.from(new Uint8Array(buffer))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('')
    .slice(0, 8);
}

/**
 * Auth.js configuration
 * Handles session management, providers, callbacks, and security settings
 */
export const authConfig: NextAuthConfig = {
  providers: [
    /**
     * Google OAuth provider
     * Allows users to sign in with their Google account
     */
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      allowDangerousEmailAccountLinking: false,
    }),

    /**
     * Resend Email provider for magic-link authentication
     * Generates single-use tokens valid for 15 minutes
     */
    Resend({
      from: process.env.RESEND_FROM_EMAIL || 'noreply@pluginbim.com',
      apiKey: process.env.RESEND_API_KEY,
    }),
  ],

  /**
   * Database adapter for persistent session storage
   * Allows session revocation and audit trails
   */
  adapter: PrismaAdapter(prisma),

  /**
   * Session configuration
   */
  session: {
    strategy: 'database', // Use database-backed sessions for security
    maxAge: 24 * 60 * 60, // 24 hours
    updateAge: 24 * 60 * 60, // Update session every 24 hours
  },

  /**
   * Event callbacks for logging and monitoring
   */
  events: {
    async signIn({ user }) {
      // Log successful sign-in without exposing plaintext email
      console.log('auth.sign_in', { emailHash: await hashEmail(user.email ?? '') });
    },
    async signOut() {
      // Log sign-out
      console.log('auth.sign_out');
    },
  },

  /**
   * Callback hooks for authentication flow
   */
  callbacks: {
    /**
     * Called when user signs in (OAuth or magic-link)
     * Can return false to deny sign-in
     */
    async signIn({ user }) {
      // Verify email is provided
      if (!user.email) {
        console.error('Sign-in attempted without email');
        return false;
      }

      // Allow all emails for now (can add domain restrictions here)
      return true;
    },

    /**
     * Called when JWT is created or updated
     * Add custom claims like role to token
     */
    async jwt({ token, user }) {
      if (user) {
        // First sign-in: add user role
        const role = resolveUserRole(user.email || '');
        const claimedRole = (user as { role?: string }).role;

        if (claimedRole && claimedRole !== role) {
          console.warn('auth.failure.untrusted_role_claim', {
            emailHash: await hashEmail(user.email ?? ''),
            claimedRole,
            resolvedRole: role,
          });
        }

        token.role = role;
        token.sub = user.id;
      }

      return token;
    },

    /**
     * Called whenever session is checked
     * Sync JWT claims to session object
     */
    async session({ session, token }) {
      if (session.user && token) {
        session.user.id = token.sub as string;
        (session.user as { role?: string }).role = token.role as string;
      }

      return session;
    },

    /**
     * Callback when user is redirected after sign-in
     */
    async redirect({ url, baseUrl }) {
      // Redirect to organizer dashboard after login
      if (url.startsWith('/')) {
        return `${baseUrl}${url}`;
      }

      // Allow same-origin redirects
      if (new URL(url).origin === new URL(baseUrl).origin) {
        return url;
      }

      return baseUrl;
    },
  },

  /**
   * Pages configuration
   * Override default Auth.js pages
   */
  pages: {
    signIn: '/login',
    error: '/login?error=true',
  },

  /**
   * Security settings — NEXTAUTH_SECRET must be set in all non-development environments.
   * Auth.js will fail to sign or verify sessions if this is absent.
   */
  secret: (() => {
    const secret = process.env.NEXTAUTH_SECRET;
    if (!secret && process.env.NODE_ENV !== 'development' && process.env.NODE_ENV !== 'test') {
      throw new Error(
        'NEXTAUTH_SECRET is required. Set it before starting the server in non-development environments.',
      );
    }
    // Development/test environments may omit the secret; use a clearly-labelled
    // placeholder so Auth.js can initialise without a configured env var.
    // This value MUST NOT be used outside of local/CI development contexts.
    return secret ?? 'dev-only__not-for-production__replace-with-env-var';
  })(),

  /**
   * Disable debug logging in production
   */
  debug: process.env.NODE_ENV === 'development',

  /**
   * Only trust the request host in local development.
   * In staging/production, NEXTAUTH_URL must be explicitly configured so host
   * validation remains strict and forged Host headers are rejected.
   */
  trustHost: process.env.NODE_ENV === 'development',
};

export default authConfig;

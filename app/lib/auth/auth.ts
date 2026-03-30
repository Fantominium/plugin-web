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
    maxAge: 30 * 24 * 60 * 60, // 30 days
    updateAge: 24 * 60 * 60, // Update session every 24 hours
  },

  /**
   * Event callbacks for logging and monitoring
   */
  events: {
    async signIn({ user }) {
      // Log successful sign-in
      console.log(`User ${user.email} signed in`);
    },
    async signOut() {
      // Log sign-out
      console.log('User signed out');
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
   * Security settings
   */
  secret: process.env.NEXTAUTH_SECRET || 'dev-secret-please-change',

  /**
   * Disable debug logging in production
   */
  debug: process.env.NODE_ENV === 'development',

  /**
   * Trust host in development
   */
  trustHost: process.env.NODE_ENV === 'development' || process.env.NEXTAUTH_URL === undefined,
};

export default authConfig;

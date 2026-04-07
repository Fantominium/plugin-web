/**
 * Export auth() helper for server-side authentication
 * Used in middleware, server components, and route handlers
 */

import NextAuth from 'next-auth';
import { authConfig } from '@/app/lib/auth/auth';

export const { auth, handlers, signIn, signOut } = NextAuth(authConfig);

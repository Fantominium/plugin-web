/**
 * Next.js middleware for route protection and authorization
 * Redirects unauthenticated users to login
 * Redirects unauthorized users to unauthorized page
 */

import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import { auth } from '@/auth';

/**
 * Protected organizer routes
 * Require 'organizer' or 'admin' role
 */
const organizerRoutes = [
  '/dashboard',
  '/dashboard/events',
  '/dashboard/events/new',
  '/dashboard/profile',
];

/**
 * Protected admin routes
 * Require 'admin' role only
 */
const adminRoutes = ['/admin', '/admin/moderation', '/admin/users', '/admin/settings'];

/**
 * Public routes (no authentication required)
 */
const publicRoutes = [
  '/',
  '/events',
  '/contact-us',
  '/privacy-policy',
  '/terms-and-conditions',
  '/login',
];

/**
 * Middleware function for route protection
 */
export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Allow public routes without authentication
  if (publicRoutes.some((route) => pathname.startsWith(route))) {
    return NextResponse.next();
  }

  // Allow auth API routes
  if (pathname.startsWith('/api/auth')) {
    return NextResponse.next();
  }

  // Get session from auth
  const session = await auth();

  // Redirect unauthenticated users to login
  if (!session) {
    if (organizerRoutes.some((route) => pathname.startsWith(route))) {
      return NextResponse.redirect(
        new URL(`/login?callbackUrl=${encodeURIComponent(pathname)}`, request.url),
      );
    }

    if (adminRoutes.some((route) => pathname.startsWith(route))) {
      return NextResponse.redirect(
        new URL(`/login?callbackUrl=${encodeURIComponent(pathname)}`, request.url),
      );
    }

    // If no route matched and no session, allow (API routes, etc.)
    return NextResponse.next();
  }

  const userRole = (session.user as { role?: string } | undefined)?.role;

  // Check organizer dashboard access
  if (organizerRoutes.some((route) => pathname.startsWith(route))) {
    const isAuthorized = userRole === 'organizer' || userRole === 'admin';

    if (!isAuthorized) {
      return NextResponse.redirect(new URL('/unauthorized', request.url));
    }

    return NextResponse.next();
  }

  // Check admin panel access
  if (adminRoutes.some((route) => pathname.startsWith(route))) {
    const isAuthorized = userRole === 'admin';

    if (!isAuthorized) {
      return NextResponse.redirect(new URL('/unauthorized', request.url));
    }

    return NextResponse.next();
  }

  // Allow all other requests
  return NextResponse.next();
}

/**
 * Configure which routes should run middleware
 * Match all routes except static files and images
 */
export const config = {
  matcher: [
    /**
     * Match all request paths except:
     * - _next (Next.js internals)
     * - static (static files)
     * - favicon.ico, sitemap.xml, robots.txt (public files)
     * - _vercel (Vercel internals)
     */
    '/((?!_next|static|favicon\\.ico|sitemap\\.xml|robots\\.txt|_vercel).*)',
  ],
};

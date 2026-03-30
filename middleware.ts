/**
 * Next.js middleware for route protection and authorization
 * Redirects unauthenticated users to login
 * Redirects unauthorized users to unauthorized page
 */

import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import { isValidPublicDestination } from '@/app/lib/public-routes';
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

function matchesRoute(pathname: string, routes: readonly string[]) {
  return routes.some((route) => pathname === route || pathname.startsWith(`${route}/`));
}

function isPublicPath(pathname: string) {
  return pathname === '/login' || isValidPublicDestination(pathname);
}

/**
 * Middleware function for route protection
 */
export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Allow public routes without authentication
  if (isPublicPath(pathname)) {
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
    if (matchesRoute(pathname, organizerRoutes)) {
      return NextResponse.redirect(
        new URL(`/login?callbackUrl=${encodeURIComponent(pathname)}`, request.url),
      );
    }

    if (matchesRoute(pathname, adminRoutes)) {
      return NextResponse.redirect(
        new URL(`/login?callbackUrl=${encodeURIComponent(pathname)}`, request.url),
      );
    }

    // If no route matched and no session, allow (API routes, etc.)
    return NextResponse.next();
  }

  const userRole = (session.user as { role?: string } | undefined)?.role;

  // Check organizer dashboard access
  if (matchesRoute(pathname, organizerRoutes)) {
    const isAuthorized = userRole === 'organizer' || userRole === 'admin';

    if (!isAuthorized) {
      return NextResponse.redirect(new URL('/unauthorized', request.url));
    }

    return NextResponse.next();
  }

  // Check admin panel access
  if (matchesRoute(pathname, adminRoutes)) {
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
    String.raw`/((?!_next|static|favicon\.ico|sitemap\.xml|robots\.txt|_vercel).*)`,
  ],
};

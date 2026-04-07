import type { NextRequest } from 'next/server';
import { auth } from '@/auth';

jest.mock('next/server', () => ({
  NextResponse: {
    next: () =>
      ({
        status: 200,
        headers: new Headers(),
      }) as Response,
    redirect: (url: URL) =>
      ({
        status: 307,
        headers: new Headers({ location: url.toString() }),
      }) as Response,
  },
}));

const { middleware } = jest.requireActual('@/middleware') as typeof import('@/middleware');

jest.mock('@/auth', () => ({
  auth: jest.fn(),
}));

const authMock = auth as jest.Mock;

function createRequest(pathname: string): NextRequest {
  const requestUrl = `http://localhost${pathname}`;
  return {
    nextUrl: new URL(requestUrl),
    url: requestUrl,
  } as unknown as NextRequest;
}

describe('middleware auth guard', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  it('redirects unauthenticated organizer route access to login with callbackUrl', async () => {
    authMock.mockResolvedValue(null);
    const warnSpy = jest.spyOn(console, 'warn').mockImplementation(() => undefined);

    const response = await middleware(createRequest('/dashboard'));

    expect(response.headers.get('location')).toContain('/login?callbackUrl=%2Fdashboard');
    expect(warnSpy).toHaveBeenCalledWith('auth.failure.unauthenticated_route_access', {
      pathname: '/dashboard',
      requiredRole: 'organizer',
    });
  });

  it('redirects unauthenticated admin route access to login with callbackUrl', async () => {
    authMock.mockResolvedValue(null);
    const warnSpy = jest.spyOn(console, 'warn').mockImplementation(() => undefined);

    const response = await middleware(createRequest('/admin/users'));

    expect(response.headers.get('location')).toContain('/login?callbackUrl=%2Fadmin%2Fusers');
    expect(warnSpy).toHaveBeenCalledWith('auth.failure.unauthenticated_route_access', {
      pathname: '/admin/users',
      requiredRole: 'admin',
    });
  });

  it('allows organizer users into organizer routes', async () => {
    authMock.mockResolvedValue({ user: { role: 'organizer' } } as never);

    const response = await middleware(createRequest('/dashboard/events'));

    expect(response.headers.get('location')).toBeNull();
    expect(response.status).toBe(200);
  });

  it('denies non-organizer role on organizer routes and redirects to unauthorized', async () => {
    authMock.mockResolvedValue({ user: { role: 'public' } } as never);

    const response = await middleware(createRequest('/dashboard/events'));

    expect(response.headers.get('location')).toContain('/unauthorized');
  });

  it('denies organizer users from admin routes and logs role denial', async () => {
    authMock.mockResolvedValue({ user: { role: 'organizer' } } as never);
    const warnSpy = jest.spyOn(console, 'warn').mockImplementation(() => undefined);

    const response = await middleware(createRequest('/admin'));

    expect(response.headers.get('location')).toContain('/unauthorized');
    expect(warnSpy).toHaveBeenCalledWith('auth.failure.role_denied', {
      pathname: '/admin',
      requiredRole: 'admin',
      userRole: 'organizer',
    });
  });

  it('allows admin users into both organizer and admin routes', async () => {
    authMock.mockResolvedValue({ user: { role: 'admin' } } as never);

    const organizerResponse = await middleware(createRequest('/dashboard'));
    const adminResponse = await middleware(createRequest('/admin/settings'));

    expect(organizerResponse.headers.get('location')).toBeNull();
    expect(adminResponse.headers.get('location')).toBeNull();
  });

  it('allows public routes without auth calls', async () => {
    const response = await middleware(createRequest('/login'));

    expect(response.status).toBe(200);
    expect(authMock).not.toHaveBeenCalled();
  });

  it('allows auth callback boundary route without session evaluation', async () => {
    const response = await middleware(createRequest('/api/auth/callback/google'));

    expect(response.status).toBe(200);
    expect(authMock).not.toHaveBeenCalled();
  });

  it('encodes callbackUrl and keeps protected details in URL-safe form', async () => {
    authMock.mockResolvedValue(null);

    const response = await middleware(createRequest('/admin/settings?tab=roles'));

    expect(response.headers.get('location')).toContain('/login?callbackUrl=%2Fadmin%2Fsettings');
  });

  it('allows unauthenticated requests for non-protected internal paths', async () => {
    authMock.mockResolvedValue(null);

    const response = await middleware(createRequest('/api/internal/health'));

    expect(response.status).toBe(200);
  });
});

import { auth } from '@/auth';

export type AuthorizedRole = 'organizer' | 'admin';

interface BaseSessionUser {
  id?: string;
  email?: string | null;
  name?: string | null;
  image?: string | null;
  role?: string;
}

interface BaseSession {
  user?: BaseSessionUser;
}

export interface AuthorizedSession extends BaseSession {
  user: BaseSessionUser & {
    id: string;
    role: AuthorizedRole;
  };
}

export async function requireSession(): Promise<AuthorizedSession> {
  const session = await auth();

  if (!session?.user) {
    throw new Error('Authentication required');
  }

  const role = (session.user as BaseSessionUser).role;

  if (role !== 'organizer' && role !== 'admin') {
    throw new Error('Unsupported role');
  }

  return {
    ...session,
    user: {
      ...session.user,
      id: (session.user as BaseSessionUser).id ?? '',
      role,
    },
  } as AuthorizedSession;
}

export function assertRole(session: AuthorizedSession, role: AuthorizedRole): void {
  if (session.user.role !== role && session.user.role !== 'admin') {
    throw new Error('Forbidden');
  }
}

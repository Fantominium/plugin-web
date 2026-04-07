import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { signIn } from 'next-auth/react';
import LoginPage from './page';

const mockUseSearchParams = jest.fn();

jest.mock('next/navigation', () => ({
  useSearchParams: () => mockUseSearchParams(),
}));

jest.mock('next-auth/react', () => ({
  signIn: jest.fn(),
}));

const signInMock = signIn as jest.Mock;

function setSearchParams(params: Record<string, string>) {
  mockUseSearchParams.mockReturnValue({
    get: (key: string) => params[key] ?? null,
  });
}

describe('login page', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    setSearchParams({});
  });

  it('renders provider-failure inline error and keeps magic-link form visible', () => {
    setSearchParams({ error: 'OAuthSignin' });

    render(<LoginPage />);

    expect(
      screen.getByText(/google sign-in failed\. you can retry or continue with a magic link\./i),
    ).toBeInTheDocument();
    expect(screen.getByLabelText(/email address/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /send sign-in link/i })).toBeInTheDocument();
  });

  it('wires error announcement with aria-describedby on both sign-in actions', () => {
    setSearchParams({ error: 'AccessDenied' });

    render(<LoginPage />);

    expect(screen.getByRole('button', { name: /sign in with google/i })).toHaveAttribute(
      'aria-describedby',
      'login-error',
    );
    expect(screen.getByRole('button', { name: /send sign-in link/i })).toHaveAttribute(
      'aria-describedby',
      'login-error',
    );
  });

  it('uses safe organizer callbackUrl by default', async () => {
    render(<LoginPage />);
    signInMock.mockResolvedValue(undefined);

    await userEvent.click(screen.getByRole('button', { name: /sign in with google/i }));

    expect(signInMock).toHaveBeenCalledWith('google', { callbackUrl: '/dashboard' });
  });

  it('allows admin callbackUrl targets and forwards them to auth provider', async () => {
    setSearchParams({ callbackUrl: '/admin/settings' });
    render(<LoginPage />);
    signInMock.mockResolvedValue(undefined);

    await userEvent.click(screen.getByRole('button', { name: /sign in with google/i }));

    expect(signInMock).toHaveBeenCalledWith('google', { callbackUrl: '/admin/settings' });
  });

  it('maps magic-link request errors into user-visible message', async () => {
    render(<LoginPage />);
    signInMock.mockResolvedValue({ error: 'rate_limited' });

    await userEvent.type(screen.getByLabelText(/email address/i), 'user@example.com');
    await userEvent.click(screen.getByRole('button', { name: /send sign-in link/i }));

    expect(
      screen.getByText(/too many magic-link requests\. please try again in an hour\./i),
    ).toBeInTheDocument();
  });
});

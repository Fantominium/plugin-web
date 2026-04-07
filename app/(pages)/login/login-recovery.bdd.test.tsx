import path from 'node:path';
import { render, screen } from '@testing-library/react';
import { defineFeature, loadFeature } from 'jest-cucumber';
import LoginPage from './page';

const mockUseSearchParams = jest.fn();

jest.mock('next/navigation', () => ({
  useSearchParams: () => mockUseSearchParams(),
}));

jest.mock('next-auth/react', () => ({
  signIn: jest.fn(),
}));

function setSearchParams(params: Record<string, string>) {
  mockUseSearchParams.mockReturnValue({
    get: (key: string) => params[key] ?? null,
  });
}

const feature = loadFeature(path.join(__dirname, 'login-recovery.feature'));

defineFeature(feature, (test) => {
  beforeEach(() => {
    jest.clearAllMocks();
    setSearchParams({});
  });

  test('OAuth provider failure shows recovery guidance and fallback action', ({
    given,
    then,
    and,
  }) => {
    given(/^the login page is opened with provider error "([^"]+)"$/, (providerError: string) => {
      setSearchParams({ error: providerError });
      render(<LoginPage />);
    });

    then('I should see inline recovery guidance', () => {
      expect(
        screen.getByText(/google sign-in failed\. you can retry or continue with a magic link\./i),
      ).toBeInTheDocument();
    });

    and('I should see the magic-link email field', () => {
      expect(screen.getByLabelText(/email address/i)).toBeInTheDocument();
    });

    and('I should see the send sign-in link action', () => {
      expect(screen.getByRole('button', { name: /send sign-in link/i })).toBeInTheDocument();
    });
  });

  test('Access denied still keeps magic-link path available', ({ given, then, and }) => {
    given(/^the login page is opened with provider error "([^"]+)"$/, (providerError: string) => {
      setSearchParams({ error: providerError });
      render(<LoginPage />);
    });

    then('the Google sign-in button should reference the error announcement', () => {
      expect(screen.getByRole('button', { name: /sign in with google/i })).toHaveAttribute(
        'aria-describedby',
        'login-error',
      );
    });

    and('the magic-link submit button should reference the error announcement', () => {
      expect(screen.getByRole('button', { name: /send sign-in link/i })).toHaveAttribute(
        'aria-describedby',
        'login-error',
      );
    });

    and('I should see the magic-link email field', () => {
      expect(screen.getByLabelText(/email address/i)).toBeInTheDocument();
    });
  });
});

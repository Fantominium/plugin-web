/**
 * Login page for organizers and admins
 * Provides Google OAuth and email magic-link authentication options
 */

'use client';

import { useSearchParams } from 'next/navigation';
import { signIn } from 'next-auth/react';
import { Suspense, useState } from 'react';

function LoginPageContent() {
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get('callbackUrl') || '/dashboard';
  const error = searchParams.get('error');

  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(
    error ? 'Authentication failed' : null,
  );

  /**
   * Handle Google OAuth sign-in
   */
  const handleGoogleSignIn = async () => {
    try {
      setIsLoading(true);
      setLoginError(null);
      await signIn('google', { callbackUrl });
    } catch (err) {
      setLoginError('Google sign-in failed. Please try again.');
      console.error('Google sign-in error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Handle email magic-link sign-in
   */
  const handleEmailSignIn = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email.trim()) {
      setLoginError('Please enter your email address');
      return;
    }

    try {
      setIsLoading(true);
      setLoginError(null);

      const result = await signIn('resend', {
        email,
        callbackUrl,
        redirect: false,
      });

      if (result?.error) {
        setLoginError('Failed to send sign-in link. Please try again.');
      } else {
        setEmailSent(true);
      }
    } catch (err) {
      setLoginError('An error occurred. Please try again.');
      console.error('Email sign-in error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // Show success message after email sent
  if (emailSent) {
    return (
      <main
        id="main-content"
        className="min-h-screen bg-gradient-to-br from-[#667eea] to-[#764ba2] flex items-center justify-center px-4"
      >
        <div className="bg-white rounded-lg shadow-xl p-8 max-w-md w-full text-center">
          <h1 className="text-3xl font-bold text-[#1a1a2e] mb-2">Check Your Email</h1>
          <p className="text-gray-600 mb-4">We&apos;ve sent a sign-in link to:</p>
          <p className="font-semibold text-[#667eea] mb-6">{email}</p>
          <p className="text-sm text-gray-500 mb-6">The link will expire in 15 minutes.</p>
          <button
            type="button"
            onClick={() => {
              setEmailSent(false);
              setEmail('');
            }}
            className="text-[#667eea] hover:text-[#764ba2] font-semibold focus:outline-none focus:ring-2 focus:ring-[#667eea] focus:ring-offset-2 rounded px-4 py-2"
          >
            Back to sign in
          </button>
        </div>
      </main>
    );
  }

  return (
    <main
      id="main-content"
      className="min-h-screen bg-gradient-to-br from-[#667eea] to-[#764ba2] flex items-center justify-center px-4"
    >
      <div className="bg-white rounded-lg shadow-xl p-8 max-w-md w-full">
        <h1 className="text-3xl font-bold text-[#1a1a2e] mb-2 text-center">Sign In</h1>
        <p className="text-gray-600 text-center mb-8">Sign in to your organizer account</p>

        {/* Error message */}
        {loginError && (
          <div role="alert" className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-700 text-sm font-medium">{loginError}</p>
          </div>
        )}

        {/* Google OAuth button */}
        <button
          type="button"
          onClick={handleGoogleSignIn}
          disabled={isLoading}
          className="w-full mb-4 px-4 py-3 bg-white border border-gray-300 rounded-lg font-semibold text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-[#667eea] focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {isLoading ? 'Signing in...' : 'Sign in with Google'}
        </button>

        {/* Divider */}
        <div className="relative mb-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300" />
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-white text-gray-500">Or continue with email</span>
          </div>
        </div>

        {/* Email magic-link form */}
        <form onSubmit={handleEmailSignIn} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              Email address
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              disabled={isLoading}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg font-medium text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#667eea] focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed"
              required
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full px-4 py-3 bg-[#667eea] hover:bg-[#764ba2] text-white font-semibold rounded-lg focus:outline-none focus:ring-2 focus:ring-[#667eea] focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isLoading ? 'Sending sign-in link...' : 'Send sign-in link'}
          </button>
        </form>

        {/* Help text */}
        <p className="text-xs text-gray-500 text-center mt-8">
          We&apos;ll send you a magic link via email. Sign in without a password.
        </p>
      </div>
    </main>
  );
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <main
          id="main-content"
          className="min-h-screen bg-gradient-to-br from-[#667eea] to-[#764ba2]"
        />
      }
    >
      <LoginPageContent />
    </Suspense>
  );
}

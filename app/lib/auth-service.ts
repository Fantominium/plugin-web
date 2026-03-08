/**
 * Authentication service
 * Handles user login, signup, token management, and session validation
 */

import { User, LoginCredentials, SignupData, AuthResponse, TokenRefreshResponse } from '@/app/types/user';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api';
const AUTH_TOKEN_KEY = 'authToken';
const REFRESH_TOKEN_KEY = 'refreshToken';
const CURRENT_USER_KEY = 'currentUser';

/**
 * Validate email format
 */
function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Validate password strength (minimum 8 characters)
 */
function isPasswordStrong(password: string): boolean {
  return password.length >= 8;
}

/**
 * Login user with email and password
 */
export async function login(
  email: string,
  password: string
): Promise<AuthResponse> {
  try {
    // Client-side validation
    if (!isValidEmail(email)) {
      return {
        success: false,
        error: 'Please enter a valid email address',
      };
    }

    if (!password) {
      return {
        success: false,
        error: 'Password is required',
      };
    }

    const response = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();

    if (!response.ok) {
      return {
        success: false,
        error: data.error || 'Login failed',
      };
    }

    // Store tokens
    if (data.data?.token) {
      localStorage.setItem(AUTH_TOKEN_KEY, data.data.token);
    }
    if (data.data?.refreshToken) {
      localStorage.setItem(REFRESH_TOKEN_KEY, data.data.refreshToken);
    }
    if (data.data?.user) {
      localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(data.data.user));
    }

    return {
      success: true,
      data: data.data,
    };
  } catch (error) {
    return {
      success: false,
      error: `Network error: ${error instanceof Error ? error.message : 'Unknown error'}`,
    };
  }
}

/**
 * Sign up new user
 */
export async function signup(
  credentials: SignupData
): Promise<AuthResponse> {
  try {
    // Client-side validation
    if (!isValidEmail(credentials.email)) {
      return {
        success: false,
        error: 'Please enter a valid email address',
      };
    }

    if (!isPasswordStrong(credentials.password)) {
      return {
        success: false,
        error: 'Password must be at least 8 characters long',
      };
    }

    if (!credentials.name.trim()) {
      return {
        success: false,
        error: 'Name is required',
      };
    }

    const response = await fetch(`${API_URL}/auth/signup`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(credentials),
    });

    const data = await response.json();

    if (!response.ok) {
      return {
        success: false,
        error: data.error || 'Signup failed',
      };
    }

    // Store tokens
    if (data.data?.token) {
      localStorage.setItem(AUTH_TOKEN_KEY, data.data.token);
    }
    if (data.data?.refreshToken) {
      localStorage.setItem(REFRESH_TOKEN_KEY, data.data.refreshToken);
    }
    if (data.data?.user) {
      localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(data.data.user));
    }

    return {
      success: true,
      data: data.data,
    };
  } catch (error) {
    return {
      success: false,
      error: `Network error: ${error instanceof Error ? error.message : 'Unknown error'}`,
    };
  }
}

/**
 * Logout user by clearing tokens and session
 */
export function logout(): void {
  localStorage.removeItem(AUTH_TOKEN_KEY);
  localStorage.removeItem(REFRESH_TOKEN_KEY);
  localStorage.removeItem(CURRENT_USER_KEY);
}

/**
 * Refresh access token using refresh token
 */
export async function refreshToken(): Promise<TokenRefreshResponse> {
  try {
    const storedRefreshToken = localStorage.getItem(REFRESH_TOKEN_KEY);

    if (!storedRefreshToken) {
      return {
        success: false,
        error: 'No refresh token available',
      };
    }

    const response = await fetch(`${API_URL}/auth/refresh`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ refreshToken: storedRefreshToken }),
    });

    const data = await response.json();

    if (!response.ok) {
      // If refresh fails, clear tokens
      logout();
      return {
        success: false,
        error: data.error || 'Token refresh failed',
      };
    }

    // Update tokens
    if (data.data?.token) {
      localStorage.setItem(AUTH_TOKEN_KEY, data.data.token);
    }
    if (data.data?.refreshToken) {
      localStorage.setItem(REFRESH_TOKEN_KEY, data.data.refreshToken);
    }

    return {
      success: true,
      data: data.data,
    };
  } catch (error) {
    logout();
    return {
      success: false,
      error: `Network error: ${error instanceof Error ? error.message : 'Unknown error'}`,
    };
  }
}

/**
 * Get current logged-in user
 */
export function getCurrentUser(): User | null {
  try {
    const stored = localStorage.getItem(CURRENT_USER_KEY);
    return stored ? JSON.parse(stored) : null;
  } catch {
    return null;
  }
}

/**
 * Check if user is authenticated (validates token)
 */
export async function isAuthenticatedAsync(): Promise<boolean> {
  const token = getStoredToken();

  if (!token) {
    return false;
  }

  // Validate token with API
  const isValid = await validateToken(token);

  if (isValid) {
    return true;
  }

  // Try to refresh token
  const refreshTokenResult = await refreshToken();
  return refreshTokenResult.success;
}

/**
 * Validate token with API
 */
export async function validateToken(token: string): Promise<boolean> {
  try {
    const response = await fetch(`${API_URL}/auth/validate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });

    return response.ok;
  } catch {
    return false;
  }
}

/**
 * Get stored authentication token
 */
export function getStoredToken(): string | null {
  try {
    return localStorage.getItem(AUTH_TOKEN_KEY);
  } catch {
    return null;
  }
}

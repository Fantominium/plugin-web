import {
  login,
  signup,
  logout,
  refreshToken,
  getCurrentUser,
  isAuthenticatedAsync,
  validateToken,
  getStoredToken,
} from '../auth-service';
import { User } from '@/app/types/user';

global.fetch = jest.fn();

// Mock localStorage
const localStorageMock = (() => {
  let store: Record<string, string> = {};

  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => {
      store[key] = value.toString();
    },
    removeItem: (key: string) => {
      delete store[key];
    },
    clear: () => {
      store = {};
    },
  };
})();

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
});

describe('Authentication Service', () => {
  beforeEach(() => {
    localStorage.clear();
    jest.clearAllMocks();
  });

  describe('login', () => {
    it('should login user with email and password', async () => {
      const mockResponse = {
        success: true,
        data: {
          user: {
            id: '1',
            email: 'user@example.com',
            name: 'John Doe',
          },
          token: 'mock-jwt-token',
          refreshToken: 'mock-refresh-token',
        },
      };

      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      });

      const result = await login('user@example.com', 'password123');

      expect(result.success).toBe(true);
      expect(result.data.user.email).toBe('user@example.com');
      expect(result.data.token).toBeDefined();
    });

    it('should store token in localStorage on successful login', async () => {
      const mockResponse = {
        success: true,
        data: {
          user: { id: '1', email: 'user@example.com', name: 'John' },
          token: 'mock-token',
          refreshToken: 'mock-refresh-token',
        },
      };

      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      });

      await login('user@example.com', 'password123');

      expect(localStorage.getItem('authToken')).toBe('mock-token');
      expect(localStorage.getItem('refreshToken')).toBe('mock-refresh-token');
    });

    it('should return error for invalid credentials', async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
        status: 401,
        json: async () => ({
          success: false,
          error: 'Invalid credentials',
        }),
      });

      const result = await login('user@example.com', 'wrongpassword');

      expect(result.success).toBe(false);
      expect(result.error).toBe('Invalid credentials');
    });

    it('should handle network errors', async () => {
      (global.fetch as jest.Mock).mockRejectedValueOnce(
        new Error('Network error')
      );

      const result = await login('user@example.com', 'password123');

      expect(result.success).toBe(false);
      expect(result.error).toContain('Network error');
    });

    it('should validate email format', async () => {
      const result = await login('invalid-email', 'password123');

      expect(result.success).toBe(false);
      expect(result.error).toContain('email');
    });

    it('should validate password is not empty', async () => {
      const result = await login('user@example.com', '');

      expect(result.success).toBe(false);
      expect(result.error?.toLowerCase()).toContain('password');
    });
  });

  describe('signup', () => {
    it('should create new user account', async () => {
      const mockResponse = {
        success: true,
        data: {
          user: {
            id: '2',
            email: 'newuser@example.com',
            name: 'Jane Doe',
          },
          token: 'mock-token',
          refreshToken: 'mock-refresh-token',
        },
      };

      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      });

      const result = await signup({
        email: 'newuser@example.com',
        password: 'password123',
        name: 'Jane Doe',
      });

      expect(result.success).toBe(true);
      expect(result.data.user.email).toBe('newuser@example.com');
    });

    it('should store token after signup', async () => {
      const mockResponse = {
        success: true,
        data: {
          user: { id: '2', email: 'newuser@example.com', name: 'Jane' },
          token: 'mock-token',
          refreshToken: 'mock-refresh-token',
        },
      };

      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      });

      await signup({
        email: 'newuser@example.com',
        password: 'password123',
        name: 'Jane Doe',
      });

      expect(localStorage.getItem('authToken')).toBe('mock-token');
    });

    it('should return error for existing email', async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
        status: 409,
        json: async () => ({
          success: false,
          error: 'Email already exists',
        }),
      });

      const result = await signup({
        email: 'existing@example.com',
        password: 'password123',
        name: 'John',
      });

      expect(result.success).toBe(false);
      expect(result.error).toContain('already exists');
    });

    it('should validate email format', async () => {
      const result = await signup({
        email: 'invalid-email',
        password: 'password123',
        name: 'John',
      });

      expect(result.success).toBe(false);
      expect(result.error).toContain('email');
    });

    it('should validate password strength', async () => {
      const result = await signup({
        email: 'user@example.com',
        password: '123',
        name: 'John',
      });

      expect(result.success).toBe(false);
      expect(result.error?.toLowerCase()).toContain('password');
    });

    it('should validate name is not empty', async () => {
      const result = await signup({
        email: 'user@example.com',
        password: 'password123',
        name: '',
      });

      expect(result.success).toBe(false);
      expect(result.error?.toLowerCase()).toContain('name');
    });
  });

  describe('logout', () => {
    it('should clear tokens from localStorage', async () => {
      localStorage.setItem('authToken', 'some-token');
      localStorage.setItem('refreshToken', 'some-refresh-token');

      logout();

      expect(localStorage.getItem('authToken')).toBeNull();
      expect(localStorage.getItem('refreshToken')).toBeNull();
    });

    it('should clear current user data', async () => {
      localStorage.setItem('currentUser', JSON.stringify({ id: '1', email: 'user@example.com' }));

      logout();

      expect(localStorage.getItem('currentUser')).toBeNull();
    });
  });

  describe('refreshToken', () => {
    it('should refresh expired token', async () => {
      localStorage.setItem('refreshToken', 'valid-refresh-token');

      const mockResponse = {
        success: true,
        data: {
          token: 'new-access-token',
          refreshToken: 'new-refresh-token',
        },
      };

      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      });

      const result = await refreshToken();

      expect(result.success).toBe(true);
      expect(result.data.token).toBe('new-access-token');
      expect(localStorage.getItem('authToken')).toBe('new-access-token');
    });

    it('should return error if no refresh token available', async () => {
      const result = await refreshToken();

      expect(result.success).toBe(false);
      expect(result.error).toContain('No refresh token');
    });

    it('should logout user if refresh fails', async () => {
      localStorage.setItem('refreshToken', 'invalid-token');
      localStorage.setItem('authToken', 'some-token');

      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
        status: 401,
      });

      await refreshToken();

      expect(localStorage.getItem('authToken')).toBeNull();
      expect(localStorage.getItem('refreshToken')).toBeNull();
    });
  });

  describe('getCurrentUser', () => {
    it('should return current logged-in user', () => {
      const mockUser: User = {
        id: '1',
        email: 'user@example.com',
        name: 'John Doe',
      };

      localStorage.setItem('currentUser', JSON.stringify(mockUser));

      const result = getCurrentUser();

      expect(result).toEqual(mockUser);
    });

    it('should return null if no user logged in', () => {
      const result = getCurrentUser();

      expect(result).toBeNull();
    });
  });

  describe('isAuthenticatedAsync', () => {
    it('should return true if valid token exists', async () => {
      localStorage.setItem('authToken', 'valid-token');

      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => ({ valid: true }),
      });

      const result = await isAuthenticatedAsync();

      expect(result).toBe(true);
    });

    it('should return false if no token exists', async () => {
      const result = await isAuthenticatedAsync();

      expect(result).toBe(false);
    });

    it('should attempt token refresh on invalid token', async () => {
      localStorage.setItem('authToken', 'expired-token');
      localStorage.setItem('refreshToken', 'valid-refresh-token');

      (global.fetch as jest.Mock)
        .mockResolvedValueOnce({
          ok: false,
          status: 401,
        })
        .mockResolvedValueOnce({
          ok: true,
          json: async () => ({
            success: true,
            data: { token: 'new-token', refreshToken: 'new-refresh' },
          }),
        });

      const result = await isAuthenticatedAsync();

      expect(result).toBe(true);
    });
  });

  describe('validateToken', () => {
    it('should return true for valid token', async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => ({ valid: true }),
      });

      const result = await validateToken('valid-token');

      expect(result).toBe(true);
    });

    it('should return false for invalid token', async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
        status: 401,
      });

      const result = await validateToken('invalid-token');

      expect(result).toBe(false);
    });

    it('should handle network errors', async () => {
      (global.fetch as jest.Mock).mockRejectedValueOnce(new Error('Network error'));

      const result = await validateToken('some-token');

      expect(result).toBe(false);
    });
  });

  describe('getStoredToken', () => {
    it('should return stored authentication token', () => {
      localStorage.setItem('authToken', 'my-token');

      const result = getStoredToken();

      expect(result).toBe('my-token');
    });

    it('should return null if no token stored', () => {
      const result = getStoredToken();

      expect(result).toBeNull();
    });
  });
});

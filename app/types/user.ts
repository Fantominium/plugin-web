/**
 * User data structure
 */
export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  bio?: string;
  phone?: string;
  role?: 'user' | 'organizer' | 'admin';
  createdAt?: Date;
  updatedAt?: Date;
}

/**
 * Login credentials
 */
export interface LoginCredentials {
  email: string;
  password: string;
}

/**
 * Sign up data
 */
export interface SignupData {
  email: string;
  password: string;
  name: string;
}

/**
 * Auth response from API
 */
export interface AuthResponse {
  success: boolean;
  data?: {
    user: User;
    token: string;
    refreshToken: string;
  };
  error?: string;
}

/**
 * Token refresh response
 */
export interface TokenRefreshResponse {
  success: boolean;
  data?: {
    token: string;
    refreshToken: string;
  };
  error?: string;
}

/**
 * User profile update
 */
export interface UserProfile extends User {
  preferences?: UserPreferences;
}

/**
 * User preferences for notifications and recommendations
 */
export interface UserPreferences {
  notificationsEnabled: boolean;
  emailNotifications: boolean;
  pushNotifications: boolean;
  notificationFrequency: 'instant' | 'daily' | 'weekly';
  categoryInterests: string[];
  locationPreference?: string;
  maxDistance?: number;
}

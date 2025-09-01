const API_URL = process.env.NEXT_PUBLIC_AUTH_SERVICE_URL || 'http://localhost:8000';

interface AuthTokens {
  access_token: string;
  refresh_token: string;
  token_type: string;
}

interface User {
  id: string;
  email: string;
  full_name: string;
  email_verified: boolean;
  created_at: string;
  account_status: string;
}

class AuthService {
  private accessToken: string | null = null;
  private refreshToken: string | null = null;

  constructor() {
    if (typeof window !== 'undefined') {
      this.accessToken = localStorage.getItem('access_token');
      this.refreshToken = localStorage.getItem('refresh_token');
    }
  }

  private saveTokens(tokens: AuthTokens) {
    this.accessToken = tokens.access_token;
    this.refreshToken = tokens.refresh_token;
    localStorage.setItem('access_token', tokens.access_token);
    localStorage.setItem('refresh_token', tokens.refresh_token);
  }

  private clearTokens() {
    this.accessToken = null;
    this.refreshToken = null;
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
  }

  async signUp(email: string, fullName: string, password: string): Promise<User> {
    const response = await fetch(`${API_URL}/api/v1/auth/signup`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email,
        full_name: fullName,
        password,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.detail || 'Signup failed');
    }

    return response.json();
  }

  async login(email: string, password: string): Promise<AuthTokens> {
    const formData = new FormData();
    formData.append('username', email);
    formData.append('password', password);

    const response = await fetch(`${API_URL}/api/v1/auth/login`, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.detail || 'Login failed');
    }

    const tokens = await response.json();
    this.saveTokens(tokens);
    return tokens;
  }

  async refreshAccessToken(): Promise<AuthTokens> {
    if (!this.refreshToken) {
      throw new Error('No refresh token available');
    }

    const response = await fetch(`${API_URL}/api/v1/auth/refresh`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        refresh_token: this.refreshToken,
      }),
    });

    if (!response.ok) {
      this.clearTokens();
      throw new Error('Token refresh failed');
    }

    const tokens = await response.json();
    this.saveTokens(tokens);
    return tokens;
  }

  async logout(): Promise<void> {
    if (this.refreshToken) {
      try {
        await fetch(`${API_URL}/api/v1/auth/logout`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${this.accessToken}`,
          },
          body: JSON.stringify({
            refresh_token: this.refreshToken,
          }),
        });
      } catch (error) {
        console.error('Logout error:', error);
      }
    }
    this.clearTokens();
  }

  async getCurrentUser(): Promise<User | null> {
    if (!this.accessToken) {
      return null;
    }

    try {
      const response = await fetch(`${API_URL}/api/v1/users/me`, {
        headers: {
          'Authorization': `Bearer ${this.accessToken}`,
        },
      });

      if (response.status === 401) {
        await this.refreshAccessToken();
        return this.getCurrentUser();
      }

      if (!response.ok) {
        return null;
      }

      return response.json();
    } catch (error) {
      console.error('Get current user error:', error);
      return null;
    }
  }

  isAuthenticated(): boolean {
    return !!this.accessToken;
  }

  getAccessToken(): string | null {
    return this.accessToken;
  }
}

export const authService = new AuthService();
export type { User, AuthTokens };
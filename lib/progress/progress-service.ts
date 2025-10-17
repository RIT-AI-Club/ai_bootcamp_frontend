/**
 * Progress Service - Handles user progress data from backend API
 */

import { PathwayMeta } from '@/lib/pathways/types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export interface UserProgress {
  userId: string;
  pathwayProgress: {
    [pathwayId: string]: {
      progress: number; // 0-100
      completedModules: string[];
      currentModule?: string;
      lastAccessed: Date;
    };
  };
  totalProgress: number;
  modulesCompleted: number;
  pathwaysStarted: number;
  pathwaysCompleted: number;
}

export interface DashboardData {
  pathways: Array<{
    id: string;
    slug: string;
    title: string;
    shortTitle: string;
    instructor: string;
    color: string;
    progress: number;
  }>;
  summary: {
    pathways_started: number;
    pathways_completed: number;
    modules_completed: number;
    total_time_spent_minutes: number;
    current_streak: number;
    longest_streak: number;
  };
  recent_achievements: Array<{
    id: string;
    name: string;
    description: string;
    icon: string;
    category: string;
    earned_at: string;
  }>;
  streak: {
    current: number;
    longest: number;
    last_activity: string | null;
  };
}

export class ProgressService {
  private static getAuthHeaders(): HeadersInit {
    // Check if we're in the browser environment
    if (typeof window === 'undefined') {
      throw new Error('ProgressService methods can only be called from the client side');
    }

    const token = localStorage.getItem('access_token');
    if (!token) {
      throw new Error('No authentication token found');
    }
    return {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    };
  }

  private static async refreshTokenIfNeeded(): Promise<void> {
    const refreshToken = localStorage.getItem('refresh_token');
    if (!refreshToken) {
      throw new Error('No refresh token available');
    }

    try {
      const response = await fetch(`${API_BASE_URL}/api/v1/auth/refresh`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          refresh_token: refreshToken,
        }),
      });

      if (!response.ok) {
        // Clear tokens and redirect to login
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        window.location.href = '/';
        throw new Error('Token refresh failed');
      }

      const tokens = await response.json();
      localStorage.setItem('access_token', tokens.access_token);
      localStorage.setItem('refresh_token', tokens.refresh_token);
    } catch (error) {
      console.error('Failed to refresh token:', error);
      throw error;
    }
  }

  private static async fetchWithAuth(url: string, options: RequestInit = {}): Promise<Response> {
    // First attempt
    let response = await fetch(url, {
      ...options,
      headers: {
        ...options.headers,
        ...this.getAuthHeaders(),
      },
    });

    // If 401, try refreshing token and retry once
    if (response.status === 401) {
      await this.refreshTokenIfNeeded();

      // Retry with new token
      response = await fetch(url, {
        ...options,
        headers: {
          ...options.headers,
          ...this.getAuthHeaders(),
        },
      });
    }

    return response;
  }

  /**
   * Fetch user's dashboard data from backend (OPTIMIZED VERSION)
   */
  static async fetchDashboardData(): Promise<DashboardData> {
    try {
      const response = await this.fetchWithAuth(`${API_BASE_URL}/api/v1/progress/user/dashboard-optimized`, {
        method: 'GET',
      });

      if (!response.ok) {
        throw new Error('Failed to fetch dashboard data');
      }

      const data = await response.json();

      // Extract dashboard data from optimized response
      return data.dashboard;
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      // Return default data on error
      return {
        pathways: [],
        summary: {
          pathways_started: 0,
          pathways_completed: 0,
          modules_completed: 0,
          total_time_spent_minutes: 0,
          current_streak: 0,
          longest_streak: 0
        },
        recent_achievements: [],
        streak: {
          current: 0,
          longest: 0,
          last_activity: null
        }
      };
    }
  }

  /**
   * OPTIMIZED: Fetch all dashboard data in single API call
   * Combines dashboard, pathways, and user summary data
   */
  static async fetchCompleteData(): Promise<{
    dashboard: DashboardData;
    pathways: Array<{
      id: string;
      slug: string;
      title: string;
      shortTitle: string;
      instructor: string;
      color: string;
      progress: number;
    }>;
    summary: UserProgress;
    achievements: Array<any>;
    streak: any;
  }> {
    try {
      const response = await this.fetchWithAuth(`${API_BASE_URL}/api/v1/progress/user/dashboard-optimized`, {
        method: 'GET',
      });

      if (!response.ok) {
        throw new Error('Failed to fetch complete data');
      }

      const data = await response.json();

      // Transform summary to match UserProgress interface
      const transformedSummary: UserProgress = {
        userId: data.summary.user_id,
        pathwayProgress: {},
        totalProgress: Math.round(
          (data.summary.pathways_completed / Math.max(data.summary.total_pathways, 1)) * 100
        ),
        modulesCompleted: data.summary.total_modules_completed,
        pathwaysStarted: data.summary.pathways_started,
        pathwaysCompleted: data.summary.pathways_completed
      };

      return {
        dashboard: data.dashboard,
        pathways: data.pathways,
        summary: transformedSummary,
        achievements: data.achievements,
        streak: data.streak
      };
    } catch (error) {
      console.error('Error fetching complete data:', error);
      // Return empty fallback data
      const emptyData = {
        dashboard: {
          pathways: [],
          summary: {
            pathways_started: 0,
            pathways_completed: 0,
            modules_completed: 0,
            total_time_spent_minutes: 0,
            current_streak: 0,
            longest_streak: 0
          },
          recent_achievements: [],
          streak: { current: 0, longest: 0, last_activity: null }
        },
        pathways: [],
        summary: {
          userId: '',
          pathwayProgress: {},
          totalProgress: 0,
          modulesCompleted: 0,
          pathwaysStarted: 0,
          pathwaysCompleted: 0
        },
        achievements: [],
        streak: { current: 0, longest: 0, last_activity: null }
      };
      return emptyData;
    }
  }

  /**
   * Fetch user's overall progress from backend
   */
  static async fetchUserProgress(): Promise<UserProgress> {
    try {
      const response = await this.fetchWithAuth(`${API_BASE_URL}/api/v1/progress/user/summary`, {
        method: 'GET',
      });

      if (!response.ok) {
        throw new Error('Failed to fetch user progress');
      }

      const data = await response.json();

      // Transform API response to match our interface
      const pathwayProgress: UserProgress['pathwayProgress'] = {};
      if (data.pathway_progress) {
        data.pathway_progress.forEach((progress: any) => {
          pathwayProgress[progress.pathway_id] = {
            progress: progress.progress_percentage,
            completedModules: [], // Will be populated from separate endpoint if needed
            currentModule: progress.current_module_id,
            lastAccessed: new Date(progress.last_accessed_at)
          };
        });
      }

      return {
        userId: data.user_id,
        pathwayProgress,
        totalProgress: Math.round((data.pathways_completed / 13) * 100),
        modulesCompleted: data.total_modules_completed,
        pathwaysStarted: data.pathways_started,
        pathwaysCompleted: data.pathways_completed
      };
    } catch (error) {
      console.error('Error fetching user progress:', error);
      return {
        userId: '',
        pathwayProgress: {},
        totalProgress: 0,
        modulesCompleted: 0,
        pathwaysStarted: 0,
        pathwaysCompleted: 0
      };
    }
  }

  /**
   * Fetch progress for specific pathway
   */
  static async fetchPathwayProgress(pathwayId: string): Promise<{
    progress: number;
    completedModules: string[];
    currentModule?: string;
  }> {
    try {
      const response = await this.fetchWithAuth(`${API_BASE_URL}/api/v1/progress/pathways/${pathwayId}`, {
        method: 'GET',
      });

      if (!response.ok) {
        throw new Error('Failed to fetch pathway progress');
      }

      const data = await response.json();

      const completedModules = data.modules
        .filter((m: any) => m.completed)
        .map((m: any) => m.id);

      return {
        progress: data.progress.progress_percentage,
        completedModules,
        currentModule: data.progress.current_module_id
      };
    } catch (error) {
      console.error('Error fetching pathway progress:', error);
      return {
        progress: 0,
        completedModules: [],
        currentModule: undefined
      };
    }
  }

  /**
   * Start a new pathway
   */
  static async startPathway(pathwayId: string): Promise<boolean> {
    try {
      const response = await this.fetchWithAuth(`${API_BASE_URL}/api/v1/progress/user/start-pathway`, {
        method: 'POST',
        body: JSON.stringify({ pathway_id: pathwayId })
      });

      return response.ok;
    } catch (error) {
      console.error('Error starting pathway:', error);
      return false;
    }
  }

  /**
   * Update module completion status
   */
  static async markModuleComplete(pathwayId: string, moduleId: string, timeSpentMinutes: number = 0): Promise<boolean> {
    try {
      const response = await this.fetchWithAuth(`${API_BASE_URL}/api/v1/progress/modules/complete`, {
        method: 'POST',
        body: JSON.stringify({
          module_id: moduleId,
          pathway_id: pathwayId,
          time_spent_minutes: timeSpentMinutes
        })
      });

      return response.ok;
    } catch (error) {
      console.error('Error marking module complete:', error);
      return false;
    }
  }

  /**
   * Update pathway progress
   */
  static async updatePathwayProgress(pathwayId: string, progress: number): Promise<boolean> {
    try {
      const response = await this.fetchWithAuth(`${API_BASE_URL}/api/v1/progress/user/pathway/${pathwayId}`, {
        method: 'PUT',
        body: JSON.stringify({
          progress_percentage: progress
        })
      });

      return response.ok;
    } catch (error) {
      console.error('Error updating pathway progress:', error);
      return false;
    }
  }

  /**
   * Fetch user achievements
   */
  static async fetchUserAchievements(): Promise<any[]> {
    try {
      const response = await this.fetchWithAuth(`${API_BASE_URL}/api/v1/progress/achievements/user`, {
        method: 'GET',
      });

      if (!response.ok) {
        throw new Error('Failed to fetch achievements');
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching achievements:', error);
      return [];
    }
  }

  /**
   * Fetch all available achievements
   */
  static async fetchAllAchievements(): Promise<any[]> {
    try {
      const response = await this.fetchWithAuth(`${API_BASE_URL}/api/v1/progress/achievements`, {
        method: 'GET',
      });

      if (!response.ok) {
        throw new Error('Failed to fetch all achievements');
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching all achievements:', error);
      return [];
    }
  }
}
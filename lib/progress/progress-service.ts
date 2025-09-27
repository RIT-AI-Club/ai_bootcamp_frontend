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

  /**
   * Fetch user's dashboard data from backend
   */
  static async fetchDashboardData(): Promise<DashboardData> {
    try {
      const response = await fetch(`${API_BASE_URL}/api/v1/progress/user/dashboard`, {
        method: 'GET',
        headers: this.getAuthHeaders(),
      });

      if (!response.ok) {
        throw new Error('Failed to fetch dashboard data');
      }

      return await response.json();
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
   * Fetch user's overall progress from backend
   */
  static async fetchUserProgress(): Promise<UserProgress> {
    try {
      const response = await fetch(`${API_BASE_URL}/api/v1/progress/user/summary`, {
        method: 'GET',
        headers: this.getAuthHeaders(),
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
      const response = await fetch(`${API_BASE_URL}/api/v1/progress/pathways/${pathwayId}`, {
        method: 'GET',
        headers: this.getAuthHeaders(),
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
      const response = await fetch(`${API_BASE_URL}/api/v1/progress/user/start-pathway`, {
        method: 'POST',
        headers: this.getAuthHeaders(),
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
      const response = await fetch(`${API_BASE_URL}/api/v1/progress/modules/complete`, {
        method: 'POST',
        headers: this.getAuthHeaders(),
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
      const response = await fetch(`${API_BASE_URL}/api/v1/progress/user/pathway/${pathwayId}`, {
        method: 'PUT',
        headers: this.getAuthHeaders(),
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
      const response = await fetch(`${API_BASE_URL}/api/v1/progress/achievements/user`, {
        method: 'GET',
        headers: this.getAuthHeaders(),
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
      const response = await fetch(`${API_BASE_URL}/api/v1/progress/achievements`, {
        method: 'GET',
        headers: this.getAuthHeaders(),
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
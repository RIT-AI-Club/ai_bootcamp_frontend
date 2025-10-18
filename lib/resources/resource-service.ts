/**
 * Resource Service - Handles resource-level progress tracking and file uploads
 * Integrates with backend resource tracking API
 */

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

// ============================================================================
// Type Definitions
// ============================================================================

export interface Resource {
  id: string;
  module_id: string;
  pathway_id: string;
  type: 'video' | 'article' | 'exercise' | 'project' | 'quiz';
  title: string;
  description?: string;
  order_index: number;
  duration_minutes?: number;
  requires_upload: boolean;
  accepted_file_types?: string[];
  max_file_size_mb: number;
  allow_resubmission: boolean;
  url?: string;
  metadata?: any;
  created_at: string;
  updated_at: string;
}

export interface ResourceCompletion {
  id: string;
  user_id: string;
  resource_id: string;
  module_id: string;
  pathway_id: string;
  status: 'not_started' | 'in_progress' | 'completed' | 'submitted' | 'reviewed';
  progress_percentage: number;
  time_spent_minutes: number;
  started_at: string;
  completed_at?: string;
  last_accessed_at: string;
  submission_required: boolean;
  submission_count: number;
  notes?: string;
  metadata?: any;
}

export interface ResourceSubmission {
  id: string;
  user_id: string;
  resource_id: string;
  file_name: string;
  file_size_bytes: number;
  file_type: string;
  gcs_url: string;
  submission_status: 'uploading' | 'uploaded' | 'processing' | 'approved' | 'rejected' | 'failed';
  reviewed_by?: string;
  reviewed_at?: string;
  review_comments?: string;
  grade?: 'pass' | 'fail';
  created_at: string;
  updated_at: string;
}

export interface ResourceWithProgress extends Resource {
  completion?: ResourceCompletion;
  submissions?: ResourceSubmission[];
}

export interface ModuleResources {
  module_id: string;
  module_title: string;
  resources: ResourceWithProgress[];
}

export interface FileUploadResponse {
  submission_id: string;
  resource_id: string;
  file_name: string;
  file_size_bytes: number;
  file_type: string;
  gcs_url: string;
  submission_status: string;
  created_at: string;
  resource_status: string;
  message: string;
}

export interface SignedURLResponse {
  submission_id: string;
  file_name: string;
  signed_url: string;
  expires_at: string;
}

// ============================================================================
// Resource Service Class
// ============================================================================

export class ResourceService {
  private static getAuthHeaders(): HeadersInit {
    if (typeof window === 'undefined') {
      throw new Error('ResourceService methods can only be called from the client side');
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

  // ============================================================================
  // Resource Queries
  // ============================================================================

  /**
   * Get all resources for a pathway (grouped by modules)
   */
  static async getPathwayResources(pathwayId: string): Promise<ModuleResources[]> {
    try {
      const response = await fetch(
        `${API_BASE_URL}/api/v1/resources/pathways/${pathwayId}/resources`,
        {
          method: 'GET',
          headers: this.getAuthHeaders(),
        }
      );

      if (!response.ok) {
        throw new Error('Failed to fetch pathway resources');
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching pathway resources:', error);
      return [];
    }
  }

  /**
   * Get resources for a specific module
   */
  static async getModuleResources(moduleId: string): Promise<Resource[]> {
    try {
      const response = await fetch(
        `${API_BASE_URL}/api/v1/resources/modules/${moduleId}/resources`,
        {
          method: 'GET',
          headers: this.getAuthHeaders(),
        }
      );

      if (!response.ok) {
        throw new Error('Failed to fetch module resources');
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching module resources:', error);
      return [];
    }
  }

  /**
   * Get resources for a module WITH progress and submissions in ONE call (optimized)
   */
  static async getModuleResourcesWithProgress(moduleId: string): Promise<ResourceWithProgress[]> {
    try {
      const response = await fetch(
        `${API_BASE_URL}/api/v1/resources/modules/${moduleId}/resources-with-progress`,
        {
          method: 'GET',
          headers: this.getAuthHeaders(),
        }
      );

      if (!response.ok) {
        throw new Error('Failed to fetch module resources with progress');
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching module resources with progress:', error);
      return [];
    }
  }

  // ============================================================================
  // Progress Tracking
  // ============================================================================

  /**
   * Start a resource (create completion record)
   */
  static async startResource(resourceId: string, notes?: string): Promise<ResourceCompletion | null> {
    try {
      const response = await fetch(
        `${API_BASE_URL}/api/v1/resources/users/me/resources/${resourceId}/start`,
        {
          method: 'POST',
          headers: this.getAuthHeaders(),
          body: JSON.stringify({ notes }),
        }
      );

      if (!response.ok) {
        throw new Error('Failed to start resource');
      }

      return await response.json();
    } catch (error) {
      console.error('Error starting resource:', error);
      return null;
    }
  }

  /**
   * Update resource progress
   */
  static async updateResourceProgress(
    resourceId: string,
    data: {
      status?: string;
      progress_percentage?: number;
      time_spent_minutes?: number;
      notes?: string;
      metadata?: any;
    }
  ): Promise<ResourceCompletion | null> {
    try {
      const response = await fetch(
        `${API_BASE_URL}/api/v1/resources/users/me/resources/${resourceId}/progress`,
        {
          method: 'PUT',
          headers: this.getAuthHeaders(),
          body: JSON.stringify(data),
        }
      );

      if (!response.ok) {
        throw new Error('Failed to update resource progress');
      }

      return await response.json();
    } catch (error) {
      console.error('Error updating resource progress:', error);
      return null;
    }
  }

  /**
   * Mark resource as completed
   */
  static async completeResource(resourceId: string): Promise<ResourceCompletion | null> {
    try {
      const response = await fetch(
        `${API_BASE_URL}/api/v1/resources/users/me/resources/${resourceId}/complete`,
        {
          method: 'POST',
          headers: this.getAuthHeaders(),
        }
      );

      if (!response.ok) {
        throw new Error('Failed to complete resource');
      }

      return await response.json();
    } catch (error) {
      console.error('Error completing resource:', error);
      return null;
    }
  }

  /**
   * Unmark resource as completed (for videos and articles only)
   */
  static async uncompleteResource(resourceId: string): Promise<ResourceCompletion | null> {
    try {
      const response = await fetch(
        `${API_BASE_URL}/api/v1/resources/users/me/resources/${resourceId}/complete`,
        {
          method: 'DELETE',
          headers: this.getAuthHeaders(),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Failed to unmark resource');
      }

      return await response.json();
    } catch (error) {
      console.error('Error unmarking resource:', error);
      throw error; // Re-throw so caller can handle the error
    }
  }

  /**
   * Get user's progress on a specific resource
   */
  static async getResourceProgress(resourceId: string): Promise<ResourceCompletion | null> {
    try {
      const response = await fetch(
        `${API_BASE_URL}/api/v1/resources/users/me/resources/${resourceId}/progress`,
        {
          method: 'GET',
          headers: this.getAuthHeaders(),
        }
      );

      if (!response.ok) {
        return null; // Resource not started yet
      }

      return await response.json();
    } catch (error) {
      console.error('Error getting resource progress:', error);
      return null;
    }
  }

  // ============================================================================
  // File Upload Management
  // ============================================================================

  /**
   * Upload a file for an exercise or project
   */
  static async uploadFile(resourceId: string, file: File): Promise<FileUploadResponse | null> {
    try {
      const formData = new FormData();
      formData.append('file', file);

      const token = localStorage.getItem('access_token');
      if (!token) {
        throw new Error('No authentication token found');
      }

      const response = await fetch(
        `${API_BASE_URL}/api/v1/resources/users/me/resources/${resourceId}/upload`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            // Don't set Content-Type - browser will set it with boundary for multipart/form-data
          },
          body: formData,
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Failed to upload file');
      }

      return await response.json();
    } catch (error) {
      console.error('Error uploading file:', error);
      throw error; // Re-throw so caller can handle the error
    }
  }

  /**
   * Get all submissions for a resource
   */
  static async getResourceSubmissions(resourceId: string): Promise<ResourceSubmission[]> {
    try {
      const response = await fetch(
        `${API_BASE_URL}/api/v1/resources/users/me/resources/${resourceId}/submissions`,
        {
          method: 'GET',
          headers: this.getAuthHeaders(),
        }
      );

      if (!response.ok) {
        throw new Error('Failed to fetch submissions');
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching submissions:', error);
      return [];
    }
  }

  /**
   * Get signed download URL for a submission
   */
  static async getSubmissionDownloadURL(submissionId: string): Promise<SignedURLResponse | null> {
    try {
      const response = await fetch(
        `${API_BASE_URL}/api/v1/resources/users/me/submissions/download/${submissionId}`,
        {
          method: 'GET',
          headers: this.getAuthHeaders(),
        }
      );

      if (!response.ok) {
        throw new Error('Failed to get download URL');
      }

      return await response.json();
    } catch (error) {
      console.error('Error getting download URL:', error);
      return null;
    }
  }

  /**
   * Delete a submission (soft delete)
   */
  static async deleteSubmission(submissionId: string): Promise<boolean> {
    try {
      const response = await fetch(
        `${API_BASE_URL}/api/v1/resources/users/me/submissions/${submissionId}`,
        {
          method: 'DELETE',
          headers: this.getAuthHeaders(),
        }
      );

      return response.ok;
    } catch (error) {
      console.error('Error deleting submission:', error);
      return false;
    }
  }

  // ============================================================================
  // Utility Functions
  // ============================================================================

  /**
   * Format file size in human-readable format
   */
  static formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  }

  /**
   * Validate file before upload
   */
  static validateFile(file: File, acceptedTypes?: string[], maxSizeMB?: number): { valid: boolean; error?: string } {
    // Check file size
    const maxBytes = (maxSizeMB || 50) * 1024 * 1024;
    if (file.size > maxBytes) {
      return {
        valid: false,
        error: `File size exceeds ${maxSizeMB || 50}MB limit`
      };
    }

    // Check file type
    if (acceptedTypes && acceptedTypes.length > 0) {
      const fileType = file.type;
      const isAccepted = acceptedTypes.some(type => {
        if (type.endsWith('/*')) {
          // Handle wildcards like 'image/*'
          const baseType = type.split('/')[0];
          return fileType.startsWith(baseType + '/');
        }
        return fileType === type;
      });

      if (!isAccepted) {
        return {
          valid: false,
          error: `File type not accepted. Allowed types: ${acceptedTypes.join(', ')}`
        };
      }
    }

    return { valid: true };
  }

  /**
   * Get resource icon emoji based on type
   */
  static getResourceIcon(type: string): string {
    switch (type) {
      case 'video':
        return '🎥';
      case 'article':
        return '📖';
      case 'exercise':
        return '💻';
      case 'project':
        return '🚀';
      case 'quiz':
        return '📝';
      default:
        return '📄';
    }
  }

  /**
   * Get status badge color
   */
  static getStatusColor(status: string): string {
    switch (status) {
      case 'completed':
      case 'approved':
        return 'from-green-500 to-green-600';
      case 'submitted':
      case 'uploaded':
        return 'from-blue-500 to-blue-600';
      case 'in_progress':
        return 'from-yellow-500 to-yellow-600';
      case 'rejected':
      case 'failed':
        return 'from-red-500 to-red-600';
      default:
        return 'from-gray-500 to-gray-600';
    }
  }
}

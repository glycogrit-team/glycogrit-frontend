/**
 * API Client Layer
 * Class-based singleton pattern inspired by NOVA architecture
 */

import { Challenge } from '../types/challenge';
import { AppConfig } from './config';
import { APIError, NetworkError, ValidationError } from './errors';

export interface APIResponse<T> {
  data: T;
  status: number;
  message?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  hasMore: boolean;
}

export class GlycogritAPIClient {
  private baseUrl: string;
  private timeout: number;
  private authToken: string | null = null;

  constructor() {
    this.baseUrl = AppConfig.API_BASE_URL;
    this.timeout = AppConfig.API_TIMEOUT;
  }

  /**
   * Set authentication token
   */
  setAuthToken(token: string | null) {
    this.authToken = token;
  }

  /**
   * Get authentication token
   */
  getAuthToken(): string | null {
    return this.authToken;
  }

  /**
   * Transform backend Event to frontend Challenge
   */
  private transformEventToChallenge(event: any): Challenge {
    return {
      id: event.id.toString(),
      title: event.name,
      description: event.description,
      longDescription: event.description, // Backend doesn't have separate longDescription
      duration: this.calculateDuration(event.start_date, event.end_date),
      difficulty: (event.difficulty_level || 'beginner') as Challenge['difficulty'],
      category: (event.event_type || 'mixed') as Challenge['category'],
      participants: event.current_participants || 0,
      startDate: event.start_date || event.created_at,
      endDate: event.end_date || event.created_at,
      imageUrl: event.banner_image_url || '/images/default-challenge.jpg',
      goals: event.goals || [],
      rules: event.rules ? event.rules.split('\n').filter((r: string) => r.trim()) : [],
      rewards: event.rewards || [],
    };
  }

  /**
   * Calculate duration string from dates
   */
  private calculateDuration(startDate: string | null, endDate: string | null): string {
    if (!startDate || !endDate) return '30 days';

    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffTime = Math.abs(end.getTime() - start.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return '1 day';
    if (diffDays === 1) return '1 day';
    return `${diffDays} days`;
  }

  /**
   * Generic fetch wrapper with error handling
   */
  private async fetch<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<APIResponse<T>> {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.timeout);

    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...options.headers as Record<string, string>,
    };

    // Add auth token if available
    if (this.authToken) {
      headers['Authorization'] = `Bearer ${this.authToken}`;
    }

    try {
      const response = await fetch(`${this.baseUrl}${endpoint}`, {
        ...options,
        signal: controller.signal,
        headers,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw await this.handleErrorResponse(response);
      }

      const data = await response.json();
      return {
        data,
        status: response.status,
      };
    } catch (error) {
      clearTimeout(timeoutId);

      if (error instanceof APIError) {
        throw error;
      }

      if (error instanceof Error) {
        if (error.name === 'AbortError') {
          throw new NetworkError('Request timeout', true);
        }
        throw new NetworkError(error.message, true);
      }

      throw new NetworkError('Unknown error occurred', false);
    }
  }

  /**
   * Handle error responses
   */
  private async handleErrorResponse(response: Response): Promise<APIError> {
    let message = 'An error occurred';
    let details: Record<string, unknown> = {};

    try {
      const errorData = await response.json();
      message = errorData.message || errorData.error || message;
      details = errorData.details || {};
    } catch {
      // If JSON parsing fails, use status text
      message = response.statusText || message;
    }

    if (response.status >= 400 && response.status < 500) {
      return new ValidationError(message, details);
    }

    return new APIError(message, response.status, false);
  }

  /**
   * Get all challenges (maps to backend /api/v1/events)
   */
  async getChallenges(params?: {
    category?: string;
    difficulty?: string;
    page?: number;
    limit?: number;
    is_featured?: boolean;
  }): Promise<Challenge[]> {
    const searchParams = new URLSearchParams();

    if (params?.category && params.category !== 'all') {
      searchParams.append('category', params.category);
    }
    if (params?.difficulty && params.difficulty !== 'all') {
      searchParams.append('difficulty', params.difficulty);
    }
    if (params?.page) {
      searchParams.append('page', params.page.toString());
    }
    if (params?.limit) {
      searchParams.append('limit', AppConfig.validatePageSize(params.limit).toString());
    }
    if (params?.is_featured !== undefined) {
      searchParams.append('is_featured', params.is_featured.toString());
    }

    const queryString = searchParams.toString();
    const endpoint = `/api/v1/events${queryString ? `?${queryString}` : ''}`;

    const response = await this.fetch<{ events: any[]; total: number; page: number; page_size: number }>(endpoint);

    // Transform backend Event to frontend Challenge format
    return response.data.events.map((event) => this.transformEventToChallenge(event));
  }

  /**
   * Get challenge by ID (maps to backend /api/v1/events/:id)
   */
  async getChallengeById(id: string): Promise<Challenge> {
    if (!id) {
      throw new ValidationError('Challenge ID is required', { id });
    }

    const response = await this.fetch<any>(`/api/v1/events/${id}`);
    return this.transformEventToChallenge(response.data);
  }

  /**
   * Join a challenge (maps to backend /api/v1/events/:id/register) - requires authentication
   */
  async joinChallenge(challengeId: string): Promise<void> {
    if (!challengeId) {
      throw new ValidationError('Challenge ID is required', { challengeId });
    }

    await this.fetch(`/api/v1/events/${challengeId}/register`, {
      method: 'POST',
      body: JSON.stringify({}),
    });
  }

  /**
   * Leave a challenge (maps to backend DELETE /api/v1/registrations/:id) - requires authentication
   * Note: This requires the registration ID, not the challenge ID
   */
  async leaveChallenge(registrationId: string): Promise<void> {
    if (!registrationId) {
      throw new ValidationError('Registration ID is required', { registrationId });
    }

    await this.fetch(`/api/v1/registrations/${registrationId}`, {
      method: 'DELETE',
    });
  }

  /**
   * Get user's joined challenges (maps to backend /api/v1/events/users/:id/events) - requires authentication
   */
  async getUserChallenges(userId: string): Promise<Challenge[]> {
    if (!userId) {
      throw new ValidationError('User ID is required', { userId });
    }

    const response = await this.fetch<{ events: any[]; total: number }>(
      `/api/v1/events/users/${userId}/events`
    );
    return response.data.events.map((event) => this.transformEventToChallenge(event));
  }

  /**
   * Submit challenge activity (maps to backend /api/v1/events/:id/activities) - requires authentication
   */
  async submitActivity(
    challengeId: string,
    activity: {
      distance?: number;
      duration?: number;
      activity_date: string;
      notes?: string;
    }
  ): Promise<void> {
    if (!challengeId) {
      throw new ValidationError('Challenge ID is required', { challengeId });
    }

    if (!activity.activity_date) {
      throw new ValidationError('Activity date is required', { activity });
    }

    await this.fetch(`/api/v1/events/${challengeId}/activities`, {
      method: 'POST',
      body: JSON.stringify(activity),
    });
  }

  /**
   * User registration
   */
  async register(userData: {
    email: string;
    password: string;
    first_name: string;
    last_name: string;
    city?: string;
    state?: string;
  }): Promise<{ access_token: string; token_type: string }> {
    const response = await this.fetch<{ access_token: string; token_type: string }>(
      '/api/v1/auth/register',
      {
        method: 'POST',
        body: JSON.stringify(userData),
      }
    );
    return response.data;
  }

  /**
   * User login
   */
  async login(credentials: {
    email: string;
    password: string;
  }): Promise<{ access_token: string; token_type: string }> {
    const response = await this.fetch<{ access_token: string; token_type: string }>(
      '/api/v1/auth/login',
      {
        method: 'POST',
        body: JSON.stringify(credentials),
      }
    );
    return response.data;
  }

  /**
   * Get current user (requires authentication)
   */
  async getCurrentUser(): Promise<{
    id: number;
    email: string;
    first_name: string;
    last_name: string;
    city?: string;
    state?: string;
    is_active: boolean;
    email_verified: boolean;
  }> {
    const response = await this.fetch<any>('/api/v1/auth/me');
    return response.data;
  }
}

// Export singleton instance
export const apiClient = new GlycogritAPIClient();

// Export class for testing purposes
export default GlycogritAPIClient;

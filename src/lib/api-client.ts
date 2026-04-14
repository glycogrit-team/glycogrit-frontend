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

  constructor() {
    this.baseUrl = AppConfig.API_BASE_URL;
    this.timeout = AppConfig.API_TIMEOUT;
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

    try {
      const response = await fetch(`${this.baseUrl}${endpoint}`, {
        ...options,
        signal: controller.signal,
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
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
   * Get all challenges
   */
  async getChallenges(params?: {
    category?: string;
    difficulty?: string;
    page?: number;
    limit?: number;
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

    const queryString = searchParams.toString();
    const endpoint = `/api/challenges${queryString ? `?${queryString}` : ''}`;

    const response = await this.fetch<Challenge[]>(endpoint);
    return response.data;
  }

  /**
   * Get challenge by ID
   */
  async getChallengeById(id: string): Promise<Challenge> {
    if (!id) {
      throw new ValidationError('Challenge ID is required', { id });
    }

    const response = await this.fetch<Challenge>(`/api/challenges/${id}`);
    return response.data;
  }

  /**
   * Join a challenge
   */
  async joinChallenge(challengeId: string, userId: string): Promise<void> {
    if (!challengeId || !userId) {
      throw new ValidationError('Challenge ID and User ID are required', {
        challengeId,
        userId,
      });
    }

    await this.fetch(`/api/challenges/${challengeId}/join`, {
      method: 'POST',
      body: JSON.stringify({ userId }),
    });
  }

  /**
   * Leave a challenge
   */
  async leaveChallenge(challengeId: string, userId: string): Promise<void> {
    if (!challengeId || !userId) {
      throw new ValidationError('Challenge ID and User ID are required', {
        challengeId,
        userId,
      });
    }

    await this.fetch(`/api/challenges/${challengeId}/leave`, {
      method: 'POST',
      body: JSON.stringify({ userId }),
    });
  }

  /**
   * Get user's joined challenges
   */
  async getUserChallenges(userId: string): Promise<Challenge[]> {
    if (!userId) {
      throw new ValidationError('User ID is required', { userId });
    }

    const response = await this.fetch<Challenge[]>(`/api/users/${userId}/challenges`);
    return response.data;
  }

  /**
   * Submit challenge activity
   */
  async submitActivity(
    challengeId: string,
    userId: string,
    activity: {
      distance?: number;
      duration?: number;
      date: string;
      notes?: string;
    }
  ): Promise<void> {
    if (!challengeId || !userId) {
      throw new ValidationError('Challenge ID and User ID are required', {
        challengeId,
        userId,
      });
    }

    if (!activity.date) {
      throw new ValidationError('Activity date is required', { activity });
    }

    await this.fetch(`/api/challenges/${challengeId}/activities`, {
      method: 'POST',
      body: JSON.stringify({
        userId,
        ...activity,
      }),
    });
  }
}

// Export singleton instance
export const apiClient = new GlycogritAPIClient();

// Export class for testing purposes
export default GlycogritAPIClient;

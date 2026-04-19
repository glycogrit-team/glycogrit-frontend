/**
 * Strava API Service
 * Handles Strava OAuth and activity syncing
 */

import { config } from './config';

export interface StravaConnection {
  athlete_id: number;
  is_active: boolean;
  last_sync_at: string | null;
  athlete_name: string | null;
}

export interface ChallengeProgress {
  challenge_id: number;
  total_distance_km: number;
  total_activities: number;
  progress_percentage: number;
  goal_distance_km: number | null;
  last_activity_date: string | null;
  current_streak_days: number;
}

export interface LeaderboardEntry {
  user_id: number;
  user_name: string;
  total_distance_km: number;
  total_activities: number;
  rank: number;
}

class StravaService {
  private baseUrl: string;

  constructor() {
    this.baseUrl = config.apiUrl;
  }

  /**
   * Get authorization headers with JWT token
   */
  private getAuthHeaders(): HeadersInit {
    const token = localStorage.getItem('token');
    return {
      'Content-Type': 'application/json',
      ...(token ? { 'Authorization': `Bearer ${token}` } : {})
    };
  }

  /**
   * Get Strava OAuth authorization URL
   */
  async getAuthorizationUrl(): Promise<string> {
    const response = await fetch(`${this.baseUrl}/api/strava/authorize`, {
      headers: this.getAuthHeaders()
    });

    if (!response.ok) {
      throw new Error('Failed to get Strava authorization URL');
    }

    const data = await response.json();
    return data.authorization_url;
  }

  /**
   * Redirect user to Strava for authorization
   */
  async connectStrava(): Promise<void> {
    const authUrl = await this.getAuthorizationUrl();
    window.location.href = authUrl;
  }

  /**
   * Handle OAuth callback and exchange code for tokens
   */
  async handleCallback(code: string): Promise<StravaConnection> {
    const response = await fetch(`${this.baseUrl}/api/strava/callback`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
      body: JSON.stringify({ code })
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.detail || 'Failed to connect Strava');
    }

    return response.json();
  }

  /**
   * Get current Strava connection status
   */
  async getConnectionStatus(): Promise<StravaConnection | null> {
    const response = await fetch(`${this.baseUrl}/api/strava/connection`, {
      headers: this.getAuthHeaders()
    });

    if (!response.ok) {
      if (response.status === 404) {
        return null;
      }
      throw new Error('Failed to get connection status');
    }

    const data = await response.json();
    return data || null;
  }

  /**
   * Disconnect Strava account
   */
  async disconnectStrava(): Promise<void> {
    const response = await fetch(`${this.baseUrl}/api/strava/connection`, {
      method: 'DELETE',
      headers: this.getAuthHeaders()
    });

    if (!response.ok) {
      throw new Error('Failed to disconnect Strava');
    }
  }

  /**
   * Sync activities from Strava for a specific challenge
   */
  async syncChallengeActivities(challengeId: number): Promise<ChallengeProgress> {
    const response = await fetch(`${this.baseUrl}/api/strava/sync/${challengeId}`, {
      method: 'POST',
      headers: this.getAuthHeaders()
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.detail || 'Failed to sync activities');
    }

    return response.json();
  }

  /**
   * Get user's progress for a specific challenge
   */
  async getChallengeProgress(challengeId: number): Promise<ChallengeProgress> {
    const response = await fetch(`${this.baseUrl}/api/strava/progress/${challengeId}`, {
      headers: this.getAuthHeaders()
    });

    if (!response.ok) {
      throw new Error('Failed to get challenge progress');
    }

    return response.json();
  }

  /**
   * Get leaderboard for a specific challenge
   */
  async getChallengeLeaderboard(challengeId: number, limit: number = 50): Promise<LeaderboardEntry[]> {
    const response = await fetch(
      `${this.baseUrl}/api/strava/leaderboard/${challengeId}?limit=${limit}`,
      {
        headers: this.getAuthHeaders()
      }
    );

    if (!response.ok) {
      throw new Error('Failed to get leaderboard');
    }

    return response.json();
  }
}

export const stravaService = new StravaService();

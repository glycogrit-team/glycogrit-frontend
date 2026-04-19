/**
 * Admin API Client
 * Handles admin-only operations for challenge management
 */

import { AppConfig } from './config';

// Helper to get auth token
function getAuthToken(): string | null {
  return localStorage.getItem('glycogrit_token');
}

// Helper to make authenticated requests
async function adminFetch(endpoint: string, options: RequestInit = {}) {
  const token = getAuthToken();

  if (!token) {
    throw new Error('Not authenticated');
  }

  const response = await fetch(`${AppConfig.API_BASE_URL}${endpoint}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
      ...options.headers,
    },
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ detail: 'Unknown error' }));
    throw new Error(error.detail || 'Request failed');
  }

  // For DELETE requests, return null
  if (response.status === 204) {
    return null;
  }

  return response.json();
}

export const adminAPI = {
  /**
   * Toggle event published status
   */
  async togglePublish(eventId: number, isPublished: boolean) {
    return this.updateEvent(eventId, {
      status: isPublished ? 'draft' : 'published'
    });
  },

  /**
   * Toggle event featured status
   */
  async toggleFeatured(eventId: number, isFeatured: boolean) {
    return this.updateEvent(eventId, {
      is_featured: !isFeatured
    });
  },

  /**
   * Delete an event
   */
  async deleteEvent(eventId: number) {
    return adminFetch(`/api/v1/events/${eventId}`, {
      method: 'DELETE',
    });
  },

  /**
   * Update event
   */
  async updateEvent(eventId: number, data: any) {
    return adminFetch(`/api/v1/events/${eventId}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  /**
   * Create new event
   */
  async createEvent(data: any) {
    return adminFetch(`/api/v1/events`, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  /**
   * Get all events (including unpublished)
   */
  async getAllEvents() {
    return adminFetch(`/api/v1/events`);
  },
};

/**
 * Events API Client
 * Public API for fetching events (no auth required for reading)
 */

import { AppConfig } from './config';

export interface Event {
  id: number;
  name: string;
  slug: string;
  description: string;
  event_type: string;
  location_name: string;
  city: string;
  state: string;
  country: string;
  event_date: string;
  start_date: string | null;
  end_date: string | null;
  registration_start_date: string;
  registration_end_date: string;
  total_distance: number | null;
  max_participants: number | null;
  status: string;
  difficulty_level: string | null;
  banner_image_url: string | null;
  location: string | null;
  current_participants: number;
  registration_fee: number | null;
  currency: string;
  organizer_id: number;
  is_virtual: boolean;
  is_featured: boolean;
  goals: string[] | null;
  rewards: string[] | null;
  rules: string | null;
  created_at: string;
  updated_at: string;
}

async function fetchAPI(endpoint: string, options: RequestInit = {}) {
  const response = await fetch(`${AppConfig.API_BASE_URL}${endpoint}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ detail: 'Unknown error' }));
    throw new Error(error.detail || 'Request failed');
  }

  return response.json();
}

export const eventsAPI = {
  /**
   * Get all published events
   */
  async getEvents(params?: {
    skip?: number;
    limit?: number;
    event_type?: string;
    city?: string;
    is_featured?: boolean;
  }): Promise<Event[]> {
    const queryParams = new URLSearchParams();
    if (params?.skip !== undefined) queryParams.append('skip', params.skip.toString());
    if (params?.limit !== undefined) queryParams.append('limit', params.limit.toString());
    if (params?.event_type) queryParams.append('event_type', params.event_type);
    if (params?.city) queryParams.append('city', params.city);
    if (params?.is_featured !== undefined) queryParams.append('is_featured', params.is_featured.toString());

    const query = queryParams.toString();
    return fetchAPI(`/api/v1/events/${query ? '?' + query : ''}`);
  },

  /**
   * Get featured events
   */
  async getFeaturedEvents(skip = 0, limit = 10): Promise<Event[]> {
    return fetchAPI(`/api/v1/events/featured?skip=${skip}&limit=${limit}`);
  },

  /**
   * Get upcoming events
   */
  async getUpcomingEvents(skip = 0, limit = 50): Promise<Event[]> {
    return fetchAPI(`/api/v1/events/upcoming?skip=${skip}&limit=${limit}`);
  },

  /**
   * Get single event by ID
   */
  async getEvent(eventId: number): Promise<Event> {
    return fetchAPI(`/api/v1/events/${eventId}`);
  },
};

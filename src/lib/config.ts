/**
 * Application-wide configuration management
 * Inspired by NOVA architecture patterns
 */

export class AppConfig {
  // API Configuration
  static readonly API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';
  static readonly API_TIMEOUT = 30000; // 30 seconds
  static readonly API_RETRY_ATTEMPTS = 3;

  // Pagination
  static readonly DEFAULT_PAGE_SIZE = 12;
  static readonly MAX_PAGE_SIZE = 100;

  // File Upload
  static readonly MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
  static readonly ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp'];

  // Cache
  static readonly CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

  /**
   * Validates pagination limit
   */
  static validatePageSize(limit: number): number {
    if (limit < 1) return this.DEFAULT_PAGE_SIZE;
    if (limit > this.MAX_PAGE_SIZE) return this.MAX_PAGE_SIZE;
    return limit;
  }

  /**
   * Validates file size
   */
  static validateFileSize(size: number): boolean {
    return size > 0 && size <= this.MAX_FILE_SIZE;
  }
}

export class ChallengeConfig {
  // Challenge categories
  static readonly CATEGORIES = ['running', 'cycling', 'walking', 'mixed', 'strength'] as const;

  // Difficulty levels
  static readonly DIFFICULTY_LEVELS = ['beginner', 'intermediate', 'advanced'] as const;

  // Default values
  static readonly MIN_PARTICIPANTS = 0;
  static readonly MAX_DURATION_DAYS = 365;
  static readonly MIN_DURATION_DAYS = 1;

  /**
   * Get display name for category
   */
  static getCategoryDisplayName(category: string): string {
    return category.charAt(0).toUpperCase() + category.slice(1);
  }

  /**
   * Get display name for difficulty
   */
  static getDifficultyDisplayName(difficulty: string): string {
    return difficulty.charAt(0).toUpperCase() + difficulty.slice(1);
  }

  /**
   * Get color variant for difficulty badge
   */
  static getDifficultyColor(difficulty: string): 'success' | 'warning' | 'info' | 'default' {
    switch (difficulty) {
      case 'beginner':
        return 'success';
      case 'intermediate':
        return 'warning';
      case 'advanced':
        return 'info';
      default:
        return 'default';
    }
  }
}

export class UIConfig {
  // Breakpoints (matching Tailwind defaults)
  static readonly BREAKPOINTS = {
    sm: 640,
    md: 768,
    lg: 1024,
    xl: 1280,
    '2xl': 1536,
  };

  // Animation durations (ms)
  static readonly ANIMATION = {
    fast: 150,
    normal: 300,
    slow: 500,
  };

  // Toast/notification duration
  static readonly TOAST_DURATION = 5000; // 5 seconds

  // Debounce delay for search
  static readonly SEARCH_DEBOUNCE = 300; // 300ms
}

export class RouteConfig {
  // Application routes
  static readonly ROUTES = {
    HOME: '/',
    CHALLENGES: '/challenges',
    CHALLENGE_DETAIL: '/challenges/:id',
    ABOUT: '/#about',
    HOW_IT_WORKS: '/#how-it-works',
  } as const;

  /**
   * Generate challenge detail URL
   */
  static getChallengeDetailUrl(id: string): string {
    return `/challenges/${id}`;
  }
}

// Simple config object for direct access
export const config = {
  apiUrl: AppConfig.API_BASE_URL,
  apiTimeout: AppConfig.API_TIMEOUT,
  apiRetryAttempts: AppConfig.API_RETRY_ATTEMPTS,
};

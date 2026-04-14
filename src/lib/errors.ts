/**
 * Custom Error Classes
 * Inspired by NOVA architecture error handling patterns
 */

export type ErrorType = 'api' | 'network' | 'validation' | 'file_upload' | 'auth';

/**
 * Base API Error class
 */
export class APIError extends Error {
  public readonly errorType: ErrorType = 'api';
  public readonly statusCode: number;
  public readonly retryable: boolean;
  public readonly timestamp: Date;

  constructor(message: string, statusCode: number = 500, retryable: boolean = false) {
    super(message);
    this.name = 'APIError';
    this.statusCode = statusCode;
    this.retryable = retryable;
    this.timestamp = new Date();

    // Maintains proper stack trace for where error was thrown
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, this.constructor);
    }
  }

  /**
   * Create APIError from Response object
   */
  static async fromResponse(response: Response): Promise<APIError> {
    let message = 'An API error occurred';

    try {
      const data = await response.json();
      message = data.message || data.error || message;
    } catch {
      message = response.statusText || message;
    }

    return new APIError(message, response.status, response.status >= 500);
  }

  /**
   * Convert to plain object for logging
   */
  toJSON() {
    return {
      name: this.name,
      errorType: this.errorType,
      message: this.message,
      statusCode: this.statusCode,
      retryable: this.retryable,
      timestamp: this.timestamp.toISOString(),
      stack: this.stack,
    };
  }
}

/**
 * Network Error (connectivity issues, timeouts)
 */
export class NetworkError extends APIError {
  public readonly errorType: ErrorType = 'network';

  constructor(message: string = 'Network error occurred', retryable: boolean = true) {
    super(message, 0, retryable);
    this.name = 'NetworkError';
  }
}

/**
 * Validation Error (client-side or server-side validation failures)
 */
export class ValidationError extends APIError {
  public readonly errorType: ErrorType = 'validation';
  public readonly validationErrors: Record<string, unknown>;

  constructor(message: string, validationErrors: Record<string, unknown> = {}) {
    super(message, 400, false);
    this.name = 'ValidationError';
    this.validationErrors = validationErrors;
  }

  toJSON() {
    return {
      ...super.toJSON(),
      validationErrors: this.validationErrors,
    };
  }
}

/**
 * Authentication/Authorization Error
 */
export class AuthError extends APIError {
  public readonly errorType: ErrorType = 'auth';
  public readonly requiresLogin: boolean;

  constructor(message: string, statusCode: number = 401, requiresLogin: boolean = true) {
    super(message, statusCode, false);
    this.name = 'AuthError';
    this.requiresLogin = requiresLogin;
  }

  toJSON() {
    return {
      ...super.toJSON(),
      requiresLogin: this.requiresLogin,
    };
  }
}

/**
 * File Upload Error
 */
export class FileUploadError extends APIError {
  public readonly errorType: ErrorType = 'file_upload';
  public readonly fileName?: string;
  public readonly fileSize?: number;
  public readonly fileType?: string;

  constructor(
    message: string,
    details: {
      fileName?: string;
      fileSize?: number;
      fileType?: string;
      retryable?: boolean;
    } = {}
  ) {
    super(message, 400, details.retryable || false);
    this.name = 'FileUploadError';
    this.fileName = details.fileName;
    this.fileSize = details.fileSize;
    this.fileType = details.fileType;
  }

  /**
   * Create from file validation failure
   */
  static fromValidation(
    message: string,
    file: File,
    retryable: boolean = false
  ): FileUploadError {
    return new FileUploadError(message, {
      fileName: file.name,
      fileSize: file.size,
      fileType: file.type,
      retryable,
    });
  }

  toJSON() {
    return {
      ...super.toJSON(),
      fileName: this.fileName,
      fileSize: this.fileSize,
      fileType: this.fileType,
    };
  }
}

/**
 * Type guard to check if error is retryable
 */
export function isRetryableError(error: unknown): boolean {
  return error instanceof APIError && error.retryable;
}

/**
 * Type guard to check if error is a network error
 */
export function isNetworkError(error: unknown): boolean {
  return error instanceof NetworkError;
}

/**
 * Type guard to check if error is a validation error
 */
export function isValidationError(error: unknown): boolean {
  return error instanceof ValidationError;
}

/**
 * Type guard to check if error is an auth error
 */
export function isAuthError(error: unknown): boolean {
  return error instanceof AuthError;
}

/**
 * Get user-friendly error message
 */
export function getUserFriendlyMessage(error: unknown): string {
  if (error instanceof ValidationError) {
    return error.message;
  }

  if (error instanceof NetworkError) {
    return 'Unable to connect. Please check your internet connection and try again.';
  }

  if (error instanceof AuthError) {
    return error.requiresLogin
      ? 'Please log in to continue.'
      : 'You do not have permission to perform this action.';
  }

  if (error instanceof FileUploadError) {
    return `File upload failed: ${error.message}`;
  }

  if (error instanceof APIError) {
    if (error.statusCode >= 500) {
      return 'Something went wrong on our end. Please try again later.';
    }
    return error.message;
  }

  if (error instanceof Error) {
    return error.message;
  }

  return 'An unexpected error occurred. Please try again.';
}

/**
 * Log error to console with formatting (in development)
 * In production, this would send to error tracking service
 */
export function logError(error: unknown, context?: Record<string, unknown>): void {
  if (import.meta.env.DEV) {
    console.group('🚨 Error Log');
    console.error('Error:', error);
    if (context) {
      console.log('Context:', context);
    }
    if (error instanceof APIError) {
      console.table(error.toJSON());
    }
    console.groupEnd();
  } else {
    // In production, send to error tracking service (e.g., Sentry)
    // Example: Sentry.captureException(error, { extra: context });
  }
}

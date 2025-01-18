export class ProviderError extends Error {
  constructor(
    message: string,
    public provider: string,
    public statusCode?: number,
    public retryable: boolean = false
  ) {
    super(message);
    this.name = 'ProviderError';
  }
}

export class RateLimitError extends ProviderError {
  constructor(provider: string, retryAfter?: number) {
    super(
      `Rate limit exceeded for ${provider}${
        retryAfter ? `. Try again after ${retryAfter} seconds` : ''
      }`,
      provider,
      429,
      true
    );
    this.name = 'RateLimitError';
  }
}

export class AuthenticationError extends ProviderError {
  constructor(provider: string) {
    super(`Authentication failed for ${provider}`, provider, 401, false);
    this.name = 'AuthenticationError';
  }
}

export class NetworkError extends ProviderError {
  constructor(provider: string, message: string) {
    super(`Network error for ${provider}: ${message}`, provider, undefined, true);
    this.name = 'NetworkError';
  }
}

export function isRetryableError(error: any): boolean {
  if (error instanceof ProviderError) {
    return error.retryable;
  }
  
  // Network-related errors are generally retryable
  if (error.name === 'FetchError' || error.name === 'NetworkError') {
    return true;
  }
  
  // Specific HTTP status codes that warrant retry
  if (error.status) {
    return [408, 429, 500, 502, 503, 504].includes(error.status);
  }
  
  return false;
}

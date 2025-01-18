export * from './error-handling';
export * from './retry';
export * from './rate-limit';
export * from './logger';

import { withRetry } from './retry';
import { withRateLimit } from './rate-limit';

// Convenience function that combines retry and rate limiting
export async function withProviderProtection<T>(
  provider: string,
  operation: () => Promise<T>,
  options?: {
    tokens?: number;
    retryAttempts?: number;
    initialDelay?: number;
  }
): Promise<T> {
  const { tokens = 1, retryAttempts, initialDelay } = options || {};

  return withRetry(
    async () => {
      return await withRateLimit(provider, operation, tokens);
    },
    {
      maxAttempts: retryAttempts,
      initialDelay: initialDelay,
    }
  );
}

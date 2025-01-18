import { isRetryableError } from './error-handling';

interface RetryOptions {
  maxAttempts?: number;
  initialDelay?: number;
  maxDelay?: number;
  backoffFactor?: number;
  retryableError?: (error: any) => boolean;
}

const defaultOptions: Required<RetryOptions> = {
  maxAttempts: 3,
  initialDelay: 1000, // 1 second
  maxDelay: 10000, // 10 seconds
  backoffFactor: 2,
  retryableError: isRetryableError,
};

export async function withRetry<T>(
  operation: () => Promise<T>,
  options: RetryOptions = {}
): Promise<T> {
  const opts = { ...defaultOptions, ...options };
  let lastError: Error | null = null;
  let delay = opts.initialDelay;

  for (let attempt = 1; attempt <= opts.maxAttempts; attempt++) {
    try {
      return await operation();
    } catch (error: any) {
      lastError = error;

      if (attempt === opts.maxAttempts || !opts.retryableError(error)) {
        throw error;
      }

      // Calculate delay with exponential backoff
      const jitter = Math.random() * 0.1 * delay; // Add 0-10% jitter
      const actualDelay = Math.min(delay + jitter, opts.maxDelay);
      
      console.warn(
        `Attempt ${attempt} failed for operation. Retrying in ${
          actualDelay / 1000
        } seconds...`,
        error
      );

      await new Promise((resolve) => setTimeout(resolve, actualDelay));
      delay = Math.min(delay * opts.backoffFactor, opts.maxDelay);
    }
  }

  // This should never be reached due to the throw in the loop
  throw lastError || new Error('Retry failed');
}

// Helper for retrying with streams
export async function withStreamRetry<T>(
  operation: () => Promise<ReadableStream<T>>,
  options: RetryOptions = {}
): Promise<ReadableStream<T>> {
  return await withRetry(operation, {
    ...options,
    maxAttempts: options.maxAttempts || 2, // Default to fewer attempts for streams
  });
}

interface RateLimitConfig {
  tokensPerInterval: number;
  interval: number; // in milliseconds
  burstLimit?: number;
}

export class RateLimiter {
  private tokens: number;
  private lastRefill: number;
  private readonly maxTokens: number;

  constructor(private config: RateLimitConfig) {
    this.tokens = config.burstLimit || config.tokensPerInterval;
    this.maxTokens = config.burstLimit || config.tokensPerInterval;
    this.lastRefill = Date.now();
  }

  private refillTokens(): void {
    const now = Date.now();
    const timePassed = now - this.lastRefill;
    const tokensToAdd = (timePassed / this.config.interval) * this.config.tokensPerInterval;
    
    this.tokens = Math.min(this.maxTokens, this.tokens + tokensToAdd);
    this.lastRefill = now;
  }

  async acquire(tokens: number = 1): Promise<void> {
    this.refillTokens();

    if (this.tokens >= tokens) {
      this.tokens -= tokens;
      return;
    }

    // Calculate wait time
    const tokensNeeded = tokens - this.tokens;
    const waitTime = (tokensNeeded / this.config.tokensPerInterval) * this.config.interval;

    await new Promise(resolve => setTimeout(resolve, waitTime));
    this.refillTokens();
    this.tokens -= tokens;
  }
}

// Provider-specific rate limiters
const rateLimiters: Record<string, RateLimiter> = {
  openai: new RateLimiter({
    tokensPerInterval: 50,
    interval: 60000, // 1 minute
    burstLimit: 100
  }),
  anthropic: new RateLimiter({
    tokensPerInterval: 50,
    interval: 60000,
    burstLimit: 100
  }),
  google: new RateLimiter({
    tokensPerInterval: 60,
    interval: 60000,
    burstLimit: 120
  }),
  deepseek: new RateLimiter({
    tokensPerInterval: 40,
    interval: 60000,
    burstLimit: 80
  }),
  grok: new RateLimiter({
    tokensPerInterval: 30,
    interval: 60000,
    burstLimit: 60
  })
};

export async function withRateLimit<T>(
  provider: string,
  operation: () => Promise<T>,
  tokens: number = 1
): Promise<T> {
  const limiter = rateLimiters[provider];
  if (!limiter) {
    throw new Error(`No rate limiter configured for provider: ${provider}`);
  }

  await limiter.acquire(tokens);
  return operation();
}

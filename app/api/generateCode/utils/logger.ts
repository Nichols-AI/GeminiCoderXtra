export enum LogLevel {
  DEBUG = 'debug',
  INFO = 'info',
  WARN = 'warn',
  ERROR = 'error'
}

interface LogEntry {
  timestamp: string;
  level: LogLevel;
  message: string;
  provider?: string;
  error?: any;
  metadata?: Record<string, any>;
}

class Logger {
  private static instance: Logger;
  private minLevel: LogLevel = LogLevel.INFO;

  private constructor() {}

  static getInstance(): Logger {
    if (!Logger.instance) {
      Logger.instance = new Logger();
    }
    return Logger.instance;
  }

  setMinLevel(level: LogLevel) {
    this.minLevel = level;
  }

  private shouldLog(level: LogLevel): boolean {
    const levels = Object.values(LogLevel);
    return levels.indexOf(level) >= levels.indexOf(this.minLevel);
  }

  private formatEntry(entry: LogEntry): string {
    const base = `[${entry.timestamp}] ${entry.level.toUpperCase()}: ${entry.message}`;
    const provider = entry.provider ? ` [Provider: ${entry.provider}]` : '';
    const error = entry.error ? `\nError: ${JSON.stringify(entry.error, null, 2)}` : '';
    const metadata = entry.metadata ? `\nMetadata: ${JSON.stringify(entry.metadata, null, 2)}` : '';
    
    return `${base}${provider}${error}${metadata}`;
  }

  private log(level: LogLevel, message: string, provider?: string, error?: any, metadata?: Record<string, any>) {
    if (!this.shouldLog(level)) return;

    const entry: LogEntry = {
      timestamp: new Date().toISOString(),
      level,
      message,
      provider,
      error,
      metadata
    };

    const formattedEntry = this.formatEntry(entry);
    
    switch (level) {
      case LogLevel.ERROR:
        console.error(formattedEntry);
        break;
      case LogLevel.WARN:
        console.warn(formattedEntry);
        break;
      case LogLevel.INFO:
        console.info(formattedEntry);
        break;
      case LogLevel.DEBUG:
        console.debug(formattedEntry);
        break;
    }

    // In a production environment, you might want to send logs to a service
    // this.sendToLogService(entry);
  }

  debug(message: string, provider?: string, metadata?: Record<string, any>) {
    this.log(LogLevel.DEBUG, message, provider, undefined, metadata);
  }

  info(message: string, provider?: string, metadata?: Record<string, any>) {
    this.log(LogLevel.INFO, message, provider, undefined, metadata);
  }

  warn(message: string, provider?: string, error?: any, metadata?: Record<string, any>) {
    this.log(LogLevel.WARN, message, provider, error, metadata);
  }

  error(message: string, provider?: string, error?: any, metadata?: Record<string, any>) {
    this.log(LogLevel.ERROR, message, provider, error, metadata);
  }

  // private async sendToLogService(entry: LogEntry) {
  //   // Implementation for sending logs to external service
  //   // e.g., CloudWatch, DataDog, etc.
  // }
}

export const logger = Logger.getInstance();

import { Platform } from 'react-native';

interface ErrorLog {
  message: string;
  stack?: string;
  timestamp: string;
  platform: string;
  version: string;
  extra?: Record<string, any>;
}

class ErrorLogger {
  private static instance: ErrorLogger;
  private logs: ErrorLog[] = [];

  private constructor() {}

  static getInstance(): ErrorLogger {
    if (!ErrorLogger.instance) {
      ErrorLogger.instance = new ErrorLogger();
    }
    return ErrorLogger.instance;
  }

  logError(error: Error, extra?: Record<string, any>) {
    const errorLog: ErrorLog = {
      message: error.message,
      stack: error.stack,
      timestamp: new Date().toISOString(),
      platform: Platform.OS,
      version: Platform.Version.toString(),
      extra,
    };

    // Log to console in development
    if (__DEV__) {
      console.error('Error logged:', errorLog);
    }

    // Store the log
    this.logs.push(errorLog);

    // Here you would typically send the error to your error tracking service
    // For example: Sentry, Firebase Crashlytics, etc.
    // this.sendToErrorTrackingService(errorLog);
  }

  getLogs(): ErrorLog[] {
    return this.logs;
  }

  clearLogs() {
    this.logs = [];
  }
}

export const errorLogger = ErrorLogger.getInstance(); 
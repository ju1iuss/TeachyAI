import { errorLogger } from './errorLogger';

export interface AsyncResult<T> {
  data: T | null;
  error: Error | null;
}

export async function safeAsync<T>(
  operation: () => Promise<T>,
  context?: string,
  fallbackValue: T | null = null
): Promise<AsyncResult<T>> {
  try {
    const data = await operation();
    return { data, error: null };
  } catch (error) {
    // Enhanced error handling with more context
    const errorMessage = error instanceof Error ? error : new Error(String(error));
    errorLogger.logError(errorMessage, { 
      context,
      operationType: typeof operation,
      timestamp: new Date().toISOString()
    });
    return { data: fallbackValue, error: errorMessage };
  } finally {
    // Could add additional cleanup or logging here if needed
  }
}

// Example usage:
/*
const { data, error } = await safeAsync(async () => {
  const response = await fetch('https://api.example.com/data');
  return response.json();
}, 'fetching data');

if (error) {
  // Handle error
} else {
  // Use data
}
*/ 
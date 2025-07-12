/**
 * Provides a minimal interface for checking database health.
 */
export type DatabaseHealthChecker = {
  ping(): Promise<boolean>;
}; 
/**
 * useFhevm Hook - Access FHEVM client instance
 */

import { useFhevmContext } from '../provider';
import type { FhevmClient } from '../client';

export interface UseFhevmReturn {
  client: FhevmClient | null;
  isInitialized: boolean;
  error: Error | null;
}

/**
 * Hook to access the FHEVM client
 *
 * @example
 * ```tsx
 * const { client, isInitialized } = useFhevm();
 *
 * if (isInitialized && client) {
 *   const encrypted = await client.encrypt32(1500);
 * }
 * ```
 */
export function useFhevm(): UseFhevmReturn {
  const { client, isInitialized, error } = useFhevmContext();

  return {
    client,
    isInitialized,
    error,
  };
}

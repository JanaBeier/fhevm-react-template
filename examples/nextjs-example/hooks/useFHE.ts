/**
 * useFHE Hook
 *
 * Custom React hook for FHE operations
 */

import { useState, useEffect } from 'react';
import { useFhevm } from '@fhevm-example/sdk';

export interface UseFHEReturn {
  isReady: boolean;
  isInitializing: boolean;
  error: Error | null;
  client: any;
}

export function useFHE(): UseFHEReturn {
  const { client, isInitialized, error } = useFhevm();
  const [isInitializing, setIsInitializing] = useState(true);

  useEffect(() => {
    if (isInitialized) {
      setIsInitializing(false);
    }
  }, [isInitialized]);

  return {
    isReady: isInitialized,
    isInitializing,
    error,
    client,
  };
}

/**
 * useEncrypt Hook - Encrypt values using FHEVM
 */

import { useState, useCallback } from 'react';
import { useFhevm } from './useFhevm';
import type { EncryptionResult } from '../types';

export interface UseEncryptReturn {
  encrypt32: (value: number) => Promise<EncryptionResult>;
  encrypt16: (value: number) => Promise<EncryptionResult>;
  encrypt8: (value: number) => Promise<EncryptionResult>;
  encryptBool: (value: boolean) => Promise<EncryptionResult>;
  isEncrypting: boolean;
  error: Error | null;
}

/**
 * Hook to encrypt values
 *
 * @example
 * ```tsx
 * const { encrypt32, isEncrypting } = useEncrypt();
 *
 * const handleEncrypt = async () => {
 *   const encrypted = await encrypt32(1500);
 *   console.log('Encrypted:', encrypted);
 * };
 * ```
 */
export function useEncrypt(): UseEncryptReturn {
  const { client, isInitialized } = useFhevm();
  const [isEncrypting, setIsEncrypting] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const encrypt32 = useCallback(
    async (value: number): Promise<EncryptionResult> => {
      if (!isInitialized || !client) {
        throw new Error('FHEVM client not initialized');
      }

      setIsEncrypting(true);
      setError(null);

      try {
        const result = await client.encrypt32(value);
        return result;
      } catch (err) {
        const error = err instanceof Error ? err : new Error('Encryption failed');
        setError(error);
        throw error;
      } finally {
        setIsEncrypting(false);
      }
    },
    [client, isInitialized]
  );

  const encrypt16 = useCallback(
    async (value: number): Promise<EncryptionResult> => {
      if (!isInitialized || !client) {
        throw new Error('FHEVM client not initialized');
      }

      setIsEncrypting(true);
      setError(null);

      try {
        const result = await client.encrypt16(value);
        return result;
      } catch (err) {
        const error = err instanceof Error ? err : new Error('Encryption failed');
        setError(error);
        throw error;
      } finally {
        setIsEncrypting(false);
      }
    },
    [client, isInitialized]
  );

  const encrypt8 = useCallback(
    async (value: number): Promise<EncryptionResult> => {
      if (!isInitialized || !client) {
        throw new Error('FHEVM client not initialized');
      }

      setIsEncrypting(true);
      setError(null);

      try {
        const result = await client.encrypt8(value);
        return result;
      } catch (err) {
        const error = err instanceof Error ? err : new Error('Encryption failed');
        setError(error);
        throw error;
      } finally {
        setIsEncrypting(false);
      }
    },
    [client, isInitialized]
  );

  const encryptBool = useCallback(
    async (value: boolean): Promise<EncryptionResult> => {
      if (!isInitialized || !client) {
        throw new Error('FHEVM client not initialized');
      }

      setIsEncrypting(true);
      setError(null);

      try {
        const result = await client.encryptBool(value);
        return result;
      } catch (err) {
        const error = err instanceof Error ? err : new Error('Encryption failed');
        setError(error);
        throw error;
      } finally {
        setIsEncrypting(false);
      }
    },
    [client, isInitialized]
  );

  return {
    encrypt32,
    encrypt16,
    encrypt8,
    encryptBool,
    isEncrypting,
    error,
  };
}

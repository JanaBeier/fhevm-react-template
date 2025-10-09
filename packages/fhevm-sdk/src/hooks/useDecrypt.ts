/**
 * useDecrypt Hook - Decrypt values using FHEVM
 */

import { useState, useCallback } from 'react';
import { useFhevm } from './useFhevm';
import type { DecryptionParams } from '../types';

export interface UseDecryptReturn {
  decrypt: (params: DecryptionParams) => Promise<number | boolean>;
  isDecrypting: boolean;
  error: Error | null;
}

/**
 * Hook to decrypt values
 *
 * @example
 * ```tsx
 * const { decrypt, isDecrypting } = useDecrypt();
 *
 * const handleDecrypt = async () => {
 *   const decrypted = await decrypt({
 *     contractAddress: '0x...',
 *     ciphertext: encryptedData,
 *     userAddress: '0x...'
 *   });
 *   console.log('Decrypted value:', decrypted);
 * };
 * ```
 */
export function useDecrypt(): UseDecryptReturn {
  const { client, isInitialized } = useFhevm();
  const [isDecrypting, setIsDecrypting] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const decrypt = useCallback(
    async (params: DecryptionParams): Promise<number | boolean> {
      if (!isInitialized || !client) {
        throw new Error('FHEVM client not initialized');
      }

      setIsDecrypting(true);
      setError(null);

      try {
        const result = await client.decrypt(params);
        return result;
      } catch (err) {
        const error = err instanceof Error ? err : new Error('Decryption failed');
        setError(error);
        throw error;
      } finally {
        setIsDecrypting(false);
      }
    },
    [client, isInitialized]
  );

  return {
    decrypt,
    isDecrypting,
    error,
  };
}

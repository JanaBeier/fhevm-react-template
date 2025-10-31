/**
 * useEncryption Hook
 *
 * Custom React hook for encryption operations
 */

import { useState, useCallback } from 'react';
import { useEncrypt as useSDKEncrypt } from '@fhevm-example/sdk';
import { EncryptedValue } from '@/types/fhe';

export interface UseEncryptionReturn {
  encrypt: (value: number, type: 'euint32' | 'euint16' | 'euint8') => Promise<EncryptedValue>;
  encryptBool: (value: boolean) => Promise<EncryptedValue>;
  isEncrypting: boolean;
  error: string | null;
  clearError: () => void;
}

export function useEncryption(): UseEncryptionReturn {
  const { encrypt32, encrypt16, encrypt8, encryptBool: sdkEncryptBool, isEncrypting } = useSDKEncrypt();
  const [error, setError] = useState<string | null>(null);

  const encrypt = useCallback(
    async (value: number, type: 'euint32' | 'euint16' | 'euint8'): Promise<EncryptedValue> => {
      try {
        setError(null);

        let result;
        switch (type) {
          case 'euint32':
            result = await encrypt32(value);
            break;
          case 'euint16':
            result = await encrypt16(value);
            break;
          case 'euint8':
            result = await encrypt8(value);
            break;
        }

        return result as EncryptedValue;
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Encryption failed';
        setError(errorMessage);
        throw new Error(errorMessage);
      }
    },
    [encrypt32, encrypt16, encrypt8]
  );

  const encryptBool = useCallback(
    async (value: boolean): Promise<EncryptedValue> => {
      try {
        setError(null);
        const result = await sdkEncryptBool(value);
        return result as EncryptedValue;
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Boolean encryption failed';
        setError(errorMessage);
        throw new Error(errorMessage);
      }
    },
    [sdkEncryptBool]
  );

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    encrypt,
    encryptBool,
    isEncrypting,
    error,
    clearError,
  };
}

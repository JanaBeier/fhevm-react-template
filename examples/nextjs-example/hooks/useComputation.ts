/**
 * useComputation Hook
 *
 * Custom React hook for homomorphic computation operations
 */

import { useState, useCallback } from 'react';
import { EncryptedValue } from '@/types/fhe';
import { fheAdd, fheSub, fheMul, fheGe, fheSelect } from '@/lib/fhe/server';

type Operation = 'add' | 'sub' | 'mul' | 'ge' | 'select';

export interface UseComputationReturn {
  compute: (operation: Operation, operands: EncryptedValue[]) => Promise<EncryptedValue>;
  isComputing: boolean;
  error: string | null;
  clearError: () => void;
}

export function useComputation(): UseComputationReturn {
  const [isComputing, setIsComputing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const compute = useCallback(
    async (operation: Operation, operands: EncryptedValue[]): Promise<EncryptedValue> => {
      try {
        setIsComputing(true);
        setError(null);

        if (operands.length < 2) {
          throw new Error('At least two operands are required');
        }

        let result: EncryptedValue;

        switch (operation) {
          case 'add':
            result = await fheAdd(operands[0], operands[1]);
            // Chain operations for more than 2 operands
            for (let i = 2; i < operands.length; i++) {
              result = await fheAdd(result, operands[i]);
            }
            break;

          case 'sub':
            result = await fheSub(operands[0], operands[1]);
            for (let i = 2; i < operands.length; i++) {
              result = await fheSub(result, operands[i]);
            }
            break;

          case 'mul':
            result = await fheMul(operands[0], operands[1]);
            for (let i = 2; i < operands.length; i++) {
              result = await fheMul(result, operands[i]);
            }
            break;

          case 'ge':
            if (operands.length !== 2) {
              throw new Error('Comparison requires exactly two operands');
            }
            result = await fheGe(operands[0], operands[1]);
            break;

          case 'select':
            if (operands.length !== 3) {
              throw new Error('Select requires exactly three operands (condition, ifTrue, ifFalse)');
            }
            result = await fheSelect(operands[0], operands[1], operands[2]);
            break;

          default:
            throw new Error(`Unknown operation: ${operation}`);
        }

        return result;
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Computation failed';
        setError(errorMessage);
        throw new Error(errorMessage);
      } finally {
        setIsComputing(false);
      }
    },
    []
  );

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    compute,
    isComputing,
    error,
    clearError,
  };
}

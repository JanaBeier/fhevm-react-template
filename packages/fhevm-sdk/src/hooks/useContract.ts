/**
 * useContract Hook - Interact with FHEVM contracts
 */

import { useState, useCallback, useEffect } from 'react';
import { ethers } from 'ethers';
import { useFhevmContext } from '../provider';
import type { ContractConfig } from '../types';

export interface UseContractReturn {
  contract: ethers.Contract | null;
  call: (method: string, ...args: any[]) => Promise<any>;
  send: (method: string, ...args: any[]) => Promise<ethers.ContractTransaction>;
  isLoading: boolean;
  error: Error | null;
}

/**
 * Hook to interact with smart contracts
 *
 * @example
 * ```tsx
 * const { contract, call, send } = useContract({
 *   address: '0x...',
 *   abi: ContractABI,
 * });
 *
 * // Read from contract
 * const value = await call('getValue');
 *
 * // Write to contract
 * const tx = await send('setValue', encryptedValue);
 * await tx.wait();
 * ```
 */
export function useContract(config: ContractConfig): UseContractReturn {
  const { provider } = useFhevmContext();
  const [contract, setContract] = useState<ethers.Contract | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!provider) return;

    try {
      const signer = config.signer || provider.getSigner();
      const contractInstance = new ethers.Contract(
        config.address,
        config.abi,
        signer
      );

      setContract(contractInstance);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to create contract instance'));
    }
  }, [config.address, config.abi, config.signer, provider]);

  const call = useCallback(
    async (method: string, ...args: any[]): Promise<any> => {
      if (!contract) {
        throw new Error('Contract not initialized');
      }

      setIsLoading(true);
      setError(null);

      try {
        const result = await contract[method](...args);
        return result;
      } catch (err) {
        const error = err instanceof Error ? err : new Error(`Contract call failed: ${method}`);
        setError(error);
        throw error;
      } finally {
        setIsLoading(false);
      }
    },
    [contract]
  );

  const send = useCallback(
    async (method: string, ...args: any[]): Promise<ethers.ContractTransaction> => {
      if (!contract) {
        throw new Error('Contract not initialized');
      }

      setIsLoading(true);
      setError(null);

      try {
        const tx = await contract[method](...args);
        return tx;
      } catch (err) {
        const error = err instanceof Error ? err : new Error(`Transaction failed: ${method}`);
        setError(error);
        throw error;
      } finally {
        setIsLoading(false);
      }
    },
    [contract]
  );

  return {
    contract,
    call,
    send,
    isLoading,
    error,
  };
}

/**
 * FHEVM Provider - React Context Provider for FHEVM SDK
 */

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { ethers } from 'ethers';
import { FhevmClient } from './client';
import type { FhevmConfig } from './types';

interface FhevmContextValue {
  client: FhevmClient | null;
  isInitialized: boolean;
  error: Error | null;
  provider: ethers.providers.Provider | null;
}

const FhevmContext = createContext<FhevmContextValue>({
  client: null,
  isInitialized: false,
  error: null,
  provider: null,
});

interface FhevmProviderProps {
  config: Partial<FhevmConfig>;
  children: ReactNode;
}

/**
 * FHEVM Provider Component
 * Wraps your app to provide FHEVM functionality
 */
export function FhevmProvider({ config, children }: FhevmProviderProps) {
  const [client, setClient] = useState<FhevmClient | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [provider, setProvider] = useState<ethers.providers.Provider | null>(null);

  useEffect(() => {
    async function initializeFhevm() {
      try {
        // Get provider from config or window.ethereum
        let ethProvider: ethers.providers.Provider;

        if (config.provider) {
          ethProvider = config.provider;
        } else if (typeof window !== 'undefined' && window.ethereum) {
          ethProvider = new ethers.providers.Web3Provider(window.ethereum);
          // Request account access
          await window.ethereum.request({ method: 'eth_requestAccounts' });
        } else {
          throw new Error('No Ethereum provider found');
        }

        setProvider(ethProvider);

        // Determine network
        const network = config.network || 'sepolia';

        // Create FHEVM client
        const fhevmClient = new FhevmClient({
          provider: ethProvider,
          network,
          contractAddress: config.contractAddress,
          gatewayUrl: config.gatewayUrl,
        });

        // Initialize client
        await fhevmClient.init();

        setClient(fhevmClient);
        setIsInitialized(true);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to initialize FHEVM'));
        console.error('FHEVM initialization error:', err);
      }
    }

    initializeFhevm();
  }, [config]);

  return (
    <FhevmContext.Provider value={{ client, isInitialized, error, provider }}>
      {children}
    </FhevmContext.Provider>
  );
}

/**
 * Hook to access FHEVM context
 */
export function useFhevmContext(): FhevmContextValue {
  const context = useContext(FhevmContext);
  if (!context) {
    throw new Error('useFhevmContext must be used within FhevmProvider');
  }
  return context;
}

// Extend Window interface for TypeScript
declare global {
  interface Window {
    ethereum?: any;
  }
}

'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { useFhevm } from '@fhevm-example/sdk';

interface FHEContextType {
  isReady: boolean;
  error: Error | null;
}

const FHEContext = createContext<FHEContextType>({
  isReady: false,
  error: null,
});

export const useFHE = () => useContext(FHEContext);

export const FHEProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isInitialized, error } = useFhevm();
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    if (isInitialized) {
      setIsReady(true);
    }
  }, [isInitialized]);

  return (
    <FHEContext.Provider value={{ isReady, error }}>
      {children}
    </FHEContext.Provider>
  );
};

/**
 * Type definitions for FHE operations
 */

export type EncryptedType = 'euint32' | 'euint16' | 'euint8' | 'ebool';

export interface EncryptedValue {
  ciphertext: string;
  type: EncryptedType;
  timestamp?: number;
}

export interface FHEClientConfig {
  network: 'sepolia' | 'localhost' | 'mainnet';
  gatewayUrl?: string;
  publicKey?: string;
}

export interface FHEOperationResult {
  success: boolean;
  result?: EncryptedValue;
  error?: string;
}

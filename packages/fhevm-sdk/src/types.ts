/**
 * Type definitions for FHEVM SDK
 */

import { ethers } from 'ethers';

export interface FhevmConfig {
  provider: ethers.providers.Provider;
  network: 'sepolia' | 'localhost' | 'custom';
  contractAddress?: string;
  gatewayUrl?: string;
}

export interface EncryptionResult {
  ciphertext: Uint8Array;
  signature: string;
}

export interface DecryptionParams {
  contractAddress: string;
  ciphertext: Uint8Array;
  userAddress: string;
}

export interface FhevmInstance {
  encrypt32(value: number): Promise<EncryptionResult>;
  encrypt16(value: number): Promise<EncryptionResult>;
  encrypt8(value: number): Promise<EncryptionResult>;
  encryptBool(value: boolean): Promise<EncryptionResult>;
  decrypt(params: DecryptionParams): Promise<number | boolean>;
  createEIP712Signature(params: any): Promise<string>;
}

export interface ContractConfig {
  address: string;
  abi: any[];
  provider: ethers.providers.Provider;
  signer?: ethers.Signer;
}

export type EncryptedValue = {
  data: Uint8Array;
  type: 'euint8' | 'euint16' | 'euint32' | 'ebool';
};

export type DecryptedValue = number | boolean | bigint;

/**
 * FHE Type Definitions
 *
 * TypeScript type definitions for FHEVM operations
 */

/**
 * Supported encrypted types in FHEVM
 */
export type EncryptedType = 'euint32' | 'euint16' | 'euint8' | 'ebool';

/**
 * Encrypted value with metadata
 */
export interface EncryptedValue {
  ciphertext: string;
  type: EncryptedType;
  timestamp?: number;
  signature?: string;
}

/**
 * FHE client configuration
 */
export interface FHEClientConfig {
  network: 'sepolia' | 'localhost' | 'mainnet' | 'custom';
  gatewayUrl?: string;
  publicKey?: string;
  rpcUrl?: string;
}

/**
 * Public key information
 */
export interface PublicKey {
  key: string;
  algorithm: string;
  version: string;
  timestamp: number;
}

/**
 * Key pair (public and private keys)
 */
export interface KeyPair {
  publicKey: string;
  privateKey: string;
}

/**
 * Result of an FHE operation
 */
export interface FHEOperationResult {
  success: boolean;
  result?: EncryptedValue;
  error?: string;
}

/**
 * Encryption options
 */
export interface EncryptionOptions {
  type: EncryptedType;
  publicKey?: string;
}

/**
 * Decryption options
 */
export interface DecryptionOptions {
  contractAddress: string;
  ciphertext: string;
  userAddress: string;
  signature?: string;
}

/**
 * Homomorphic operation types
 */
export type HomomorphicOperation =
  | 'add'
  | 'sub'
  | 'mul'
  | 'div'
  | 'ge'
  | 'gt'
  | 'le'
  | 'lt'
  | 'eq'
  | 'ne'
  | 'select';

/**
 * Computation request
 */
export interface ComputationRequest {
  operation: HomomorphicOperation;
  operands: EncryptedValue[];
}

/**
 * Computation response
 */
export interface ComputationResponse {
  success: boolean;
  result?: EncryptedValue;
  operation: HomomorphicOperation;
  operandCount: number;
  error?: string;
}

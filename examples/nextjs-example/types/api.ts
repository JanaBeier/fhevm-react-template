/**
 * API Type Definitions
 *
 * TypeScript type definitions for API requests and responses
 */

import { EncryptedValue, HomomorphicOperation } from './fhe';

/**
 * Base API response
 */
export interface APIResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

/**
 * Encryption API request
 */
export interface EncryptRequest {
  value: number | boolean;
  type: 'euint32' | 'euint16' | 'euint8' | 'ebool';
}

/**
 * Encryption API response
 */
export interface EncryptResponse {
  success: boolean;
  encrypted?: EncryptedValue;
  message?: string;
  error?: string;
}

/**
 * Decryption API request
 */
export interface DecryptRequest {
  ciphertext: string;
  signature?: string;
  contractAddress?: string;
  userAddress?: string;
}

/**
 * Decryption API response
 */
export interface DecryptResponse {
  success: boolean;
  decrypted?: any;
  type?: string;
  message?: string;
  error?: string;
}

/**
 * Computation API request
 */
export interface ComputeRequest {
  operation: HomomorphicOperation;
  operands: EncryptedValue[];
}

/**
 * Computation API response
 */
export interface ComputeResponse {
  success: boolean;
  result?: EncryptedValue;
  operation?: HomomorphicOperation;
  operandCount?: number;
  message?: string;
  error?: string;
}

/**
 * Key management API response
 */
export interface KeyResponse {
  success: boolean;
  publicKey?: any;
  message?: string;
  error?: string;
}

/**
 * Transaction request
 */
export interface TransactionRequest {
  to: string;
  from?: string;
  data?: string;
  value?: string;
  gasLimit?: string;
}

/**
 * Transaction response
 */
export interface TransactionResponse {
  success: boolean;
  hash?: string;
  blockNumber?: number;
  from?: string;
  to?: string;
  error?: string;
}

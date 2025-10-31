/**
 * Validation Utilities
 *
 * Provides validation functions for FHEVM data types and operations
 */

import { EncryptedType } from '@/types/fhe';

/**
 * Validate value for euint32 type
 */
export function validateUint32(value: number): boolean {
  return Number.isInteger(value) && value >= 0 && value <= 4294967295;
}

/**
 * Validate value for euint16 type
 */
export function validateUint16(value: number): boolean {
  return Number.isInteger(value) && value >= 0 && value <= 65535;
}

/**
 * Validate value for euint8 type
 */
export function validateUint8(value: number): boolean {
  return Number.isInteger(value) && value >= 0 && value <= 255;
}

/**
 * Validate value based on encrypted type
 */
export function validateValueForType(value: number, type: EncryptedType): boolean {
  switch (type) {
    case 'euint32':
      return validateUint32(value);
    case 'euint16':
      return validateUint16(value);
    case 'euint8':
      return validateUint8(value);
    case 'ebool':
      return typeof value === 'boolean';
    default:
      return false;
  }
}

/**
 * Get the maximum value for an encrypted type
 */
export function getMaxValueForType(type: EncryptedType): number {
  switch (type) {
    case 'euint32':
      return 4294967295;
    case 'euint16':
      return 65535;
    case 'euint8':
      return 255;
    case 'ebool':
      return 1;
    default:
      return 0;
  }
}

/**
 * Validate ciphertext format
 */
export function validateCiphertext(ciphertext: string): boolean {
  try {
    // Basic validation - check if it's base64 encoded
    const decoded = atob(ciphertext);
    JSON.parse(decoded);
    return true;
  } catch {
    return false;
  }
}

/**
 * Validate encrypted value object
 */
export function validateEncryptedValue(value: any): boolean {
  return (
    value &&
    typeof value === 'object' &&
    typeof value.ciphertext === 'string' &&
    validateCiphertext(value.ciphertext) &&
    ['euint32', 'euint16', 'euint8', 'ebool'].includes(value.type)
  );
}

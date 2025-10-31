/**
 * Security Utilities
 *
 * Provides security-related helper functions for FHEVM applications
 */

/**
 * Sanitize user input to prevent XSS
 */
export function sanitizeInput(input: string): string {
  return input
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;');
}

/**
 * Validate Ethereum address format
 */
export function isValidAddress(address: string): boolean {
  return /^0x[a-fA-F0-9]{40}$/.test(address);
}

/**
 * Validate numeric input within range
 */
export function isValidNumber(
  value: string,
  min?: number,
  max?: number
): boolean {
  const num = parseFloat(value);

  if (isNaN(num)) {
    return false;
  }

  if (min !== undefined && num < min) {
    return false;
  }

  if (max !== undefined && num > max) {
    return false;
  }

  return true;
}

/**
 * Generate a random nonce
 */
export function generateNonce(): string {
  return Math.random().toString(36).substring(2, 15);
}

/**
 * Hash data using Web Crypto API
 */
export async function hashData(data: string): Promise<string> {
  const encoder = new TextEncoder();
  const dataBuffer = encoder.encode(data);
  const hashBuffer = await crypto.subtle.digest('SHA-256', dataBuffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

/**
 * Verify data integrity with hash
 */
export async function verifyHash(data: string, hash: string): Promise<boolean> {
  const computedHash = await hashData(data);
  return computedHash === hash;
}

/**
 * Key Management for FHEVM
 *
 * This module handles public/private key management for
 * FHE encryption and decryption operations.
 */

import { PublicKey, KeyPair } from '@/types/fhe';

/**
 * Fetch the public key from the FHEVM network
 */
export async function getPublicKey(): Promise<PublicKey> {
  try {
    const response = await fetch('/api/keys');
    const data = await response.json();

    if (!data.success) {
      throw new Error(data.error || 'Failed to fetch public key');
    }

    return data.publicKey;
  } catch (error) {
    throw new Error(
      error instanceof Error ? error.message : 'Failed to fetch public key'
    );
  }
}

/**
 * Generate a new key pair
 */
export async function generateKeyPair(): Promise<KeyPair> {
  try {
    const response = await fetch('/api/keys', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'generate' }),
    });

    const data = await response.json();

    if (!data.success) {
      throw new Error(data.error || 'Failed to generate key pair');
    }

    return {
      publicKey: data.publicKey,
      privateKey: '', // Private key is managed securely
    };
  } catch (error) {
    throw new Error(
      error instanceof Error ? error.message : 'Failed to generate key pair'
    );
  }
}

/**
 * Refresh the public key
 */
export async function refreshPublicKey(): Promise<PublicKey> {
  try {
    const response = await fetch('/api/keys', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'refresh' }),
    });

    const data = await response.json();

    if (!data.success) {
      throw new Error(data.error || 'Failed to refresh public key');
    }

    return data.publicKey;
  } catch (error) {
    throw new Error(
      error instanceof Error ? error.message : 'Failed to refresh public key'
    );
  }
}

/**
 * Validate a public key
 */
export function validatePublicKey(key: string): boolean {
  // In a real implementation, this would validate the key format
  return key && key.length > 0;
}

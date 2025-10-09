/**
 * FHEVM Client - Core SDK client for encryption/decryption
 */

import { ethers } from 'ethers';
import type { FhevmConfig, FhevmInstance, EncryptionResult, DecryptionParams } from './types';

export class FhevmClient {
  private config: FhevmConfig;
  private fhevmInstance: any; // fhevmjs instance
  private isInitialized: boolean = false;

  constructor(config: FhevmConfig) {
    this.config = config;
  }

  /**
   * Initialize the FHEVM instance
   */
  async init(): Promise<void> {
    if (this.isInitialized) {
      return;
    }

    try {
      // Dynamic import of fhevmjs
      const { createInstance } = await import('fhevmjs');

      const chainId = (await this.config.provider.getNetwork()).chainId;

      this.fhevmInstance = await createInstance({
        chainId,
        networkUrl: this.config.provider.connection?.url || '',
        gatewayUrl: this.config.gatewayUrl,
      });

      this.isInitialized = true;
    } catch (error) {
      throw new Error(`Failed to initialize FHEVM: ${error.message}`);
    }
  }

  /**
   * Encrypt a 32-bit unsigned integer
   */
  async encrypt32(value: number): Promise<EncryptionResult> {
    await this.ensureInitialized();

    const encrypted = this.fhevmInstance.encrypt32(value);

    return {
      ciphertext: encrypted,
      signature: await this.createSignature(encrypted),
    };
  }

  /**
   * Encrypt a 16-bit unsigned integer
   */
  async encrypt16(value: number): Promise<EncryptionResult> {
    await this.ensureInitialized();

    const encrypted = this.fhevmInstance.encrypt16(value);

    return {
      ciphertext: encrypted,
      signature: await this.createSignature(encrypted),
    };
  }

  /**
   * Encrypt an 8-bit unsigned integer
   */
  async encrypt8(value: number): Promise<EncryptionResult> {
    await this.ensureInitialized();

    const encrypted = this.fhevmInstance.encrypt8(value);

    return {
      ciphertext: encrypted,
      signature: await this.createSignature(encrypted),
    };
  }

  /**
   * Encrypt a boolean value
   */
  async encryptBool(value: boolean): Promise<EncryptionResult> {
    await this.ensureInitialized();

    const encrypted = this.fhevmInstance.encryptBool(value);

    return {
      ciphertext: encrypted,
      signature: await this.createSignature(encrypted),
    };
  }

  /**
   * Decrypt a value (requires user permission via EIP-712 signature)
   */
  async decrypt(params: DecryptionParams): Promise<number | boolean> {
    await this.ensureInitialized();

    // Create EIP-712 signature for decryption permission
    const signature = await this.createEIP712Signature(params);

    // Request decryption from gateway
    const decrypted = await this.fhevmInstance.decrypt(
      params.ciphertext,
      params.contractAddress,
      params.userAddress,
      signature
    );

    return decrypted;
  }

  /**
   * Create EIP-712 signature for decryption
   */
  async createEIP712Signature(params: any): Promise<string> {
    const signer = this.config.provider.getSigner();

    const domain = {
      name: 'FHEVM',
      version: '1',
      chainId: (await this.config.provider.getNetwork()).chainId,
      verifyingContract: params.contractAddress,
    };

    const types = {
      Decryption: [
        { name: 'ciphertext', type: 'bytes' },
        { name: 'userAddress', type: 'address' },
      ],
    };

    const value = {
      ciphertext: ethers.utils.hexlify(params.ciphertext),
      userAddress: params.userAddress,
    };

    const signature = await signer._signTypedData(domain, types, value);
    return signature;
  }

  /**
   * Get the public key for encryption
   */
  async getPublicKey(): Promise<string> {
    await this.ensureInitialized();
    return this.fhevmInstance.getPublicKey();
  }

  /**
   * Check if client is initialized
   */
  isReady(): boolean {
    return this.isInitialized;
  }

  /**
   * Ensure client is initialized
   */
  private async ensureInitialized(): Promise<void> {
    if (!this.isInitialized) {
      await this.init();
    }
  }

  /**
   * Create signature for encrypted data
   */
  private async createSignature(data: Uint8Array): Promise<string> {
    const signer = this.config.provider.getSigner();
    const message = ethers.utils.hexlify(data);
    return await signer.signMessage(message);
  }
}

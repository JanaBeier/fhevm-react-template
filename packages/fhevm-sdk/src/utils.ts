/**
 * Utility functions for FHEVM SDK
 */

import { ethers } from 'ethers';

/**
 * Convert encrypted data to hex string
 */
export function toHex(data: Uint8Array): string {
  return ethers.utils.hexlify(data);
}

/**
 * Convert hex string to Uint8Array
 */
export function fromHex(hex: string): Uint8Array {
  return ethers.utils.arrayify(hex);
}

/**
 * Format address with ellipsis
 */
export function formatAddress(address: string): string {
  if (!address) return '';
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
}

/**
 * Wait for transaction confirmation
 */
export async function waitForTransaction(
  tx: ethers.ContractTransaction,
  confirmations: number = 1
): Promise<ethers.ContractReceipt> {
  return await tx.wait(confirmations);
}

/**
 * Get network name from chain ID
 */
export function getNetworkName(chainId: number): string {
  const networks: Record<number, string> = {
    1: 'mainnet',
    5: 'goerli',
    11155111: 'sepolia',
    31337: 'localhost',
  };

  return networks[chainId] || 'unknown';
}

/**
 * Check if running in browser
 */
export function isBrowser(): boolean {
  return typeof window !== 'undefined';
}

/**
 * Get MetaMask provider
 */
export function getMetaMaskProvider(): any | null {
  if (!isBrowser()) return null;
  return (window as any).ethereum;
}

/**
 * Request MetaMask connection
 */
export async function connectMetaMask(): Promise<string[]> {
  const ethereum = getMetaMaskProvider();

  if (!ethereum) {
    throw new Error('MetaMask not installed');
  }

  const accounts = await ethereum.request({ method: 'eth_requestAccounts' });
  return accounts;
}

/**
 * Switch MetaMask network
 */
export async function switchNetwork(chainId: number): Promise<void> {
  const ethereum = getMetaMaskProvider();

  if (!ethereum) {
    throw new Error('MetaMask not installed');
  }

  try {
    await ethereum.request({
      method: 'wallet_switchEthereumChain',
      params: [{ chainId: `0x${chainId.toString(16)}` }],
    });
  } catch (error: any) {
    // Chain not added, try to add it
    if (error.code === 4902) {
      await addNetwork(chainId);
    } else {
      throw error;
    }
  }
}

/**
 * Add network to MetaMask
 */
export async function addNetwork(chainId: number): Promise<void> {
  const ethereum = getMetaMaskProvider();

  if (!ethereum) {
    throw new Error('MetaMask not installed');
  }

  const networks: Record<number, any> = {
    11155111: {
      chainId: '0xaa36a7',
      chainName: 'Sepolia',
      nativeCurrency: {
        name: 'Sepolia ETH',
        symbol: 'SEP',
        decimals: 18,
      },
      rpcUrls: ['https://rpc.sepolia.org'],
      blockExplorerUrls: ['https://sepolia.etherscan.io'],
    },
  };

  const networkConfig = networks[chainId];

  if (!networkConfig) {
    throw new Error(`Network ${chainId} not configured`);
  }

  await ethereum.request({
    method: 'wallet_addEthereumChain',
    params: [networkConfig],
  });
}

/**
 * Format big number to readable string
 */
export function formatBigNumber(value: ethers.BigNumber, decimals: number = 18): string {
  return ethers.utils.formatUnits(value, decimals);
}

/**
 * Parse string to big number
 */
export function parseBigNumber(value: string, decimals: number = 18): ethers.BigNumber {
  return ethers.utils.parseUnits(value, decimals);
}

/**
 * Check if address is valid
 */
export function isValidAddress(address: string): boolean {
  return ethers.utils.isAddress(address);
}

/**
 * Get checksummed address
 */
export function getChecksumAddress(address: string): string {
  return ethers.utils.getAddress(address);
}

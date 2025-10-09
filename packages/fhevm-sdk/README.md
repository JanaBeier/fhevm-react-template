# @fhevm-example/sdk

> Universal FHEVM SDK for building confidential dApps with Zama's Fully Homomorphic Encryption

## Features

✅ **Framework Agnostic** - Works with React, Vue, Next.js, or vanilla JavaScript
✅ **Type-Safe** - Full TypeScript support with comprehensive type definitions
✅ **React Hooks** - Ready-to-use hooks for React applications
✅ **Easy Integration** - Simple API similar to wagmi
✅ **Production Ready** - Optimized for performance and security

## Installation

```bash
npm install @fhevm-example/sdk fhevmjs ethers
```

## Quick Start

### React/Next.js

```tsx
import { FhevmProvider, useFhevm, useEncrypt } from '@fhevm-example/sdk';

// 1. Wrap your app with FhevmProvider
function App() {
  return (
    <FhevmProvider config={{ network: 'sepolia' }}>
      <YourComponent />
    </FhevmProvider>
  );
}

// 2. Use hooks in your components
function YourComponent() {
  const { isInitialized } = useFhevm();
  const { encrypt32, isEncrypting } = useEncrypt();

  const handleEncrypt = async () => {
    const encrypted = await encrypt32(1500);
    console.log('Encrypted:', encrypted);
  };

  if (!isInitialized) return <div>Initializing FHEVM...</div>;

  return (
    <button onClick={handleEncrypt} disabled={isEncrypting}>
      {isEncrypting ? 'Encrypting...' : 'Encrypt Value'}
    </button>
  );
}
```

### Vanilla JavaScript/Node.js

```javascript
import { FhevmClient } from '@fhevm-example/sdk';
import { ethers } from 'ethers';

// 1. Create provider
const provider = new ethers.providers.JsonRpcProvider('https://rpc.sepolia.org');

// 2. Initialize client
const client = new FhevmClient({
  provider,
  network: 'sepolia',
});

await client.init();

// 3. Encrypt values
const encrypted = await client.encrypt32(1500);
console.log('Encrypted:', encrypted);
```

## API Reference

### FhevmProvider

React context provider for FHEVM functionality.

```tsx
<FhevmProvider
  config={{
    provider: ethersProvider,  // Optional: Custom ethers provider
    network: 'sepolia',        // Network: 'sepolia' | 'localhost' | 'custom'
    contractAddress: '0x...',  // Optional: Default contract address
    gatewayUrl: '...'          // Optional: Custom gateway URL
  }}
>
  {children}
</FhevmProvider>
```

### useFhevm()

Access the FHEVM client instance.

```tsx
const { client, isInitialized, error } = useFhevm();
```

**Returns:**
- `client`: FhevmClient instance
- `isInitialized`: Boolean indicating if client is ready
- `error`: Error object if initialization failed

### useEncrypt()

Encrypt values using FHE.

```tsx
const { encrypt32, encrypt16, encrypt8, encryptBool, isEncrypting, error } = useEncrypt();
```

**Methods:**
- `encrypt32(value: number)`: Encrypt 32-bit unsigned integer
- `encrypt16(value: number)`: Encrypt 16-bit unsigned integer
- `encrypt8(value: number)`: Encrypt 8-bit unsigned integer
- `encryptBool(value: boolean)`: Encrypt boolean

**Example:**
```tsx
const encrypted = await encrypt32(1500);
// Returns: { ciphertext: Uint8Array, signature: string }
```

### useDecrypt()

Decrypt values with user permission (EIP-712 signature).

```tsx
const { decrypt, isDecrypting, error } = useDecrypt();
```

**Method:**
```tsx
const decrypted = await decrypt({
  contractAddress: '0x...',
  ciphertext: encryptedData,
  userAddress: '0x...'
});
```

### useContract()

Interact with smart contracts.

```tsx
const { contract, call, send, isLoading, error } = useContract({
  address: '0x...',
  abi: ContractABI,
});
```

**Methods:**
- `call(method, ...args)`: Read from contract
- `send(method, ...args)`: Send transaction to contract

**Example:**
```tsx
// Read
const value = await call('getTotalDevices');

// Write
const tx = await send('registerDevice', 'Smart Thermostat');
await tx.wait();
```

### FhevmClient

Core client for encryption/decryption.

```typescript
const client = new FhevmClient({
  provider: ethers.providers.Provider,
  network: 'sepolia' | 'localhost' | 'custom',
  contractAddress?: string,
  gatewayUrl?: string,
});

await client.init();

// Methods
await client.encrypt32(value: number): Promise<EncryptionResult>
await client.encrypt16(value: number): Promise<EncryptionResult>
await client.encrypt8(value: number): Promise<EncryptionResult>
await client.encryptBool(value: boolean): Promise<EncryptionResult>
await client.decrypt(params: DecryptionParams): Promise<number | boolean>
await client.getPublicKey(): Promise<string>
client.isReady(): boolean
```

## Utility Functions

```typescript
import {
  toHex,
  fromHex,
  formatAddress,
  waitForTransaction,
  getNetworkName,
  connectMetaMask,
  switchNetwork,
  isValidAddress,
  formatBigNumber,
  parseBigNumber,
} from '@fhevm-example/sdk';

// Convert encrypted data to hex
const hex = toHex(encryptedData);

// Format address
const short = formatAddress('0x1234567890123456789012345678901234567890');
// Returns: '0x1234...7890'

// Connect MetaMask
const accounts = await connectMetaMask();

// Switch network
await switchNetwork(11155111); // Sepolia
```

## Examples

See the `examples/` directory for complete working examples:

- **Next.js Example** - Full Next.js application
- **Power Optimizer** - Real-world energy analytics dApp
- **Vue Example** - Vue.js integration
- **Node.js Example** - Backend integration

## TypeScript Support

Full TypeScript support with type definitions included.

```typescript
import type {
  FhevmConfig,
  FhevmInstance,
  EncryptionResult,
  DecryptionParams,
  ContractConfig,
  EncryptedValue,
  DecryptedValue,
} from '@fhevm-example/sdk';
```

## Development

```bash
# Build SDK
npm run build

# Watch mode
npm run dev

# Run tests
npm test

# Lint code
npm run lint
```

## License

MIT License - See LICENSE file for details

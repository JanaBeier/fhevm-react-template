# Next.js FHEVM Example

> Complete Next.js application demonstrating FHEVM SDK integration

## Overview

This example shows how to integrate the `@fhevm-example/sdk` in a Next.js application, demonstrating:

- ✅ FhevmProvider setup in Next.js
- ✅ React hooks for encryption/decryption
- ✅ Smart contract interaction with encrypted data
- ✅ Client-side rendering with FHEVM
- ✅ TypeScript support

## Features

### 1. Encryption Demo

Demonstrates encrypting different data types:
- **euint32** - 32-bit unsigned integers (0 to 4,294,967,295)
- **euint16** - 16-bit unsigned integers (0 to 65,535)
- **euint8** - 8-bit unsigned integers (0 to 255)
- **ebool** - Boolean values (true/false)

### 2. Contract Interaction

Interact with the PowerConsumptionOptimizer smart contract:
- Register devices
- Update consumption data (encrypted)
- Query device information
- View total registered devices

## Quick Start

### Prerequisites

```bash
Node.js >= 18.0.0
MetaMask browser extension
Sepolia ETH (get from faucets)
```

### Installation

```bash
# Install dependencies
npm install

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Build for Production

```bash
npm run build
npm start
```

## Project Structure

```
nextjs-example/
├── pages/
│   ├── _app.tsx          # App wrapper with FhevmProvider
│   └── index.tsx         # Home page with tabs
├── components/
│   ├── EncryptDemo.tsx   # Encryption demonstration
│   └── ContractInteraction.tsx  # Contract interaction
├── styles/
│   └── globals.css       # Global styles
├── package.json
├── next.config.js
├── tsconfig.json
└── README.md
```

## Usage Examples

### Setup Provider

```tsx
// pages/_app.tsx
import { FhevmProvider } from '@fhevm-example/sdk';

export default function App({ Component, pageProps }) {
  return (
    <FhevmProvider config={{ network: 'sepolia' }}>
      <Component {...pageProps} />
    </FhevmProvider>
  );
}
```

### Use Encryption Hook

```tsx
// components/YourComponent.tsx
import { useEncrypt } from '@fhevm-example/sdk';

export default function YourComponent() {
  const { encrypt32, isEncrypting } = useEncrypt();

  const handleEncrypt = async () => {
    const encrypted = await encrypt32(1500);
    console.log('Encrypted:', encrypted);
  };

  return (
    <button onClick={handleEncrypt} disabled={isEncrypting}>
      Encrypt Value
    </button>
  );
}
```

### Use Contract Hook

```tsx
import { useContract } from '@fhevm-example/sdk';

const CONTRACT_ABI = [...];
const CONTRACT_ADDRESS = '0x...';

export default function ContractComponent() {
  const { call, send, isLoading } = useContract({
    address: CONTRACT_ADDRESS,
    abi: CONTRACT_ABI,
  });

  const registerDevice = async () => {
    const tx = await send('registerDevice', 'Smart Thermostat');
    await tx.wait();
  };

  const getTotal = async () => {
    const total = await call('totalDevices');
    console.log('Total devices:', total.toString());
  };

  return (
    <>
      <button onClick={registerDevice}>Register</button>
      <button onClick={getTotal}>Get Total</button>
    </>
  );
}
```

## Configuration

### Environment Variables

Create `.env.local` file (optional):

```env
NEXT_PUBLIC_CONTRACT_ADDRESS=0x71FA4921E376f40CAD0e122E287F20da8e6AE9B5
NEXT_PUBLIC_NETWORK=sepolia
```

### MetaMask Setup

1. Install MetaMask extension
2. Add Sepolia testnet
3. Get Sepolia ETH from faucets:
   - [Alchemy Faucet](https://sepoliafaucet.com/)
   - [Infura Faucet](https://www.infura.io/faucet/sepolia)
4. Connect MetaMask to the app

## Key Components

### FhevmProvider

Wraps the entire app to provide FHEVM functionality:

```tsx
<FhevmProvider
  config={{
    network: 'sepolia',  // or 'localhost', 'custom'
    contractAddress: '0x...',  // optional
    gatewayUrl: '...'  // optional
  }}
>
  {children}
</FhevmProvider>
```

### Hooks

**useFhevm()**
```tsx
const { client, isInitialized, error } = useFhevm();
```

**useEncrypt()**
```tsx
const { encrypt32, encrypt16, encrypt8, encryptBool, isEncrypting, error } = useEncrypt();
```

**useDecrypt()**
```tsx
const { decrypt, isDecrypting, error } = useDecrypt();
```

**useContract()**
```tsx
const { contract, call, send, isLoading, error } = useContract({ address, abi });
```

## Features Demonstrated

### Client-Side Encryption

All encryption happens in the browser before data is sent to the blockchain:

```tsx
const encrypted = await encrypt32(1500);
// encrypted.ciphertext: Uint8Array (never decrypted on-chain)
// encrypted.signature: string (for verification)
```

### Smart Contract Interaction

Send encrypted data to smart contracts:

```tsx
const tx = await send('updateConsumptionData', powerUsage, efficiencyScore);
await tx.wait();
```

### Permission-Based Decryption

Decrypt data with EIP-712 signatures:

```tsx
const decrypted = await decrypt({
  contractAddress: '0x...',
  ciphertext: encryptedData,
  userAddress: '0x...'
});
```

## Troubleshooting

### MetaMask Not Detected

Make sure MetaMask is installed and enabled.

### Wrong Network

Switch to Sepolia testnet in MetaMask.

### Initialization Failed

Check console for errors and ensure you're connected to Sepolia.

### Transaction Failed

Ensure you have enough Sepolia ETH for gas fees.

## Learning Resources

- [Zama Documentation](https://docs.zama.ai)
- [FHEVM Documentation](https://www.fhevm.io/)
- [Next.js Documentation](https://nextjs.org/docs)
- [SDK Documentation](../../packages/fhevm-sdk/README.md)

## License

MIT License

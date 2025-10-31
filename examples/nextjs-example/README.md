# Next.js FHEVM SDK Integration Example

> Complete Next.js 13+ application demonstrating FHEVM SDK integration with App Router

## Overview

This example demonstrates a production-ready integration of the FHEVM SDK in a Next.js application using the App Router architecture. It showcases:

- ✅ **App Router Structure** - Next.js 13+ with server and client components
- ✅ **SDK Integration** - Complete integration of @fhevm-example/sdk
- ✅ **React Hooks** - Custom hooks for encryption, decryption, and computation
- ✅ **API Routes** - Server-side FHE operations
- ✅ **Type Safety** - Full TypeScript support
- ✅ **Real-World Examples** - Banking and medical use cases

## Features

### 1. Encryption Demo

Demonstrates encrypting different data types using the SDK:

- **euint32** - 32-bit unsigned integers (0 to 4,294,967,295)
- **euint16** - 16-bit unsigned integers (0 to 65,535)
- **euint8** - 8-bit unsigned integers (0 to 255)
- **ebool** - Boolean values (true/false)

**Location**: `components/fhe/EncryptionDemo.tsx`

### 2. Computation Demo

Shows homomorphic computation on encrypted data:

- Addition on encrypted values
- Subtraction on encrypted values
- Multiplication on encrypted values
- Results remain encrypted

**Location**: `components/fhe/ComputationDemo.tsx`

### 3. Key Manager

Public key management interface:

- Fetch public encryption key
- Refresh keys
- View key information

**Location**: `components/fhe/KeyManager.tsx`

### 4. Banking Example

Privacy-preserving financial transactions:

- Encrypted account balances
- Deposit and withdrawal operations
- Transaction history
- Owner-only decryption

**Location**: `components/examples/BankingExample.tsx`

### 5. Medical Example

Healthcare data privacy demonstration:

- Encrypted medical records
- Heart rate, blood pressure, glucose tracking
- Privacy-compliant data handling
- HIPAA-friendly architecture

**Location**: `components/examples/MedicalExample.tsx`

## Project Structure

```
nextjs-example/
├── app/                          # Next.js App Router
│   ├── layout.tsx                # Root layout with FhevmProvider
│   ├── page.tsx                  # Main page with tabbed interface
│   ├── globals.css               # Global styles
│   └── api/                      # API Routes
│       ├── fhe/
│       │   ├── route.ts          # Main FHE endpoint
│       │   ├── encrypt/route.ts  # Encryption API
│       │   ├── decrypt/route.ts  # Decryption API
│       │   └── compute/route.ts  # Computation API
│       └── keys/route.ts         # Key management API
│
├── components/
│   ├── ui/                       # Base UI Components
│   │   ├── Button.tsx            # Reusable button with variants
│   │   ├── Input.tsx             # Input with validation
│   │   └── Card.tsx              # Card container
│   │
│   ├── fhe/                      # FHE Components
│   │   ├── FHEProvider.tsx       # FHE context provider
│   │   ├── EncryptionDemo.tsx    # Encryption demonstration
│   │   ├── ComputationDemo.tsx   # Computation demonstration
│   │   └── KeyManager.tsx        # Key management
│   │
│   └── examples/                 # Example Use Cases
│       ├── BankingExample.tsx    # Banking use case
│       └── MedicalExample.tsx    # Medical use case
│
├── lib/                          # Utility Libraries
│   ├── fhe/                      # FHE Integration
│   │   ├── client.ts             # Client-side operations
│   │   ├── server.ts             # Server-side operations
│   │   ├── keys.ts               # Key management
│   │   └── types.ts              # FHE type definitions
│   │
│   └── utils/                    # Helper Functions
│       ├── security.ts           # Security utilities
│       └── validation.ts         # Input validation
│
├── hooks/                        # Custom React Hooks
│   ├── useFHE.ts                 # Extended FHE hook
│   ├── useEncryption.ts          # Encryption utilities
│   └── useComputation.ts         # Computation utilities
│
├── types/                        # TypeScript Types
│   ├── fhe.ts                    # FHE type definitions
│   └── api.ts                    # API types
│
├── package.json
├── next.config.js
├── tsconfig.json
└── README.md
```

## Quick Start

### Prerequisites

```bash
Node.js >= 18.0.0
npm or yarn
MetaMask browser extension (for blockchain interaction)
```

### Installation

```bash
# Navigate to the example directory
cd examples/nextjs-example

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

## SDK Integration Guide

### 1. Setup Provider

Wrap your application with `FhevmProvider` in the root layout:

```tsx
// app/layout.tsx
import { FhevmProvider } from '@fhevm-example/sdk';

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <FhevmProvider config={{ network: 'sepolia' }}>
          {children}
        </FhevmProvider>
      </body>
    </html>
  );
}
```

### 2. Use Encryption Hook

```tsx
'use client';

import { useEncrypt } from '@fhevm-example/sdk';

export default function MyComponent() {
  const { encrypt32, isEncrypting } = useEncrypt();

  const handleEncrypt = async () => {
    const encrypted = await encrypt32(1500);
    console.log('Encrypted:', encrypted);
  };

  return (
    <button onClick={handleEncrypt} disabled={isEncrypting}>
      {isEncrypting ? 'Encrypting...' : 'Encrypt Value'}
    </button>
  );
}
```

### 3. Use Contract Hook

```tsx
import { useContract } from '@fhevm-example/sdk';
import { PowerConsumptionOptimizerABI } from './abis';

const CONTRACT_ADDRESS = '0x71FA4921E376f40CAD0e122E287F20da8e6AE9B5';

export default function ContractComponent() {
  const { call, send, isLoading } = useContract({
    address: CONTRACT_ADDRESS,
    abi: PowerConsumptionOptimizerABI,
  });

  const registerDevice = async () => {
    const tx = await send('registerDevice', 'Smart Thermostat');
    await tx.wait();
  };

  return (
    <button onClick={registerDevice} disabled={isLoading}>
      Register Device
    </button>
  );
}
```

### 4. Create API Routes

```typescript
// app/api/fhe/encrypt/route.ts
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  const { value, type } = await request.json();

  // Perform encryption
  const encrypted = await encryptValue(value, type);

  return NextResponse.json({
    success: true,
    encrypted,
  });
}
```

## Components Guide

### UI Components

**Button Component**
```tsx
import { Button } from '@/components/ui/Button';

<Button variant="primary" size="medium" onClick={handleClick}>
  Click Me
</Button>
```

**Input Component**
```tsx
import { Input } from '@/components/ui/Input';

<Input
  type="number"
  label="Amount"
  value={amount}
  onChange={(e) => setAmount(e.target.value)}
  error={errorMessage}
/>
```

**Card Component**
```tsx
import { Card } from '@/components/ui/Card';

<Card title="My Card" subtitle="Card description">
  <p>Card content</p>
</Card>
```

### FHE Components

All FHE components are pre-built and ready to use:

- `EncryptionDemo` - Interactive encryption demonstration
- `ComputationDemo` - Homomorphic computation examples
- `KeyManager` - Public key management interface

### Example Components

Use these as templates for your own applications:

- `BankingExample` - Financial privacy patterns
- `MedicalExample` - Healthcare data privacy

## API Routes

### Encryption Endpoint

**POST** `/api/fhe/encrypt`

```json
{
  "value": 1500,
  "type": "euint32"
}
```

Response:
```json
{
  "success": true,
  "encrypted": {
    "ciphertext": "...",
    "type": "euint32",
    "timestamp": 1234567890
  }
}
```

### Decryption Endpoint

**POST** `/api/fhe/decrypt`

```json
{
  "ciphertext": "...",
  "signature": "..."
}
```

### Computation Endpoint

**POST** `/api/fhe/compute`

```json
{
  "operation": "add",
  "operands": [
    { "ciphertext": "...", "type": "euint32" },
    { "ciphertext": "...", "type": "euint32" }
  ]
}
```

### Key Management Endpoint

**GET** `/api/keys`

Returns the public encryption key.

## Custom Hooks

### useFHE

Extended FHE operations:

```tsx
import { useFHE } from '@/hooks/useFHE';

const { isReady, isInitializing, error, client } = useFHE();
```

### useEncryption

Enhanced encryption with error handling:

```tsx
import { useEncryption } from '@/hooks/useEncryption';

const { encrypt, encryptBool, isEncrypting, error, clearError } = useEncryption();

// Encrypt with type specification
const encrypted = await encrypt(1500, 'euint32');
```

### useComputation

Homomorphic computation utilities:

```tsx
import { useComputation } from '@/hooks/useComputation';

const { compute, isComputing, error } = useComputation();

// Perform computation
const result = await compute('add', [encrypted1, encrypted2]);
```

## Type Definitions

All TypeScript types are available:

```typescript
import type {
  EncryptedType,
  EncryptedValue,
  FHEClientConfig,
  PublicKey,
  HomomorphicOperation,
  EncryptRequest,
  DecryptRequest,
} from '@/types/fhe';
```

## Environment Variables

Create `.env.local` (optional):

```env
NEXT_PUBLIC_CONTRACT_ADDRESS=0x71FA4921E376f40CAD0e122E287F20da8e6AE9B5
NEXT_PUBLIC_NETWORK=sepolia
```

## Configuration

### Next.js Config

```javascript
// next.config.js
const nextConfig = {
  reactStrictMode: true,
  webpack: (config) => {
    config.resolve.fallback = {
      fs: false,
      net: false,
      tls: false,
    };
    return config;
  },
};
```

### TypeScript Config

Path aliases configured for easy imports:

```json
{
  "compilerOptions": {
    "paths": {
      "@/*": ["./*"]
    }
  }
}
```

## Best Practices

### 1. Always Check Initialization

```tsx
const { isInitialized } = useFhevm();

if (!isInitialized) {
  return <div>Initializing FHEVM...</div>;
}
```

### 2. Handle Loading States

```tsx
<button disabled={isEncrypting || isLoading}>
  {isEncrypting ? 'Processing...' : 'Submit'}
</button>
```

### 3. Validate Inputs

```tsx
import { validateUint32 } from '@/lib/utils/validation';

if (!validateUint32(value)) {
  setError('Invalid value for euint32');
  return;
}
```

### 4. Implement Error Handling

```tsx
try {
  const encrypted = await encrypt32(value);
} catch (error) {
  console.error('Encryption failed:', error);
  setError(error.message);
}
```

### 5. Use Type Safety

```tsx
import type { EncryptedValue } from '@/types/fhe';

const [encrypted, setEncrypted] = useState<EncryptedValue | null>(null);
```

## Troubleshooting

### FHEVM Not Initializing

- Check network configuration
- Verify MetaMask is connected
- Ensure you're on Sepolia testnet

### Encryption Failing

- Validate input values for the encrypted type
- Check public key availability
- Verify client initialization

### Transaction Errors

- Ensure sufficient Sepolia ETH for gas
- Check contract address is correct
- Verify ABI matches the contract

## Performance Tips

1. **Initialize Once**: Set up FhevmProvider at the root
2. **Cache Results**: Store encrypted values to avoid re-encryption
3. **Batch Operations**: Combine multiple FHE operations when possible
4. **Lazy Load**: Use dynamic imports for heavy components

## Security Considerations

- ✅ Client-side encryption before blockchain submission
- ✅ Input sanitization for all user inputs
- ✅ Validation for encrypted types
- ✅ Secure key management
- ✅ Error messages don't leak sensitive data

## Learning Resources

- **Main Documentation**: [../../README.md](../../README.md)
- **SDK Documentation**: [../../packages/fhevm-sdk/README.md](../../packages/fhevm-sdk/README.md)
- **Integration Guide**: [../../docs/SDK_INTEGRATION.md](../../docs/SDK_INTEGRATION.md)
- **Zama Documentation**: [docs.zama.ai](https://docs.zama.ai)
- **FHEVM Documentation**: [fhevm.io](https://www.fhevm.io/)

## Support

For issues or questions:

- Review the example code and documentation
- Check the SDK documentation
- Consult Zama resources
- Join the Zama Discord community

## License

MIT License - See LICENSE file for details

---

**Built with Zama FHEVM** - Empowering privacy-preserving applications

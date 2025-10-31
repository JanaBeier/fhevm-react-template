# FHEVM SDK Integration Guide

This guide explains how the FHEVM SDK is integrated throughout this template repository.

## Project Structure

The repository follows the structure recommended in the requirements:

```
fhevm-react-template/
├── packages/
│   └── fhevm-sdk/                   # Core SDK package
│       ├── src/
│       │   ├── core/                # (Included in client.ts)
│       │   ├── hooks/               # React hooks
│       │   ├── types.ts             # Type definitions
│       │   ├── utils.ts             # Utility functions
│       │   ├── client.ts            # Core FHEVM client
│       │   ├── provider.tsx         # React context provider
│       │   └── index.ts             # Main entry point
│       ├── package.json
│       ├── README.md
│       └── tsconfig.json
│
├── templates/                       # Reference to example templates
│   └── README.md                   # Templates documentation
│
├── examples/                        # Example implementations
│   ├── nextjs-example/             # Complete Next.js example
│   │   ├── app/                    # App Router (Next.js 13+)
│   │   │   ├── layout.tsx          # Root layout with FhevmProvider
│   │   │   ├── page.tsx            # Home page
│   │   │   ├── globals.css         # Global styles
│   │   │   └── api/                # API routes
│   │   │       ├── fhe/
│   │   │       │   ├── route.ts    # Main FHE endpoint
│   │   │       │   ├── encrypt/    # Encryption endpoint
│   │   │       │   ├── decrypt/    # Decryption endpoint
│   │   │       │   └── compute/    # Computation endpoint
│   │   │       └── keys/route.ts   # Key management
│   │   │
│   │   ├── components/             # React components
│   │   │   ├── ui/                 # Base UI components
│   │   │   │   ├── Button.tsx
│   │   │   │   ├── Input.tsx
│   │   │   │   └── Card.tsx
│   │   │   ├── fhe/                # FHE functionality components
│   │   │   │   ├── FHEProvider.tsx
│   │   │   │   ├── EncryptionDemo.tsx
│   │   │   │   ├── ComputationDemo.tsx
│   │   │   │   └── KeyManager.tsx
│   │   │   └── examples/           # Use case examples
│   │   │       ├── BankingExample.tsx
│   │   │       └── MedicalExample.tsx
│   │   │
│   │   ├── lib/                    # Utility libraries
│   │   │   ├── fhe/                # FHE integration library
│   │   │   │   ├── client.ts       # Client-side FHE operations
│   │   │   │   ├── server.ts       # Server-side FHE operations
│   │   │   │   ├── keys.ts         # Key management
│   │   │   │   └── types.ts        # Type definitions
│   │   │   └── utils/              # Utility functions
│   │   │       ├── security.ts
│   │   │       └── validation.ts
│   │   │
│   │   ├── hooks/                  # Custom React hooks
│   │   │   ├── useFHE.ts
│   │   │   ├── useEncryption.ts
│   │   │   └── useComputation.ts
│   │   │
│   │   ├── types/                  # TypeScript types
│   │   │   ├── fhe.ts
│   │   │   └── api.ts
│   │   │
│   │   └── README.md               # Next.js example docs
│   │
│   └── power-optimizer/            # Smart contract example
│       └── README.md               # Smart contract docs
│
├── docs/                           # Documentation
│   ├── ARCHITECTURE.md
│   ├── DEPLOYMENT_GUIDE.md
│   ├── TESTING_GUIDE.md
│   └── SDK_INTEGRATION.md (this file)
│
└── README.md                       # Main project documentation
```

## Core SDK Components

### 1. FHEVM Client (`packages/fhevm-sdk/src/client.ts`)

The core client provides framework-agnostic FHE operations:

- **Initialization**: Connect to FHEVM network
- **Encryption**: `encrypt32()`, `encrypt16()`, `encrypt8()`, `encryptBool()`
- **Decryption**: `decrypt()` with EIP-712 signatures
- **Key Management**: `getPublicKey()`

### 2. React Hooks (`packages/fhevm-sdk/src/hooks/`)

Ready-to-use React hooks:

- **useFhevm**: Access FHEVM client instance
- **useEncrypt**: Encrypt data client-side
- **useDecrypt**: Decrypt with user permission
- **useContract**: Interact with smart contracts

### 3. Provider (`packages/fhevm-sdk/src/provider.tsx`)

React Context Provider for sharing FHEVM state across components.

### 4. Types (`packages/fhevm-sdk/src/types.ts`)

Complete TypeScript type definitions for all SDK operations.

### 5. Utilities (`packages/fhevm-sdk/src/utils.ts`)

Helper functions for common operations.

## Next.js Example Integration

The `examples/nextjs-example/` demonstrates complete SDK integration:

### App Router Structure

Following Next.js 13+ App Router pattern:

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

### Component Integration

Components use SDK hooks for FHE operations:

```tsx
// components/fhe/EncryptionDemo.tsx
import { useEncrypt } from '@fhevm-example/sdk';

export const EncryptionDemo = () => {
  const { encrypt32, isEncrypting } = useEncrypt();

  const handleEncrypt = async () => {
    const encrypted = await encrypt32(1500);
    console.log('Encrypted:', encrypted);
  };

  return (
    <button onClick={handleEncrypt} disabled={isEncrypting}>
      {isEncrypting ? 'Encrypting...' : 'Encrypt'}
    </button>
  );
};
```

### API Routes

Server-side API routes for FHE operations:

- `/api/fhe/encrypt` - Encryption endpoint
- `/api/fhe/decrypt` - Decryption endpoint
- `/api/fhe/compute` - Homomorphic computation
- `/api/keys` - Key management

### Custom Hooks

Additional hooks built on top of SDK:

- `useFHE()` - Extended FHE operations
- `useEncryption()` - Enhanced encryption with error handling
- `useComputation()` - Homomorphic computation utilities

### Utility Libraries

Helper functions for common tasks:

- **lib/fhe/client.ts** - Client-side FHE operations
- **lib/fhe/server.ts** - Server-side FHE operations
- **lib/fhe/keys.ts** - Key management utilities
- **lib/utils/security.ts** - Security helpers
- **lib/utils/validation.ts** - Input validation

## Example Use Cases

### Banking Example

Demonstrates privacy-preserving financial transactions:

- Encrypted account balances
- Private transaction amounts
- Owner-only decryption

### Medical Example

Shows healthcare data privacy:

- Encrypted medical records
- Private health metrics
- HIPAA-compliant data handling

## Getting Started

### 1. Install Dependencies

```bash
cd examples/nextjs-example
npm install
```

### 2. Run Development Server

```bash
npm run dev
```

### 3. Open Browser

Navigate to [http://localhost:3000](http://localhost:3000)

## Key Features Demonstrated

1. **Client-Side Encryption**: All data encrypted before blockchain submission
2. **Homomorphic Computation**: Calculations on encrypted data
3. **Permission-Based Decryption**: Only authorized users can decrypt
4. **Type Safety**: Full TypeScript support
5. **React Integration**: Seamless hooks-based API
6. **API Routes**: Server-side FHE operations
7. **Real-World Examples**: Banking and medical use cases

## Best Practices

### 1. Initialize Once

Initialize FHEVM at the app root:

```tsx
<FhevmProvider config={{ network: 'sepolia' }}>
  <App />
</FhevmProvider>
```

### 2. Check Initialization Status

Always check if FHEVM is ready:

```tsx
const { isInitialized } = useFhevm();

if (!isInitialized) {
  return <div>Initializing...</div>;
}
```

### 3. Handle Errors

Implement proper error handling:

```tsx
const { encrypt32, error } = useEncrypt();

if (error) {
  console.error('Encryption error:', error);
}
```

### 4. Validate Inputs

Validate data before encryption:

```tsx
import { validateUint32 } from '@/lib/utils/validation';

if (!validateUint32(value)) {
  throw new Error('Invalid value for euint32');
}
```

### 5. Manage Loading States

Show loading indicators during operations:

```tsx
const { encrypt32, isEncrypting } = useEncrypt();

<button disabled={isEncrypting}>
  {isEncrypting ? 'Encrypting...' : 'Encrypt'}
</button>
```

## Architecture Benefits

### Framework Agnostic Core

The SDK core is framework-independent, allowing use with:

- React
- Vue
- Next.js
- Node.js
- Vanilla JavaScript

### Wagmi-Style API

Familiar API for Web3 developers:

```tsx
// Similar to wagmi hooks
const { encrypt32 } = useEncrypt();
const { call, send } = useContract({ address, abi });
```

### Type Safety

Full TypeScript support with comprehensive types:

```typescript
import type { EncryptedValue, FHEClientConfig } from '@fhevm-example/sdk';
```

### Modular Design

Import only what you need:

```typescript
import { useEncrypt } from '@fhevm-example/sdk';
// or
import { FhevmClient } from '@fhevm-example/sdk';
```

## Testing

The example includes comprehensive testing patterns:

- Unit tests for utility functions
- Integration tests for SDK hooks
- E2E tests for complete workflows

## Deployment

The example is production-ready with:

- Optimized builds
- Environment configuration
- Security best practices
- Performance monitoring

## Resources

- **Main Documentation**: [README.md](../README.md)
- **SDK Documentation**: [packages/fhevm-sdk/README.md](../packages/fhevm-sdk/README.md)
- **Next.js Example**: [examples/nextjs-example/README.md](../examples/nextjs-example/README.md)
- **Architecture Guide**: [ARCHITECTURE.md](./ARCHITECTURE.md)
- **Deployment Guide**: [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md)

## Support

For issues or questions:

- Check the documentation
- Review example code
- Consult Zama resources at [docs.zama.ai](https://docs.zama.ai)

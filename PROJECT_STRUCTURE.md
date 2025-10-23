# FHEVM SDK Project Structure

> Monorepo structure with SDK and multiple examples

## 📁 Directory Structure

```
fhevm-react-template/
├── packages/
│   └── fhevm-sdk/                    # Universal FHEVM SDK
│       ├── src/
│       │   ├── index.ts              # Main exports
│       │   ├── client.ts             # FhevmClient class
│       │   ├── provider.tsx          # React Provider
│       │   ├── types.ts              # TypeScript types
│       │   ├── utils.ts              # Utility functions
│       │   └── hooks/
│       │       ├── useFhevm.ts       # Access client
│       │       ├── useEncrypt.ts     # Encrypt values
│       │       ├── useDecrypt.ts     # Decrypt values
│       │       └── useContract.ts    # Contract interaction
│       ├── package.json
│       ├── tsconfig.json
│       └── README.md
│
├── examples/
│   ├── nextjs-example/               # Next.js example (TO BE CREATED)
│   │   ├── pages/
│   │   ├── components/
│   │   ├── package.json
│   │   └── README.md
│   │
│   └── power-optimizer/              # Power Optimizer dApp (TO BE MOVED)
│       ├── contracts/
│       ├── scripts/
│       ├── test/
│       ├── package.json
│       └── README.md
│
├── contracts/                         # Smart contracts (current location)
├── scripts/                           # Deployment scripts (current location)
├── test/                              # Tests (current location)
├── hardhat.config.js
├── package.json                       # Root package.json
├── README.md                          # Main README
└── Documentation files...
```

## 🔧 SDK Package (`packages/fhevm-sdk`)

### Core Files

**client.ts** - FhevmClient class
- `init()` - Initialize FHEVM instance
- `encrypt32/16/8()` - Encrypt values
- `encryptBool()` - Encrypt booleans
- `decrypt()` - Decrypt with EIP-712 signature
- `getPublicKey()` - Get encryption public key

**provider.tsx** - React Context Provider
- `FhevmProvider` - Wrap your app
- `useFhevmContext()` - Access context

**hooks/** - React Hooks
- `useFhevm()` - Access FHEVM client
- `useEncrypt()` - Encrypt values easily
- `useDecrypt()` - Decrypt with permission
- `useContract()` - Interact with contracts

**utils.ts** - Utility Functions
- `toHex/fromHex` - Data conversion
- `formatAddress` - Address formatting
- `connectMetaMask` - Wallet connection
- `switchNetwork` - Network switching

## 📦 Installation & Usage

### Install SDK

```bash
cd packages/fhevm-sdk
npm install
npm run build
```

### Use in React/Next.js

```tsx
import { FhevmProvider, useFhevm, useEncrypt } from '@fhevm-example/sdk';

function App() {
  return (
    <FhevmProvider config={{ network: 'sepolia' }}>
      <MyComponent />
    </FhevmProvider>
  );
}

function MyComponent() {
  const { isInitialized } = useFhevm();
  const { encrypt32 } = useEncrypt();

  // Use encryption
  const encrypted = await encrypt32(1500);
}
```

### Use in Node.js

```javascript
import { FhevmClient } from '@fhevm-example/sdk';
import { ethers } from 'ethers';

const provider = new ethers.providers.JsonRpcProvider('...');
const client = new FhevmClient({ provider, network: 'sepolia' });

await client.init();
const encrypted = await client.encrypt32(1500);
```

## 🎯 Examples

### Next.js Example (TO BE CREATED)

Full Next.js application demonstrating:
- SDK integration
- Page routing with FHEVM
- Components with encryption/decryption
- Server-side rendering considerations

### Power Optimizer Example (CURRENT CONTENT)

Real-world energy analytics dApp:
- Smart contract: `PowerConsumptionOptimizer.sol`
- FHE operations: encrypt/decrypt power consumption
- Complete testing suite (51 tests)
- Deployed on Sepolia

## 🚀 Quick Start

### 1. Install Root Dependencies

```bash
npm install
```

### 2. Build SDK

```bash
cd packages/fhevm-sdk
npm install
npm run build
```

### 3. Run Example

```bash
# Next.js example
cd examples/nextjs-example
npm install
npm run dev

# Power Optimizer
cd examples/power-optimizer
npm install
npm run compile
npm test
```

## 📖 API Documentation

See `packages/fhevm-sdk/README.md` for complete API documentation.

### Key APIs

**FhevmClient**
```typescript
const client = new FhevmClient({ provider, network: 'sepolia' });
await client.init();
const encrypted = await client.encrypt32(value);
```

**React Hooks**
```typescript
const { client, isInitialized } = useFhevm();
const { encrypt32, isEncrypting } = useEncrypt();
const { decrypt, isDecrypting } = useDecrypt();
const { call, send, isLoading } = useContract({ address, abi });
```

**Utilities**
```typescript
import { formatAddress, connectMetaMask, switchNetwork } from '@fhevm-example/sdk';
```

## 🏗️ Development

### Build SDK

```bash
cd packages/fhevm-sdk
npm run build      # Build once
npm run dev        # Watch mode
```

### Run Tests

```bash
npm run test --workspaces
```

### Lint Code

```bash
npm run lint --workspaces
```

## 📝 Notes

### Current State

✅ **SDK Package**: Fully implemented
- Client, Provider, Hooks, Utils all created
- TypeScript support with type definitions
- React hooks for easy integration

⏳ **Next.js Example**: TO BE CREATED
- Need to create Next.js app structure
- Integrate SDK
- Add example pages and components

⏳ **Power Optimizer**: TO BE MOVED
- Currently in root directory
- Need to move to `examples/power-optimizer/`
- Already has complete implementation

### Migration Steps

1. Create `examples/power-optimizer/` directory
2. Move contracts, scripts, test to it
3. Create separate `package.json` for it
4. Update imports to use `@fhevm-example/sdk`
5. Create Next.js example application
6. Update root README with new structure

## 🎯 Competition Requirements

✅ **Universal SDK Package** - `packages/fhevm-sdk`
✅ **Framework Agnostic** - Works with React, Vue, Node.js
✅ **Modular API** - Hooks and standalone functions
✅ **TypeScript Support** - Full type definitions
⏳ **Multiple Examples** - Next.js + Power Optimizer
⏳ **Clear Documentation** - SDK README complete

## 📄 License

MIT License

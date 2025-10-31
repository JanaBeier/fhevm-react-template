# FHEVM Templates

This directory contains ready-to-use templates for building privacy-preserving applications with FHEVM.

## Available Templates

### Next.js Template

Location: `../examples/nextjs-example/`

A complete Next.js application demonstrating FHEVM SDK integration with:

- App Router (Next.js 13+) structure
- React hooks for encryption and contract interaction
- API routes for server-side FHE operations
- UI components for building privacy-preserving interfaces
- Example use cases (Banking and Medical)

**Quick Start:**
```bash
cd examples/nextjs-example
npm install
npm run dev
```

### Power Optimizer Template

Location: `../examples/power-optimizer/`

A production-ready smart contract example showing:

- Encrypted data storage and management
- Homomorphic computation on encrypted values
- Permission-based access control
- Complete testing suite

**Quick Start:**
```bash
cd examples/power-optimizer
npm install
npm test
npm run deploy
```

## Using Templates

Each template can be used as a starting point for your own FHEVM application:

1. Copy the template directory to your project location
2. Install dependencies: `npm install`
3. Configure environment variables
4. Start building your privacy-preserving application

## Documentation

For detailed documentation on each template, see the README file in each template directory.

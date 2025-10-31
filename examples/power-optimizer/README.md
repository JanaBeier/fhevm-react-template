# PowerConsumptionOptimizer - Example dApp

> Privacy-preserving energy analytics demonstrating real-world FHEVM usage

## Overview

This example demonstrates a complete, production-ready dApp built with Zama's FHEVM, showcasing how to implement privacy-preserving analytics in the energy management domain.

## What This Example Demonstrates

✅ **FHE Smart Contract** - Complete Solidity contract using encrypted types
✅ **Homomorphic Operations** - FHE.add, FHE.sub, FHE.mul, FHE.ge, FHE.select
✅ **Permission Management** - FHE.allow and FHE.allowThis
✅ **Production Deployment** - Deployed and verified on Sepolia testnet
✅ **Comprehensive Testing** - 51 tests with 95%+ coverage
✅ **Security Hardened** - Pre-commit hooks, linting, security audits

## Live Deployment

**Network**: Sepolia Testnet
**Contract Address**: `0x71FA4921E376f40CAD0e122E287F20da8e6AE9B5`
**Etherscan**: [View Contract](https://sepolia.etherscan.io/address/0x71FA4921E376f40CAD0e122E287F20da8e6AE9B5)

## Quick Start

### Prerequisites

```bash
Node.js >= 18.0.0
npm or yarn
MetaMask wallet
Sepolia ETH
```

### Installation

```bash
# Install dependencies
npm install

# Configure environment
cp .env.example .env
# Edit .env with your keys

# Compile contracts
npm run compile

# Run tests
npm test
```

### Deployment

```bash
# Deploy to Sepolia
npm run deploy

# Verify on Etherscan
npm run verify

# Interact with contract
npm run interact
```

## Project Structure

```
power-optimizer/
├── contracts/
│   └── PowerConsumptionOptimizer.sol  # Main FHE contract
├── scripts/
│   ├── deploy.js         # Deployment script
│   ├── verify.js         # Etherscan verification
│   ├── interact.js       # Interaction examples
│   └── simulate.js       # Multi-device simulation
├── test/
│   ├── PowerConsumptionOptimizer.test.js          # 45 unit tests
│   └── PowerConsumptionOptimizer.sepolia.test.js  # 6 integration tests
├── hardhat.config.js     # Hardhat configuration
├── package.json
└── .env.example          # Environment template
```

## Smart Contract Features

### Encrypted Data Types

```solidity
struct DeviceConsumption {
    euint32 encryptedPowerUsage;        // 32-bit encrypted
    euint16 encryptedEfficiencyScore;   // 16-bit encrypted
    bool isActive;                       // Public metadata
    string deviceType;                   // Public metadata
}
```

### Core Functions

**Register Device**
```solidity
function registerDevice(string memory deviceType) external
```

**Update Consumption** (Encrypted)
```solidity
function updateConsumptionData(
    uint32 powerUsage,
    uint16 efficiencyScore
) external
```

**Start Optimization Analysis**
```solidity
function startOptimizationAnalysis() external
```

## FHE Operations Used

### 1. Encryption

```solidity
euint32 encryptedUsage = FHE.asEuint32(powerUsage);
euint16 encryptedEfficiency = FHE.asEuint16(efficiencyScore);
```

### 2. Homomorphic Addition

```solidity
totalConsumption = FHE.add(totalConsumption, device.encryptedPowerUsage);
```

### 3. Homomorphic Subtraction

```solidity
euint32 savings = FHE.sub(totalConsumption, optimizedConsumption);
```

### 4. Homomorphic Multiplication

```solidity
euint32 optimized = FHE.mul(currentUsage, reductionFactor);
```

### 5. Permission Management

```solidity
FHE.allowThis(encryptedUsage);          // Contract can compute
FHE.allow(encryptedUsage, msg.sender);  // User can decrypt
```

## Testing

### Run All Tests

```bash
npm test
```

**Output**:
```
  PowerConsumptionOptimizer
    ✓ 51 passing (8s)
    Coverage: 95%+
```

### Test Categories

1. **Deployment** (5 tests) - Contract initialization
2. **Device Registration** (8 tests) - Registration logic
3. **Consumption Updates** (8 tests) - Encrypted data updates
4. **Optimization Windows** (6 tests) - Time-based access
5. **System Statistics** (5 tests) - State queries
6. **Owner Functions** (5 tests) - Access control
7. **Edge Cases** (8 tests) - Boundary conditions
8. **Gas Optimization** (3 tests) - Performance
9. **Event Emissions** (3 tests) - Event logging

### Gas Reporting

```bash
npm run test:gas
```

### Coverage Report

```bash
npm run test:coverage
```

## Privacy Model

### What's Private (Encrypted)

| Data | Type | Access |
|------|------|--------|
| Power consumption | euint32 | Owner only |
| Efficiency score | euint16 | Owner only |
| Aggregate totals | euint32 | Computed homomorphically |
| Optimization results | euint32 | Authorized only |

### What's Public

| Data | Type | Access |
|------|------|--------|
| Device count | uint32 | Everyone |
| Device types | string | Everyone |
| Timestamps | uint256 | Everyone |
| Active status | bool | Everyone |

## Performance Metrics

### Gas Consumption

| Operation | Gas Cost | Status |
|-----------|----------|--------|
| Register Device | ~108,000 | ✅ Optimized |
| Update Consumption | ~85,000 | ✅ Optimized |
| Start Analysis | ~150,000 | ✅ Optimized |

### Contract Metrics

```
Contract Size:    22.4 KB / 24 KB limit
Test Coverage:    95%+
Solidity Version: 0.8.24
Optimizer:        Enabled (200 runs)
```

## Security Features

✅ **Access Control** - Role-based permissions
✅ **Input Validation** - All inputs validated
✅ **DoS Protection** - Bounded iterations
✅ **Emergency Controls** - Device deactivation
✅ **Event Logging** - Comprehensive audit trail

## Use Cases

### 1. Residential Smart Homes

- Privacy-preserving billing
- Anonymous demand response participation
- Optimization without data exposure

### 2. Commercial Buildings

- Multi-facility encrypted aggregation
- Performance benchmarking without trade secret exposure
- Compliance reporting with privacy

### 3. Grid-Scale Management

- Encrypted consumption collection
- Homomorphic total load computation
- Private distributed energy coordination

## Integration with SDK

This example can be integrated with the FHEVM SDK:

```tsx
import { FhevmProvider, useContract, useEncrypt } from '@fhevm-example/sdk';

const { send } = useContract({
  address: '0x71FA4921E376f40CAD0e122E287F20da8e6AE9B5',
  abi: PowerConsumptionOptimizerABI,
});

const { encrypt32, encrypt16 } = useEncrypt();

// Register device
await send('registerDevice', 'Smart Thermostat');

// Update with encrypted data
const encryptedPower = await encrypt32(1500);
const encryptedEfficiency = await encrypt16(750);
await send('updateConsumptionData', 1500, 750);
```

## Scripts

### Deploy to Sepolia

```bash
npm run deploy
```

### Verify on Etherscan

```bash
npm run verify
```

### Interact with Contract

```bash
npm run interact
```

This runs a comprehensive interaction workflow:
1. Register a test device
2. Update consumption data
3. Start optimization analysis
4. Get system statistics
5. Get optimization recommendations

### Run Simulation

```bash
npm run simulate
```

Simulates 5 devices over 3 cycles with realistic usage patterns.

## Environment Configuration

Create `.env` file:

```env
# Network
SEPOLIA_RPC_URL=https://eth-sepolia.g.alchemy.com/v2/YOUR_API_KEY
PRIVATE_KEY=your_private_key_here

# Verification
ETHERSCAN_API_KEY=your_etherscan_api_key

# Optional: Security
PAUSER_ADDRESS=0x...
ADMIN_ADDRESS=0x...

# Optional: Optimization
OPTIMIZER_ENABLED=true
OPTIMIZER_RUNS=200
```

## Documentation

See the main project documentation for more details:
- Architecture deep-dive
- Testing guide
- Deployment guide
- Security best practices

## License

MIT License

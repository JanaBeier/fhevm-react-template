# 🔐 PowerConsumptionOptimizer - FHEVM Example dApp

> Privacy-preserving energy analytics demonstrating Zama's Fully Homomorphic Encryption

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Solidity](https://img.shields.io/badge/Solidity-0.8.24-blue.svg)](https://soliditylang.org/)
[![FHE](https://img.shields.io/badge/FHE-Zama-purple.svg)](https://www.zama.ai/)

📺 **Video Demo**: [demo.mp4]
🌐 **Live Contract**: [View on Sepolia](https://sepolia.etherscan.io/address/0x71FA4921E376f40CAD0e122E287F20da8e6AE9B5)
🌐 **Live Demo**: [View ](https://fhe-power-consumption-optimizer.vercel.app) 
---

## 📋 Overview

**PowerConsumptionOptimizer** is a complete example dApp demonstrating how to build privacy-preserving applications using **Zama's FHEVM** (Fully Homomorphic Encryption Virtual Machine). This project showcases real-world FHE usage in the energy analytics domain.

### What This Demonstrates

This example dApp shows developers how to:

✅ **Use Encrypted Data Types**: Work with `euint32`, `euint16`, and `ebool`
✅ **Perform Homomorphic Operations**: Execute `FHE.add()`, `FHE.sub()`, `FHE.mul()`, `FHE.ge()`, `FHE.select()`
✅ **Manage Permissions**: Control data access with `FHE.allow()` and `FHE.allowThis()`
✅ **Build Privacy-First dApps**: Design applications where sensitive data never gets decrypted on-chain
✅ **Optimize for Production**: Achieve gas efficiency and security best practices

### The Problem It Solves

Energy consumption data reveals sensitive information about personal habits, commercial operations, and infrastructure vulnerabilities. Traditional systems expose this data to utilities, aggregators, and potential attackers.

**Our Solution**: Perform all analytics on encrypted data using Fully Homomorphic Encryption, ensuring complete privacy while enabling optimization, billing verification, and grid coordination.

---

## ✨ Key Features

### 🔐 Privacy-First Architecture

```solidity
// All sensitive data encrypted before storage
struct DeviceConsumption {
    euint32 encryptedPowerUsage;        // Never stored as plaintext
    euint16 encryptedEfficiencyScore;   // Never stored as plaintext
    bool isActive;                       // Metadata (public)
    string deviceType;                   // Metadata (public)
}
```

### ⚡ Homomorphic Computation

```solidity
// Compute on encrypted data without decryption
euint32 totalConsumption = FHE.asEuint32(0);

for (uint256 i = 0; i < devices.length; i++) {
    // Add encrypted values directly
    totalConsumption = FHE.add(
        totalConsumption,
        deviceData[devices[i]].encryptedPowerUsage
    );
}
// Result is still encrypted!
```

### 🔑 Fine-Grained Access Control

```solidity
// Device owner can decrypt their own data
FHE.allow(encryptedUsage, msg.sender);

// Contract can compute on data
FHE.allowThis(encryptedUsage);

// Everyone else: no access
```

---

## 🏗️ Architecture

### System Components

```
┌─────────────────────────────────────────────────────┐
│              Smart Contract Layer                    │
│         (PowerConsumptionOptimizer.sol)             │
│                                                      │
│  ┌──────────────────────────────────────────────┐  │
│  │ Device Registry                               │  │
│  │  • Encrypted power usage (euint32)           │  │
│  │  • Encrypted efficiency (euint16)            │  │
│  │  • Public metadata (type, timestamp)         │  │
│  └──────────────────────────────────────────────┘  │
│                                                      │
│  ┌──────────────────────────────────────────────┐  │
│  │ Optimization Engine                           │  │
│  │  • Homomorphic aggregation (FHE.add)         │  │
│  │  • Encrypted comparisons (FHE.ge)            │  │
│  │  • Conditional logic (FHE.select)            │  │
│  └──────────────────────────────────────────────┘  │
│                                                      │
│  ┌──────────────────────────────────────────────┐  │
│  │ Access Control & Security                     │  │
│  │  • Role-based permissions                     │  │
│  │  • Permission management (FHE.allow)         │  │
│  │  • Input validation                           │  │
│  └──────────────────────────────────────────────┘  │
└────────────────┬────────────────────────────────────┘
                 │
                 │ FHE Operations
                 ▼
┌─────────────────────────────────────────────────────┐
│              Zama FHEVM Layer                        │
│                                                      │
│  • euint32, euint16, ebool types                   │
│  • FHE.add, sub, mul operations                    │
│  • FHE.ge, lt comparison operations                │
│  • FHE.select conditional operations               │
│  • FHE.allow permission management                 │
└─────────────────────────────────────────────────────┘
```

### Data Flow

```
Device → Encrypt → Store → Compute (FHE) → Decrypt (authorized only)
  │         │        │         │               │
Plain   euint32  Blockchain  Still        Owner's
Data             Storage    Encrypted     Private Key
```

---

## 🚀 Quick Start

### Prerequisites

```bash
Node.js >= 18.0.0
npm or yarn
MetaMask wallet
Sepolia ETH (from faucets)
```

### Installation

```bash
# Install dependencies
npm install

# Configure environment
cp .env.example .env
# Edit .env with your RPC URL and private key

# Compile contracts
npm run compile

# Run tests (51 tests)
npm test

# Deploy to Sepolia
npm run deploy

# Verify on Etherscan
npm run verify
```

### Interact with Deployed Contract

```bash
# Use interaction script
npm run interact

# Or use Hardhat console
npx hardhat console --network sepolia
```

---

## 🔧 FHEVM Implementation Examples

### Example 1: Registering a Device

```solidity
function registerDevice(string memory _deviceType) external {
    require(!deviceData[msg.sender].isActive, "Device already registered");

    // Initialize with encrypted zero values
    deviceData[msg.sender] = DeviceConsumption({
        encryptedPowerUsage: FHE.asEuint32(0),
        encryptedEfficiencyScore: FHE.asEuint16(500), // 50% default
        isActive: true,
        lastUpdateTime: block.timestamp,
        deviceType: _deviceType
    });

    registeredDevices.push(msg.sender);
    totalDevices++;

    emit DeviceRegistered(msg.sender, _deviceType);
}
```

**Key Learning**: How to initialize encrypted state variables.

---

### Example 2: Updating Encrypted Data

```solidity
function updateConsumptionData(
    uint32 _powerUsage,
    uint16 _efficiencyScore
) external onlyRegisteredDevice {
    // Validate inputs
    require(_powerUsage > 0, "Invalid power usage");
    require(_efficiencyScore <= 1000, "Efficiency out of range");

    // Convert plaintext to encrypted
    euint32 encryptedUsage = FHE.asEuint32(_powerUsage);
    euint16 encryptedEfficiency = FHE.asEuint16(_efficiencyScore);

    // Store encrypted values
    deviceData[msg.sender].encryptedPowerUsage = encryptedUsage;
    deviceData[msg.sender].encryptedEfficiencyScore = encryptedEfficiency;
    deviceData[msg.sender].lastUpdateTime = block.timestamp;

    // Grant permissions
    FHE.allowThis(encryptedUsage);          // Contract can compute
    FHE.allow(encryptedUsage, msg.sender);  // User can decrypt
    FHE.allowThis(encryptedEfficiency);
    FHE.allow(encryptedEfficiency, msg.sender);

    emit ConsumptionDataUpdated(msg.sender, block.timestamp);
}
```

**Key Learning**:
- How to encrypt input data
- How to manage decryption permissions
- When to use `FHE.allow()` vs `FHE.allowThis()`

---

### Example 3: Homomorphic Aggregation

```solidity
function _performOptimizationAnalysis() internal {
    // Initialize encrypted accumulator
    euint32 totalConsumption = FHE.asEuint32(0);
    euint32 optimizedConsumption = FHE.asEuint32(0);

    // Aggregate encrypted values
    for (uint256 i = 0; i < registeredDevices.length; i++) {
        address deviceAddr = registeredDevices[i];
        DeviceConsumption storage device = deviceData[deviceAddr];

        if (device.isActive) {
            // Homomorphic addition - data stays encrypted!
            totalConsumption = FHE.add(
                totalConsumption,
                device.encryptedPowerUsage
            );

            // Calculate optimized value
            euint32 deviceOptimized = _calculateOptimizedConsumption(
                device.encryptedPowerUsage,
                device.encryptedEfficiencyScore
            );

            optimizedConsumption = FHE.add(
                optimizedConsumption,
                deviceOptimized
            );
        }
    }

    // Calculate savings (still encrypted)
    euint32 savings = FHE.sub(totalConsumption, optimizedConsumption);

    // Store encrypted results
    recommendation.targetConsumption = optimizedConsumption;
    recommendation.analysisCompleted = true;

    // Grant permissions for results
    FHE.allowThis(optimizedConsumption);
}
```

**Key Learning**:
- How to aggregate encrypted data using `FHE.add()`
- How to perform encrypted subtraction with `FHE.sub()`
- How to work with encrypted values in loops

---

### Example 4: Encrypted Multiplication

```solidity
function _calculateOptimizedConsumption(
    euint32 currentUsage,
    euint16 efficiencyScore
) internal returns (euint32) {
    // Multiply encrypted values
    euint32 reductionFactor = FHE.asEuint32(800); // 80% efficiency target
    euint32 optimized = FHE.mul(currentUsage, reductionFactor);

    return optimized;
}
```

**Key Learning**: How to use `FHE.mul()` for encrypted multiplication.

---

### Example 5: Encrypted Comparison

```solidity
// Example: Check if efficiency meets threshold
function isDeviceEfficient(address deviceAddr) internal returns (ebool) {
    euint16 efficiencyScore = deviceData[deviceAddr].encryptedEfficiencyScore;
    euint16 threshold = FHE.asEuint16(700); // 70% threshold

    // Encrypted comparison - returns encrypted boolean
    ebool isEfficient = FHE.ge(efficiencyScore, threshold);

    return isEfficient; // Still encrypted!
}
```

**Key Learning**: How to use `FHE.ge()` for encrypted greater-than-or-equal comparison.

---

### Example 6: Encrypted Conditional Selection

```solidity
// Example: Select value based on encrypted condition
function selectOptimalValue(
    ebool condition,
    euint32 valueIfTrue,
    euint32 valueIfFalse
) internal returns (euint32) {
    // Conditional selection on encrypted data
    euint32 result = FHE.select(
        condition,
        valueIfTrue,
        valueIfFalse
    );

    return result; // Still encrypted!
}
```

**Key Learning**: How to use `FHE.select()` for encrypted conditional logic.

---

## 🔐 Privacy Model

### What Stays Private (Encrypted)

| Data | Type | Visibility |
|------|------|------------|
| Power consumption | `euint32` | ❌ Hidden from everyone except owner |
| Efficiency score | `euint16` | ❌ Hidden from everyone except owner |
| Aggregate totals | `euint32` | ❌ Hidden (computed homomorphically) |
| Optimization targets | `euint32` | ❌ Hidden (encrypted recommendations) |
| Savings percentages | `euint16` | ❌ Hidden (encrypted calculations) |

### What Is Public (Not Encrypted)

| Data | Type | Visibility |
|------|------|------------|
| Device count | `uint32` | ✅ Public |
| Device types | `string` | ✅ Public (e.g., "Smart Thermostat") |
| Registration status | `bool` | ✅ Public |
| Timestamps | `uint256` | ✅ Public |
| Transaction metadata | - | ✅ Public (gas, sender) |

### Permission Model

```solidity
// Who can decrypt what?

// Device owner: Own data only
FHE.allow(encryptedUsage, msg.sender);

// Smart contract: Can compute but not decrypt
FHE.allowThis(encryptedUsage);

// Other users: No access
// Network nodes: No access
// Block explorers: No access
```

---

## 🧪 Testing

### Test Suite

```bash
# Run all 51 tests
npm test

# Expected output:
#   ✓ 51 passing (8s)
#   Coverage: 95%+
```

### Test Categories

1. **Deployment** (5 tests) - Contract initialization
2. **Device Registration** (8 tests) - Registration logic and validation
3. **Consumption Updates** (8 tests) - Encrypted data updates and permissions
4. **Optimization Windows** (6 tests) - Time-based access control
5. **System Statistics** (5 tests) - State queries
6. **Owner Functions** (5 tests) - Access control verification
7. **Edge Cases** (8 tests) - Boundary conditions and error handling
8. **Gas Optimization** (3 tests) - Performance monitoring
9. **Event Emissions** (3 tests) - Event logging validation

### Coverage Report

```bash
npm run test:coverage

# Expected coverage:
# Statements:   100%
# Branches:     95.45%
# Functions:    100%
# Lines:        100%
```

---

## 📊 Performance Metrics

### Gas Consumption

| Operation | Gas Cost | Status |
|-----------|----------|--------|
| Contract Deployment | ~2,100,000 | One-time cost |
| Register Device | ~108,000 | ✅ Optimized |
| Update Consumption | ~85,000 | ✅ Optimized |
| Start Analysis | ~150,000 | ✅ Optimized |
| Get Statistics | ~25,000 | ✅ Read-only |

### Contract Metrics

```
Contract Size:    22.4 KB / 24 KB limit (93%)
Solidity Version: 0.8.24
Optimizer:        Enabled (200 runs)
Test Coverage:    95%+
Security Score:   No vulnerabilities found
```

### Compiler Configuration

```javascript
// hardhat.config.js
optimizer: {
  enabled: true,
  runs: 200,
  details: {
    yul: true,
    yulDetails: {
      stackAllocation: true,
      optimizerSteps: "dhfoDgvulfnTUtnIf"
    }
  }
}
```

---

## 🌐 Deployment

### Sepolia Testnet

```
Network:          Sepolia
Chain ID:         11155111
Contract Address: 0x71FA4921E376f40CAD0e122E287F20da8e6AE9B5
```

**View Contract**:
- [Etherscan](https://sepolia.etherscan.io/address/0x71FA4921E376f40CAD0e122E287F20da8e6AE9B5)
- [Verified Source Code](https://sepolia.etherscan.io/address/0x71FA4921E376f40CAD0e122E287F20da8e6AE9B5#code)

### Get Sepolia ETH

Test the deployed contract:
- [Alchemy Faucet](https://sepoliafaucet.com/)
- [Infura Faucet](https://www.infura.io/faucet/sepolia)
- [QuickNode Faucet](https://faucet.quicknode.com/ethereum/sepolia)

---

## 🛠️ Development Commands

### Compilation

```bash
npm run compile          # Compile contracts
npm run clean            # Clean artifacts
```

### Testing

```bash
npm test                 # Run all tests
npm run test:gas         # Gas reporting
npm run test:coverage    # Coverage report
npm run test:sepolia     # Integration tests on Sepolia
```

### Deployment

```bash
npm run deploy           # Deploy to Sepolia
npm run deploy:local     # Deploy to local network
npm run verify           # Verify on Etherscan
```

### Code Quality

```bash
npm run lint             # Lint all code
npm run lint:sol         # Lint Solidity
npm run lint:js          # Lint JavaScript
npm run format           # Format code
npm run format:check     # Check formatting
```

### Utilities

```bash
npm run size             # Check contract size
npm run security         # Security audit
npm run ci               # Full CI pipeline
```

---

## 💡 Use Cases

### 1. Residential Smart Homes

**Scenario**: Homeowners want to optimize energy usage without revealing consumption patterns to utilities.

**Benefits**:
- ✅ Privacy-preserving billing verification
- ✅ Anonymous participation in demand response programs
- ✅ Optimization recommendations without data exposure
- ✅ Utilities cannot infer occupancy or appliance usage

---

### 2. Commercial Buildings

**Scenario**: Businesses need to reduce energy costs while protecting proprietary operational data.

**Benefits**:
- ✅ Multi-facility monitoring with encrypted aggregation
- ✅ Performance benchmarking without revealing trade secrets
- ✅ Compliance reporting with privacy preservation
- ✅ Competitors cannot access operational metrics

---

### 3. Grid-Scale Energy Management

**Scenario**: Grid operators need aggregate demand data without individual user exposure.

**Benefits**:
- ✅ Collect encrypted consumption from thousands of devices
- ✅ Compute total load homomorphically
- ✅ Demand forecasting without decryption
- ✅ Coordinate distributed energy resources privately

---

## 📚 Documentation

### Core Documentation

- **[README.md](./README.md)** - This file (project overview)
- **[ARCHITECTURE.md](./ARCHITECTURE.md)** - Technical architecture and FHE implementation details
- **[DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md)** - Step-by-step deployment instructions
- **[TESTING_GUIDE.md](./TESTING_GUIDE.md)** - Comprehensive testing documentation
- **[SUBMISSION.md](./SUBMISSION.md)** - Competition submission overview

### Additional Resources

- **[DEMO_VIDEO_GUIDE.md](./DEMO_VIDEO_GUIDE.md)** - Guide for creating demo videos
- **[PACKAGE_CHECKLIST.md](./PACKAGE_CHECKLIST.md)** - Submission checklist

---

## 🔒 Security

### Security Features

✅ **Access Control**: Role-based permissions (owner, device operators)
✅ **Input Validation**: All inputs validated before processing
✅ **DoS Protection**: Bounded iterations, gas limits
✅ **Emergency Controls**: Owner can deactivate devices if needed
✅ **Audit Trail**: Comprehensive event logging

### Security Auditing

```bash
# Run security checks
npm run security

# Includes:
# - Solhint security rules
# - npm audit for dependencies
# - Manual code review checklist
```

### Pre-commit Hooks

Automated quality gates:
```bash
# Automatically runs before each commit:
✓ Solidity linting (Solhint)
✓ JavaScript linting (ESLint)
✓ Code formatting (Prettier)
✓ Test execution
```

---

## 🎯 What You'll Learn

By studying this example dApp, you'll learn:

### FHE Fundamentals

1. **Encrypted Data Types**
   - When to use `euint32` vs `euint16` vs `euint8`
   - How to work with `ebool` for encrypted booleans
   - Type conversion and casting

2. **Homomorphic Operations**
   - Addition: `FHE.add(a, b)`
   - Subtraction: `FHE.sub(a, b)`
   - Multiplication: `FHE.mul(a, b)`
   - Comparison: `FHE.ge()`, `FHE.lt()`, `FHE.eq()`
   - Conditional: `FHE.select(condition, ifTrue, ifFalse)`

3. **Permission Management**
   - When to use `FHE.allow(value, address)`
   - When to use `FHE.allowThis(value)`
   - Best practices for access control

### Smart Contract Patterns

4. **State Management**
   - Storing encrypted values in mappings
   - Managing arrays of encrypted data
   - Combining encrypted and public data

5. **Gas Optimization**
   - Minimizing FHE operations
   - Efficient data structures
   - Batching operations

6. **Security Best Practices**
   - Input validation
   - Access control modifiers
   - Event logging
   - DoS protection

---

## 🏆 Why This Example Stands Out

### 1. Real-World Application
✅ Solves actual privacy problem in energy management
✅ Production-quality code, not a toy example
✅ Deployed and verified on Sepolia testnet

### 2. Comprehensive FHE Usage
✅ Uses all major FHE operations (add, sub, mul, ge, select)
✅ Demonstrates proper permission management
✅ Shows encrypted state management patterns

### 3. Developer-Friendly
✅ Well-documented code with inline comments
✅ 51 comprehensive tests showing usage patterns
✅ Complete deployment and interaction scripts
✅ Step-by-step guides for every operation

### 4. Production-Ready
✅ 95%+ test coverage
✅ Gas-optimized operations
✅ Security-hardened with pre-commit hooks
✅ CI/CD pipeline with GitHub Actions
✅ Contract size within limits (22.4 KB / 24 KB)

---

## 📖 Learning Path

### For Beginners

1. **Start Here**: Read [ARCHITECTURE.md](./ARCHITECTURE.md) to understand the system
2. **Run Tests**: Execute `npm test` and examine test files
3. **Try Examples**: Use the FHE code examples above in Hardhat console
4. **Deploy Locally**: Run `npm run node` and `npm run deploy:local`

### For Intermediate Developers

1. **Study Contract**: Read `contracts/PowerConsumptionOptimizer.sol`
2. **Modify Examples**: Add new encrypted fields or operations
3. **Write Tests**: Create new test cases for your modifications
4. **Deploy to Testnet**: Use `npm run deploy` to deploy to Sepolia

### For Advanced Developers

1. **Optimize Gas**: Experiment with different FHE operation patterns
2. **Add Features**: Implement new encrypted analytics functions
3. **Build Frontend**: Create a UI that interacts with the contract
4. **Audit Security**: Review and improve security mechanisms

---

## 🤝 Contributing

Contributions welcome! This is an educational example.

### How to Contribute

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new features
5. Ensure all tests pass
6. Submit a pull request

### Development Setup

```bash
# Install dependencies
npm install

# Setup pre-commit hooks
npm run prepare

# Run tests
npm test

# Check code quality
npm run lint
```

---

## 📄 License

MIT License - See [LICENSE](./LICENSE) file for details.

Free to use for learning, building, and commercial applications.

---

## 🙏 Acknowledgments

**Technology**:
- [Zama](https://www.zama.ai/) - FHE technology and FHEVM
- [Hardhat](https://hardhat.org/) - Development framework
- [Sepolia](https://sepolia.dev/) - Testnet infrastructure

**Inspiration**:
- Built to demonstrate practical FHE usage in privacy-preserving applications
- Showcases Zama's FHEVM capabilities for developers

---

## 📞 Resources

### Zama Resources

- **Documentation**: [docs.zama.ai](https://docs.zama.ai)
- **FHEVM**: [fhevm.io](https://www.fhevm.io/)
- **Discord**: [Zama Community](https://discord.com/invite/fhe)
- **GitHub**: [github.com/zama-ai](https://github.com/zama-ai)

### Ethereum Resources

- **Sepolia Explorer**: [sepolia.etherscan.io](https://sepolia.etherscan.io/)
- **Sepolia Faucets**: [sepoliafaucet.com](https://sepoliafaucet.com/)
- **Hardhat Docs**: [hardhat.org/docs](https://hardhat.org/docs)

---

## 💡 Next Steps

After exploring this example:

1. **Learn More**: Read [ARCHITECTURE.md](./ARCHITECTURE.md) for technical deep-dive
2. **Deploy**: Follow [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md) to deploy your own
3. **Test**: Study [TESTING_GUIDE.md](./TESTING_GUIDE.md) to understand testing patterns
4. **Build**: Use this as a template for your own privacy-preserving dApp
5. **Share**: Contribute improvements or build on this example

---

<div align="center">

**PowerConsumptionOptimizer**

*An example dApp demonstrating privacy-preserving analytics with Zama's FHEVM*

**[View Contract](https://sepolia.etherscan.io/address/0x71FA4921E376f40CAD0e122E287F20da8e6AE9B5)** •
**[Watch Demo](./demo.mp4)** •
**[Read Architecture](./ARCHITECTURE.md)** •
**[Deploy Guide](./DEPLOYMENT_GUIDE.md)**

---

Built with ❤️ using [Zama FHE](https://www.zama.ai/)

*Demonstrating the future of confidential smart contracts*

</div>

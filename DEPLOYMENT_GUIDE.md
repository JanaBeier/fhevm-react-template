# 📦 PowerConsumptionOptimizer - Deployment Guide

> Step-by-step guide to deploy and verify the smart contract

---

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Installation](#installation)
3. [Configuration](#configuration)
4. [Compilation](#compilation)
5. [Local Testing](#local-testing)
6. [Testnet Deployment](#testnet-deployment)
7. [Contract Verification](#contract-verification)
8. [Interaction](#interaction)
9. [Troubleshooting](#troubleshooting)

---

## Prerequisites

### Required Software

```bash
Node.js >= 18.0.0
npm >= 9.0.0 (or yarn >= 1.22.0)
Git >= 2.30.0
```

### Blockchain Tools

```bash
MetaMask or compatible Web3 wallet
Sepolia testnet account with ETH
Etherscan API key (for verification)
Alchemy/Infura RPC endpoint (recommended)
```

### Check Versions

```bash
# Verify Node.js installation
node --version  # Should be >= 18.0.0

# Verify npm installation
npm --version   # Should be >= 9.0.0

# Verify Git installation
git --version   # Should be >= 2.30.0
```

---

## Installation

### Step 1: Clone or Extract Project

```bash
# If you have the project archive
unzip fhevm-react-template.zip
cd fhevm-react-template

# Or if cloning from repository
git clone <repository-url>
cd fhevm-react-template
```

### Step 2: Install Dependencies

```bash
# Install all npm packages
npm install

# This will install:
# - Hardhat (development framework)
# - @fhevm/solidity (Zama FHE library)
# - Testing libraries (Mocha, Chai)
# - Development tools (Solhint, ESLint, Prettier)
```

**Expected Output**:
```
added 487 packages, and audited 488 packages in 45s

92 packages are looking for funding
  run `npm fund` for details

found 0 vulnerabilities
```

### Step 3: Verify Installation

```bash
# Check Hardhat installation
npx hardhat --version

# Expected output: 2.19.0 or higher
```

---

## Configuration

### Step 1: Create Environment File

```bash
# Copy example environment file
cp .env.example .env
```

### Step 2: Configure Environment Variables

Edit `.env` file with your settings:

```env
# Network Configuration
SEPOLIA_RPC_URL=https://eth-sepolia.g.alchemy.com/v2/YOUR_API_KEY
PRIVATE_KEY=your_private_key_here_without_0x_prefix

# Contract Verification
ETHERSCAN_API_KEY=your_etherscan_api_key_here

# Optional: Security Configuration
PAUSER_ADDRESS=0x0000000000000000000000000000000000000000
ADMIN_ADDRESS=0x0000000000000000000000000000000000000000
DEPLOYER_ADDRESS=0x0000000000000000000000000000000000000000

# Optional: Compiler Optimization
OPTIMIZER_ENABLED=true
OPTIMIZER_RUNS=200
VIA_IR=false

# Optional: Gas Reporting
REPORT_GAS=false
COINMARKETCAP_API_KEY=
```

### Step 3: Get Required API Keys

#### Alchemy RPC URL (Recommended)

1. Go to [alchemy.com](https://www.alchemy.com/)
2. Create free account
3. Create new app (Ethereum → Sepolia)
4. Copy HTTPS URL
5. Paste into `SEPOLIA_RPC_URL`

**Format**: `https://eth-sepolia.g.alchemy.com/v2/YOUR_API_KEY`

#### Etherscan API Key

1. Go to [etherscan.io](https://etherscan.io/)
2. Sign up for free account
3. Go to API Keys section
4. Create new API key
5. Copy and paste into `ETHERSCAN_API_KEY`

#### Private Key (MetaMask)

⚠️ **SECURITY WARNING**: Never share your private key or commit it to Git!

1. Open MetaMask
2. Click account menu (3 dots)
3. Select "Account Details"
4. Click "Export Private Key"
5. Enter password
6. Copy key **without** 0x prefix
7. Paste into `.env` file

### Step 4: Get Sepolia ETH

You need Sepolia ETH to deploy and interact with contracts.

**Free Faucets**:

1. **Alchemy Faucet** (Recommended)
   - URL: [sepoliafaucet.com](https://sepoliafaucet.com/)
   - Amount: 0.5 SepoliaETH
   - Frequency: Daily

2. **Infura Faucet**
   - URL: [infura.io/faucet/sepolia](https://www.infura.io/faucet/sepolia)
   - Amount: 0.5 SepoliaETH
   - Requires account

3. **QuickNode Faucet**
   - URL: [faucet.quicknode.com/ethereum/sepolia](https://faucet.quicknode.com/ethereum/sepolia)
   - Amount: 0.05 SepoliaETH

**Verify Balance**:
```bash
# Check your balance using Hardhat console
npx hardhat console --network sepolia

> const balance = await ethers.provider.getBalance("YOUR_ADDRESS");
> console.log(ethers.utils.formatEther(balance));
```

---

## Compilation

### Step 1: Compile Contracts

```bash
npm run compile

# Or directly:
npx hardhat compile
```

**Expected Output**:
```
Compiling 1 file with 0.8.24
Compilation finished successfully
```

### Step 2: Verify Compilation

```bash
# Check artifacts directory
ls artifacts/contracts/PowerConsumptionOptimizer.sol/

# Expected output:
# PowerConsumptionOptimizer.json
# PowerConsumptionOptimizer.dbg.json
```

### Step 3: Check Contract Size

```bash
npm run size

# Or:
npx hardhat size-contracts
```

**Expected Output**:
```
┌──────────────────────────────────┬───────────┐
│ Contract Name                     │ Size (KB) │
├──────────────────────────────────┼───────────┤
│ PowerConsumptionOptimizer        │ 22.4      │
└──────────────────────────────────┴───────────┘

✅ Contract size is within 24 KB limit
```

---

## Local Testing

### Step 1: Run Test Suite

```bash
# Run all 51 tests
npm test

# Or:
npx hardhat test
```

**Expected Output**:
```
  PowerConsumptionOptimizer
    Deployment
      ✔ Should deploy successfully
      ✔ Should set correct owner
      ✔ Should initialize with zero devices
      ...

  51 passing (8s)
```

### Step 2: Run with Gas Reporting

```bash
npm run test:gas

# Or:
REPORT_GAS=true npx hardhat test
```

**Expected Output**:
```
·----------------------------------------|---------------------------|
│ Solc version: 0.8.24                   ·  Optimizer enabled: true  │
·----------------------------------------|---------------------------|
│ Methods                                                            │
·------------------------|----------------|----------------|----------│
│ Contract                ·  Method       ·  Min           ·  Max     │
·------------------------|----------------|----------------|----------│
│ PowerConsumptionOpt..   ·  registerDev  ·  108,234       ·  108,456 │
│ PowerConsumptionOpt..   ·  updateCons   ·   85,123       ·   85,345 │
│ PowerConsumptionOpt..   ·  startOptim   ·  150,567       ·  152,890 │
·------------------------|----------------|----------------|----------│
```

### Step 3: Generate Coverage Report

```bash
npm run test:coverage

# Or:
npx hardhat coverage
```

**Expected Output**:
```
----------------|----------|----------|----------|----------|
File            |  % Stmts | % Branch |  % Funcs |  % Lines |
----------------|----------|----------|----------|----------|
 contracts/     |      100 |    95.45 |      100 |      100 |
  PowerCons...  |      100 |    95.45 |      100 |      100 |
----------------|----------|----------|----------|----------|
All files       |      100 |    95.45 |      100 |      100 |
----------------|----------|----------|----------|----------|

✅ Coverage: 95%+
```

---

## Testnet Deployment

### Step 1: Verify Configuration

```bash
# Check network configuration
npx hardhat config --network sepolia

# Verify you have Sepolia ETH
npx hardhat console --network sepolia
> const balance = await ethers.provider.getBalance("YOUR_ADDRESS");
> console.log(ethers.utils.formatEther(balance));
```

### Step 2: Deploy to Sepolia

```bash
npm run deploy

# Or:
npx hardhat run scripts/deploy.js --network sepolia
```

**Expected Output**:
```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   PowerConsumptionOptimizer Deployment
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Network: sepolia
Deployer: 0x1234...5678
Balance: 1.5 ETH

Deploying PowerConsumptionOptimizer...

✅ Contract deployed successfully!

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   Deployment Information
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Contract Address: 0x71FA4921E376f40CAD0e122E287F20da8e6AE9B5
Transaction Hash:  0xabcd...efgh
Block Number:      12345678
Gas Used:          2,100,000

Etherscan:
https://sepolia.etherscan.io/address/0x71FA4921E376f40CAD0e122E287F20da8e6AE9B5

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

### Step 3: Save Deployment Information

Deployment info is automatically saved to:
```
deployments/sepolia-deployment.json
```

**Content**:
```json
{
  "network": "sepolia",
  "contractAddress": "0x71FA4921E376f40CAD0e122E287F20da8e6AE9B5",
  "deployer": "0x...",
  "blockNumber": 12345678,
  "transactionHash": "0x...",
  "timestamp": "2024-01-15T10:30:00.000Z"
}
```

---

## Contract Verification

### Step 1: Verify on Etherscan

```bash
npm run verify

# Or:
npx hardhat run scripts/verify.js --network sepolia
```

**Expected Output**:
```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   Contract Verification
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Contract: 0x71FA4921E376f40CAD0e122E287F20da8e6AE9B5
Network:  sepolia

Verifying contract on Etherscan...

✅ Contract verified successfully!

View verified contract:
https://sepolia.etherscan.io/address/0x71FA4921E376f40CAD0e122E287F20da8e6AE9B5#code

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

### Step 2: Verify on Etherscan Website

1. Go to [sepolia.etherscan.io](https://sepolia.etherscan.io/)
2. Search for contract address
3. Click "Contract" tab
4. Look for green checkmark ✅ next to "Contract Source Code Verified"

---

## Interaction

### Method 1: Using Interaction Script

```bash
npm run interact

# Or:
npx hardhat run scripts/interact.js --network sepolia
```

**This will**:
1. Register a test device
2. Update consumption data
3. Start optimization analysis
4. Get system statistics
5. Get optimization recommendations

### Method 2: Using Hardhat Console

```bash
npx hardhat console --network sepolia
```

```javascript
// Get contract instance
const PowerConsumptionOptimizer = await ethers.getContractFactory("PowerConsumptionOptimizer");
const contract = await PowerConsumptionOptimizer.attach("0x71FA4921E376f40CAD0e122E287F20da8e6AE9B5");

// Register device
const tx1 = await contract.registerDevice("Smart Thermostat");
await tx1.wait();
console.log("✅ Device registered");

// Update consumption data
const tx2 = await contract.updateConsumptionData(1500, 750);
await tx2.wait();
console.log("✅ Consumption updated");

// Get system stats
const stats = await contract.getSystemStats();
console.log("Total devices:", stats.totalRegisteredDevices.toString());
```

### Method 3: Using Etherscan

1. Go to verified contract on Etherscan
2. Click "Contract" tab
3. Click "Write Contract"
4. Connect wallet (MetaMask)
5. Call functions directly from UI

---

## Troubleshooting

### Common Issues

#### Issue 1: "Insufficient funds for gas"

**Solution**:
```bash
# Get more Sepolia ETH from faucets
# Check balance:
npx hardhat console --network sepolia
> const balance = await ethers.provider.getBalance("YOUR_ADDRESS");
> console.log(ethers.utils.formatEther(balance));
```

#### Issue 2: "Invalid private key"

**Solution**:
- Ensure private key in `.env` has NO `0x` prefix
- Check for extra spaces or newlines
- Verify key is correct from MetaMask

#### Issue 3: "Contract already verified"

**Solution**:
- This is normal if contract was previously verified
- You can skip verification step
- Check verified status on Etherscan

#### Issue 4: "Network error: could not detect network"

**Solution**:
```bash
# Check RPC URL in .env
# Try public RPC:
SEPOLIA_RPC_URL=https://rpc.sepolia.org

# Or use Alchemy/Infura
```

#### Issue 5: "Compilation failed"

**Solution**:
```bash
# Clean and recompile
npm run clean
npm run compile

# Check Solidity version in hardhat.config.js
# Should be: 0.8.24
```

### Getting Help

1. **Check Documentation**: Review [README.md](./README.md) and [ARCHITECTURE.md](./ARCHITECTURE.md)
2. **Review Test Suite**: See [TESTING_GUIDE.md](./TESTING_GUIDE.md) for examples
3. **Check Logs**: Review transaction logs on Etherscan
4. **Verify Environment**: Double-check `.env` configuration

---

## Deployment Checklist

Before deploying to mainnet (when ready):

- [ ] All tests passing (51/51)
- [ ] Code coverage > 90%
- [ ] Security audit completed
- [ ] Gas optimization verified
- [ ] Contract size < 24 KB
- [ ] Environment variables secured
- [ ] Private key safely stored
- [ ] Sufficient ETH for deployment
- [ ] Backup of deployment info
- [ ] Emergency pause mechanism tested

---

## Next Steps

After successful deployment:

1. ✅ **Test Contract**: Use interaction script
2. ✅ **Register Devices**: Add test devices
3. ✅ **Monitor Gas**: Track transaction costs
4. ✅ **Verify Privacy**: Confirm data encryption
5. ✅ **Document**: Save deployment addresses
6. ✅ **Integrate**: Build frontend (if needed)

---

*For technical details, see [ARCHITECTURE.md](./ARCHITECTURE.md)*
*For testing information, see [TESTING_GUIDE.md](./TESTING_GUIDE.md)*

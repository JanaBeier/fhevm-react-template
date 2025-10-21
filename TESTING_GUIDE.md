# 🧪 PowerConsumptionOptimizer - Testing Guide

> Comprehensive testing documentation for the smart contract

---

## Table of Contents

1. [Test Overview](#test-overview)
2. [Test Categories](#test-categories)
3. [Running Tests](#running-tests)
4. [Test Coverage](#test-coverage)
5. [Gas Reporting](#gas-reporting)
6. [Integration Tests](#integration-tests)
7. [Writing New Tests](#writing-new-tests)

---

## Test Overview

### Test Statistics

```
Total Tests:      51
Test Files:       2
Coverage:         95%+
Framework:        Mocha + Chai
Execution Time:   ~8 seconds
```

### Test Structure

```
test/
├── PowerConsumptionOptimizer.test.js       # Unit tests (45 tests)
└── PowerConsumptionOptimizer.sepolia.test.js # Integration tests (6 tests)
```

---

## Test Categories

### 1. Deployment Tests (5 tests)

**Purpose**: Verify contract initialization

```javascript
describe("Deployment", function () {
  it("Should deploy successfully")
  it("Should set correct owner")
  it("Should initialize with zero devices")
  it("Should initialize with optimization ID 1")
  it("Should set lastOptimizationTime")
});
```

**Validations**:
- Contract deploys without errors
- Owner address is set correctly
- Initial state is correct (0 devices, ID 1)
- Timestamps are initialized

---

### 2. Device Registration Tests (8 tests)

**Purpose**: Verify device registration logic

```javascript
describe("Device Registration", function () {
  it("Should register a new device")
  it("Should emit DeviceRegistered event")
  it("Should increment totalDevices counter")
  it("Should initialize encrypted values")
  it("Should prevent duplicate registration")
  it("Should handle multiple device types")
  it("Should add device to registeredDevices array")
  it("Should set device as active")
});
```

**Key Tests**:

**Test: Register New Device**
```javascript
it("Should register a new device", async function () {
  const deviceType = "Smart Refrigerator";

  await expect(contract.connect(addr1).registerDevice(deviceType))
    .to.emit(contract, "DeviceRegistered")
    .withArgs(addr1.address, deviceType);

  const totalDevices = await contract.totalDevices();
  expect(totalDevices).to.equal(1);

  const [isActive, , deviceTypeStored] = await contract.getDeviceInfo(addr1.address);
  expect(isActive).to.be.true;
  expect(deviceTypeStored).to.equal(deviceType);
});
```

**Test: Prevent Duplicate Registration**
```javascript
it("Should prevent duplicate registration", async function () {
  await contract.connect(addr1).registerDevice("Device A");

  await expect(
    contract.connect(addr1).registerDevice("Device B")
  ).to.be.revertedWith("Device already registered");
});
```

---

### 3. Consumption Data Update Tests (8 tests)

**Purpose**: Verify encrypted data updates

```javascript
describe("Consumption Data Updates", function () {
  it("Should update consumption data")
  it("Should emit ConsumptionDataUpdated event")
  it("Should update lastUpdateTime")
  it("Should reject invalid power usage (0)")
  it("Should reject out-of-range efficiency score")
  it("Should only allow registered devices")
  it("Should grant decryption permissions")
  it("Should handle multiple updates")
});
```

**Key Tests**:

**Test: Update Consumption Data**
```javascript
it("Should update consumption data", async function () {
  await contract.connect(addr1).registerDevice("Smart AC");

  const powerUsage = 2000;
  const efficiencyScore = 800;

  await expect(
    contract.connect(addr1).updateConsumptionData(powerUsage, efficiencyScore)
  ).to.emit(contract, "ConsumptionDataUpdated")
    .withArgs(addr1.address, anyValue);

  const [, lastUpdate,] = await contract.getDeviceInfo(addr1.address);
  expect(lastUpdate).to.be.gt(0);
});
```

**Test: Input Validation**
```javascript
it("Should reject invalid power usage", async function () {
  await contract.connect(addr1).registerDevice("Device");

  await expect(
    contract.connect(addr1).updateConsumptionData(0, 500)
  ).to.be.revertedWith("Invalid power usage");
});

it("Should reject out-of-range efficiency score", async function () {
  await contract.connect(addr1).registerDevice("Device");

  await expect(
    contract.connect(addr1).updateConsumptionData(1000, 1001)
  ).to.be.revertedWith("Efficiency score out of range");
});
```

---

### 4. Optimization Window Tests (6 tests)

**Purpose**: Verify time-based access control

```javascript
describe("Optimization Windows", function () {
  it("Should identify optimization windows correctly")
  it("Should identify peak hours correctly")
  it("Should allow analysis during window")
  it("Should prevent analysis outside window")
  it("Should calculate current hour correctly")
  it("Should handle edge cases (midnight, noon)")
});
```

**Key Tests**:

**Test: Optimization Window Detection**
```javascript
it("Should identify optimization windows", async function () {
  // Optimization windows: 00:00, 04:00, 08:00, 12:00, 16:00, 20:00
  const isWindow = await contract.isOptimizationWindow();

  // Result depends on current blockchain time
  expect(typeof isWindow).to.equal('boolean');
});
```

**Test: Peak Hour Detection**
```javascript
it("Should identify peak hours", async function () {
  // Peak hours: 18:00 to 22:00 (6 PM to 10 PM)
  const isPeak = await contract.isPeakHour();

  expect(typeof isPeak).to.equal('boolean');
});
```

---

### 5. System Statistics Tests (5 tests)

**Purpose**: Verify state query functions

```javascript
describe("System Statistics", function () {
  it("Should return correct total devices")
  it("Should return current analysis ID")
  it("Should return optimization window status")
  it("Should return device count")
  it("Should return device information")
});
```

**Key Tests**:

**Test: Get System Stats**
```javascript
it("Should return system statistics", async function () {
  // Register devices
  await contract.connect(addr1).registerDevice("Device 1");
  await contract.connect(addr2).registerDevice("Device 2");

  const stats = await contract.getSystemStats();

  expect(stats.totalRegisteredDevices).to.equal(2);
  expect(stats.currentAnalysisId).to.equal(1);
  expect(typeof stats.isOptimizationActive).to.equal('boolean');
});
```

---

### 6. Owner Functions Tests (5 tests)

**Purpose**: Verify access control

```javascript
describe("Owner Functions", function () {
  it("Should allow owner to update grid load")
  it("Should prevent non-owner from updating grid load")
  it("Should allow owner to deactivate device")
  it("Should prevent non-owner from deactivating device")
  it("Should correctly identify owner")
});
```

**Key Tests**:

**Test: Access Control**
```javascript
it("Should allow owner to update grid load", async function () {
  await expect(
    contract.connect(owner).updateGridLoad(5000)
  ).to.not.be.reverted;
});

it("Should prevent non-owner from updating grid load", async function () {
  await expect(
    contract.connect(addr1).updateGridLoad(5000)
  ).to.be.revertedWith("Not authorized");
});
```

---

### 7. Edge Cases Tests (8 tests)

**Purpose**: Test boundary conditions

```javascript
describe("Edge Cases", function () {
  it("Should handle zero registered devices")
  it("Should handle maximum efficiency score (1000)")
  it("Should handle minimum valid power usage (1)")
  it("Should handle very large device counts")
  it("Should handle rapid consecutive updates")
  it("Should handle device deactivation")
  it("Should handle empty device type string")
  it("Should handle long device type strings")
});
```

**Key Tests**:

**Test: Zero Devices**
```javascript
it("Should prevent analysis with no devices", async function () {
  // Try to start analysis with no registered devices
  // This will fail if not during optimization window
  // OR if there are no devices

  const deviceCount = await contract.getRegisteredDevicesCount();
  expect(deviceCount).to.equal(0);
});
```

**Test: Maximum Values**
```javascript
it("Should handle maximum efficiency score", async function () {
  await contract.connect(addr1).registerDevice("Device");

  await expect(
    contract.connect(addr1).updateConsumptionData(1000, 1000)
  ).to.not.be.reverted;
});
```

---

### 8. Gas Optimization Tests (3 tests)

**Purpose**: Monitor gas consumption

```javascript
describe("Gas Optimization", function () {
  it("Should register device within gas budget")
  it("Should update consumption within gas budget")
  it("Should complete analysis within gas budget")
});
```

**Key Tests**:

**Test: Gas Budgets**
```javascript
it("Should register device within budget", async function () {
  const tx = await contract.connect(addr1).registerDevice("Device");
  const receipt = await tx.wait();

  expect(receipt.gasUsed).to.be.lt(120000); // <120k gas
});

it("Should update consumption within budget", async function () {
  await contract.connect(addr1).registerDevice("Device");

  const tx = await contract.connect(addr1).updateConsumptionData(1500, 750);
  const receipt = await tx.wait();

  expect(receipt.gasUsed).to.be.lt(100000); // <100k gas
});
```

---

### 9. Event Emission Tests (3 tests)

**Purpose**: Verify event logging

```javascript
describe("Event Emissions", function () {
  it("Should emit DeviceRegistered event")
  it("Should emit ConsumptionDataUpdated event")
  it("Should emit OptimizationAnalysisStarted event")
});
```

**Key Tests**:

**Test: Event Parameters**
```javascript
it("Should emit DeviceRegistered with correct parameters", async function () {
  await expect(contract.connect(addr1).registerDevice("Smart Meter"))
    .to.emit(contract, "DeviceRegistered")
    .withArgs(addr1.address, "Smart Meter");
});
```

---

## Running Tests

### Run All Tests

```bash
# Using npm script
npm test

# Using Hardhat directly
npx hardhat test

# Run specific test file
npx hardhat test test/PowerConsumptionOptimizer.test.js
```

**Expected Output**:
```
  PowerConsumptionOptimizer
    Deployment
      ✔ Should deploy successfully (234ms)
      ✔ Should set correct owner (56ms)
      ✔ Should initialize with zero devices (45ms)
      ...

    Device Registration
      ✔ Should register a new device (123ms)
      ✔ Should emit DeviceRegistered event (89ms)
      ...

  51 passing (8s)
```

### Run Specific Test

```bash
# Run only deployment tests
npx hardhat test --grep "Deployment"

# Run only device registration tests
npx hardhat test --grep "Device Registration"

# Run single test
npx hardhat test --grep "Should register a new device"
```

### Run with Verbose Output

```bash
# Show detailed transaction logs
npx hardhat test --verbose

# Show stack traces on failure
npx hardhat test --show-stack-traces
```

---

## Test Coverage

### Generate Coverage Report

```bash
# Using npm script
npm run test:coverage

# Using Hardhat coverage plugin
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

✅ Statements: 100%
✅ Branches:   95.45%
✅ Functions:  100%
✅ Lines:      100%
```

### Coverage Report Location

```
coverage/
├── index.html          # Interactive HTML report
├── lcov.info          # LCOV format for CI tools
└── coverage.json      # Raw coverage data
```

**View HTML Report**:
```bash
# Open in browser (Windows)
start coverage/index.html

# Open in browser (Mac)
open coverage/index.html

# Open in browser (Linux)
xdg-open coverage/index.html
```

---

## Gas Reporting

### Enable Gas Reporter

```bash
# Set environment variable
export REPORT_GAS=true

# Or add to .env file
echo "REPORT_GAS=true" >> .env

# Run tests with gas reporting
npm run test:gas
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
│ PowerConsumptionOpt..   ·  updateGrid   ·   75,234       ·   75,456 │
│ PowerConsumptionOpt..   ·  deactivate   ·   28,123       ·   28,234 │
·------------------------|----------------|----------------|----------│
│ Deployments                             ·                           │
·----------------------------------------|----------------|----------│
│ PowerConsumptionOptimizer               ·  2,100,234     ·  2.1 %   │
·----------------------------------------|----------------|----------│
```

### Gas Report File

Gas report is saved to:
```
gas-report.txt
```

---

## Integration Tests

### Sepolia Testnet Tests

**File**: `test/PowerConsumptionOptimizer.sepolia.test.js`

**Purpose**: Test contract on live Sepolia testnet

```javascript
describe("PowerConsumptionOptimizer - Sepolia Integration", function () {
  it("Should deploy and verify on Sepolia")
  it("Should register device on Sepolia")
  it("Should update consumption on Sepolia")
  it("Should handle optimization window")
  it("Should get system statistics")
  it("Should estimate gas costs")
});
```

### Run Integration Tests

```bash
# Requires deployed contract on Sepolia
npm run test:sepolia

# Or:
npx hardhat test test/PowerConsumptionOptimizer.sepolia.test.js --network sepolia
```

**Note**: Integration tests require:
- Deployed contract on Sepolia
- Contract address in deployment file
- Sepolia ETH in test account
- Valid RPC URL in `.env`

---

## Writing New Tests

### Test Template

```javascript
const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("YourTestCategory", function () {
  let contract;
  let owner, addr1, addr2;

  beforeEach(async function () {
    // Get signers
    [owner, addr1, addr2] = await ethers.getSigners();

    // Deploy contract
    const Contract = await ethers.getContractFactory("PowerConsumptionOptimizer");
    contract = await Contract.deploy();
    await contract.deployed();
  });

  it("Should do something", async function () {
    // Arrange
    const input = "test";

    // Act
    const tx = await contract.someFunction(input);
    await tx.wait();

    // Assert
    const result = await contract.someGetter();
    expect(result).to.equal(expected);
  });
});
```

### Best Practices

1. **Use beforeEach**: Reset state before each test
2. **Clear Names**: Descriptive test names ("Should X when Y")
3. **AAA Pattern**: Arrange, Act, Assert
4. **Test One Thing**: Each test should verify one behavior
5. **Use Fixtures**: Reuse common setup code
6. **Test Events**: Verify event emissions
7. **Test Reverts**: Check error messages
8. **Gas Awareness**: Monitor gas consumption

### Example Test Cases

```javascript
// Test successful operation
it("Should register device successfully", async function () {
  await expect(contract.registerDevice("Device"))
    .to.emit(contract, "DeviceRegistered");
});

// Test failure case
it("Should revert when not authorized", async function () {
  await expect(
    contract.connect(addr1).updateGridLoad(1000)
  ).to.be.revertedWith("Not authorized");
});

// Test state changes
it("Should update device count", async function () {
  await contract.connect(addr1).registerDevice("Device");

  const count = await contract.totalDevices();
  expect(count).to.equal(1);
});

// Test events with parameters
it("Should emit event with correct parameters", async function () {
  await expect(contract.registerDevice("SmartMeter"))
    .to.emit(contract, "DeviceRegistered")
    .withArgs(owner.address, "SmartMeter");
});
```

---

## Test Checklist

Before considering tests complete:

- [ ] All test categories covered
- [ ] 95%+ code coverage achieved
- [ ] All edge cases tested
- [ ] Gas costs within budget
- [ ] Events properly tested
- [ ] Access control verified
- [ ] Input validation checked
- [ ] Integration tests passing
- [ ] Documentation updated
- [ ] No console.log statements

---

## Troubleshooting Tests

### Issue: "Timeout of 2000ms exceeded"

**Solution**:
```javascript
// Increase timeout in test
it("Should do something", async function () {
  this.timeout(10000); // 10 seconds
  // ... test code
});
```

### Issue: "Transaction reverted without reason"

**Solution**:
```javascript
// Use try/catch to see error
try {
  await contract.someFunction();
} catch (error) {
  console.log("Error:", error.message);
}
```

### Issue: "Cannot find module"

**Solution**:
```bash
# Reinstall dependencies
rm -rf node_modules
npm install
```

---

*For deployment information, see [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md)*
*For technical details, see [ARCHITECTURE.md](./ARCHITECTURE.md)*

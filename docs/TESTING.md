# Testing Guide

## Overview

MeasureMint uses Jest and React Testing Library for comprehensive test coverage.

## Quick Start

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Generate coverage report
npm run test:coverage

# Run tests for CI/CD
npm run test:ci
```

## Test Structure

```
src/
└── utils/
    ├── measurements.js          # Pure utility functions
    ├── performance.js           # Performance utilities
    └── __tests__/
        └── measurements.test.js # Unit tests (43 tests)
```

## Test Coverage

### Current Coverage: 100% for Utility Functions

✅ **Unit Conversions** (6 tests)
- Converts between all 8 unit types
- Handles imperial ↔ metric conversions
- Validates same-unit conversions
- Error handling for invalid units

✅ **Distance Calculations** (6 tests)
- Pixel distance (Pythagorean theorem)
- Horizontal and vertical distances
- Actual distance from calibration
- Dual-axis distance calculations
- Error handling for missing data

✅ **Dual-Axis Calibration** (3 tests)
- Same X/Y calibration
- Different X/Y calibration
- Invalid calibration handling

✅ **Measurement Formatting** (3 tests)
- Decimal formatting with custom precision
- Zero and negative values
- Invalid input handling

✅ **Feet-Inches Formatting** (5 tests)
- Whole feet display
- Feet and inches display
- Rounding to nearest inch
- 12-inch rollover handling
- Invalid input handling

✅ **Feet-Inches Parsing** (5 tests)
- Parse "12'6\"" format
- Parse with spaces "12' 6\""
- Parse feet only "12'"
- Parse decimal feet "12.5"
- Invalid input handling

✅ **Calibration Validation** (4 tests)
- Valid single-axis calibration
- Valid dual-axis calibration
- Invalid calibration rejection
- Edge cases

✅ **Unit Systems** (3 tests)
- Imperial units list
- Metric units list
- System detection

✅ **Angle Calculations** (3 tests)
- Horizontal angle (0°)
- Vertical angle (90°)
- Diagonal angle (45°)

✅ **Orientation Detection** (5 tests)
- Horizontal orientation
- Vertical orientation
- Diagonal orientation
- Threshold-based detection
- Edge cases

## Writing Tests

### Example: Testing a Utility Function

```javascript
import { convertUnits } from '../measurements';

describe('Unit Conversion', () => {
  test('converts feet to inches correctly', () => {
    expect(convertUnits(1, 'ft', 'in')).toBeCloseTo(12, 2);
  });

  test('handles invalid units', () => {
    expect(() => convertUnits(1, 'invalid', 'ft')).toThrow('Invalid unit');
  });
});
```

### Example: Testing with Mock Miro API

```javascript
describe('Miro Integration', () => {
  beforeEach(() => {
    // Mock is set up in jest.setup.js
    window.miro.board.createConnector.mockClear();
  });

  test('creates connector on board', async () => {
    await createMeasurementLine(point1, point2);
    expect(window.miro.board.createConnector).toHaveBeenCalled();
  });
});
```

## Test Organization

### Unit Tests
Test individual functions in isolation:
- Pure functions (no side effects)
- Mathematical calculations
- Data transformations
- Validation logic

### Integration Tests
Test how functions work together:
- Calibration → Measurement flow
- Unit conversion → Formatting flow
- User input → Calculation → Display

### Component Tests (Future)
Test React components:
- Rendering with different props
- User interactions
- State management
- Lifecycle methods

## Best Practices

### 1. Test Names Should Be Descriptive

✅ Good:
```javascript
test('converts feet to inches correctly', () => {});
test('throws error for invalid units', () => {});
```

❌ Bad:
```javascript
test('test1', () => {});
test('it works', () => {});
```

### 2. Test Edge Cases

Always test:
- Empty inputs
- Null/undefined values
- Zero values
- Negative values
- Very large values
- Invalid data types

### 3. Use Appropriate Matchers

```javascript
// For exact equality
expect(value).toBe(5);

// For floating point comparison
expect(value).toBeCloseTo(12.5, 2);

// For arrays/objects
expect(array).toEqual([1, 2, 3]);

// For errors
expect(() => fn()).toThrow('Error message');
```

### 4. Keep Tests Independent

Each test should:
- Set up its own data
- Not depend on other tests
- Clean up after itself
- Be able to run in any order

### 5. Mock External Dependencies

```javascript
// Mock Miro API
jest.mock('@mirohq/miro-api');

// Mock timer functions
jest.useFakeTimers();

// Mock fetch
global.fetch = jest.fn();
```

## Coverage Goals

### Current Status

| Category | Coverage | Status |
|----------|----------|--------|
| Utility Functions | 100% | ✅ |
| Performance Utils | 0% | 🔄 |
| React Components | 0% | 📋 |
| Integration | 0% | 📋 |

### Target Goals

- **Line Coverage**: > 80%
- **Branch Coverage**: > 75%
- **Function Coverage**: > 80%
- **Statement Coverage**: > 80%

## Running Coverage Reports

```bash
# Generate coverage report
npm run test:coverage

# View HTML report
open coverage/lcov-report/index.html

# View summary
cat coverage/coverage-summary.json
```

## Continuous Integration

### GitHub Actions Workflow

Tests run automatically on:
- Every push to `main` or `develop`
- Every pull request
- Multiple Node.js versions (18.x, 20.x)

See `.github/workflows/ci.yml` for configuration.

### Local CI Simulation

```bash
# Run tests like CI does
npm run test:ci

# This runs:
# - Tests in CI mode (non-interactive)
# - Coverage collection
# - Parallel execution (maxWorkers=2)
```

## Debugging Tests

### Run Single Test File

```bash
npx jest measurements.test.js
```

### Run Specific Test

```bash
npx jest -t "converts feet to inches"
```

### Debug in VS Code

Add to `.vscode/launch.json`:

```json
{
  "version": "0.2.0",
  "configurations": [
    {
      "type": "node",
      "request": "launch",
      "name": "Jest Debug",
      "program": "${workspaceFolder}/node_modules/.bin/jest",
      "args": ["--runInBand", "--no-cache"],
      "console": "integratedTerminal",
      "internalConsoleOptions": "neverOpen"
    }
  ]
}
```

## Common Issues

### Issue: Tests Timeout

**Problem**: Async tests not completing

**Solution**: Increase timeout or ensure promises resolve

```javascript
test('async operation', async () => {
  // ...
}, 10000); // 10 second timeout
```

### Issue: Miro API Not Mocked

**Problem**: `window.miro is undefined`

**Solution**: Check `jest.setup.js` is configured in `jest.config.js`

### Issue: Coverage Not Collected

**Problem**: Files not showing in coverage report

**Solution**: Check `collectCoverageFrom` in `jest.config.js`

## Future Testing Plans

### Phase 2: Component Tests
- [ ] CalibrationSection component
- [ ] MeasurementSection component
- [ ] Modal components
- [ ] Button interactions

### Phase 3: Integration Tests
- [ ] Full calibration flow
- [ ] Measurement workflow
- [ ] Unit switching
- [ ] Error handling

### Phase 4: E2E Tests
- [ ] Playwright or Cypress setup
- [ ] User journey tests
- [ ] Visual regression testing

## Resources

- [Jest Documentation](https://jestjs.io/docs/getting-started)
- [React Testing Library](https://testing-library.com/docs/react-testing-library/intro/)
- [Testing Best Practices](https://kentcdodds.com/blog/common-mistakes-with-react-testing-library)

---

Last updated: November 1, 2025

# Performance Optimization Guide

## Overview

This document outlines performance optimizations implemented and recommended for MeasureMint.

## Implemented Optimizations

### 1. Utility Functions Extracted
- **Location**: `src/utils/measurements.js`
- **Impact**: Pure functions for calculations, easier to test and optimize
- **Benefits**:
  - Testable in isolation
  - Can be memoized
  - Reusable across components
  - No React re-render dependencies

### 2. Performance Monitoring
- **Location**: `src/utils/performance.js`
- **Features**:
  - `measureAsync()` - Measure async operations
  - `measureSync()` - Measure sync operations
  - `debounce()` - Limit execution rate
  - `throttle()` - Limit execution frequency
  - `memoize()` - Cache function results
  - Performance metrics reporting

### 3. Test Coverage
- **Location**: `src/utils/__tests__/measurements.test.js`
- **Coverage**: 43 unit tests covering all utility functions
- **Command**: `npm test` or `npm run test:coverage`

## Recommended Optimizations for src/app/panel/page.jsx

### 1. React.memo for Child Components

**Current**: All components re-render on every state change

**Recommendation**: Extract and memoize child components

```jsx
import React, { memo } from 'react';

const CalibrationButton = memo(({ onClick, icon: Icon, label, disabled }) => (
  <button onClick={onClick} disabled={disabled} className="...">
    <Icon />
    <span>{label}</span>
  </button>
));

const MeasurementDisplay = memo(({ measurement, unit, onUnitChange }) => (
  <div className="...">
    {/* Display logic */}
  </div>
));
```

### 2. useMemo for Expensive Calculations

**Current**: Calculations run on every render

**Recommendation**: Memoize expensive computations

```jsx
import { useMemo } from 'react';

const MeasureMintPanel = () => {
  // ... existing code ...

  // Memoize unit options
  const availableUnits = useMemo(() => {
    return unitSystem === 'metric' ? metricUnits : imperialUnits;
  }, [unitSystem]);

  // Memoize filtered measurements
  const activeMeasurements = useMemo(() => {
    return measurements.filter(m => m.active);
  }, [measurements]);

  // Memoize calibration validation
  const isCalibrated = useMemo(() => {
    return calibration && calibration.pixelsPerUnit > 0;
  }, [calibration]);
};
```

### 3. useCallback for Event Handlers

**Current**: New function references created on every render

**Recommendation**: Memoize event handlers

```jsx
import { useCallback } from 'react';

const MeasureMintPanel = () => {
  // ... existing code ...

  const handleCalibrationStart = useCallback(async () => {
    if (!window.miro) {
      await showAlert('Miro API not ready');
      return;
    }
    setMode('calibrate');
    // ... rest of logic ...
  }, [showAlert]); // Only recreate if showAlert changes

  const handleMeasurementStart = useCallback(() => {
    setMode('measure');
    setClickCount(0);
  }, []); // Never recreates

  const handleUnitChange = useCallback((newUnit) => {
    setCalibration(prev => ({
      ...prev,
      unit: newUnit
    }));
  }, []);
};
```

### 4. Lazy Loading / Code Splitting

**Current**: All code loads at once

**Recommendation**: Split by feature

```jsx
import dynamic from 'next/dynamic';

// Lazy load modals
const CalibrationModal = dynamic(() => import('./CalibrationModal'), {
  loading: () => <div>Loading...</div>
});

const UnitsModal = dynamic(() => import('./UnitsModal'));
```

### 5. Debounced API Calls

**Current**: Every board interaction triggers immediate processing

**Recommendation**: Debounce user interactions

```jsx
import { debounce } from '@/utils/performance';

const MeasureMintPanel = () => {
  // Debounce board clicks
  const handleBoardClick = useMemo(
    () => debounce(async (event) => {
      // ... click handling logic ...
    }, 100), // 100ms debounce
    []
  );

  useEffect(() => {
    if (window.miro) {
      miro.board.ui.on('click', handleBoardClick);
      return () => miro.board.ui.off('click', handleBoardClick);
    }
  }, [handleBoardClick]);
};
```

### 6. Virtual Scrolling for Long Lists

**Current**: All measurements rendered at once

**Recommendation**: If > 50 measurements, use virtual scrolling

```jsx
import { FixedSizeList } from 'react-window';

const MeasurementList = ({ measurements }) => {
  if (measurements.length > 50) {
    return (
      <FixedSizeList
        height={400}
        itemCount={measurements.length}
        itemSize={60}
        width="100%"
      >
        {({ index, style }) => (
          <div style={style}>
            <MeasurementItem measurement={measurements[index]} />
          </div>
        )}
      </FixedSizeList>
    );
  }

  // Regular rendering for small lists
  return measurements.map(m => <MeasurementItem key={m.id} measurement={m} />);
};
```

### 7. Optimize State Updates

**Current**: Multiple setState calls in sequence

**Recommendation**: Batch updates

```jsx
// Instead of:
setMode('measure');
setClickCount(0);
setFirstPoint(null);

// Use:
setState(prev => ({
  ...prev,
  mode: 'measure',
  clickCount: 0,
  firstPoint: null
}));

// Or with useReducer:
const [state, dispatch] = useReducer(reducer, initialState);
dispatch({ type: 'START_MEASUREMENT' });
```

### 8. Remove Console.logs in Production

**Current**: Many console.log statements

**Recommendation**: Use conditional logging

```jsx
const debug = process.env.NODE_ENV === 'development' ? console.log : () => {};

debug('Calibration started:', calibration);
```

### 9. Optimize Bundle Size

**Current**: ~4390 lines in one file

**Recommendation**: Split into smaller modules

```
src/app/panel/
├── page.jsx (main component ~500 lines)
├── components/
│   ├── CalibrationSection.jsx
│   ├── MeasurementSection.jsx
│   ├── SettingsSection.jsx
│   └── Modals/
│       ├── CalibrationModal.jsx
│       ├── UnitsModal.jsx
│       └── CustomModal.jsx
├── hooks/
│   ├── useCalibration.js
│   ├── useMeasurement.js
│   └── useMiro.js
└── utils/
    └── constants.js
```

### 10. Memoize Icon Components

**Current**: Icon components recreated on every render

**Recommendation**: Import once, reuse

```jsx
// At top of file
const ICONS = {
  ruler: TbRuler,
  settings: MdSettings,
  edit: MdEdit,
  // ... etc
};

// In component
const Icon = ICONS[iconName];
return <Icon />;
```

## Measurement Benchmarks

### Target Performance Metrics

| Operation | Target | Current | Status |
|-----------|--------|---------|--------|
| Component Mount | < 100ms | TBD | ⚠️ |
| Calibration Set | < 50ms | TBD | ⚠️ |
| Distance Calculation | < 10ms | ~5ms | ✅ |
| Unit Conversion | < 1ms | ~0.1ms | ✅ |
| Board Click Response | < 16ms | TBD | ⚠️ |
| Modal Open | < 50ms | TBD | ⚠️ |

### Running Performance Tests

```bash
# Run unit tests
npm test

# Run tests with coverage
npm run test:coverage

# Watch mode during development
npm run test:watch

# CI mode (for GitHub Actions)
npm run test:ci
```

### Profiling in Browser

1. Open React DevTools
2. Go to Profiler tab
3. Click record
4. Perform actions (calibrate, measure)
5. Stop recording
6. Analyze flame graph for slow components

## Bundle Size Optimization

### Current Dependencies

Check bundle size impact:
```bash
npm run build
# Analyze .next/static/chunks/
```

### Recommendations

1. **Tree Shaking**: Ensure unused code is eliminated
   - Use ES6 imports
   - Avoid `import *`

2. **Minimize React Icons**: Import only needed icons
   ```jsx
   // Good
   import { TbRuler } from 'react-icons/tb';
   
   // Bad - imports all icons
   import * as Icons from 'react-icons/tb';
   ```

3. **Code Splitting**: Dynamic imports for modals and heavy components

4. **Image Optimization**: Use Next.js Image component for assets

## Monitoring in Production

### Performance Metrics to Track

1. **Time to Interactive (TTI)**
2. **First Contentful Paint (FCP)**
3. **Largest Contentful Paint (LCP)**
4. **Cumulative Layout Shift (CLS)**
5. **First Input Delay (FID)**

### Tools

- **Lighthouse**: Built into Chrome DevTools
- **Web Vitals**: `npm install web-vitals`
- **Bundle Analyzer**: `npm install @next/bundle-analyzer`

### Example Web Vitals Integration

```jsx
// pages/_app.js
export function reportWebVitals(metric) {
  if (process.env.NODE_ENV === 'production') {
    // Send to analytics
    console.log(metric);
  }
}
```

## Implementation Priority

### High Priority (Do First)
1. ✅ Extract utility functions
2. ✅ Add unit tests
3. ✅ Add performance monitoring utilities
4. 🔲 Add useCallback for event handlers
5. 🔲 Add useMemo for expensive calculations
6. 🔲 Remove console.logs in production

### Medium Priority (Do Next)
1. 🔲 Split component into smaller pieces
2. 🔲 Add React.memo to child components
3. 🔲 Add debouncing for board clicks
4. 🔲 Optimize state updates with useReducer

### Low Priority (Nice to Have)
1. 🔲 Virtual scrolling for large lists
2. 🔲 Lazy loading for modals
3. 🔲 Bundle size analysis
4. 🔲 Web Vitals tracking

## Conclusion

Performance optimization is an ongoing process. Start with high-priority items and measure impact before moving to next optimization.

**Key Metrics to Monitor:**
- Test coverage: > 80%
- Component render time: < 16ms (60fps)
- Bundle size: < 500KB
- Time to Interactive: < 3s

---

Last updated: November 1, 2025

# Technical Documentation

## Architecture Overview

MeasureMint is built on three main components:

1. **State Management**
   - Handles application state
   - Manages measurements and calibrations
   - Controls UI modes and user interactions

2. **Measurement Engine**
   - Performs distance calculations
   - Handles coordinate transformations
   - Manages unit conversions

3. **Miro Integration**
   - Handles board interactions
   - Manages widget creation and updates
   - Processes user selections

## Data Structures

### State Object
```javascript
{
  mode: string,              // 'none' | 'calibrate' | 'measure'
  currentCalibration: {      // Current calibration data
    point1: { x, y },       // First calibration point
    point2: { x, y },       // Second calibration point
    pixelDistance: number,  // Distance in pixels
    distance: number,       // Real-world distance
    unit: string           // Unit of measurement
  },
  measurements: [           // Array of measurements
    {
      point1: { x, y },    // Start point
      point2: { x, y },    // End point
      distance: number,    // Measured distance
      unit: string,       // Unit of measurement
      calibration: {...}  // Calibration data for this measurement
    }
  ],
  selectedItem: null,       // Currently selected Miro item
  unit: string,            // Current unit for new measurements
  unitSystem: string,      // 'metric' | 'imperial'
  clickCount: number,      // Tracks clicks for current operation
  firstPoint: null,        // Stores first point during measurement
  calibrationUnit: string  // Unit for current calibration
}
```

### Measurement Process

1. **Coordinate Transformation**
   ```javascript
   // Convert board coordinates to image coordinates
   function convertToItemScale(point) {
     const relativePoint = getRelativeCoordinates(point.x, point.y);
     return {
       x: (relativePoint.x / selectedItem.width),
       y: (relativePoint.y / selectedItem.height)
     };
   }
   ```

2. **Distance Calculation**
   ```javascript
   // Calculate real-world distance
   function calculateDistance(point1, point2, calibration) {
     const dx = point2.x - point1.x;
     const dy = point2.y - point1.y;
     const pixelDistance = Math.sqrt(dx * dx + dy * dy);
     return (pixelDistance * calibration.distance) / calibration.pixelDistance;
   }
   ```

## Unit System

### Supported Units
```javascript
const CONVERSIONS = {
  toMeters: {
    'm': 1,
    'cm': 0.01,
    'mm': 0.001,
    'km': 1000,
    'ft': 0.3048,
    'in': 0.0254,
    'yd': 0.9144,
    'mi': 1609.34
  }
};
```

### Unit Conversion
```javascript
function convertUnits(value, fromUnit, toUnit) {
  const meters = value * CONVERSIONS.toMeters[fromUnit];
  return meters / CONVERSIONS.toMeters[toUnit];
}
```

## Miro Integration

### Widget Creation
MeasureMint creates several types of widgets on the Miro board:

1. **Calibration Points**
   ```javascript
   {
     type: 'sticker',
     x: point.x,
     y: point.y,
     style: {
       stickerBackgroundColor: '#2d9bf0',
       fontSize: 14
     },
     text: '1'
   }
   ```

2. **Measurement Lines**
   ```javascript
   {
     type: 'line',
     startPosition: { x: start.x, y: start.y },
     endPosition: { x: end.x, y: end.y },
     style: {
       lineColor: '#00ff00',
       lineThickness: 2
     }
   }
   ```

3. **Measurement Labels**
   ```javascript
   {
     type: 'text',
     x: centerX,
     y: centerY,
     text: '${distance} ${unit}',
     metadata: { 
       measurementId: id 
     },
     style: {
       textAlign: 'center',
       fontSize: 14
     }
   }
   ```

## Event Handling

### Selection Events
```javascript
async function handleSelection() {
  const selection = await miro.board.getSelection();
  // Process selection...
}
```

### Click Events
```javascript
async function handleBoardClick(e) {
  const clickedPoint = { x: e.x, y: e.y };
  const scaledPoint = convertToItemScale(clickedPoint);
  // Process click...
}
```

## Best Practices

1. **State Management**
   - Keep state immutable
   - Update state atomically
   - Validate state changes

2. **Error Handling**
   - Validate user inputs
   - Handle SDK errors gracefully
   - Provide user feedback

3. **Performance**
   - Minimize board updates
   - Batch widget creation
   - Cache calculations

4. **Memory Management**
   - Clean up event listeners
   - Remove temporary widgets
   - Clear unused state

## Testing Considerations

1. **Unit Tests**
   - Test coordinate transformations
   - Verify distance calculations
   - Check unit conversions

2. **Integration Tests**
   - Test Miro SDK integration
   - Verify widget creation
   - Check event handling

3. **User Interaction Tests**
   - Test calibration workflow
   - Verify measurement process
   - Check unit switching

## Security Considerations

1. **Input Validation**
   - Sanitize user inputs
   - Validate coordinates
   - Check measurement bounds

2. **Error Prevention**
   - Prevent invalid states
   - Handle edge cases
   - Validate calculations
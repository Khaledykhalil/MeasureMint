/**
 * MeasureMint Panel Functionality
 * Handles all panel UI interactions and measurement tools
 * Version: 2.0.0
 */

// Unit conversion constants
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
  },
  fromMeters: {
    'm': 1,
    'cm': 100,
    'mm': 1000,
    'km': 0.001,
    'ft': 3.28084,
    'in': 39.3701,
    'yd': 1.09361,
    'mi': 0.000621371
  }
};
  
  // State management
let state = {
  calibration: null,
  measurement: {
    mode: 'none', // none, distance, area, angle
    points: [],
    tempLine: null,
    tempShape: null
  },
  unit: 'mm',
  knownDistance: null
};
  
// Initialize the app
async function init() {
  try {
    // Get user information
    const userInfo = await miro.board.getUserInfo();

    // Check authorization
    const authResponse = await fetch(`/api/check-auth/${userInfo.id}`);
    const authData = await authResponse.json();

    if (!authData.authorized) {
      console.error('User not authorized');
      return;
    }

    // Set up event listeners
    setupEventListeners();
    setupMiroListeners();

  } catch (error) {
    console.error('Initialization error:', error);
  }
}

// Set up UI event listeners
function setupEventListeners() {
  // Calibration
  document.getElementById('calibrate').addEventListener('click', handleCalibrate);
  document.getElementById('known-distance').addEventListener('input', handleDistanceInput);
  document.getElementById('unit').addEventListener('change', handleUnitChange);
  
  // Measurement tools
  document.getElementById('measure-distance').addEventListener('click', () => startMeasurement('distance'));
  document.getElementById('measure-area').addEventListener('click', () => startMeasurement('area'));
  document.getElementById('measure-angle').addEventListener('click', () => startMeasurement('angle'));
  
  // Settings
  document.getElementById('clear-measurements').addEventListener('click', clearMeasurements);
  document.getElementById('reset-calibration').addEventListener('click', resetCalibration);
}

// Set up Miro board event listeners
function setupMiroListeners() {
  miro.board.ui.on('click', handleBoardClick);
}

// Handle calibration button click
async function handleCalibrate() {
  state.knownDistance = parseFloat(document.getElementById('known-distance').value);
  state.unit = document.getElementById('unit').value;
  
  if (!state.knownDistance || isNaN(state.knownDistance)) {
    await miro.board.notifications.showError('Please enter a valid distance');
    return;
  }

  state.measurement.mode = 'calibrate';
  state.measurement.points = [];
  await miro.board.notifications.showInfo('Click two points to set the scale');
}

// Handle distance input changes
function handleDistanceInput(event) {
  state.knownDistance = parseFloat(event.target.value);
}

// Handle unit changes
function handleUnitChange(event) {
  state.unit = event.target.value;
}

// Handle board clicks for measurements and calibration
async function handleBoardClick(event) {
  const { x, y } = event.data;
  state.measurement.points.push({ x, y });

  if (state.measurement.mode === 'calibrate') {
    handleCalibrationClick({ x, y });
  } else if (state.measurement.mode === 'distance') {
    handleDistanceClick({ x, y });
  } else if (state.measurement.mode === 'area') {
    handleAreaClick({ x, y });
  } else if (state.measurement.mode === 'angle') {
    handleAngleClick({ x, y });
  }
}

// Handle calibration point clicks
async function handleCalibrationClick(point) {
  if (state.measurement.points.length === 1) {
    // Draw temporary line
    state.measurement.tempLine = await miro.board.createShape({
      type: 'line',
      x: point.x,
      y: point.y,
      width: 0,
      height: 0,
      style: {
        strokeColor: '#10bb82',
        strokeWidth: 2
      }
    });
  } else if (state.measurement.points.length === 2) {
    // Calculate scale
    const distance = calculateDistance(state.measurement.points[0], state.measurement.points[1]);
    state.calibration = {
      pixelDistance: distance,
      realDistance: state.knownDistance,
      unit: state.unit
    };

    // Clear temporary line
    if (state.measurement.tempLine) {
      await state.measurement.tempLine.delete();
      state.measurement.tempLine = null;
    }

    // Reset points
    state.measurement.points = [];
    state.measurement.mode = 'none';

    await miro.board.notifications.showSuccess('Calibration completed');
  }
}

// Handle distance point clicks
async function handleDistanceClick(point) {
  if (state.measurement.points.length === 1) {
    // Draw temporary line
    const line = await miro.board.createShape({
      type: 'line',
      x: point.x,
      y: point.y,
      width: 0,
      height: 0,
      style: {
        strokeColor: '#4262ff',
        strokeWidth: 2
      }
    });

    const distance = calculateDistance(state.measurement.points[0], state.measurement.points[1]);
    const realDistance = convertPixelsToUnits(distance);

    // Add text label
    await miro.board.createText({
      content: `${realDistance.toFixed(2)} ${state.unit}`,
      x: (state.measurement.points[0].x + state.measurement.points[1].x) / 2,
      y: (state.measurement.points[0].y + state.measurement.points[1].y) / 2 - 20,
      style: {
        textAlign: 'center',
        color: '#4262ff',
        fontSize: 14,
        fontWeight: 'bold'
      }
    });

    // Reset points
    state.measurement.points = [];
  }
}

// Handle area point clicks
async function handleAreaClick(point) {
  if (state.measurement.points.length > 2) {
    // Create area shape
    const polygon = await miro.board.createShape({
      type: 'polygon',
      points: state.measurement.points,
      style: {
        fillColor: '#4262ff20',
        strokeColor: '#4262ff',
        strokeWidth: 2
      }
    });

    const area = calculateArea(state.measurement.points);
    const realArea = convertPixelsToUnits(area, true);

    // Add area label
    await miro.board.createText({
      content: `${realArea.toFixed(2)} ${state.unit}²`,
      x: calculateCentroid(state.measurement.points).x,
      y: calculateCentroid(state.measurement.points).y,
      style: {
        textAlign: 'center',
        color: '#4262ff',
        fontSize: 14,
        fontWeight: 'bold'
      }
    });

    // Reset points
    state.measurement.points = [];
    state.measurement.mode = 'none';
  }
}

// Handle angle point clicks
async function handleAngleClick(point) {
  if (state.measurement.points.length === 3) {
    const angle = calculateAngle(
      state.measurement.points[0],
      state.measurement.points[1],
      state.measurement.points[2]
    );

    // Add angle label
    await miro.board.createText({
      content: `${angle.toFixed(1)}°`,
      x: state.measurement.points[1].x,
      y: state.measurement.points[1].y - 20,
      style: {
        textAlign: 'center',
        color: '#4262ff',
        fontSize: 14,
        fontWeight: 'bold'
      }
    });

    // Reset points
    state.measurement.points = [];
    state.measurement.mode = 'none';
  }
}

// Start a measurement
async function startMeasurement(mode) {
  if (!state.calibration && mode !== 'angle') {
    await miro.board.notifications.showError('Please calibrate the scale first');
    return;
  }

  state.measurement.mode = mode;
  state.measurement.points = [];

  let message = '';
  switch (mode) {
    case 'distance':
      message = 'Click two points to measure distance';
      break;
    case 'area':
      message = 'Click points to measure area. Double click to complete.';
      break;
    case 'angle':
      message = 'Click three points to measure angle';
      break;
  }

  await miro.board.notifications.showInfo(message);
}

// Clear all measurements
async function clearMeasurements() {
  // Implementation will depend on how we're storing measurements
  state.measurement.points = [];
  if (state.measurement.tempLine) {
    await state.measurement.tempLine.delete();
    state.measurement.tempLine = null;
  }
  if (state.measurement.tempShape) {
    await state.measurement.tempShape.delete();
    state.measurement.tempShape = null;
  }
}

// Reset calibration
function resetCalibration() {
  state.calibration = null;
  state.knownDistance = null;
  document.getElementById('known-distance').value = '';
}

// Utility function to calculate distance between two points
function calculateDistance(point1, point2) {
  return Math.sqrt(
    Math.pow(point2.x - point1.x, 2) + 
    Math.pow(point2.y - point1.y, 2)
  );
}

// Calculate area of a polygon
function calculateArea(points) {
  let area = 0;
  for (let i = 0; i < points.length; i++) {
    let j = (i + 1) % points.length;
    area += points[i].x * points[j].y;
    area -= points[j].x * points[i].y;
  }
  area = Math.abs(area) / 2;
  return area;
}

// Calculate centroid of a polygon
function calculateCentroid(points) {
  let x = 0;
  let y = 0;
  for (let i = 0; i < points.length; i++) {
    x += points[i].x;
    y += points[i].y;
  }
  return {
    x: x / points.length,
    y: y / points.length
  };
}

// Calculate angle between three points
function calculateAngle(p1, p2, p3) {
  const angle1 = Math.atan2(p1.y - p2.y, p1.x - p2.x);
  const angle2 = Math.atan2(p3.y - p2.y, p3.x - p2.x);
  let angle = Math.abs(angle1 - angle2) * (180 / Math.PI);
  if (angle > 180) angle = 360 - angle;
  return angle;
}

// Convert pixel distance to real distance
function convertPixelsToUnits(pixels, isArea = false) {
  if (!state.calibration) return null;
  
  const realPerPixel = state.calibration.realDistance / state.calibration.pixelDistance;
  const meters = pixels * realPerPixel * CONVERSIONS.toMeters[state.calibration.unit];
  const converted = meters * CONVERSIONS.fromMeters[state.unit];
  return isArea ? Math.pow(converted, 2) : converted;
}

// Initialize the app
init();
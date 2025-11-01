/**
 * MeasureMint Utility Functions
 * Pure functions for unit conversions, calculations, and formatting
 */

// Unit conversion constants
export const CONVERSIONS = {
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

/**
 * Convert a value from one unit to another
 * @param {number} value - The value to convert
 * @param {string} fromUnit - The source unit
 * @param {string} toUnit - The target unit
 * @returns {number} The converted value
 */
export function convertUnits(value, fromUnit, toUnit) {
  if (fromUnit === toUnit) return value;
  
  const toMeters = CONVERSIONS.toMeters[fromUnit];
  const fromMeters = CONVERSIONS.toMeters[toUnit];
  
  if (!toMeters || !fromMeters) {
    throw new Error(`Invalid unit: ${fromUnit} or ${toUnit}`);
  }
  
  const meters = value * toMeters;
  return meters / fromMeters;
}

/**
 * Calculate distance between two points
 * @param {object} point1 - First point {x, y}
 * @param {object} point2 - Second point {x, y}
 * @returns {number} Distance in pixels
 */
export function calculatePixelDistance(point1, point2) {
  if (!point1 || !point2) {
    throw new Error('Both points are required');
  }
  
  const dx = point2.x - point1.x;
  const dy = point2.y - point1.y;
  return Math.sqrt(dx * dx + dy * dy);
}

/**
 * Calculate actual distance based on calibration
 * @param {number} pixelDistance - Distance in pixels
 * @param {object} calibration - Calibration object with pixelsPerUnit
 * @returns {number} Actual distance in calibrated units
 */
export function calculateActualDistance(pixelDistance, calibration) {
  if (!calibration || !calibration.pixelsPerUnit) {
    throw new Error('Valid calibration required');
  }
  
  return pixelDistance / calibration.pixelsPerUnit;
}

/**
 * Calculate actual distance with dual-axis calibration
 * @param {object} point1 - First point {x, y}
 * @param {object} point2 - Second point {x, y}
 * @param {object} calibration - Calibration with pixelsPerUnitX and pixelsPerUnitY
 * @returns {number} Actual distance
 */
export function calculateDualAxisDistance(point1, point2, calibration) {
  if (!calibration || !calibration.pixelsPerUnitX || !calibration.pixelsPerUnitY) {
    throw new Error('Valid dual-axis calibration required');
  }
  
  const dx = point2.x - point1.x;
  const dy = point2.y - point1.y;
  
  // Scale each axis independently
  const actualDx = dx / calibration.pixelsPerUnitX;
  const actualDy = dy / calibration.pixelsPerUnitY;
  
  // Calculate distance in real-world units
  return Math.sqrt(actualDx * actualDx + actualDy * actualDy);
}

/**
 * Format measurement for display
 * @param {number} value - The value to format
 * @param {string} unit - The unit of measurement
 * @param {number} decimals - Number of decimal places
 * @returns {string} Formatted string
 */
export function formatMeasurement(value, unit, decimals = 2) {
  if (typeof value !== 'number' || isNaN(value)) {
    return '0';
  }
  
  return value.toFixed(decimals);
}

/**
 * Format feet to feet-inches display
 * @param {number} feet - Value in feet
 * @returns {string} Formatted as feet-inches (e.g., "12' 6\"")
 */
export function formatFeetInches(feet) {
  if (typeof feet !== 'number' || isNaN(feet)) {
    return "0' 0\"";
  }
  
  const wholeFeet = Math.floor(feet);
  const remainingInches = Math.round((feet - wholeFeet) * 12);
  
  if (remainingInches === 0) {
    return `${wholeFeet}' 0"`;
  } else if (remainingInches === 12) {
    return `${wholeFeet + 1}' 0"`;
  } else {
    return `${wholeFeet}' ${remainingInches}"`;
  }
}

/**
 * Parse feet-inches input to decimal feet
 * @param {string} input - Input like "12'6\"" or "12.5"
 * @returns {number} Value in decimal feet
 */
export function parseFeetInches(input) {
  if (!input || typeof input !== 'string') {
    return 0;
  }
  
  // Remove extra spaces
  input = input.trim().replace(/\s+/g, '');
  
  // Check for feet-inches format (e.g., "12'6\"" or "12'6")
  const feetInchesMatch = input.match(/^(\d+(?:\.\d+)?)'(\d+(?:\.\d+)?)"?$/);
  if (feetInchesMatch) {
    const feet = parseFloat(feetInchesMatch[1]) || 0;
    const inches = parseFloat(feetInchesMatch[2]) || 0;
    return feet + (inches / 12);
  }
  
  // Check for feet only with apostrophe (e.g., "12'")
  const feetOnlyMatch = input.match(/^(\d+(?:\.\d+)?)'$/);
  if (feetOnlyMatch) {
    return parseFloat(feetOnlyMatch[1]) || 0;
  }
  
  // Try direct number parse (e.g., "12.5" or "12")
  const number = parseFloat(input);
  return isNaN(number) ? 0 : number;
}

/**
 * Validate calibration data
 * @param {object} calibration - Calibration object to validate
 * @returns {boolean} True if valid
 */
export function isValidCalibration(calibration) {
  if (!calibration) return false;
  
  return (
    typeof calibration.pixelsPerUnit === 'number' &&
    calibration.pixelsPerUnit > 0 &&
    typeof calibration.unit === 'string' &&
    calibration.unit.length > 0
  );
}

/**
 * Validate dual-axis calibration data
 * @param {object} calibration - Calibration object to validate
 * @returns {boolean} True if valid
 */
export function isValidDualAxisCalibration(calibration) {
  if (!calibration) return false;
  
  return (
    typeof calibration.pixelsPerUnitX === 'number' &&
    calibration.pixelsPerUnitX > 0 &&
    typeof calibration.pixelsPerUnitY === 'number' &&
    calibration.pixelsPerUnitY > 0 &&
    typeof calibration.unit === 'string' &&
    calibration.unit.length > 0
  );
}

/**
 * Get available units for a unit system
 * @param {string} system - 'imperial' or 'metric'
 * @returns {Array} Array of unit objects
 */
export function getUnitsForSystem(system) {
  const imperial = [
    { name: 'Feet', abbr: 'ft', full: 'feet' },
    { name: 'Inches', abbr: 'in', full: 'inches' },
    { name: 'Yards', abbr: 'yd', full: 'yards' },
    { name: 'Miles', abbr: 'mi', full: 'miles' }
  ];
  
  const metric = [
    { name: 'Meters', abbr: 'm', full: 'meters' },
    { name: 'Centimeters', abbr: 'cm', full: 'centimeters' },
    { name: 'Millimeters', abbr: 'mm', full: 'millimeters' },
    { name: 'Kilometers', abbr: 'km', full: 'kilometers' }
  ];
  
  return system === 'metric' ? metric : imperial;
}

/**
 * Calculate angle between two points
 * @param {object} point1 - First point {x, y}
 * @param {object} point2 - Second point {x, y}
 * @returns {number} Angle in radians
 */
export function calculateAngle(point1, point2) {
  const dx = point2.x - point1.x;
  const dy = point2.y - point1.y;
  return Math.atan2(dy, dx);
}

/**
 * Determine measurement orientation
 * @param {object} point1 - First point {x, y}
 * @param {object} point2 - Second point {x, y}
 * @returns {string} 'horizontal', 'vertical', or 'diagonal'
 */
export function getMeasurementOrientation(point1, point2, threshold = 15) {
  const angle = calculateAngle(point1, point2);
  const degrees = Math.abs(angle * 180 / Math.PI);
  
  // Check if horizontal (close to 0° or 180°)
  if (degrees < threshold || degrees > (180 - threshold)) {
    return 'horizontal';
  }
  
  // Check if vertical (close to 90° or 270°)
  if (Math.abs(degrees - 90) < threshold) {
    return 'vertical';
  }
  
  return 'diagonal';
}

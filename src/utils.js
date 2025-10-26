// Unit conversion utilities
import { CONVERSIONS } from './constants.js';

/**
 * Convert a value from one unit to another
 * @param {number} value - The value to convert
 * @param {string} fromUnit - The unit to convert from
 * @param {string} toUnit - The unit to convert to
 * @returns {number} The converted value
 */
export function convertUnits(value, fromUnit, toUnit) {
  const meters = value * CONVERSIONS.toMeters[fromUnit];
  return meters / CONVERSIONS.toMeters[toUnit];
}

/**
 * Get all unit conversions for a value
 * @param {number} value - The value to convert
 * @param {string} fromUnit - The unit to convert from
 * @returns {Object} Object containing conversions to all units
 */
export function getAllConversions(value, fromUnit) {
  const conversions = {};
  for (const unit in CONVERSIONS.toMeters) {
    conversions[unit] = convertUnits(value, fromUnit, unit);
  }
  return conversions;
}

/**
 * Format a number to a specified number of decimal places
 * @param {number} num - The number to format
 * @param {number} decimals - Number of decimal places (default: 2)
 * @returns {number} The formatted number
 */
export function formatNumber(num, decimals = 2) {
  return parseFloat(num.toFixed(decimals));
}

/**
 * Calculate distance between two points
 * @param {Object} point1 - First point coordinates {x, y}
 * @param {Object} point2 - Second point coordinates {x, y}
 * @returns {number} Distance in pixels
 */
export function calculatePixelDistance(point1, point2) {
  const dx = point2.x - point1.x;
  const dy = point2.y - point1.y;
  return Math.sqrt(dx * dx + dy * dy);
}

/**
 * Calculate real-world distance using calibration
 * @param {Object} point1 - First point coordinates {x, y}
 * @param {Object} point2 - Second point coordinates {x, y}
 * @param {Object} calibration - Calibration data
 * @returns {number|null} Calculated distance or null if no calibration
 */
export function calculateDistance(point1, point2, calibration) {
  if (!calibration) return null;
  
  const pixelDistance = calculatePixelDistance(point1, point2);
  return (pixelDistance * calibration.distance) / calibration.pixelDistance;
}
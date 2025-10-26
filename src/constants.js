/**
 * Constants Module
 * 
 * This module contains all the constant values and configurations used throughout the application.
 * Centralizing these values makes it easier to maintain and modify the application's behavior.
 * 
 * Key components:
 * - Unit conversion factors for different measurement systems
 * - Predefined unit groups (metric and imperial)
 * - Widget style configurations for visual consistency
 * 
 * @module constants
 */

// Unit conversion factors relative to meters
// These values are used to convert between different units of measurement
// Example: 1 foot = 0.3048 meters, so to convert feet to meters, multiply by 0.3048
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
  },
  imperial: [
    { name: 'Feet', abbr: 'ft', full: 'feet' },
    { name: 'Inches', abbr: 'in', full: 'inches' },
    { name: 'Yards', abbr: 'yd', full: 'yards' },
    { name: 'Miles', abbr: 'mi', full: 'miles' }
  ],
  metric: [
    { name: 'Meters', abbr: 'm', full: 'meters' },
    { name: 'Centimeters', abbr: 'cm', full: 'centimeters' },
    { name: 'Millimeters', abbr: 'mm', full: 'millimeters' },
    { name: 'Kilometers', abbr: 'km', full: 'kilometers' }
  ]
};

// Widget style configurations
export const STYLES = {
  calibrationPoint: {
    stickerBackgroundColor: '#2d9bf0',
    fontSize: 14
  },
  measurementPoint: {
    stickerBackgroundColor: '#00ff00',
    fontSize: 14
  },
  calibrationLine: {
    lineColor: '#2d9bf0',
    lineThickness: 2
  },
  measurementLine: {
    lineColor: '#00ff00',
    lineThickness: 2
  },
  measurementLabel: {
    textAlign: 'center',
    fontSize: 14
  }
};
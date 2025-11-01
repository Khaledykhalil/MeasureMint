/**
 * Unit tests for measurement utility functions
 */

import {
  convertUnits,
  calculatePixelDistance,
  calculateActualDistance,
  calculateDualAxisDistance,
  formatMeasurement,
  formatFeetInches,
  parseFeetInches,
  isValidCalibration,
  isValidDualAxisCalibration,
  getUnitsForSystem,
  calculateAngle,
  getMeasurementOrientation,
  CONVERSIONS
} from '../measurements';

describe('Unit Conversion', () => {
  test('converts feet to inches correctly', () => {
    expect(convertUnits(1, 'ft', 'in')).toBeCloseTo(12, 2);
    expect(convertUnits(2.5, 'ft', 'in')).toBeCloseTo(30, 2);
  });

  test('converts meters to centimeters correctly', () => {
    expect(convertUnits(1, 'm', 'cm')).toBeCloseTo(100, 2);
    expect(convertUnits(2.5, 'm', 'cm')).toBeCloseTo(250, 2);
  });

  test('converts feet to meters correctly', () => {
    expect(convertUnits(1, 'ft', 'm')).toBeCloseTo(0.3048, 4);
    expect(convertUnits(10, 'ft', 'm')).toBeCloseTo(3.048, 4);
  });

  test('returns same value when converting to same unit', () => {
    expect(convertUnits(5, 'ft', 'ft')).toBe(5);
    expect(convertUnits(100, 'm', 'm')).toBe(100);
  });

  test('throws error for invalid units', () => {
    expect(() => convertUnits(1, 'invalid', 'ft')).toThrow('Invalid unit');
    expect(() => convertUnits(1, 'ft', 'invalid')).toThrow('Invalid unit');
  });

  test('handles all conversion factors correctly', () => {
    expect(CONVERSIONS.toMeters['ft']).toBe(0.3048);
    expect(CONVERSIONS.toMeters['in']).toBe(0.0254);
    expect(CONVERSIONS.toMeters['m']).toBe(1);
    expect(CONVERSIONS.toMeters['cm']).toBe(0.01);
  });
});

describe('Distance Calculations', () => {
  test('calculates pixel distance correctly', () => {
    const point1 = { x: 0, y: 0 };
    const point2 = { x: 3, y: 4 };
    expect(calculatePixelDistance(point1, point2)).toBe(5);
  });

  test('calculates horizontal distance correctly', () => {
    const point1 = { x: 0, y: 5 };
    const point2 = { x: 10, y: 5 };
    expect(calculatePixelDistance(point1, point2)).toBe(10);
  });

  test('calculates vertical distance correctly', () => {
    const point1 = { x: 5, y: 0 };
    const point2 = { x: 5, y: 10 };
    expect(calculatePixelDistance(point1, point2)).toBe(10);
  });

  test('throws error for missing points', () => {
    expect(() => calculatePixelDistance(null, { x: 1, y: 1 })).toThrow('Both points are required');
    expect(() => calculatePixelDistance({ x: 1, y: 1 }, null)).toThrow('Both points are required');
  });

  test('calculates actual distance with calibration', () => {
    const calibration = { pixelsPerUnit: 10 };
    expect(calculateActualDistance(100, calibration)).toBe(10);
    expect(calculateActualDistance(50, calibration)).toBe(5);
  });

  test('throws error for invalid calibration', () => {
    expect(() => calculateActualDistance(100, null)).toThrow('Valid calibration required');
    expect(() => calculateActualDistance(100, {})).toThrow('Valid calibration required');
  });
});

describe('Dual-Axis Distance Calculations', () => {
  test('calculates distance with same X and Y calibration', () => {
    const point1 = { x: 0, y: 0 };
    const point2 = { x: 30, y: 40 };
    const calibration = { pixelsPerUnitX: 10, pixelsPerUnitY: 10 };
    
    // 30/10 = 3, 40/10 = 4, distance = 5
    expect(calculateDualAxisDistance(point1, point2, calibration)).toBe(5);
  });

  test('calculates distance with different X and Y calibration', () => {
    const point1 = { x: 0, y: 0 };
    const point2 = { x: 20, y: 20 };
    const calibration = { pixelsPerUnitX: 10, pixelsPerUnitY: 20 };
    
    // 20/10 = 2, 20/20 = 1, distance = sqrt(4+1) = sqrt(5)
    expect(calculateDualAxisDistance(point1, point2, calibration)).toBeCloseTo(Math.sqrt(5), 4);
  });

  test('throws error for invalid dual-axis calibration', () => {
    const point1 = { x: 0, y: 0 };
    const point2 = { x: 10, y: 10 };
    
    expect(() => calculateDualAxisDistance(point1, point2, null)).toThrow('Valid dual-axis calibration required');
    expect(() => calculateDualAxisDistance(point1, point2, {})).toThrow('Valid dual-axis calibration required');
  });
});

describe('Measurement Formatting', () => {
  test('formats decimal measurements correctly', () => {
    expect(formatMeasurement(12.3456, 'ft', 2)).toBe('12.35');
    expect(formatMeasurement(12.3456, 'ft', 1)).toBe('12.3');
    expect(formatMeasurement(12.3456, 'ft', 3)).toBe('12.346');
  });

  test('handles zero and negative values', () => {
    expect(formatMeasurement(0, 'ft', 2)).toBe('0.00');
    expect(formatMeasurement(-5.5, 'ft', 2)).toBe('-5.50');
  });

  test('handles invalid input', () => {
    expect(formatMeasurement(NaN, 'ft', 2)).toBe('0');
    expect(formatMeasurement(undefined, 'ft', 2)).toBe('0');
  });
});

describe('Feet-Inches Formatting', () => {
  test('formats whole feet correctly', () => {
    expect(formatFeetInches(12)).toBe("12' 0\"");
    expect(formatFeetInches(5)).toBe("5' 0\"");
  });

  test('formats feet and inches correctly', () => {
    expect(formatFeetInches(12.5)).toBe("12' 6\"");
    expect(formatFeetInches(5.25)).toBe("5' 3\"");
    expect(formatFeetInches(10.75)).toBe("10' 9\"");
  });

  test('rounds inches to nearest whole number', () => {
    expect(formatFeetInches(12.54)).toBe("12' 6\""); // 0.54 * 12 = 6.48 → 6
    expect(formatFeetInches(12.58)).toBe("12' 7\""); // 0.58 * 12 = 6.96 → 7
  });

  test('handles 12 inches as next foot', () => {
    expect(formatFeetInches(12.99)).toBe("13' 0\""); // Rounds to 13 feet
  });

  test('handles invalid input', () => {
    expect(formatFeetInches(NaN)).toBe("0' 0\"");
    expect(formatFeetInches(undefined)).toBe("0' 0\"");
  });
});

describe('Feet-Inches Parsing', () => {
  test('parses feet-inches format correctly', () => {
    expect(parseFeetInches("12'6\"")).toBeCloseTo(12.5, 2);
    expect(parseFeetInches("5'3\"")).toBeCloseTo(5.25, 2);
    expect(parseFeetInches("10'9\"")).toBeCloseTo(10.75, 2);
  });

  test('parses feet-inches with spaces', () => {
    expect(parseFeetInches("12' 6\"")).toBeCloseTo(12.5, 2);
    expect(parseFeetInches("5 ' 3 \"")).toBeCloseTo(5.25, 2);
  });

  test('parses feet only', () => {
    expect(parseFeetInches("12'")).toBe(12);
    expect(parseFeetInches("12")).toBe(12);
    expect(parseFeetInches("5.5")).toBe(5.5);
  });

  test('handles decimal feet', () => {
    expect(parseFeetInches("12.5")).toBe(12.5);
    expect(parseFeetInches("10.75'")).toBe(10.75);
  });

  test('handles invalid input', () => {
    expect(parseFeetInches("")).toBe(0);
    expect(parseFeetInches(null)).toBe(0);
    expect(parseFeetInches("abc")).toBe(0);
  });
});

describe('Calibration Validation', () => {
  test('validates correct calibration', () => {
    const calibration = {
      pixelsPerUnit: 10,
      unit: 'ft'
    };
    expect(isValidCalibration(calibration)).toBe(true);
  });

  test('rejects invalid calibration', () => {
    expect(isValidCalibration(null)).toBe(false);
    expect(isValidCalibration({})).toBe(false);
    expect(isValidCalibration({ pixelsPerUnit: 0, unit: 'ft' })).toBe(false);
    expect(isValidCalibration({ pixelsPerUnit: -5, unit: 'ft' })).toBe(false);
    expect(isValidCalibration({ pixelsPerUnit: 10, unit: '' })).toBe(false);
  });

  test('validates correct dual-axis calibration', () => {
    const calibration = {
      pixelsPerUnitX: 10,
      pixelsPerUnitY: 15,
      unit: 'ft'
    };
    expect(isValidDualAxisCalibration(calibration)).toBe(true);
  });

  test('rejects invalid dual-axis calibration', () => {
    expect(isValidDualAxisCalibration(null)).toBe(false);
    expect(isValidDualAxisCalibration({})).toBe(false);
    expect(isValidDualAxisCalibration({ pixelsPerUnitX: 10, unit: 'ft' })).toBe(false);
    expect(isValidDualAxisCalibration({ pixelsPerUnitY: 10, unit: 'ft' })).toBe(false);
  });
});

describe('Unit Systems', () => {
  test('returns imperial units', () => {
    const units = getUnitsForSystem('imperial');
    expect(units).toHaveLength(4);
    expect(units[0].abbr).toBe('ft');
    expect(units[1].abbr).toBe('in');
  });

  test('returns metric units', () => {
    const units = getUnitsForSystem('metric');
    expect(units).toHaveLength(4);
    expect(units[0].abbr).toBe('m');
    expect(units[1].abbr).toBe('cm');
  });

  test('defaults to imperial for unknown system', () => {
    const units = getUnitsForSystem('unknown');
    expect(units[0].abbr).toBe('ft');
  });
});

describe('Angle Calculations', () => {
  test('calculates angle for horizontal line', () => {
    const point1 = { x: 0, y: 0 };
    const point2 = { x: 10, y: 0 };
    expect(calculateAngle(point1, point2)).toBe(0);
  });

  test('calculates angle for vertical line', () => {
    const point1 = { x: 0, y: 0 };
    const point2 = { x: 0, y: 10 };
    expect(calculateAngle(point1, point2)).toBeCloseTo(Math.PI / 2, 4);
  });

  test('calculates angle for diagonal line', () => {
    const point1 = { x: 0, y: 0 };
    const point2 = { x: 10, y: 10 };
    expect(calculateAngle(point1, point2)).toBeCloseTo(Math.PI / 4, 4);
  });
});

describe('Measurement Orientation', () => {
  test('identifies horizontal orientation', () => {
    const point1 = { x: 0, y: 0 };
    const point2 = { x: 10, y: 0 };
    expect(getMeasurementOrientation(point1, point2)).toBe('horizontal');
  });

  test('identifies vertical orientation', () => {
    const point1 = { x: 0, y: 0 };
    const point2 = { x: 0, y: 10 };
    expect(getMeasurementOrientation(point1, point2)).toBe('vertical');
  });

  test('identifies diagonal orientation', () => {
    const point1 = { x: 0, y: 0 };
    const point2 = { x: 10, y: 10 };
    expect(getMeasurementOrientation(point1, point2)).toBe('diagonal');
  });

  test('handles near-horizontal as horizontal with threshold', () => {
    const point1 = { x: 0, y: 0 };
    const point2 = { x: 10, y: 1 }; // About 5.7 degrees
    expect(getMeasurementOrientation(point1, point2, 15)).toBe('horizontal');
  });

  test('handles near-vertical as vertical with threshold', () => {
    const point1 = { x: 0, y: 0 };
    const point2 = { x: 1, y: 10 }; // About 84.3 degrees
    expect(getMeasurementOrientation(point1, point2, 15)).toBe('vertical');
  });
});

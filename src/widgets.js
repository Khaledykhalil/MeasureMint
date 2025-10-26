/**
 * Widgets Module
 * 
 * This module handles all interactions with the Miro board widgets.
 * It provides a clean interface for creating and managing visual elements
 * on the Miro board, ensuring consistent styling and behavior.
 * 
 * Key features:
 * - Creation of measurement points and lines
 * - Management of calibration markers
 * - Text label generation for measurements
 * - Consistent styling across all visual elements
 * 
 * The module abstracts away the complexity of working directly with the Miro SDK,
 * providing simple, task-focused functions for common operations.
 * 
 * @module widgets
 */

import { STYLES } from './constants.js';

/**
 * Create a temporary point marker on the board
 * @param {Object} point - Point coordinates {x, y}
 * @param {string} type - Type of point ('calibration' or 'measurement')
 * @param {string} text - Text to display on the point
 * @returns {Promise<Object>} Created widget
 */
export async function createPointMarker(point, type, text) {
  const style = type === 'calibration' ? STYLES.calibrationPoint : STYLES.measurementPoint;
  
  return await miro.board.widgets.create({
    type: 'sticker',
    x: point.x,
    y: point.y,
    style: style,
    text: text
  });
}

/**
 * Create a line between two points
 * @param {Object} startPoint - Start point coordinates {x, y}
 * @param {Object} endPoint - End point coordinates {x, y}
 * @param {string} type - Type of line ('calibration' or 'measurement')
 * @returns {Promise<Object>} Created widget
 */
export async function createLine(startPoint, endPoint, type) {
  const style = type === 'calibration' ? STYLES.calibrationLine : STYLES.measurementLine;
  
  return await miro.board.widgets.create({
    type: 'line',
    startPosition: startPoint,
    endPosition: endPoint,
    style: style
  });
}

/**
 * Create a measurement label
 * @param {Object} position - Label position {x, y}
 * @param {string} text - Label text
 * @param {number} measurementId - ID of the measurement
 * @returns {Promise<Object>} Created widget
 */
export async function createLabel(position, text, measurementId) {
  return await miro.board.widgets.create({
    type: 'text',
    x: position.x,
    y: position.y,
    text: text,
    metadata: { measurementId },
    style: STYLES.measurementLabel
  });
}

/**
 * Create a complete measurement visualization
 * @param {Object} measurement - Measurement data
 * @param {number} measurementId - ID of the measurement
 * @returns {Promise<Array>} Created widgets
 */
export async function createMeasurementVisuals(measurement, measurementId) {
  const { point1, point2, distance, unit } = measurement;
  
  const line = await createLine(point1, point2, 'measurement');
  
  const labelPosition = {
    x: (point1.x + point2.x) / 2,
    y: (point1.y + point2.y) / 2
  };
  
  const label = await createLabel(
    labelPosition,
    `${distance} ${unit}`,
    measurementId
  );
  
  return [line, label];
}

/**
 * Create calibration visualization
 * @param {Object} point1 - First calibration point
 * @param {Object} point2 - Second calibration point
 * @returns {Promise<Array>} Created widgets
 */
export async function createCalibrationVisuals(point1, point2) {
  const marker1 = await createPointMarker(point1, 'calibration', '1');
  const marker2 = await createPointMarker(point2, 'calibration', '2');
  const line = await createLine(point1, point2, 'calibration');
  
  return [marker1, marker2, line];
}
/**
 * MeasureMint Core Application
 * 
 * This is the main application file that coordinates all the different modules
 * and handles the core measurement functionality. It integrates with the Miro
 * SDK and manages user interactions.
 * 
 * Key features:
 * - Miro SDK integration and initialization
 * - Event handling for user interactions
 * - Coordination between different modules
 * - UI state management and updates
 * 
 * The application is built with a modular architecture where:
 * - Constants module provides configuration values
 * - Utils module handles calculations and conversions
 * - Widgets module manages Miro board elements
 * - State module maintains application state
 * 
 * This modular approach allows for:
 * - Easier maintenance and updates
 * - Better code organization
 * - Improved testing capabilities
 * - Clear separation of concerns
 * 
 * Each measurement is independent and maintains its own calibration data,
 * allowing users to have multiple measurements with different scales on
 * the same image or PDF.
 * 
 * @module measuremint
 */

import { CONVERSIONS } from './src/constants.js';
import { convertUnits, getAllConversions, formatNumber, calculateDistance } from './src/utils.js';
import { createPointMarker, createLine, createLabel, createMeasurementVisuals, createCalibrationVisuals } from './src/widgets.js';
import { State } from './src/state.js';  // Initialize application state
  const state = new State();

// Miro SDK initialization
async function initMiroSDK() {
  try {
    await miro.board.ui.on('selection:update', handleSelection);
    state.miroBoard = await miro.board.getInfo();
    updateUI();
  } catch (error) {
    console.error('Failed to initialize Miro SDK:', error);
    updateStatus('error', 'Failed to initialize Miro SDK');
  }
}

// Handle selection changes on the Miro board
async function handleSelection() {
  const selection = await miro.board.getSelection();
  if (selection.length === 1) {
    const item = selection[0];
    if (item.type === 'image' || (item.type === 'pdf' && item.contentUrl)) {
      state.selectedItem = item;
      updateUI();
      updateStatus('success', `Selected ${item.type}: ${item.title || 'Untitled'}`);
    } else {
      state.selectedItem = null;
      updateUI();
      updateStatus('warning', 'Please select an image or PDF from the board');
    }
  } else {
    state.selectedItem = null;
    updateUI();
    updateStatus('info', 'Please select a single image or PDF from the board');
  }
}

// Get coordinates relative to the selected item
function getRelativeCoordinates(x, y) {
  if (!state.selectedItem) return null;
  
  const item = state.selectedItem;
  const itemX = item.x - item.width / 2;
  const itemY = item.y - item.height / 2;
  
  return {
    x: x - itemX,
    y: y - itemY
  };
}

// Convert Miro coordinates to image/PDF coordinates
function convertToItemScale(point) {
  if (!state.selectedItem) return null;
  
  const relativePoint = getRelativeCoordinates(point.x, point.y);
  if (!relativePoint) return null;
  
  return {
    x: (relativePoint.x / state.selectedItem.width),
    y: (relativePoint.y / state.selectedItem.height)
  };
}

// Convert units between different measurement systems
function convertUnits(value, fromUnit, toUnit) {
  const meters = value * CONVERSIONS.toMeters[fromUnit];
  return meters / CONVERSIONS.toMeters[toUnit];
}

function getAllConversions(value, fromUnit) {
  const conversions = {};
  for (const unit in CONVERSIONS.toMeters) {
    conversions[unit] = convertUnits(value, fromUnit, unit);
  }
  return conversions;
}

function formatNumber(num, decimals = 2) {
  return parseFloat(num.toFixed(decimals));
}

// Handle clicks on the board for measurements
async function handleBoardClick(e) {
  if (!state.selectedItem) return;
  
  const clickedPoint = { x: e.x, y: e.y };
  const scaledPoint = convertToItemScale(clickedPoint);
  
  if (!scaledPoint) return;
  
  if (state.mode === 'calibrate') {
    handleCalibrationClick(clickedPoint, scaledPoint);
  } else if (state.mode === 'measure') {
    handleMeasurementClick(clickedPoint, scaledPoint);
  }
}

// Handle calibration clicks
async function handleCalibrationClick(clickedPoint, scaledPoint) {
  if (state.clickCount === 0) {
    state.firstPoint = { raw: clickedPoint, scaled: scaledPoint };
    state.clickCount++;
    
    // Draw temporary point
    await miro.board.widgets.create({
      type: 'sticker',
      x: clickedPoint.x,
      y: clickedPoint.y,
      style: {
        stickerBackgroundColor: '#2d9bf0',
        fontSize: 14
      },
      text: '1'
    });
    
    updateStatus('info', 'Click second point for calibration');
  } else {
    const pixelDistance = Math.sqrt(
      Math.pow(clickedPoint.x - state.firstPoint.raw.x, 2) +
      Math.pow(clickedPoint.y - state.firstPoint.raw.y, 2)
    );
    
    // Show calibration dialog
    const calibrationValue = await showCalibrationDialog();
    if (calibrationValue) {
      state.currentCalibration = {
        point1: state.firstPoint.scaled,
        point2: scaledPoint,
        pixelDistance: pixelDistance,
        distance: calibrationValue,
        unit: state.calibrationUnit
      };
      
      // Draw calibration line
      await miro.board.widgets.create({
        type: 'line',
        startPosition: { x: state.firstPoint.raw.x, y: state.firstPoint.raw.y },
        endPosition: { x: clickedPoint.x, y: clickedPoint.y },
        style: {
          lineColor: '#2d9bf0',
          lineThickness: 2
        }
      });
      
      state.mode = 'measure';
      state.clickCount = 0;
      state.firstPoint = null;
      updateUI();
      updateStatus('success', 'Calibration complete - ready to measure');
    }
  }
}

// Handle measurement clicks
async function handleMeasurementClick(clickedPoint, scaledPoint) {
  if (!state.currentCalibration) {
    updateStatus('error', 'Please calibrate before measuring');
    return;
  }

  if (state.clickCount === 0) {
    state.firstPoint = { raw: clickedPoint, scaled: scaledPoint };
    state.clickCount++;
    
    // Draw temporary point
    await miro.board.widgets.create({
      type: 'sticker',
      x: clickedPoint.x,
      y: clickedPoint.y,
      style: {
        stickerBackgroundColor: '#00ff00',
        fontSize: 14
      },
      text: '1'
    });
    
    updateStatus('info', 'Click second point to complete measurement');
  } else {
    // Calculate distance using current calibration
    const dx = scaledPoint.x - state.firstPoint.scaled.x;
    const dy = scaledPoint.y - state.firstPoint.scaled.y;
    const pixelDistance = Math.sqrt(dx * dx + dy * dy);
    const distance = (pixelDistance * state.currentCalibration.distance) / state.currentCalibration.pixelDistance;

    if (distance !== null) {
      const measurement = {
        point1: state.firstPoint.scaled,
        point2: scaledPoint,
        distance: distance,
        unit: state.unit,
        // Store the calibration data with the measurement
        calibration: { ...state.currentCalibration }
      };
      
      state.measurements.push(measurement);
      
      // Draw measurement line and label
      const displayDistance = formatNumber(distance);
      
      await miro.board.widgets.create([
        {
          type: 'line',
          startPosition: { x: state.firstPoint.raw.x, y: state.firstPoint.raw.y },
          endPosition: { x: clickedPoint.x, y: clickedPoint.y },
          style: {
            lineColor: '#00ff00',
            lineThickness: 2
          }
        },
        {
          type: 'text',
          x: (state.firstPoint.raw.x + clickedPoint.x) / 2,
          y: (state.firstPoint.raw.y + clickedPoint.y) / 2,
          text: `${displayDistance} ${state.unit}`,
          metadata: { 
            measurementId: state.measurements.length - 1 
          },
          style: {
            textAlign: 'center',
            fontSize: 14
          }
        }
      ]);
    }
    
    state.clickCount = 0;
    state.firstPoint = null;
    updateUI();
    updateStatus('success', 'Measurement complete');
  }
}

function updateStatus(type, message) {
  const statusBar = document.getElementById('status');
  if (statusBar) {
    statusBar.className = `status ${type}`;
    statusBar.textContent = message;
  }
}

// UI updates
function updateUI() {
  const statusBar = document.getElementById('status');
  if (statusBar) {
    if (state.mode === 'measure' || state.mode === 'calibrate') {
      // Enable board click handling
      miro.board.ui.on('click', handleBoardClick);
    } else {
      // Disable board click handling
      miro.board.ui.off('click');
    }
    
    const indicator = statusBar.querySelector('.status-indicator');
    const text = statusBar.querySelector('span');
    
    if (state.currentCalibration) {
      indicator.className = 'status-indicator';
      text.textContent = 'Ready to measure';
    } else if (state.mode === 'calibrate') {
      indicator.className = 'status-indicator warning';
      text.textContent = 'Click two points on the board to calibrate';
    } else if (state.mode === 'measure') {
      indicator.className = 'status-indicator';
      text.textContent = 'Click two points on the board to measure';
    } else if (state.selectedItem) {
      indicator.className = 'status-indicator';
      text.textContent = 'Item selected - ready to calibrate';
    } else {
      indicator.className = 'status-indicator error';
      text.textContent = 'Please select an image or PDF from the board';
    }
  }
  
  // Update selected item info
  const selectedItemInfo = document.getElementById('selectedItemInfo');
  if (selectedItemInfo && state.selectedItem) {
    const name = document.getElementById('selectedItemName');
    const type = document.getElementById('selectedItemType');
    const size = document.getElementById('selectedItemSize');
    
    if (name) name.textContent = state.selectedItem.title || 'Untitled';
    if (type) type.textContent = state.selectedItem.type || 'unknown';
    if (size) size.textContent = `${state.selectedItem.width}x${state.selectedItem.height}`;
    
    selectedItemInfo.style.display = 'block';
  } else if (selectedItemInfo) {
    selectedItemInfo.style.display = 'none';
  }
  
  // Update unit system buttons
  const unitButtons = document.querySelectorAll('.unit-btn');
  unitButtons.forEach(btn => {
    btn.classList.toggle('active', btn.dataset.unit === state.unitSystem);
  });
  
  // Update mode buttons
  const modeButtons = document.querySelectorAll('.mode-btn');
  modeButtons.forEach(btn => {
    btn.classList.toggle('active', btn.dataset.mode === state.mode);
    btn.disabled = !state.selectedItem;
  });
}

// Initialize
window.addEventListener('load', initMiroSDK);

// Export functions for use in HTML
window.setMode = function(mode) {
  state.mode = mode;
  state.clickCount = 0;
  state.firstPoint = null;
  updateUI();
};

window.setUnitSystem = function(unitSystem) {
  state.unitSystem = unitSystem;
  state.unit = CONVERSIONS[unitSystem][0].abbr;
  state.calibrationUnit = state.unit;
  updateUI();
};

window.setUnit = function(unit) {
  state.unit = unit;
  updateUI();
};
/**
 * State management for the MeasureMint application
 */
export class State {
  constructor() {
    this.mode = 'none';
    this.currentCalibration = null;
    this.measurements = [];
    this.selectedItem = null;
    this.unit = 'ft';
    this.unitSystem = 'imperial';
    this.clickCount = 0;
    this.firstPoint = null;
    this.calibrationUnit = 'ft';
    this.miroBoard = null;
    
    // Bind methods
    this.reset = this.reset.bind(this);
    this.setMode = this.setMode.bind(this);
    this.setUnit = this.setUnit.bind(this);
    this.setUnitSystem = this.setUnitSystem.bind(this);
  }
  
  /**
   * Reset measurement state
   */
  reset() {
    this.clickCount = 0;
    this.firstPoint = null;
  }
  
  /**
   * Set the current mode
   * @param {string} mode - New mode ('none', 'calibrate', or 'measure')
   */
  setMode(mode) {
    this.mode = mode;
    this.reset();
  }
  
  /**
   * Set the current unit
   * @param {string} unit - New unit
   */
  setUnit(unit) {
    this.unit = unit;
  }
  
  /**
   * Set the unit system and update current unit
   * @param {string} system - New unit system ('metric' or 'imperial')
   */
  setUnitSystem(system) {
    this.unitSystem = system;
    this.unit = system === 'metric' ? 'm' : 'ft';
    this.calibrationUnit = this.unit;
  }
  
  /**
   * Add a new measurement
   * @param {Object} measurement - Measurement data
   */
  addMeasurement(measurement) {
    this.measurements.push({
      ...measurement,
      calibration: { ...this.currentCalibration }
    });
  }
  
  /**
   * Set the current calibration
   * @param {Object} calibration - Calibration data
   */
  setCalibration(calibration) {
    this.currentCalibration = { ...calibration };
  }
  
  /**
   * Set the selected item
   * @param {Object} item - Selected Miro item
   */
  setSelectedItem(item) {
    this.selectedItem = item;
  }
  
  /**
   * Get measurement by ID
   * @param {number} id - Measurement ID
   * @returns {Object|null} Measurement data or null if not found
   */
  getMeasurement(id) {
    return this.measurements[id] || null;
  }
  
  /**
   * Convert item coordinates to board coordinates
   * @param {Object} point - Point in item coordinates
   * @returns {Object|null} Point in board coordinates or null if no item selected
   */
  itemToBoardCoordinates(point) {
    if (!this.selectedItem) return null;
    
    const itemX = this.selectedItem.x - this.selectedItem.width / 2;
    const itemY = this.selectedItem.y - this.selectedItem.height / 2;
    
    return {
      x: itemX + (point.x * this.selectedItem.width),
      y: itemY + (point.y * this.selectedItem.height)
    };
  }
  
  /**
   * Convert board coordinates to item coordinates
   * @param {Object} point - Point in board coordinates
   * @returns {Object|null} Point in item coordinates or null if no item selected
   */
  boardToItemCoordinates(point) {
    if (!this.selectedItem) return null;
    
    const itemX = this.selectedItem.x - this.selectedItem.width / 2;
    const itemY = this.selectedItem.y - this.selectedItem.height / 2;
    
    return {
      x: (point.x - itemX) / this.selectedItem.width,
      y: (point.y - itemY) / this.selectedItem.height
    };
  }
}
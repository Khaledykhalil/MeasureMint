'use client';

import { useState, useEffect } from 'react';
import { 
  MdImage, 
  MdSettings, 
  MdRefresh, 
  MdBarChart, 
  MdEdit,
  MdSave,
  MdContentCopy
} from 'react-icons/md';
import { 
  TbRuler, 
  TbRulerMeasure, 
  TbRectangle, 
  TbNumbers, 
  TbWaveSine,
  TbBox,
  TbAngle,
  TbCircle,
  TbClipboardList,
  TbLayersDifference,
  TbStairs,
  TbLayoutGridAdd,
  TbSquare,
  TbVectorBezier2,
  TbCube
} from 'react-icons/tb';

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

// Architectural drawing scales
const ARCHITECTURAL_SCALES = {
  imperial: [
    { name: '1/16" = 1\'', ratio: 192, description: 'Large scale plans' },
    { name: '3/32" = 1\'', ratio: 128, description: 'Large scale plans' },
    { name: '1/8" = 1\'', ratio: 96, description: 'Floor plans, elevations' },
    { name: '3/16" = 1\'', ratio: 64, description: 'Floor plans' },
    { name: '1/4" = 1\'', ratio: 48, description: 'Standard floor plans' },
    { name: '3/8" = 1\'', ratio: 32, description: 'Detail drawings' },
    { name: '1/2" = 1\'', ratio: 24, description: 'Large details' },
    { name: '3/4" = 1\'', ratio: 16, description: 'Large details' },
    { name: '1" = 1\'', ratio: 12, description: 'Full size details' },
    { name: '1 1/2" = 1\'', ratio: 8, description: 'Large details' },
    { name: '3" = 1\'', ratio: 4, description: 'Very large details' }
  ],
  metric: [
    { name: '1:100', ratio: 100, description: 'Floor plans' },
    { name: '1:50', ratio: 50, description: 'Standard floor plans' },
    { name: '1:20', ratio: 20, description: 'Detail drawings' },
    { name: '1:10', ratio: 10, description: 'Large details' },
    { name: '1:5', ratio: 5, description: 'Very large details' },
    { name: '1:200', ratio: 200, description: 'Site plans' }
  ]
};

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

// Function to format measurements in feet and inches
function formatFeetInches(valueInFeet) {
  const totalInches = valueInFeet * 12;
  const feet = Math.floor(totalInches / 12);
  const inches = Math.round(totalInches % 12);
  
  if (feet === 0) {
    return `${inches}"`;
  } else if (inches === 0) {
    return `${feet}'`;
  } else {
    return `${feet}' ${inches}"`;
  }
}

// Function to format measurement based on unit type and format preference
function formatMeasurement(value, unit, showFeetInches = true, decimals = 2) {
  if (unit === 'ft' && showFeetInches) {
    return formatFeetInches(value);
  }
  return formatNumber(value, decimals);
}


const getStyles = (darkMode) => ({
  body: {
    fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
    background: darkMode ? 'linear-gradient(135deg, #1c1c1e 0%, #2c2c2e 100%)' : 'linear-gradient(135deg, #f5f7fa 0%, #e8ecf1 100%)',
    minHeight: '100vh',
    maxHeight: '100vh',
    overflow: 'auto',
    padding: '12px'
  },
  container: {
    maxWidth: '100%',
    margin: '0 auto'
  },
  header: {
    background: darkMode ? '#2c2c2e' : 'white',
    borderRadius: '12px',
    padding: '12px 16px',
    marginBottom: '12px',
    boxShadow: darkMode ? '0 1px 3px rgba(0, 0, 0, 0.4)' : '0 1px 3px rgba(0, 0, 0, 0.05)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  logoSection: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px'
  },
  logo: {
    width: '24px',
    height: '24px',
    background: '#10bb82',
    borderRadius: '6px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: 'white',
    fontWeight: '700',
    fontSize: '14px'
  },
  brand: {
    display: 'flex',
    flexDirection: 'column'
  },
  brandName: {
    fontSize: '16px',
    fontWeight: '700',
    color: darkMode ? '#ffffff' : '#1a202c',
    letterSpacing: '-0.5px'
  },
  brandTagline: {
    fontSize: '10px',
    color: darkMode ? '#8e8e93' : '#718096',
    fontWeight: '500',
    textTransform: 'uppercase',
    letterSpacing: '0.5px'
  },
  unitToggle: {
    display: 'flex',
    gap: '4px',
    background: darkMode ? '#1c1c1e' : '#f7fafc',
    padding: '3px',
    borderRadius: '8px'
  },
  unitBtn: {
    padding: '6px 12px',
    border: 'none',
    borderRadius: '6px',
    fontSize: '12px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    color: darkMode ? '#aeaeb2' : '#4a5568',
    background: 'transparent'
  },
  unitBtnActive: {
    background: darkMode ? '#2c2c2e' : 'white',
    color: '#10bb82',
    boxShadow: darkMode ? '0 2px 4px rgba(0, 0, 0, 0.3)' : '0 2px 4px rgba(0, 0, 0, 0.08)'
  },
  panel: {
    background: darkMode ? '#2c2c2e' : 'white',
    borderRadius: '12px',
    padding: '16px',
    boxShadow: darkMode ? '0 1px 3px rgba(0, 0, 0, 0.4)' : '0 1px 3px rgba(0, 0, 0, 0.05)',
    marginBottom: '12px'
  },
  panelTitle: {
    fontSize: '12px',
    fontWeight: '600',
    color: darkMode ? '#8e8e93' : '#718096',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
    marginBottom: '12px',
    paddingBottom: '8px',
    borderBottom: darkMode ? '2px solid #3a3a3c' : '2px solid #e2e8f0'
  },
  toolsGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr',
    gap: '8px'
  },
  toolCard: {
    background: darkMode ? '#1c1c1e' : '#f8fafc',
    border: darkMode ? '2px solid #3a3a3c' : '2px solid #2d3748',
    borderRadius: '8px',
    padding: '10px',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    position: 'relative',
    overflow: 'hidden',
    outline: 'none'
  },
  toolCardHover: {
    borderColor: '#10bb82',
    boxShadow: '0 4px 8px rgba(16, 187, 130, 0.15)',
    transform: 'translateY(-1px)'
  },
  toolIcon: {
    width: '32px',
    height: '32px',
    borderRadius: '8px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
    fontSize: '18px'
  },
  toolIcon1: {
    background: '#10bb82'
  },
  toolIcon2: {
    background: '#10bb82'
  },
  toolIcon3: {
    background: '#10bb82'
  },
  toolIcon4: {
    background: '#10bb82'
  },
  toolContent: {
    flex: 1,
    minWidth: 0
  },
  toolName: {
    fontSize: '13px',
    fontWeight: '600',
    color: darkMode ? '#ffffff' : '#1a202c',
    marginBottom: '2px',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis'
  },
  toolDescription: {
    fontSize: '11px',
    color: darkMode ? '#8e8e93' : '#718096',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis'
  },
  emptyCard: {
    background: darkMode ? '#1c1c1e' : '#fafafa',
    border: darkMode ? '2px dashed #3a3a3c' : '2px dashed #cbd5e0',
    borderRadius: '12px',
    padding: '32px',
    textAlign: 'center',
    color: darkMode ? '#636366' : '#a0aec0',
    cursor: 'default'
  },
  emptyIcon: {
    fontSize: '32px',
    marginBottom: '8px'
  },
  measurementDisplay: {
    background: darkMode ? '#1c1c1e' : 'white',
    border: '2px solid #10bb82',
    borderRadius: '12px',
    padding: '24px',
    marginBottom: '16px',
    textAlign: 'center'
  },
  measurementValue: {
    fontSize: '42px',
    fontWeight: '700',
    color: '#10bb82',
    marginBottom: '8px',
    fontFamily: 'monospace'
  },
  measurementUnit: {
    fontSize: '16px',
    color: darkMode ? '#8e8e93' : '#718096',
    textTransform: 'uppercase',
    letterSpacing: '1px',
    fontWeight: '600'
  },
  modal: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'rgba(0,0,0,0.5)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000
  },
  modalContent: {
    background: darkMode ? '#2c2c2e' : 'white',
    borderRadius: '16px',
    padding: '32px',
    maxWidth: '500px',
    width: '90%',
    maxHeight: '90vh',
    overflowY: 'auto',
    boxShadow: darkMode ? '0 20px 60px rgba(0,0,0,0.6)' : '0 20px 60px rgba(0,0,0,0.3)'
  },
  modalTitle: {
    fontSize: '24px',
    fontWeight: '700',
    color: darkMode ? '#ffffff' : '#1a202c',
    marginBottom: '24px',
    paddingBottom: '16px',
    borderBottom: darkMode ? '2px solid #3a3a3c' : '2px solid #e2e8f0'
  },
  formGroup: {
    marginBottom: '24px'
  },
  label: {
    display: 'block',
    fontSize: '14px',
    fontWeight: '600',
    marginBottom: '8px',
    color: darkMode ? '#aeaeb2' : '#4a5568',
    textTransform: 'uppercase',
    letterSpacing: '0.5px'
  },
  input: {
    width: '100%',
    padding: '12px 16px',
    border: darkMode ? '2px solid #3a3a3c' : '2px solid #e2e8f0',
    borderRadius: '10px',
    fontSize: '16px',
    boxSizing: 'border-box',
    fontFamily: 'monospace',
    transition: 'border-color 0.2s ease',
    background: darkMode ? '#1c1c1e' : 'white',
    color: darkMode ? '#ffffff' : '#1a202c'
  },
  unitGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, 1fr)',
    gap: '12px'
  },
  unitGridBtn: {
    padding: '12px 16px',
    border: darkMode ? '2px solid #3a3a3c' : '2px solid #e2e8f0',
    borderRadius: '10px',
    background: darkMode ? '#1c1c1e' : 'white',
    fontSize: '14px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.2s',
    textAlign: 'center',
    color: darkMode ? '#aeaeb2' : '#4a5568'
  },
  unitGridBtnActive: {
    background: '#10bb82',
    color: 'white',
    borderColor: '#10bb82'
  },
  modalButtons: {
    display: 'flex',
    gap: '12px',
    marginTop: '24px'
  },
  btnPrimary: {
    flex: 1,
    padding: '10px 16px',
    border: 'none',
    borderRadius: '8px',
    fontSize: '13px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    background: '#10bb82',
    color: 'white',
    boxShadow: '0 2px 8px rgba(16, 187, 130, 0.3)'
  },
  btnSecondary: {
    flex: 1,
    padding: '10px 16px',
    border: darkMode ? '2px solid #3a3a3c' : '2px solid #e2e8f0',
    borderRadius: '8px',
    fontSize: '13px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    background: darkMode ? '#1c1c1e' : 'white',
    color: darkMode ? '#aeaeb2' : '#4a5568'
  },
  historyItem: {
    padding: '16px',
    background: darkMode ? '#1c1c1e' : '#f8fafc',
    border: darkMode ? '2px solid #3a3a3c' : '2px solid #e2e8f0',
    borderRadius: '10px',
    marginBottom: '12px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  historyLabel: {
    color: darkMode ? '#8e8e93' : '#718096',
    fontSize: '14px',
    fontWeight: '500'
  },
  historyValue: {
    fontWeight: '700',
    color: '#10bb82',
    fontFamily: 'monospace',
    fontSize: '16px'
  }
});

export default function PanelPage() {
  const [mode, setMode] = useState('none');
  const [calibration, setCalibration] = useState(null);
  const [calibrationLineId, setCalibrationLineId] = useState(null); // Track calibration line ID
  const [measurements, setMeasurements] = useState([]);
  const [measurementLines, setMeasurementLines] = useState([]); // Track measurement line IDs
  const [selectedImage, setSelectedImage] = useState(null);
  const [unitSystem, setUnitSystem] = useState('imperial');
  const [clickCount, setClickCount] = useState(0);
  const [firstPoint, setFirstPoint] = useState(null);
  const [showCalibrationModal, setShowCalibrationModal] = useState(false);
  const [showUnitsModal, setShowUnitsModal] = useState(false);
  const [showScalePresetsModal, setShowScalePresetsModal] = useState(false);
  const [tempCalibrationDistance, setTempCalibrationDistance] = useState(null);
  const [calibrationUnit, setCalibrationUnit] = useState('ft');
  const [calibrationValue, setCalibrationValue] = useState('');
  const [hoveredCard, setHoveredCard] = useState(null);
  const [calibrationLine, setCalibrationLine] = useState(null);
  const [isFirstMeasurement, setIsFirstMeasurement] = useState(true);
  const showFeetInches = true; // Always show feet-inches format for feet measurements
  
  // UI state for collapsible sections
  const [expandedSection, setExpandedSection] = useState('calibration'); // 'calibration', 'linear', 'area', or null
  
  // Area measurement state
  const [areaPoints, setAreaPoints] = useState([]);
  const [areaShapes, setAreaShapes] = useState([]); // Store completed area shapes
  const [tempAreaLines, setTempAreaLines] = useState([]); // Temporary lines while drawing
  
  // Count tool state
  const [countItems, setCountItems] = useState([]);
  const [countTotal, setCountTotal] = useState(0);
  
  // Polyline measurement state
  const [polylinePoints, setPolylinePoints] = useState([]);
  const [polylineShapes, setPolylineShapes] = useState([]); // Store completed polylines
  const [tempPolylineLines, setTempPolylineLines] = useState([]);
  
  // Volume measurement state
  const [volumeBaseArea, setVolumeBaseArea] = useState(null);
  const [volumeHeight, setVolumeHeight] = useState('');
  const [showVolumeModal, setShowVolumeModal] = useState(false);
  
  // Angle measurement state
  const [anglePoints, setAnglePoints] = useState([]);
  const [angleLines, setAngleLines] = useState([]);
  
  // Circle measurement state
  const [circleCenter, setCircleCenter] = useState(null);
  const [circleRadius, setCircleRadius] = useState(null);
  const [tempCircle, setTempCircle] = useState(null);

  // Cutout/Subtract Areas state
  const [cutoutMainPoints, setCutoutMainPoints] = useState([]);
  const [cutoutMainLines, setCutoutMainLines] = useState([]);
  const [cutoutPolygons, setCutoutPolygons] = useState([]); // Array of cutout polygons
  const [currentCutoutPoints, setCurrentCutoutPoints] = useState([]);
  const [currentCutoutLines, setCurrentCutoutLines] = useState([]);
  const [cutoutMode, setCutoutMode] = useState('main'); // 'main', 'cutout', or 'done'

  // Slope/Pitch measurement state
  const [slopePoints, setSlopePoints] = useState([]);
  const [slopeLine, setSlopeLine] = useState(null);

  // Multiple Scale Regions state
  const [scaleRegions, setScaleRegions] = useState([]); // Array of {id, name, bounds, calibration, shapeId, labelId}
  const [currentRegionPoints, setCurrentRegionPoints] = useState([]);
  const [currentRegionLines, setCurrentRegionLines] = useState([]);
  const [showScaleRegionsModal, setShowScaleRegionsModal] = useState(false);
  const [activeScaleRegion, setActiveScaleRegion] = useState(null); // Currently selected region for measurements
  const [tempRegionCalibration, setTempRegionCalibration] = useState(null);

  // Dark mode state
  const [darkMode, setDarkMode] = useState(false);

  // Custom modal state (replaces browser alerts)
  const [customModal, setCustomModal] = useState({
    show: false,
    title: '',
    message: '',
    type: 'alert', // 'alert' or 'confirm'
    onConfirm: null,
    onCancel: null
  });

  // Custom modal helpers
  const showAlert = (message, title = 'MeasureMint') => {
    return new Promise((resolve) => {
      setCustomModal({
        show: true,
        title,
        message,
        type: 'alert',
        onConfirm: () => {
          setCustomModal({ ...customModal, show: false });
          resolve();
        },
        onCancel: null
      });
    });
  };

  const showConfirm = (message, title = 'MeasureMint') => {
    return new Promise((resolve) => {
      setCustomModal({
        show: true,
        title,
        message,
        type: 'confirm',
        onConfirm: () => {
          setCustomModal({ ...customModal, show: false });
          resolve(true);
        },
        onCancel: () => {
          setCustomModal({ ...customModal, show: false });
          resolve(false);
        }
      });
    });
  };

  // Generate styles based on dark mode
  const styles = getStyles(darkMode);

  // Add escape key listener to exit measurement mode
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === 'Escape' && mode === 'measure') {
        // Remove the current measurement line if it exists
        if (calibrationLine) {
          window.miro.board.remove(calibrationLine).catch(console.error);
          setCalibrationLine(null);
        }
        setMode('none');
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [mode, calibrationLine]);

  // Note: Miro SDK v2 doesn't support board.ui.on('click')
  // Instead, we use helper functions that prompt users to click and select positions
  // See the helper functions below for each measurement mode

  const selectImage = async () => {
    try {
      const selection = await window.miro.board.getSelection();
      if (selection.length === 0) {
        return;
      }
      
      const image = selection.find(item => item.type === 'image');
      if (!image) {
        return;
      }
      
      setSelectedImage(image);
    } catch (error) {
      console.error('Error selecting image:', error);
      alert('Error selecting image. Please try again.');
    }
  };

  const applyScalePreset = async (scale) => {
    // For architectural scales, we can set up calibration with minimal input
    // User can either draw a reference line OR directly enter a known dimension
    
    setShowScalePresetsModal(false);
    
    // Ask user to choose calibration method
    const method = await showConfirm(
      `Selected: ${scale.name} (${scale.description})\n\n` +
      `Choose calibration method:\n\n` +
      `OK = Direct Entry (fastest - just enter a dimension from your drawing)\n` +
      `Cancel = Draw Reference Line (most accurate - draw line on your board)\n\n` +
      `Recommended: Direct Entry for speed!`,
      'MeasureMint - Calibration Method'
    );
    
    if (method) {
      // DIRECT ENTRY METHOD - No reference line needed!
      const dimensionInput = prompt(
        `Enter a known dimension from your drawing:\n\n` +
        `Examples: 10, 12.5, 12'6", 6"\n\n` +
        `This can be any dimension you see marked on the drawing.`
      );
      
      if (!dimensionInput || dimensionInput.trim() === '') {
        alert('Cancelled. No calibration applied.');
        return;
      }
      
      // Parse the input (handles feet-inches format)
      const parsedValue = parseFeetInches(dimensionInput);
      
      if (parsedValue === null || parsedValue <= 0) {
        alert('Invalid dimension. Please enter a valid number (e.g., 10, 12.5, 12\'6")');
        return;
      }
      
      // Ask for the unit if not already specified in the input
      let unit = 'ft'; // default
      
      if (!dimensionInput.includes("'") && !dimensionInput.includes('"')) {
        const unitInput = prompt(
          `What unit is "${dimensionInput}" measured in?\n\n` +
          `Options: ft, in, m, cm, mm, yd\n` +
          `(Press Cancel to use feet)`,
          'ft'
        );
        
        if (unitInput && CONVERSIONS.toMeters[unitInput.trim()]) {
          unit = unitInput.trim();
        }
      }
      
      // Convert parsed value to the selected unit if needed
      let actualDistance = parsedValue;
      if (dimensionInput.includes("'") || dimensionInput.includes('"')) {
        // Input was in feet/inches, convert to target unit
        actualDistance = convertUnits(parsedValue, 'ft', unit);
      }
      
      // Now ask user to draw a line on the dimension so we can auto-calculate pixels
      await showAlert(
        `You entered: ${formatMeasurement(actualDistance, unit, true)}\n\n` +
        `Next, please draw a line on the board that represents this dimension.\n\n` +
        `The system will automatically measure the pixel distance.`,
        'MeasureMint - Draw Reference Line'
      );
      
      // Prompt user to select the line they just drew
      await showAlert(
        'Now, please select the line you just drew on the dimension.',
        'MeasureMint - Select Line'
      );
      
      const selection = await miro.board.getSelection();
      
      if (!selection || selection.length === 0) {
        await showAlert('No line selected. Calibration cancelled.', 'Error');
        return;
      }
      
      const selectedLine = selection[0];
      
      if (selectedLine.type !== 'connector') {
        await showAlert('Please select a line (connector). Calibration cancelled.', 'Error');
        return;
      }
      
      // Calculate pixel distance from the selected line
      const startPos = selectedLine.start;
      const endPos = selectedLine.end;
      const pixelDistance = Math.sqrt(
        Math.pow(endPos.x - startPos.x, 2) + 
        Math.pow(endPos.y - startPos.y, 2)
      );
      
      if (pixelDistance <= 0) {
        await showAlert('Invalid line length. Calibration cancelled.', 'Error');
        return;
      }
      
      // Optionally delete the reference line
      const shouldDelete = await showConfirm(
        `Pixel distance measured: ${pixelDistance.toFixed(2)} pixels\n\n` +
        `Do you want to delete the reference line?`,
        'MeasureMint - Delete Reference Line?'
      );
      
      if (shouldDelete) {
        await miro.board.remove(selectedLine);
      }
      
      // Create the calibration
      const newCalibration = {
        pixelsPerUnit: pixelDistance / actualDistance,
        pixelDistance: pixelDistance,
        actualDistance: actualDistance,
        unit: unit,
        ratio: scale.ratio,
        scaleName: scale.name,
        timestamp: new Date().toISOString()
      };
      
      setCalibration(newCalibration);
      
      alert(
        `✓ Calibration applied successfully!\n\n` +
        `${scale.name} (1:${scale.ratio})\n` +
        `Dimension: ${formatMeasurement(actualDistance, unit, true)}\n` +
        `Screen: ${pixelDistance.toFixed(0)} pixels\n\n` +
        `You can now start taking measurements!`
      );
      
      // Automatically start measurement mode
      setMode('measure');
      await startMeasurement();
      
    } else {
      // DRAW REFERENCE LINE METHOD (original method)
      // Store the scale preset and start calibration process
      setTempCalibrationDistance(scale);
      alert(
        `Draw a calibration line on your drawing:\n\n` +
        `1. The line will appear on your board\n` +
        `2. Drag the endpoints to match a known distance\n` +
        `3. Enter the actual distance when prompted\n\n` +
        `The scale ratio (${scale.ratio}:1) will be applied automatically!`
      );
      await startCalibration();
    }
  };

  const startCalibration = async () => {
    console.log('startCalibration called');
    
    // Check if Miro API is available
    if (!window.miro) {
      await showAlert('Miro API not ready. Please wait a moment and try again.', 'Error');
      return;
    }

    console.log('Miro API available, mode:', mode);

    // If we're in measurement mode, clean up the current measurement line
    if (mode === 'measure' && calibrationLine) {
      try {
        await window.miro.board.remove(calibrationLine);
      } catch (error) {
        console.error('Error removing measurement line:', error);
      }
    }

    setMode('calibrate');
    setClickCount(0);
    setFirstPoint(null);
    setCalibrationLine(null);
    setIsFirstMeasurement(true); // Reset for new calibration
    
    console.log('Creating calibration line...');
    
    try {
      // Create a draggable line for the user to position
      const viewport = await window.miro.board.viewport.get();
      console.log('Viewport:', viewport);
      
      const centerX = viewport.x + viewport.width / 2;
      const centerY = viewport.y + viewport.height / 2;
      
      // Position line to the right side of viewport to be more visible
      const offsetX = viewport.width * 0.25; // 25% to the right

      // Create line with draggable endpoints (no dots needed)
      const line = await window.miro.board.createConnector({
        start: {
          position: {
            x: centerX + offsetX - 200,
            y: centerY
          }
        },
        end: {
          position: {
            x: centerX + offsetX + 200,
            y: centerY
          }
        },
        shape: 'straight',
        style: {
          strokeColor: '#f5576c',
          strokeWidth: 2,
          startStrokeCap: 'none',
          endStrokeCap: 'none'
        },
        captions: [{
          content: 'Calibration Line - Drag endpoints to known distance',
          position: 0.5,
          textAlignVertical: 'middle'
        }]
      });

      console.log('Calibration line created:', line.id);
      setCalibrationLine(line);
      await showAlert('Calibration line created! Drag the endpoints to match a known distance on your image, then click "Set Calibration Distance".', 'Success');
    } catch (error) {
      console.error('Error starting calibration:', error);
      await showAlert('Error creating calibration line: ' + error.message, 'Error');
      setMode('none');
    }
  };

  const finishCalibration = async () => {
    if (!calibrationLine) {
      return;
    }

    try {
      // Get fresh reference to the line to get its current endpoints
      const items = await window.miro.board.get({ id: [calibrationLine.id] });
      
      if (items.length !== 1) {
        throw new Error('Could not find calibration line');
      }

      const line = items[0];
      const start = line.start.position;
      const end = line.end.position;

      const distance = Math.sqrt(
        Math.pow(end.x - start.x, 2) + 
        Math.pow(end.y - start.y, 2)
      );

      setTempCalibrationDistance(distance);
      setShowCalibrationModal(true);
    } catch (error) {
      console.error('Error finishing calibration:', error);
      alert('Error: ' + error.message);
    }
  };

  // NEW: Select and reuse an existing calibration line
  const selectExistingCalibration = async () => {
    try {
      alert(
        'Select an existing green calibration line on the board.\n\n' +
        'The line\'s calibration values will be automatically loaded and reused for new measurements!'
      );
      
      // Get user selection
      const selection = await window.miro.board.getSelection();
      
      if (selection.length === 0) {
        alert('No items selected. Please select a calibration line and try again.');
        return;
      }
      
      // Find a connector in the selection
      const connector = selection.find(item => item.type === 'connector');
      
      if (!connector) {
        alert('Please select a calibration line (connector/arrow).');
        return;
      }
      
      // Check if it has a calibration caption
      const caption = connector.captions?.[0]?.content || '';
      
      if (!caption.includes('Calibration:')) {
        alert('This line doesn\'t appear to be a calibration line. Please select a green calibration line.');
        return;
      }
      
      // Parse the calibration values from the caption
      // Format: "Calibration: 10' 6" (1/4" = 1'-0")" or "Calibration: 10.5 ft"
      const calibrationMatch = caption.match(/Calibration:\s*([0-9.'"\s]+)\s*([a-z]+)?/i);
      
      if (!calibrationMatch) {
        alert('Could not parse calibration values from the selected line.');
        return;
      }
      
      let calibrationText = calibrationMatch[1].trim();
      let unit = calibrationMatch[2] || 'ft';
      
      // Parse feet-inches format if present
      const actualDistance = parseFeetInches(calibrationText) || parseFloat(calibrationText);
      
      if (!actualDistance || actualDistance <= 0) {
        alert('Could not parse calibration distance from the selected line.');
        return;
      }
      
      // Calculate pixel distance from the connector's endpoints
      const start = connector.start.position;
      const end = connector.end.position;
      const pixelDistance = Math.sqrt(
        Math.pow(end.x - start.x, 2) + 
        Math.pow(end.y - start.y, 2)
      );
      
      // Create new calibration object
      const newCalibration = {
        pixelsPerUnit: pixelDistance / actualDistance,
        pixelDistance: pixelDistance,
        actualDistance: actualDistance,
        unit: unit,
        timestamp: new Date().toISOString()
      };
      
      setCalibration(newCalibration);
      setCalibrationLineId(connector.id);
      
      alert(
        `✓ Calibration loaded successfully!\n\n` +
        `Distance: ${formatMeasurement(actualDistance, unit, true)}\n` +
        `Pixels: ${pixelDistance.toFixed(0)}px\n\n` +
        `You can now start taking measurements!`
      );
      
      // Automatically start measurement mode
      setMode('measure');
      await startMeasurement();
      
    } catch (error) {
      console.error('Error selecting existing calibration:', error);
      alert('Error loading calibration: ' + error.message);
    }
  };

  const startMeasurement = async () => {
    if (!calibration) {
      alert('Please set up calibration first before measuring!');
      return;
    }

    setMode('measure');
    setClickCount(0);
    setFirstPoint(null);
    
    try {
      // Create a draggable line for measurement
      const viewport = await window.miro.board.viewport.get();
      const centerX = viewport.x + viewport.width / 2;
      const centerY = viewport.y + viewport.height / 2;
      
      // Position line to the right side of viewport to be more visible
      const offsetX = viewport.width * 0.25; // 25% to the right

      // Create line with draggable endpoints (no dots needed)
      const line = await window.miro.board.createConnector({
        start: {
          position: {
            x: centerX + offsetX - 200,
            y: centerY
          }
        },
        end: {
          position: {
            x: centerX + offsetX + 200,
            y: centerY
          }
        },
        shape: 'straight',
        style: {
          strokeColor: '#4facfe',
          strokeWidth: 2,
          startStrokeCap: 'none',
          endStrokeCap: 'none'
        },
        captions: [{
          content: 'Measurement Line - Drag endpoints to measure',
          position: 0.5,
          textAlignVertical: 'middle'
        }]
      });

      setCalibrationLine(line);
    } catch (error) {
      console.error('Error starting measurement:', error);
      alert('Error creating measurement line: ' + error.message);
    }
  };

  const finishMeasurement = async () => {
    if (!calibrationLine) {
      alert('No measurement line found. Please click "Distance" button first to create a measurement line.');
      return;
    }

    try {
      // Get fresh reference to the line to get its current endpoints
      const items = await window.miro.board.get({ id: [calibrationLine.id] });
      
      if (items.length !== 1) {
        throw new Error('Could not find measurement line');
      }

      const line = items[0];
      const start = line.start.position;
      const end = line.end.position;

      const pixelDistance = Math.sqrt(
        Math.pow(end.x - start.x, 2) + 
        Math.pow(end.y - start.y, 2)
      );

      // Calculate the actual measurement
      const actualDistance = pixelDistance / calibration.pixelsPerUnit;
      const conversions = getAllConversions(actualDistance, calibration.unit);

      // Format the measurement for display
      const primaryUnit = calibration.unit;
      const formattedValue = formatMeasurement(actualDistance, primaryUnit, showFeetInches);
      const measurementText = primaryUnit === 'ft' && showFeetInches ? formattedValue : `${formattedValue} ${primaryUnit}`;

      // Update the line's caption with the measurement by recreating it
      const updatedLine = await window.miro.board.createConnector({
        start: {
          ...line.start
        },
        end: {
          ...line.end
        },
        shape: 'straight',
        style: {
          strokeColor: '#4facfe',
          strokeWidth: 2,
          startStrokeCap: 'none',
          endStrokeCap: 'none'
        },
        captions: [{
          content: measurementText,
          position: 0.5,
          textAlignVertical: 'middle'
        }]
      });

      // Remove the old line
      await window.miro.board.remove(calibrationLine);

      // Store the measurement with line ID
      const measurement = {
        id: Date.now(),
        lineId: updatedLine.id,
        distance: actualDistance,
        unit: calibration.unit,
        conversions: conversions,
        timestamp: new Date()
      };

      setMeasurements([...measurements, measurement]);
      setMeasurementLines([...measurementLines, updatedLine.id]);

      // Mark that the first measurement has been completed
      setIsFirstMeasurement(false);

      // Reset calibrationLine and immediately start a new measurement
      setCalibrationLine(null);
      
      // Automatically start a new measurement line
      await startMeasurement();
    } catch (error) {
      console.error('Error finishing measurement:', error);
      alert('Error: ' + error.message);
    }
  };

  const updateSelectedMeasurement = async () => {
    try {
      // Get the current selection from the board
      const selection = await window.miro.board.getSelection();
      
      if (selection.length === 0) {
        alert('Please select a measurement line on the board first');
        return;
      }

      const selectedItem = selection[0];
      
      // Check if the selected item is a connector
      if (selectedItem.type !== 'connector') {
        alert('Please select a measurement line (connector)');
        return;
      }

      // Check if it's one of our measurement lines
      if (!measurementLines.includes(selectedItem.id)) {
        alert('This line is not a measurement. Please select a blue measurement line.');
        return;
      }

      const line = selectedItem;
      const start = line.start.position;
      const end = line.end.position;

      const pixelDistance = Math.sqrt(
        Math.pow(end.x - start.x, 2) + 
        Math.pow(end.y - start.y, 2)
      );

      // Calculate the actual measurement
      const actualDistance = pixelDistance / calibration.pixelsPerUnit;
      const conversions = getAllConversions(actualDistance, calibration.unit);

      // Format the measurement for display
      const primaryUnit = calibration.unit;
      const formattedValue = formatNumber(actualDistance, 2);
      const measurementText = `${formattedValue} ${primaryUnit}`;

      // Create updated line with new measurement
      const updatedLine = await window.miro.board.createConnector({
        start: {
          ...line.start
        },
        end: {
          ...line.end
        },
        shape: 'straight',
        style: {
          strokeColor: '#4facfe',
          strokeWidth: 2,
          startStrokeCap: 'none',
          endStrokeCap: 'none'
        },
        captions: [{
          content: measurementText,
          position: 0.5,
          textAlignVertical: 'middle'
        }]
      });

      // Remove the old line
      await window.miro.board.remove(selectedItem);

      // Update the measurement in our records
      const updatedMeasurements = measurements.map(m => {
        if (m.lineId === selectedItem.id) {
          return {
            ...m,
            lineId: updatedLine.id,
            distance: actualDistance,
            conversions: conversions,
            timestamp: new Date()
          };
        }
        return m;
      });

      setMeasurements(updatedMeasurements);
      
      // Update line IDs
      const updatedLineIds = measurementLines.map(id => 
        id === selectedItem.id ? updatedLine.id : id
      );
      setMeasurementLines(updatedLineIds);

      alert('Measurement updated successfully!');
    } catch (error) {
      console.error('Error updating measurement:', error);
      alert('Error: ' + error.message);
    }
  };

  const updateCalibration = async () => {
    try {
      if (!calibrationLineId) {
        alert('No calibration line found. Please calibrate first.');
        return;
      }

      // Get the current selection from the board
      const selection = await window.miro.board.getSelection();
      
      if (selection.length === 0) {
        alert('Please select the green calibration line on the board first');
        return;
      }

      const selectedItem = selection[0];
      
      // Check if the selected item is the calibration line
      if (selectedItem.id !== calibrationLineId) {
        alert('Please select the green calibration line to update it');
        return;
      }

      const line = selectedItem;
      const start = line.start.position;
      const end = line.end.position;

      const pixelDistance = Math.sqrt(
        Math.pow(end.x - start.x, 2) + 
        Math.pow(end.y - start.y, 2)
      );

      // Set the new pixel distance and show modal to re-enter the actual distance
      setTempCalibrationDistance(pixelDistance);
      setShowCalibrationModal(true);
      
      alert('Enter the actual distance for the repositioned calibration line');
    } catch (error) {
      console.error('Error updating calibration:', error);
      alert('Error: ' + error.message);
    }
  };

  const handleBoardClick = async (x, y) => {
    // This function is no longer used with the new drag-and-drop approach
  };

  // Area Measurement Functions
  const startAreaMeasurement = async () => {
    if (!calibration) {
      return;
    }

    setMode('area');
    setAreaPoints([]);
    setTempAreaLines([]);
    
    // Instructions for user
    alert('Use the "Add Point" button to place markers on the board where you want to measure. Add at least 3 points, then click "Finish Area".');
  };
  
  const promptForAreaPoint = async () => {
    try {
      // Ask user to select a location on the board by creating a temporary shape
      const shape = await window.miro.board.createShape({
        shape: 'circle',
        width: 20,
        height: 20,
        style: {
          fillColor: '#00b8d4',
          borderWidth: 0
        }
      });
      
      // Get the shape's position
      const x = shape.x;
      const y = shape.y;
      
      // Add this point to our area
      await addAreaPoint(x, y);
      
      // Delete the temporary shape
      await window.miro.board.remove(shape);
      
      // Zoom to show the new point
      await window.miro.board.viewport.zoomTo(shape);
      
    } catch (error) {
      console.error('Error adding area point:', error);
    }
  };

  const addAreaPoint = async (x, y) => {
    const newPoint = { x, y };
    const updatedPoints = [...areaPoints, newPoint];
    setAreaPoints(updatedPoints);

    // Draw line from previous point to new point
    if (areaPoints.length > 0) {
      const prevPoint = areaPoints[areaPoints.length - 1];
      
      try {
        const line = await window.miro.board.createConnector({
          start: { 
            position: prevPoint
          },
          end: { 
            position: newPoint
          },
          shape: 'straight',
          style: {
            strokeColor: '#00b8d4', // Cyan for area
            strokeWidth: 4,
            startStrokeCap: 'none',
            endStrokeCap: 'none'
          }
        });
        
        setTempAreaLines([...tempAreaLines, line.id]);
      } catch (error) {
        console.error('Error drawing area line:', error);
      }
    }
  };

  const finishAreaMeasurement = async () => {
    if (areaPoints.length < 3) {
      alert('Please select at least 3 points to create an area');
      return;
    }

    try {
      // Close the polygon by connecting last point to first
      const line = await window.miro.board.createConnector({
        start: { 
          position: areaPoints[areaPoints.length - 1]
        },
        end: { 
          position: areaPoints[0]
        },
        shape: 'straight',
        style: {
          strokeColor: '#00b8d4',
          strokeWidth: 4,
          startStrokeCap: 'none',
          endStrokeCap: 'none'
        }
      });

      const allLines = [...tempAreaLines, line.id];

      // Calculate area using shoelace formula
      let area = 0;
      for (let i = 0; i < areaPoints.length; i++) {
        const j = (i + 1) % areaPoints.length;
        area += areaPoints[i].x * areaPoints[j].y;
        area -= areaPoints[j].x * areaPoints[i].y;
      }
      area = Math.abs(area / 2);

      // Calculate perimeter
      let perimeter = 0;
      for (let i = 0; i < areaPoints.length; i++) {
        const j = (i + 1) % areaPoints.length;
        const dx = areaPoints[j].x - areaPoints[i].x;
        const dy = areaPoints[j].y - areaPoints[i].y;
        perimeter += Math.sqrt(dx * dx + dy * dy);
      }

      // Convert to actual units
      const actualArea = area / (calibration.pixelsPerUnit * calibration.pixelsPerUnit);
      const actualPerimeter = perimeter / calibration.pixelsPerUnit;

      // Create label showing area
      const centerX = areaPoints.reduce((sum, p) => sum + p.x, 0) / areaPoints.length;
      const centerY = areaPoints.reduce((sum, p) => sum + p.y, 0) / areaPoints.length;

      const formattedArea = formatMeasurement(actualArea, calibration.unit, showFeetInches);
      const formattedPerimeter = formatMeasurement(actualPerimeter, calibration.unit, showFeetInches);
      const areaDisplay = calibration.unit === 'ft' && showFeetInches ? `${formattedArea} sq` : `${formattedArea} ${calibration.unit}²`;
      const perimDisplay = calibration.unit === 'ft' && showFeetInches ? formattedPerimeter : `${formattedPerimeter} ${calibration.unit}`;
      
      const areaText = await window.miro.board.createText({
        content: `Area: ${areaDisplay}\nPerimeter: ${perimDisplay}`,
        x: centerX,
        y: centerY,
        width: 200,
        style: {
          color: '#00b8d4',
          fontSize: 14,
          textAlign: 'center'
        }
      });

      // Store the area measurement
      const areaMeasurement = {
        id: Date.now(),
        type: 'area',
        area: actualArea,
        perimeter: actualPerimeter,
        unit: calibration.unit,
        points: areaPoints,
        lineIds: allLines,
        textId: areaText.id,
        timestamp: new Date()
      };

      setAreaShapes([...areaShapes, areaMeasurement]);
      setMeasurements([...measurements, areaMeasurement]);

      // Reset for next area
      setAreaPoints([]);
      setTempAreaLines([]);
      setMode('none');
    } catch (error) {
      console.error('Error finishing area measurement:', error);
      alert('Error: ' + error.message);
    }
  };

  const cancelAreaMeasurement = async () => {
    // Remove temporary lines
    if (tempAreaLines.length > 0) {
      try {
        for (const lineId of tempAreaLines) {
          await window.miro.board.remove({ id: lineId });
        }
      } catch (error) {
        console.error('Error removing temp lines:', error);
      }
    }
    
    setAreaPoints([]);
    setTempAreaLines([]);
    setMode('none');
  };

  // Parse feet and inches notation (e.g., 12' 6" or 12'6" or 12' or 6")
  const parseFeetInches = (input) => {
    if (!input || typeof input !== 'string') return null;
    
    const trimmed = input.trim();
    
    // Pattern to match feet and inches: 12' 6" or 12'6" or 12' or 6"
    const feetInchesPattern = /^(\d+(?:\.\d+)?)'?\s*(\d+(?:\.\d+)?)?"?$|^(\d+(?:\.\d+)?)'$/;
    const inchesOnlyPattern = /^(\d+(?:\.\d+)?)"$/;
    
    // Check for feet and inches (e.g., 12' 6" or 12'6")
    const feetInchesMatch = trimmed.match(/(\d+(?:\.\d+)?)'(?:\s*(\d+(?:\.\d+)?)?")?/);
    if (feetInchesMatch) {
      const feet = parseFloat(feetInchesMatch[1] || 0);
      const inches = parseFloat(feetInchesMatch[2] || 0);
      return feet + (inches / 12); // Return total in feet
    }
    
    // Check for inches only (e.g., 6")
    const inchesMatch = trimmed.match(/^(\d+(?:\.\d+)?)"$/);
    if (inchesMatch) {
      const inches = parseFloat(inchesMatch[1]);
      return inches / 12; // Convert to feet
    }
    
    // If no special notation, try parsing as regular number
    const num = parseFloat(trimmed);
    return isNaN(num) ? null : num;
  };

  const handleCalibrationComplete = async () => {
    // Parse the input value to handle feet/inches notation
    const parsedValue = parseFeetInches(calibrationValue);
    
    if (parsedValue === null || parsedValue <= 0) {
      alert('Please enter a valid distance (e.g., 12.5, 12\' 6", or 6")');
      return;
    }
    
    // Convert parsed value to the selected calibration unit
    let actualDistance = parsedValue;
    
    // If input contained feet/inches notation, convert to selected unit
    if (calibrationValue.includes("'") || calibrationValue.includes('"')) {
      // parsedValue is in feet, convert to calibration unit
      actualDistance = convertUnits(parsedValue, 'ft', calibrationUnit);
    }

    try {
      // Check if this is part of a scale preset application
      const scalePreset = tempCalibrationDistance?.ratio ? tempCalibrationDistance : null;
      
      // Set calibration with both formats for compatibility
      const newCalibration = {
        pixelsPerUnit: tempCalibrationDistance / actualDistance,
        pixelDistance: tempCalibrationDistance,
        actualDistance: actualDistance,
        unit: calibrationUnit,
        ...(scalePreset && {
          ratio: scalePreset.ratio,
          scaleName: scalePreset.name
        }),
        timestamp: new Date().toISOString()
      };
      
      setCalibration(newCalibration);

      // Update the calibration line caption to show the calibration distance
      if (calibrationLine) {
        // Get the current line to preserve its position
        const items = await window.miro.board.get({ id: [calibrationLine.id] });
        if (items.length === 1) {
          const line = items[0];
          
          // Create a new line with updated caption and green color
          const updatedLine = await window.miro.board.createConnector({
            start: {
              ...line.start
            },
            end: {
              ...line.end
            },
            shape: 'straight',
            style: {
              strokeColor: '#10bb82',
              strokeWidth: 2,
              startStrokeCap: 'none',
              endStrokeCap: 'none'
            },
            captions: [{
              content: `Calibration: ${formatMeasurement(actualDistance, calibrationUnit, true)}${scalePreset ? ` (${scalePreset.name})` : ''}`,
              position: 0.5
            }]
          });

          // Remove the old red line
          await window.miro.board.remove(calibrationLine);
          
          // Store the calibration line ID
          setCalibrationLineId(updatedLine.id);
        }
      } else if (calibrationLineId) {
        // We're updating an existing green calibration line
        const items = await window.miro.board.get({ id: [calibrationLineId] });
        if (items.length === 1) {
          const line = items[0];
          
          // Create a new line with updated caption
          const updatedLine = await window.miro.board.createConnector({
            start: {
              ...line.start
            },
            end: {
              ...line.end
            },
            shape: 'straight',
            style: {
              strokeColor: '#10bb82',
              strokeWidth: 2,
              startStrokeCap: 'none',
              endStrokeCap: 'none'
            },
            captions: [{
              content: `Calibration: ${formatMeasurement(actualDistance, calibrationUnit, true)}${scalePreset ? ` (${scalePreset.name})` : ''}`,
              position: 0.5
            }]
          });

          // Remove the old line
          await window.miro.board.remove({ id: calibrationLineId });
          
          // Store the new calibration line ID
          setCalibrationLineId(updatedLine.id);
        }
      }

      setShowCalibrationModal(false);
      setCalibrationValue('');
      setCalibrationLine(null);
      setTempCalibrationDistance(null); // Clear the temp preset data
      
      // Show success message
      if (scalePreset) {
        alert(
          `✓ Scale preset applied successfully!\n\n` +
          `${scalePreset.name} (1:${scalePreset.ratio})\n` +
          `Calibration: ${formatMeasurement(actualDistance, calibrationUnit, true)}\n\n` +
          `You can now start taking measurements!`
        );
      }
      
      // Automatically start measurement mode
      setMode('measure');
      await startMeasurement();
    } catch (error) {
      console.error('Error updating calibration line:', error);
      setMode('none');
      setShowCalibrationModal(false);
      setCalibrationValue('');
      setCalibrationLine(null);
      setTempCalibrationDistance(null);
    }
  };

  const handleMeasurementComplete = (pixelDistance) => {
    if (!calibration) return;

    const actualDistance = pixelDistance / calibration.pixelsPerUnit;
    const conversions = getAllConversions(actualDistance, calibration.unit);

    const measurement = {
      id: Date.now(),
      type: 'linear',
      distance: actualDistance,
      unit: calibration.unit,
      conversions: conversions,
      timestamp: new Date()
    };

    setMeasurements([...measurements, measurement]);
    setMode('none');
  };

  // Export Measurements to CSV
  const exportMeasurementsToCSV = () => {
    if (measurements.length === 0) {
      alert('No measurements to export');
      return;
    }

    // Create CSV content
    const headers = ['#', 'Type', 'Value', 'Unit', 'Additional Info', 'Timestamp'];
    const rows = measurements.map((m, idx) => {
      let value, unit, additionalInfo;
      
      switch (m.type) {
        case 'area':
          value = formatMeasurement(m.area, m.unit, showFeetInches);
          unit = m.unit === 'ft' ? 'sq ft' : `${m.unit}²`;
          additionalInfo = m.unit === 'ft' ? `Perimeter: ${formatMeasurement(m.perimeter, m.unit, showFeetInches)}` : `Perimeter: ${formatMeasurement(m.perimeter, m.unit, showFeetInches)} ${m.unit}`;
          break;
        case 'polyline':
          value = formatMeasurement(m.totalLength, m.unit, showFeetInches);
          unit = m.unit === 'ft' ? '' : m.unit;
          additionalInfo = `${m.points.length} segments`;
          break;
        case 'count':
          value = m.number;
          unit = 'item';
          additionalInfo = '';
          break;
        case 'volume':
          value = formatNumber(m.volume, 2);
          unit = `${m.unit}³`;
          additionalInfo = `Base: ${formatNumber(m.baseArea, 2)} ${m.unit}², Height: ${formatNumber(m.height, 2)} ${m.unit}`;
          break;
        case 'angle':
          value = formatNumber(m.angle, 1);
          unit = 'degrees';
          additionalInfo = '';
          break;
        case 'circle':
          value = formatMeasurement(m.radius, m.unit, showFeetInches);
          unit = m.unit === 'ft' ? '(radius)' : `${m.unit} (radius)`;
          const formattedD = formatMeasurement(m.diameter, m.unit, showFeetInches);
          const formattedC = formatMeasurement(m.circumference, m.unit, showFeetInches);
          const formattedA = formatMeasurement(m.area, m.unit, showFeetInches);
          additionalInfo = m.unit === 'ft' ? `D: ${formattedD}, C: ${formattedC}, A: ${formattedA} sq` : `D: ${formattedD}, C: ${formattedC}, A: ${formattedA} ${m.unit}²`;
          break;
        case 'cutout':
          value = formatMeasurement(m.netArea, m.unit, showFeetInches);
          unit = m.unit === 'ft' ? 'sq ft (net)' : `${m.unit}² (net)`;
          const formattedGross = formatMeasurement(m.grossArea, m.unit, showFeetInches);
          const formattedCutout = formatMeasurement(m.cutoutArea, m.unit, showFeetInches);
          const formattedNet = formatMeasurement(m.netArea, m.unit, showFeetInches);
          const sqUnit = m.unit === 'ft' ? 'sq' : `${m.unit}²`;
          additionalInfo = `Gross: ${formattedGross} ${sqUnit}, Cutouts: ${formattedCutout} ${sqUnit}, Net: ${formattedNet} ${sqUnit}`;
          break;
        case 'slope':
          value = m.riseRunRatio;
          unit = 'ratio';
          const formattedRise = formatMeasurement(m.rise, m.unit, showFeetInches);
          const formattedRun = formatMeasurement(m.run, m.unit, showFeetInches);
          additionalInfo = m.unit === 'ft' ? `${formatNumber(m.slopePercentage, 1)}% / ${formatNumber(m.slopeDegrees, 1)}°, Rise: ${formattedRise}, Run: ${formattedRun}` : `${formatNumber(m.slopePercentage, 1)}% / ${formatNumber(m.slopeDegrees, 1)}°, Rise: ${formattedRise} ${m.unit}, Run: ${formattedRun} ${m.unit}`;
          break;
        case 'volume':
          value = formatMeasurement(m.volume, m.unit, showFeetInches);
          unit = m.unit === 'ft' ? 'cu ft' : `${m.unit}³`;
          const formattedBase = formatMeasurement(m.baseArea, m.unit, showFeetInches);
          const formattedHeight = formatMeasurement(m.height, m.unit, showFeetInches);
          additionalInfo = m.unit === 'ft' ? `Base: ${formattedBase} sq, Height: ${formattedHeight}` : `Base: ${formattedBase} ${m.unit}², Height: ${formattedHeight} ${m.unit}`;
          break;
        default: // linear
          value = formatMeasurement(m.distance, m.unit, showFeetInches);
          unit = m.unit === 'ft' ? '' : m.unit;
          additionalInfo = '';
      }
      
      return [
        idx + 1,
        m.type || 'linear',
        value,
        unit,
        additionalInfo,
        m.timestamp ? new Date(m.timestamp).toLocaleString() : ''
      ];
    });

    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
    ].join('\n');

    // Create download link
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `measuremint-measurements-${Date.now()}.csv`;
    link.click();
    window.URL.revokeObjectURL(url);
  };

  // Count Tool Functions
  const startCountTool = () => {
    if (!calibration) {
      return;
    }
    setMode('count');
  };

  const addCountMarker = async () => {
    try {
      const viewport = await window.miro.board.viewport.get();
      const centerX = viewport.x + viewport.width / 2;
      const centerY = viewport.y + viewport.height / 2;
      const offsetX = viewport.width * 0.25;

      const newCount = countTotal + 1;
      
      // Create a sticky note as a marker
      const marker = await window.miro.board.createStickyNote({
        content: `${newCount}`,
        x: centerX + offsetX,
        y: centerY,
        style: {
          fillColor: 'light_yellow',
          textAlign: 'center',
          textAlignVertical: 'middle'
        },
        width: 100
      });

      const countItem = {
        id: Date.now(),
        type: 'count',
        number: newCount,
        markerId: marker.id,
        timestamp: new Date()
      };

      setCountItems([...countItems, countItem]);
      setCountTotal(newCount);
      setMeasurements([...measurements, { ...countItem, description: `Count #${newCount}` }]);
    } catch (error) {
      console.error('Error adding count marker:', error);
    }
  };

  const resetCount = () => {
    setCountTotal(0);
    setCountItems([]);
    setMode('none');
  };

  // Polyline Measurement Functions
  const startPolylineMeasurement = async () => {
    if (!calibration) {
      await showAlert('Please set up calibration first.', 'MeasureMint');
      return;
    }
    
    try {
      const proceed = await showConfirm(
        'Draw multiple connected lines on the board to represent your path.\n\n' +
        'Then select ALL the lines and click OK.',
        'MeasureMint - Polyline Path'
      );
      
      if (!proceed) return;
      
      const selection = await miro.board.getSelection();
      
      if (!selection || selection.length === 0) {
        await showAlert('No lines selected. Please select the path lines and try again.', 'Error');
        return;
      }
      
      // Filter only connectors
      const lines = selection.filter(item => item.type === 'connector');
      
      if (lines.length === 0) {
        await showAlert('Please select connector lines (not shapes or text).', 'Error');
        return;
      }
      
      // Calculate total length
      let totalPixels = 0;
      const segments = [];
      
      for (const line of lines) {
        // Handle both direct coordinates and position objects
        const startX = line.start.x ?? line.start.position?.x ?? 0;
        const startY = line.start.y ?? line.start.position?.y ?? 0;
        const endX = line.end.x ?? line.end.position?.x ?? 0;
        const endY = line.end.y ?? line.end.position?.y ?? 0;
        
        const dx = endX - startX;
        const dy = endY - startY;
        const segmentPixels = Math.sqrt(dx * dx + dy * dy);
        totalPixels += segmentPixels;
        const segmentLength = segmentPixels / calibration.pixelsPerUnit;
        segments.push(segmentLength);
      }
      
      const totalLength = totalPixels / calibration.pixelsPerUnit;
      
      // Create label at the last line's endpoint
      const lastLine = lines[lines.length - 1];
      const labelX = lastLine.end.x ?? lastLine.end.position?.x ?? 0;
      const labelY = (lastLine.end.y ?? lastLine.end.position?.y ?? 0) + 50;
      
      const formattedLength = formatMeasurement(totalLength, calibration.unit);
      const lengthDisplay = calibration.unit === 'ft' ? formattedLength : `${formattedLength} ${calibration.unit}`;
      
      const lengthText = await miro.board.createText({
        content: `Path Length: ${lengthDisplay}\\n${lines.length} segments`,
        x: labelX,
        y: labelY,
        width: 200,
        style: {
          color: '#ff6b6b',
          fontSize: 14,
          textAlign: 'center'
        }
      });
      
      // Store the measurement
      const polylineMeasurement = {
        id: Date.now(),
        type: 'polyline',
        totalLength,
        segments,
        unit: calibration.unit,
        lineIds: lines.map(l => l.id),
        textId: lengthText.id,
        timestamp: new Date()
      };
      
      setMeasurements([...measurements, polylineMeasurement]);
      await showAlert(`Path measured: ${lengthDisplay}\\n${lines.length} segments`, 'Success');
      
    } catch (error) {
      console.error('Error measuring polyline:', error);
      await showAlert('Error measuring path: ' + error.message, 'Error');
    }
  };

  // Volume Measurement Functions
  const startVolumeMeasurement = () => {
    if (!calibration) {
      return;
    }
    // Reuse area measurement for base
    setMode('volume');
    setAreaPoints([]);
    setTempAreaLines([]);
  };

  const finishVolumeBase = async () => {
    if (areaPoints.length < 3) {
      alert('Please select at least 3 points for the base area');
      return;
    }

    try {
      // Calculate base area
      let area = 0;
      for (let i = 0; i < areaPoints.length; i++) {
        const j = (i + 1) % areaPoints.length;
        area += areaPoints[i].x * areaPoints[j].y;
        area -= areaPoints[j].x * areaPoints[i].y;
      }
      area = Math.abs(area / 2);
      const actualArea = area / (calibration.pixelsPerUnit * calibration.pixelsPerUnit);

      setVolumeBaseArea({ area: actualArea, points: areaPoints, lineIds: tempAreaLines });
      setShowVolumeModal(true);
    } catch (error) {
      console.error('Error calculating volume base:', error);
    }
  };

  const completeVolumeCalculation = async () => {
    const height = parseFloat(volumeHeight);
    if (!height || height <= 0) {
      alert('Please enter a valid height');
      return;
    }

    try {
      const volume = volumeBaseArea.area * height;

      // Close the polygon
      const line = await window.miro.board.createConnector({
        start: { position: areaPoints[areaPoints.length - 1] },
        end: { position: areaPoints[0] },
        shape: 'straight',
        style: {
          strokeColor: '#9c27b0', // Purple for volume
          strokeWidth: 4
        }
      });

      const allLines = [...tempAreaLines, line.id];

      // Add label
      const centerX = areaPoints.reduce((sum, p) => sum + p.x, 0) / areaPoints.length;
      const centerY = areaPoints.reduce((sum, p) => sum + p.y, 0) / areaPoints.length;

      const volumeText = await window.miro.board.createText({
        content: `Volume: ${formatNumber(volume, 2)} ${calibration.unit}³\nBase: ${formatNumber(volumeBaseArea.area, 2)} ${calibration.unit}²\nHeight: ${formatNumber(height, 2)} ${calibration.unit}`,
        x: centerX,
        y: centerY,
        width: 250,
        style: {
          color: '#9c27b0',
          fontSize: 14,
          textAlign: 'center'
        }
      });

      const volumeMeasurement = {
        id: Date.now(),
        type: 'volume',
        volume,
        baseArea: volumeBaseArea.area,
        height,
        unit: calibration.unit,
        points: areaPoints,
        lineIds: allLines,
        textId: volumeText.id,
        timestamp: new Date()
      };

      setMeasurements([...measurements, volumeMeasurement]);
      setAreaPoints([]);
      setTempAreaLines([]);
      setVolumeBaseArea(null);
      setVolumeHeight('');
      setShowVolumeModal(false);
      setMode('none');
    } catch (error) {
      console.error('Error completing volume calculation:', error);
    }
  };

  // Angle Measurement Functions
  const startAngleMeasurement = async () => {
    if (!calibration) {
      await showAlert('Please set up calibration first.', 'MeasureMint');
      return;
    }
    
    try {
      const proceed = await showConfirm(
        'Draw two lines that meet at a vertex (angle point).\n\n' +
        'Then select BOTH lines and click OK.\n\n' +
        'The angle will be calculated at their intersection.',
        'MeasureMint - Angle Measurement'
      );
      
      if (!proceed) return;
      
      const selection = await miro.board.getSelection();
      
      if (!selection || selection.length !== 2) {
        await showAlert('Please select exactly 2 connector lines.', 'Error');
        return;
      }
      
      const lines = selection.filter(item => item.type === 'connector');
      
      if (lines.length !== 2) {
        await showAlert('Please select exactly 2 connector lines (not shapes or text).', 'Error');
        return;
      }
      
      const [line1, line2] = lines;
      
      // Helper to get coordinates
      const getCoords = (point) => ({
        x: point.x ?? point.position?.x ?? 0,
        y: point.y ?? point.position?.y ?? 0
      });
      
      const line1Start = getCoords(line1.start);
      const line1End = getCoords(line1.end);
      const line2Start = getCoords(line2.start);
      const line2End = getCoords(line2.end);
      
      // Find common vertex (shared point)
      let vertex, p1, p2;
      
      if (Math.abs(line1End.x - line2Start.x) < 5 && Math.abs(line1End.y - line2Start.y) < 5) {
        // line1.end connects to line2.start
        vertex = line1End;
        p1 = line1Start;
        p2 = line2End;
      } else if (Math.abs(line1End.x - line2End.x) < 5 && Math.abs(line1End.y - line2End.y) < 5) {
        // line1.end connects to line2.end
        vertex = line1End;
        p1 = line1Start;
        p2 = line2Start;
      } else if (Math.abs(line1Start.x - line2Start.x) < 5 && Math.abs(line1Start.y - line2Start.y) < 5) {
        // line1.start connects to line2.start
        vertex = line1Start;
        p1 = line1End;
        p2 = line2End;
      } else if (Math.abs(line1Start.x - line2End.x) < 5 && Math.abs(line1Start.y - line2End.y) < 5) {
        // line1.start connects to line2.end
        vertex = line1Start;
        p1 = line1End;
        p2 = line2Start;
      } else {
        await showAlert('The two lines must share a common endpoint (vertex).', 'Error');
        return;
      }
      
      // Calculate angle using vectors
      const v1 = { x: p1.x - vertex.x, y: p1.y - vertex.y };
      const v2 = { x: p2.x - vertex.x, y: p2.y - vertex.y };
      
      const dot = v1.x * v2.x + v1.y * v2.y;
      const mag1 = Math.sqrt(v1.x * v1.x + v1.y * v1.y);
      const mag2 = Math.sqrt(v2.x * v2.x + v2.y * v2.y);
      const angleRad = Math.acos(dot / (mag1 * mag2));
      const angleDeg = angleRad * (180 / Math.PI);
      
      // Create label at vertex
      const angleText = await miro.board.createText({
        content: `${formatNumber(angleDeg, 1)}°`,
        x: vertex.x,
        y: vertex.y + 50,
        width: 100,
        style: {
          color: '#ff9800',
          fontSize: 18,
          textAlign: 'center',
          fontWeight: 'bold'
        }
      });
      
      const angleMeasurement = {
        id: Date.now(),
        type: 'angle',
        angle: angleDeg,
        lineIds: lines.map(l => l.id),
        textId: angleText.id,
        unit: calibration.unit,
        timestamp: new Date()
      };
      
      setMeasurements([...measurements, angleMeasurement]);
      await showAlert(`Angle measured: ${formatNumber(angleDeg, 1)}°`, 'Success');
      
    } catch (error) {
      console.error('Error measuring angle:', error);
      await showAlert('Error measuring angle: ' + error.message, 'Error');
    }
  };

  // Circle Measurement Functions
  const startCircleMeasurement = async () => {
    if (!calibration) {
      await showAlert('Please set up calibration first.', 'MeasureMint');
      return;
    }
    
    try {
      const proceed = await showConfirm(
        'Draw a circle shape on the board.\n\n' +
        'Then select the circle and click OK.\n\n' +
        'The radius, diameter, circumference, and area will be calculated.',
        'MeasureMint - Circle Measurement'
      );
      
      if (!proceed) return;
      
      const selection = await miro.board.getSelection();
      
      if (!selection || selection.length === 0) {
        await showAlert('No shape selected. Please select a circle and try again.', 'Error');
        return;
      }
      
      const circle = selection[0];
      
      if (circle.type !== 'shape' || (circle.shape !== 'circle' && circle.shape !== 'oval')) {
        await showAlert('Please select a circle or oval shape.', 'Error');
        return;
      }
      
      // Get circle dimensions (average width and height for ovals)
      const radiusPixels = (circle.width + circle.height) / 4; // Divide by 4 to get radius
      const radius = radiusPixels / calibration.pixelsPerUnit;
      const diameter = radius * 2;
      const circumference = 2 * Math.PI * radius;
      const area = Math.PI * radius * radius;
      
      // Format measurements
      const formattedRadius = formatMeasurement(radius, calibration.unit);
      const formattedDiameter = formatMeasurement(diameter, calibration.unit);
      const formattedCircumference = formatMeasurement(circumference, calibration.unit);
      const formattedArea = formatMeasurement(area, calibration.unit);
      
      const unitLabel = calibration.unit === 'ft' ? '' : ` ${calibration.unit}`;
      const sqUnitLabel = calibration.unit === 'ft' ? ' sq ft' : ` ${calibration.unit}²`;
      
      // Create label below circle
      const circleText = await miro.board.createText({
        content: `Radius: ${formattedRadius}${unitLabel}\\nDiameter: ${formattedDiameter}${unitLabel}\\nCircumference: ${formattedCircumference}${unitLabel}\\nArea: ${formattedArea}${sqUnitLabel}`,
        x: circle.x,
        y: circle.y + radiusPixels + 60,
        width: 250,
        style: {
          color: '#e91e63',
          fontSize: 12,
          textAlign: 'center'
        }
      });
      
      const circleMeasurement = {
        id: Date.now(),
        type: 'circle',
        radius,
        diameter,
        circumference,
        area,
        unit: calibration.unit,
        shapeId: circle.id,
        textId: circleText.id,
        timestamp: new Date()
      };
      
      setMeasurements([...measurements, circleMeasurement]);
      await showAlert(
        `Circle measured:\\nRadius: ${formattedRadius}${unitLabel}\\nArea: ${formattedArea}${sqUnitLabel}`,
        'Success'
      );
      
    } catch (error) {
      console.error('Error measuring circle:', error);
      await showAlert('Error measuring circle: ' + error.message, 'Error');
    }
  };

  // Cutout/Subtract Areas Functions
  const startCutoutArea = () => {
    setMode('cutout');
    setCutoutMode('main');
    setCutoutMainPoints([]);
    setCutoutMainLines([]);
    setCutoutPolygons([]);
    setCurrentCutoutPoints([]);
    setCurrentCutoutLines([]);
  };

  const addCutoutPoint = async (x, y) => {
    const newPoint = { x, y };

    if (cutoutMode === 'main') {
      // Adding points to main polygon
      const updatedPoints = [...cutoutMainPoints, newPoint];
      setCutoutMainPoints(updatedPoints);

      // Draw line from previous point
      if (cutoutMainPoints.length > 0) {
        try {
          const prevPoint = cutoutMainPoints[cutoutMainPoints.length - 1];
          const line = await window.miro.board.createConnector({
            start: { 
              position: prevPoint
            },
            end: { 
              position: newPoint
            },
            shape: 'straight',
            style: {
              strokeColor: '#00b8d4', // Cyan for main area
              strokeWidth: 4,
              startStrokeCap: 'none',
              endStrokeCap: 'none'
            }
          });
          
          setCutoutMainLines([...cutoutMainLines, line.id]);
        } catch (error) {
          console.error('Error drawing main area line:', error);
        }
      }
    } else if (cutoutMode === 'cutout') {
      // Adding points to cutout polygon
      const updatedPoints = [...currentCutoutPoints, newPoint];
      setCurrentCutoutPoints(updatedPoints);

      // Draw line from previous point
      if (currentCutoutPoints.length > 0) {
        try {
          const prevPoint = currentCutoutPoints[currentCutoutPoints.length - 1];
          const line = await window.miro.board.createConnector({
            start: { 
              position: prevPoint
            },
            end: { 
              position: newPoint
            },
            shape: 'straight',
            style: {
              strokeColor: '#ff6b6b', // Red for cutouts
              strokeWidth: 4,
              startStrokeCap: 'none',
              endStrokeCap: 'none'
            }
          });
          
          setCurrentCutoutLines([...currentCutoutLines, line.id]);
        } catch (error) {
          console.error('Error drawing cutout line:', error);
        }
      }
    }
  };

  const finishMainArea = async () => {
    if (cutoutMainPoints.length < 3) {
      alert('Please select at least 3 points for the main area');
      return;
    }

    try {
      // Close the main polygon
      const line = await window.miro.board.createConnector({
        start: { 
          position: cutoutMainPoints[cutoutMainPoints.length - 1]
        },
        end: { 
          position: cutoutMainPoints[0]
        },
        shape: 'straight',
        style: {
          strokeColor: '#00b8d4',
          strokeWidth: 4,
          startStrokeCap: 'none',
          endStrokeCap: 'none'
        }
      });

      setCutoutMainLines([...cutoutMainLines, line.id]);
      setCutoutMode('cutout');
      alert('Main area complete! Now click points to define cutout areas, or finish to complete.');
    } catch (error) {
      console.error('Error closing main area:', error);
    }
  };

  const finishCutout = async () => {
    if (currentCutoutPoints.length < 3) {
      alert('Please select at least 3 points for the cutout area');
      return;
    }

    try {
      // Close the cutout polygon
      const line = await window.miro.board.createConnector({
        start: { 
          position: currentCutoutPoints[currentCutoutPoints.length - 1]
        },
        end: { 
          position: currentCutoutPoints[0]
        },
        shape: 'straight',
        style: {
          strokeColor: '#ff6b6b',
          strokeWidth: 4,
          startStrokeCap: 'none',
          endStrokeCap: 'none'
        }
      });

      const allCutoutLines = [...currentCutoutLines, line.id];
      
      // Save this cutout polygon
      setCutoutPolygons([...cutoutPolygons, {
        points: currentCutoutPoints,
        lines: allCutoutLines
      }]);

      // Reset for next cutout
      setCurrentCutoutPoints([]);
      setCurrentCutoutLines([]);
      
      alert('Cutout complete! Add another cutout or finish the measurement.');
    } catch (error) {
      console.error('Error finishing cutout:', error);
    }
  };

  const finishCutoutMeasurement = async () => {
    if (cutoutMainPoints.length < 3) {
      alert('Please complete the main area first');
      return;
    }

    try {
      // Calculate main area using shoelace formula
      let grossArea = 0;
      for (let i = 0; i < cutoutMainPoints.length; i++) {
        const j = (i + 1) % cutoutMainPoints.length;
        grossArea += cutoutMainPoints[i].x * cutoutMainPoints[j].y;
        grossArea -= cutoutMainPoints[j].x * cutoutMainPoints[i].y;
      }
      grossArea = Math.abs(grossArea / 2);

      // Calculate cutout areas
      let totalCutoutArea = 0;
      for (const cutout of cutoutPolygons) {
        let cutoutArea = 0;
        for (let i = 0; i < cutout.points.length; i++) {
          const j = (i + 1) % cutout.points.length;
          cutoutArea += cutout.points[i].x * cutout.points[j].y;
          cutoutArea -= cutout.points[j].x * cutout.points[i].y;
        }
        totalCutoutArea += Math.abs(cutoutArea / 2);
      }

      // Calculate net area
      const netArea = grossArea - totalCutoutArea;

      // Convert to real-world units
      const pixelsPerUnit = calibration.pixelDistance / calibration.actualDistance;
      const grossAreaReal = grossArea / (pixelsPerUnit * pixelsPerUnit);
      const cutoutAreaReal = totalCutoutArea / (pixelsPerUnit * pixelsPerUnit);
      const netAreaReal = netArea / (pixelsPerUnit * pixelsPerUnit);

      // Get all conversions
      const grossConversions = getAllConversions(grossAreaReal, calibration.unit);
      const cutoutConversions = getAllConversions(cutoutAreaReal, calibration.unit);
      const netConversions = getAllConversions(netAreaReal, calibration.unit);

      // Collect all line IDs
      const allLines = [...cutoutMainLines];
      cutoutPolygons.forEach(cutout => {
        allLines.push(...cutout.lines);
      });

      // Store the cutout measurement
      const cutoutMeasurement = {
        id: Date.now(),
        type: 'cutout',
        grossArea: grossAreaReal,
        cutoutArea: cutoutAreaReal,
        netArea: netAreaReal,
        unit: calibration.unit,
        grossConversions,
        cutoutConversions,
        netConversions,
        mainPoints: cutoutMainPoints,
        cutoutPolygons: cutoutPolygons,
        lineIds: allLines,
        timestamp: new Date().toISOString()
      };

      setMeasurements([...measurements, cutoutMeasurement]);
      
      // Reset state
      setCutoutMainPoints([]);
      setCutoutMainLines([]);
      setCutoutPolygons([]);
      setCurrentCutoutPoints([]);
      setCurrentCutoutLines([]);
      setCutoutMode('main');
      setMode('none');
    } catch (error) {
      console.error('Error finishing cutout measurement:', error);
      alert('Error calculating cutout area. Please try again.');
    }
  };

  const cancelCutoutMeasurement = async () => {
    try {
      // Remove all main area lines
      for (const lineId of cutoutMainLines) {
        await window.miro.board.remove({ id: lineId });
      }

      // Remove all cutout lines
      for (const cutout of cutoutPolygons) {
        for (const lineId of cutout.lines) {
          await window.miro.board.remove({ id: lineId });
        }
      }

      // Remove current cutout lines
      for (const lineId of currentCutoutLines) {
        await window.miro.board.remove({ id: lineId });
      }
    } catch (error) {
      console.error('Error cleaning up cutout lines:', error);
    }

    setCutoutMainPoints([]);
    setCutoutMainLines([]);
    setCutoutPolygons([]);
    setCurrentCutoutPoints([]);
    setCurrentCutoutLines([]);
    setCutoutMode('main');
    setMode('none');
  };

  // Slope/Pitch Measurement Functions
  const startSlopeMeasurement = async () => {
    if (!calibration) {
      await showAlert('Please set up calibration first.', 'MeasureMint');
      return;
    }
    
    try {
      const proceed = await showConfirm(
        'Draw a line representing the slope.\n\n' +
        'Then select the line and click OK.\n\n' +
        'The slope will be calculated in multiple formats:\n' +
        '• Rise:Run ratio\n' +
        '• Percentage\n' +
        '• Degrees',
        'MeasureMint - Slope Measurement'
      );
      
      if (!proceed) return;
      
      const selection = await miro.board.getSelection();
      
      if (!selection || selection.length === 0) {
        await showAlert('No line selected. Please select a connector line and try again.', 'Error');
        return;
      }
      
      const line = selection[0];
      
      if (line.type !== 'connector') {
        await showAlert('Please select a connector line (not a shape or text).', 'Error');
        return;
      }
      
      // Calculate slope - handle both coordinate formats
      const getCoords = (point) => ({
        x: point.x ?? point.position?.x ?? 0,
        y: point.y ?? point.position?.y ?? 0
      });
      
      const p1 = getCoords(line.start);
      const p2 = getCoords(line.end);
      
      // Calculate rise and run in pixels
      const runPixels = Math.abs(p2.x - p1.x);
      const risePixels = Math.abs(p2.y - p1.y);
      
      // Convert to real-world units
      const run = runPixels / calibration.pixelsPerUnit;
      const rise = risePixels / calibration.pixelsPerUnit;
      
      // Calculate slope formats
      const slopeRatio = run > 0 ? rise / run : 0;
      const slopePercentage = slopeRatio * 100;
      const slopeDegrees = Math.atan(slopeRatio) * (180 / Math.PI);
      
      // Format as Rise:Run (simplified ratio)
      let riseRunRatio = '0:0';
      if (run > 0) {
        const gcd = (a, b) => b === 0 ? a : gcd(b, a % b);
        const divisor = gcd(Math.round(rise * 100), Math.round(run * 100));
        const riseInt = Math.round(rise * 100) / divisor;
        const runInt = Math.round(run * 100) / divisor;
        riseRunRatio = `${formatNumber(riseInt, 2)}:${formatNumber(runInt, 2)}`;
      }
      
      // Format measurements
      const formattedRise = formatMeasurement(rise, calibration.unit);
      const formattedRun = formatMeasurement(run, calibration.unit);
      const unitLabel = calibration.unit === 'ft' ? '' : ` ${calibration.unit}`;
      
      // Update line with caption - properly handle start/end format
      const updatedLine = await miro.board.createConnector({
        start: { 
          position: p1
        },
        end: { 
          position: p2
        },
        shape: 'straight',
        style: {
          strokeColor: '#9c27b0',
          strokeWidth: 2,
          startStrokeCap: 'none',
          endStrokeCap: 'none'
        },
        captions: [{
          content: `Slope: ${riseRunRatio} (${formatNumber(slopePercentage, 1)}%, ${formatNumber(slopeDegrees, 1)}°)`,
          position: 0.5,
          textAlignVertical: 'middle'
        }]
      });
      
      // Remove old line
      await miro.board.remove(line);
      
      // Store the slope measurement
      const slopeMeasurement = {
        id: Date.now(),
        type: 'slope',
        rise,
        run,
        riseRunRatio,
        slopePercentage,
        slopeDegrees,
        unit: calibration.unit,
        lineId: updatedLine.id,
        timestamp: new Date()
      };
      
      setMeasurements([...measurements, slopeMeasurement]);
      await showAlert(
        `Slope measured:\\n` +
        `Ratio: ${riseRunRatio}\\n` +
        `Percentage: ${formatNumber(slopePercentage, 1)}%\\n` +
        `Degrees: ${formatNumber(slopeDegrees, 1)}°\\n` +
        `Rise: ${formattedRise}${unitLabel}\\n` +
        `Run: ${formattedRun}${unitLabel}`,
        'Success'
      );
      
    } catch (error) {
      console.error('Error measuring slope:', error);
      await showAlert('Error measuring slope: ' + error.message, 'Error');
    }
  };

  // Multiple Scale Regions Functions
  const startScaleRegion = () => {
    setMode('scaleRegion');
    setCurrentRegionPoints([]);
    setCurrentRegionLines([]);
  };

  const addRegionPoint = async (x, y) => {
    const newPoint = { x, y };
    const updatedPoints = [...currentRegionPoints, newPoint];
    setCurrentRegionPoints(updatedPoints);

    // Draw line from previous point
    if (currentRegionPoints.length > 0) {
      try {
        const prevPoint = currentRegionPoints[currentRegionPoints.length - 1];
        const line = await window.miro.board.createConnector({
          start: { 
            position: prevPoint
          },
          end: { 
            position: newPoint
          },
          shape: 'straight',
          style: {
            strokeColor: '#ffa500', // Orange for scale regions
            strokeWidth: 3,
            strokeStyle: 'dashed',
            startStrokeCap: 'none',
            endStrokeCap: 'none'
          }
        });
        
        setCurrentRegionLines([...currentRegionLines, line.id]);
      } catch (error) {
        console.error('Error drawing region line:', error);
      }
    }
  };

  const finishScaleRegion = async () => {
    if (currentRegionPoints.length < 3) {
      alert('Please define at least 3 points for the scale region');
      return;
    }

    try {
      // Close the polygon
      const closingLine = await window.miro.board.createConnector({
        start: { 
          position: currentRegionPoints[currentRegionPoints.length - 1]
        },
        end: { 
          position: currentRegionPoints[0]
        },
        shape: 'straight',
        style: {
          strokeColor: '#ffa500',
          strokeWidth: 3,
          strokeStyle: 'dashed',
          startStrokeCap: 'none',
          endStrokeCap: 'none'
        }
      });

      const allLines = [...currentRegionLines, closingLine.id];

      // Calculate bounds
      const xs = currentRegionPoints.map(p => p.x);
      const ys = currentRegionPoints.map(p => p.y);
      const bounds = {
        minX: Math.min(...xs),
        maxX: Math.max(...xs),
        minY: Math.min(...ys),
        maxY: Math.max(...ys)
      };

      // Create a semi-transparent shape to visualize the region
      const shape = await window.miro.board.createShape({
        x: (bounds.minX + bounds.maxX) / 2,
        y: (bounds.minY + bounds.maxY) / 2,
        width: bounds.maxX - bounds.minX,
        height: bounds.maxY - bounds.minY,
        shape: 'rectangle',
        style: {
          fillColor: '#ffa500',
          fillOpacity: 0.1,
          borderColor: '#ffa500',
          borderWidth: 2,
          borderStyle: 'dashed'
        }
      });

      // Prompt for region name and calibration
      const regionName = prompt('Enter a name for this scale region (e.g., "Detail View", "Floor Plan"):', `Region ${scaleRegions.length + 1}`);
      if (!regionName) {
        // User cancelled, clean up
        await window.miro.board.remove(shape);
        for (const lineId of allLines) {
          await window.miro.board.remove({ id: lineId });
        }
        setCurrentRegionPoints([]);
        setCurrentRegionLines([]);
        setMode('none');
        return;
      }

      // Store temporary region data and show calibration setup
      setTempRegionCalibration({
        regionId: Date.now(),
        name: regionName,
        points: currentRegionPoints,
        bounds,
        lines: allLines,
        shapeId: shape.id
      });

      // Trigger calibration for this region
      alert(`Now calibrate the scale for "${regionName}". Draw a calibration line in this region.`);
      startCalibration(); // Use existing calibration flow
      
    } catch (error) {
      console.error('Error finishing scale region:', error);
      alert('Error creating scale region. Please try again.');
    }
  };

  const completeRegionCalibration = async (regionCalibration) => {
    if (!tempRegionCalibration) return;

    try {
      // Create label for the region showing the scale
      const label = await window.miro.board.createStickyNote({
        x: (tempRegionCalibration.bounds.minX + tempRegionCalibration.bounds.maxX) / 2,
        y: tempRegionCalibration.bounds.minY - 100,
        content: `${tempRegionCalibration.name}\nScale: 1:${regionCalibration.ratio || 'Custom'}`,
        style: {
          fillColor: '#ffa500',
          textAlign: 'center'
        },
        width: 200
      });

      // Save the region with its calibration
      const newRegion = {
        ...tempRegionCalibration,
        calibration: regionCalibration,
        labelId: label.id,
        createdAt: new Date().toISOString()
      };

      setScaleRegions([...scaleRegions, newRegion]);
      setTempRegionCalibration(null);
      setCurrentRegionPoints([]);
      setCurrentRegionLines([]);
      setMode('none');
      
      alert(`Scale region "${newRegion.name}" created successfully!`);
    } catch (error) {
      console.error('Error completing region calibration:', error);
      alert('Error saving scale region. Please try again.');
    }
  };

  const deleteScaleRegion = async (regionId) => {
    const region = scaleRegions.find(r => r.regionId === regionId);
    if (!region) return;

    try {
      // Remove visual elements
      await window.miro.board.remove(region.shapeId);
      await window.miro.board.remove(region.labelId);
      for (const lineId of region.lines) {
        await window.miro.board.remove({ id: lineId });
      }

      // Remove from state
      setScaleRegions(scaleRegions.filter(r => r.regionId !== regionId));
      
      if (activeScaleRegion?.regionId === regionId) {
        setActiveScaleRegion(null);
      }
    } catch (error) {
      console.error('Error deleting scale region:', error);
    }
  };

  const selectScaleRegion = (regionId) => {
    const region = scaleRegions.find(r => r.regionId === regionId);
    setActiveScaleRegion(region);
  };

  // NEW: Detect scale regions from Miro groups and frames
  const detectGroupBasedScaleRegions = async () => {
    try {
      alert(
        'Detecting scale regions from groups and frames...\n\n' +
        'How it works:\n' +
        '1. Each GROUP with a calibration line = separate scale region\n' +
        '2. Each FRAME with contents = separate scale region\n' +
        '3. Measurements inside a group/frame use that region\'s calibration\n\n' +
        'Select a group or frame that contains a calibration line to set it up!'
      );

      // Get user selection
      const selection = await window.miro.board.getSelection();
      
      if (selection.length === 0) {
        alert('Please select a group or frame that contains items with a calibration line.');
        return;
      }

      // Check if selection is a frame
      const frame = selection.find(item => item.type === 'frame');
      
      if (frame) {
        // User selected a frame - set up scale region for this frame
        await setupFrameAsScaleRegion(frame);
        return;
      }

      // If not a frame, check if items are grouped
      // Get all items and check if they belong to the same parent group
      const firstItem = selection[0];
      
      // Check if item has a parent (is part of a group)
      if (firstItem.parentId) {
        await setupGroupAsScaleRegion(firstItem.parentId, selection);
      } else {
        alert(
          'The selected items are not grouped.\n\n' +
          'To use automatic scale regions:\n' +
          '1. Group your calibration line with the drawing area\n' +
          '2. Or place items inside a Frame\n' +
          '3. Then measurements inside will use that region\'s calibration'
        );
      }
    } catch (error) {
      console.error('Error detecting group-based scale regions:', error);
      alert('Error: ' + error.message);
    }
  };

  const setupFrameAsScaleRegion = async (frame) => {
    try {
      // Look for a calibration line inside the frame
      const frameChildren = await window.miro.board.get({ 
        type: 'connector',
        // Filter items within frame bounds
      });

      const calibrationLine = frameChildren.find(item => {
        const caption = item.captions?.[0]?.content || '';
        return caption.includes('Calibration:') &&
               item.x >= frame.x - frame.width / 2 &&
               item.x <= frame.x + frame.width / 2 &&
               item.y >= frame.y - frame.height / 2 &&
               item.y <= frame.y + frame.height / 2;
      });

      if (!calibrationLine) {
        alert(
          'No calibration line found in this frame.\n\n' +
          'Please add a calibration line inside the frame first.'
        );
        return;
      }

      // Parse calibration from the line
      const calibrationData = await parseCalibrationFromLine(calibrationLine);
      
      if (!calibrationData) {
        alert('Could not parse calibration data from the line.');
        return;
      }

      // Create scale region for this frame
      const newRegion = {
        regionId: frame.id,
        name: frame.title || `Frame ${scaleRegions.length + 1}`,
        type: 'frame',
        frameId: frame.id,
        calibration: calibrationData,
        bounds: {
          x: frame.x,
          y: frame.y,
          width: frame.width,
          height: frame.height
        },
        timestamp: new Date().toISOString()
      };

      setScaleRegions([...scaleRegions, newRegion]);
      setActiveScaleRegion(newRegion);

      alert(
        `✓ Frame scale region created!\n\n` +
        `Name: ${newRegion.name}\n` +
        `Calibration: ${formatMeasurement(calibrationData.actualDistance, calibrationData.unit, true)}\n\n` +
        `All measurements inside this frame will use this calibration automatically!`
      );
    } catch (error) {
      console.error('Error setting up frame as scale region:', error);
      alert('Error: ' + error.message);
    }
  };

  const setupGroupAsScaleRegion = async (groupId, items) => {
    try {
      // Find calibration line in the group
      const calibrationLine = items.find(item => {
        if (item.type !== 'connector') return false;
        const caption = item.captions?.[0]?.content || '';
        return caption.includes('Calibration:');
      });

      if (!calibrationLine) {
        alert(
          'No calibration line found in this group.\n\n' +
          'Please group your calibration line with the items you want to measure.'
        );
        return;
      }

      // Parse calibration from the line
      const calibrationData = await parseCalibrationFromLine(calibrationLine);
      
      if (!calibrationData) {
        alert('Could not parse calibration data from the line.');
        return;
      }

      // Calculate bounds of the group
      const bounds = calculateGroupBounds(items);

      // Create scale region for this group
      const newRegion = {
        regionId: groupId,
        name: `Group ${scaleRegions.length + 1}`,
        type: 'group',
        groupId: groupId,
        calibration: calibrationData,
        bounds: bounds,
        timestamp: new Date().toISOString()
      };

      setScaleRegions([...scaleRegions, newRegion]);
      setActiveScaleRegion(newRegion);

      alert(
        `✓ Group scale region created!\n\n` +
        `Calibration: ${formatMeasurement(calibrationData.actualDistance, calibrationData.unit, true)}\n\n` +
        `Measurements near this group will use this calibration automatically!`
      );
    } catch (error) {
      console.error('Error setting up group as scale region:', error);
      alert('Error: ' + error.message);
    }
  };

  const parseCalibrationFromLine = async (line) => {
    try {
      const caption = line.captions?.[0]?.content || '';
      const calibrationMatch = caption.match(/Calibration:\s*([0-9.'"\s]+)\s*([a-z]+)?/i);
      
      if (!calibrationMatch) return null;
      
      let calibrationText = calibrationMatch[1].trim();
      let unit = calibrationMatch[2] || 'ft';
      
      const actualDistance = parseFeetInches(calibrationText) || parseFloat(calibrationText);
      
      if (!actualDistance || actualDistance <= 0) return null;
      
      // Calculate pixel distance
      const start = line.start.position;
      const end = line.end.position;
      const pixelDistance = Math.sqrt(
        Math.pow(end.x - start.x, 2) + 
        Math.pow(end.y - start.y, 2)
      );
      
      return {
        pixelsPerUnit: pixelDistance / actualDistance,
        pixelDistance: pixelDistance,
        actualDistance: actualDistance,
        unit: unit
      };
    } catch (error) {
      console.error('Error parsing calibration from line:', error);
      return null;
    }
  };

  const calculateGroupBounds = (items) => {
    if (items.length === 0) return null;
    
    let minX = Infinity, minY = Infinity;
    let maxX = -Infinity, maxY = -Infinity;
    
    items.forEach(item => {
      const halfWidth = (item.width || 0) / 2;
      const halfHeight = (item.height || 0) / 2;
      
      minX = Math.min(minX, item.x - halfWidth);
      maxX = Math.max(maxX, item.x + halfWidth);
      minY = Math.min(minY, item.y - halfHeight);
      maxY = Math.max(maxY, item.y + halfHeight);
    });
    
    return {
      x: (minX + maxX) / 2,
      y: (minY + maxY) / 2,
      width: maxX - minX,
      height: maxY - minY
    };
  };

  const getCalibrationForPoint = (x, y) => {
    // Check if point is inside any scale region (group or frame)
    for (const region of scaleRegions) {
      if (region.type === 'frame' || region.type === 'group') {
        // Check if point is within bounds
        const halfWidth = region.bounds.width / 2;
        const halfHeight = region.bounds.height / 2;
        
        if (x >= region.bounds.x - halfWidth &&
            x <= region.bounds.x + halfWidth &&
            y >= region.bounds.y - halfHeight &&
            y <= region.bounds.y + halfHeight) {
          return region.calibration;
        }
      } else if (region.points) {
        // Legacy polygon-based regions
        if (isPointInPolygon({ x, y }, region.points)) {
          return region.calibration;
        }
      }
    }
    // Fall back to global calibration
    return calibration;
  };

  const isPointInPolygon = (point, polygon) => {
    let inside = false;
    for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
      const xi = polygon[i].x, yi = polygon[i].y;
      const xj = polygon[j].x, yj = polygon[j].y;
      
      const intersect = ((yi > point.y) !== (yj > point.y))
        && (point.x < (xj - xi) * (point.y - yi) / (yj - yi) + xi);
      if (intersect) inside = !inside;
    }
    return inside;
  };

  const cancelScaleRegion = async () => {
    try {
      // Clean up lines
      for (const lineId of currentRegionLines) {
        await window.miro.board.remove({ id: lineId });
      }
    } catch (error) {
      console.error('Error cleaning up region lines:', error);
    }

    setCurrentRegionPoints([]);
    setCurrentRegionLines([]);
    setMode('none');
  };

  const latestMeasurement = measurements.length > 0 ? measurements[measurements.length - 1] : null;

  return (
    <div style={styles.body}>
      <div style={styles.container}>
        {/* Header */}
        <header style={styles.header}>
          <div style={styles.logoSection}>
            <img 
              src="/logo.svg" 
              alt="MeasureMint Logo" 
              style={{
                width: '32px',
                height: '32px',
                marginRight: '4px'
              }}
            />
            <div style={styles.brand}>
              <div style={styles.brandName}>MeasureMint</div>
              <div style={styles.brandTagline}>Professional Measurement Tool</div>
            </div>
          </div>
          <button
            onClick={() => setDarkMode(!darkMode)}
            style={{
              padding: '8px 12px',
              border: 'none',
              borderRadius: '8px',
              background: darkMode ? '#2c2c2e' : 'white',
              color: darkMode ? '#ffffff' : '#4a5568',
              cursor: 'pointer',
              fontSize: '18px',
              transition: 'all 0.2s ease',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
            title={darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          >
            {darkMode ? '☀️' : '🌙'}
          </button>
        </header>

        {/* Set Calibration Distance Button - shown when in calibrate mode */}
        {mode === 'calibrate' && calibrationLine && (
          <div style={{
            background: darkMode ? '#2c2c2e' : 'white',
            borderRadius: '12px',
            padding: '16px',
            boxShadow: darkMode ? '0 1px 3px rgba(0, 0, 0, 0.4)' : '0 1px 3px rgba(0, 0, 0, 0.05)',
            marginBottom: '12px'
          }}>
            <button
              onClick={finishCalibration}
              style={{
                ...styles.btnPrimary,
                padding: '12px 20px',
                fontSize: '14px',
                width: '100%'
              }}
            >
              ✓ Set Calibration Distance
            </button>
            <p style={{marginTop: '8px', color: darkMode ? '#8e8e93' : '#718096', fontSize: '11px', textAlign: 'center'}}>
              Drag the line endpoints to match a known distance on your image
            </p>
          </div>
        )}

        {/* Calculate Measurement Button - shown when in measure mode */}
        {mode === 'measure' && calibrationLine && (
          <div style={{
            background: darkMode ? '#2c2c2e' : 'white',
            borderRadius: '12px',
            padding: '16px',
            boxShadow: darkMode ? '0 1px 3px rgba(0, 0, 0, 0.4)' : '0 1px 3px rgba(0, 0, 0, 0.05)',
            marginBottom: '12px'
          }}>
            <button
              onClick={finishMeasurement}
              style={{
                ...styles.btnPrimary,
                padding: '12px 20px',
                fontSize: '14px',
                width: '100%'
              }}
            >
              📐 Calculate Measurement
            </button>
            <p style={{marginTop: '8px', color: darkMode ? '#8e8e93' : '#718096', fontSize: '11px', textAlign: 'center'}}>
              Drag the line endpoints to the points you want to measure
            </p>
          </div>
        )}

        {/* Main Panel */}
        <main style={styles.panel}>
          <h2 style={styles.panelTitle}>Measurement Tools</h2>
          
          {/* Compact Tool Sections */}
          <div style={{display: 'flex', flexDirection: 'column', gap: '8px'}}>
            
            {/* CALIBRATION SECTION */}
            <div style={{
              background: darkMode ? '#1c1c1e' : 'white',
              borderRadius: '12px',
              padding: '12px',
              boxShadow: darkMode ? '0 1px 3px rgba(0, 0, 0, 0.3)' : '0 1px 3px rgba(0, 0, 0, 0.05)',
              border: darkMode ? '2px solid #3a3a3c' : '2px solid #e2e8f0'
            }}>
              <div 
                onClick={() => setExpandedSection(expandedSection === 'calibration' ? null : 'calibration')}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  cursor: 'pointer',
                  padding: '4px'
                }}
              >
                <div style={{display: 'flex', alignItems: 'center', gap: '8px'}}>
                  <div style={{...styles.toolIcon, ...styles.toolIcon2, width: '32px', height: '32px'}}>
                    <MdSettings size={20} />
                  </div>
                  <div>
                    <div style={{fontWeight: '600', fontSize: '14px', color: darkMode ? '#ffffff' : '#1a202c'}}>
                      Calibration {calibration && '✓'}
                    </div>
                    <div style={{fontSize: '11px', color: darkMode ? '#8e8e93' : '#718096'}}>
                      {calibration ? 'Ready to measure' : 'Set scale first'}
                    </div>
                  </div>
                </div>
                <div style={{fontSize: '18px', color: darkMode ? '#8e8e93' : '#718096'}}>
                  {expandedSection === 'calibration' ? '▼' : '▶'}
                </div>
              </div>
              
              {expandedSection === 'calibration' && (
                <div style={{marginTop: '12px', display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '8px'}}>
                  <button
                    onClick={startCalibration}
                    style={{
                      ...styles.toolCard,
                      padding: '12px 8px',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      gap: '6px',
                      cursor: 'pointer',
                      border: darkMode ? '2px solid #3a3a3c' : '2px solid #2d3748',
                      background: darkMode ? '#1c1c1e' : '#f8fafc',
                      color: darkMode ? '#ffffff' : '#2d3748'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.borderColor = '#10bb82'}
                    onMouseLeave={(e) => e.currentTarget.style.borderColor = darkMode ? '#3a3a3c' : '#2d3748'}
                  >
                    <MdEdit size={20} />
                    <span style={{fontSize: '12px', fontWeight: '600', textAlign: 'center'}}>Draw Line</span>
                  </button>
                  
                  <button
                    onClick={selectExistingCalibration}
                    style={{
                      ...styles.toolCard,
                      padding: '12px 8px',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      gap: '6px',
                      cursor: 'pointer',
                      border: darkMode ? '2px solid #3a3a3c' : '2px solid #2d3748',
                      background: darkMode ? '#1c1c1e' : '#f8fafc',
                      color: darkMode ? '#ffffff' : '#2d3748'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.borderColor = '#10bb82'}
                    onMouseLeave={(e) => e.currentTarget.style.borderColor = darkMode ? '#3a3a3c' : '#2d3748'}
                  >
                    <MdContentCopy size={20} />
                    <span style={{fontSize: '12px', fontWeight: '600', textAlign: 'center'}}>Reuse Line</span>
                  </button>
                  
                  <button
                    onClick={() => setShowScalePresetsModal(true)}
                    style={{
                      ...styles.toolCard,
                      padding: '12px 8px',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      gap: '6px',
                      cursor: 'pointer',
                      border: darkMode ? '2px solid #3a3a3c' : '2px solid #2d3748',
                      background: darkMode ? '#1c1c1e' : '#f8fafc',
                      color: darkMode ? '#ffffff' : '#2d3748'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.borderColor = '#10bb82'}
                    onMouseLeave={(e) => e.currentTarget.style.borderColor = darkMode ? '#3a3a3c' : '#2d3748'}
                  >
                    <TbClipboardList size={20} />
                    <span style={{fontSize: '12px', fontWeight: '600', textAlign: 'center'}}>Presets</span>
                  </button>
                  
                  <button
                    onClick={() => calibrationLineId && updateCalibration()}
                    style={{
                      ...styles.toolCard,
                      padding: '12px 8px',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      gap: '6px',
                      cursor: calibrationLineId ? 'pointer' : 'not-allowed',
                      border: darkMode ? '2px solid #3a3a3c' : '2px solid #2d3748',
                      background: darkMode ? '#1c1c1e' : '#f8fafc',
                      color: darkMode ? '#ffffff' : '#2d3748',
                      opacity: calibrationLineId ? 1 : 0.5
                    }}
                    onMouseEnter={(e) => calibrationLineId && (e.currentTarget.style.borderColor = '#10bb82')}
                    onMouseLeave={(e) => e.currentTarget.style.borderColor = darkMode ? '#3a3a3c' : '#2d3748'}
                  >
                    <MdRefresh size={20} />
                    <span style={{fontSize: '12px', fontWeight: '600', textAlign: 'center'}}>Update</span>
                  </button>
                  
                  <button
                    onClick={detectGroupBasedScaleRegions}
                    style={{
                      ...styles.toolCard,
                      padding: '12px 8px',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      gap: '6px',
                      cursor: 'pointer',
                      border: darkMode ? '2px solid #3a3a3c' : '2px solid #2d3748',
                      background: darkMode ? '#1c1c1e' : '#f8fafc',
                      color: darkMode ? '#ffffff' : '#2d3748',
                      gridColumn: '1 / -1'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.borderColor = '#10bb82'}
                    onMouseLeave={(e) => e.currentTarget.style.borderColor = '#2d3748'}
                    title="Use Miro groups or frames as scale regions"
                  >
                    <TbLayoutGridAdd size={20} />
                    <span style={{fontSize: '12px', fontWeight: '600', textAlign: 'center'}}>
                      Group/Frame Regions {scaleRegions.length > 0 && `(${scaleRegions.length})`}
                    </span>
                  </button>
                </div>
              )}
            </div>

            {/* LINEAR MEASUREMENTS SECTION */}
            <div style={{
              background: darkMode ? '#1c1c1e' : 'white',
              borderRadius: '12px',
              padding: '12px',
              boxShadow: darkMode ? '0 1px 3px rgba(0, 0, 0, 0.3)' : '0 1px 3px rgba(0, 0, 0, 0.05)',
              border: darkMode ? '2px solid #3a3a3c' : '2px solid #e2e8f0'
            }}>
              <div 
                onClick={() => setExpandedSection(expandedSection === 'linear' ? null : 'linear')}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  cursor: 'pointer',
                  padding: '4px'
                }}
              >
                <div style={{display: 'flex', alignItems: 'center', gap: '8px'}}>
                  <div style={{...styles.toolIcon, ...styles.toolIcon1, width: '32px', height: '32px'}}>
                    <MdBarChart size={20} />
                  </div>
                  <div>
                    <div style={{fontWeight: '600', fontSize: '14px', color: darkMode ? '#ffffff' : '#1a202c'}}>
                      Linear Measurements
                    </div>
                    <div style={{fontSize: '11px', color: darkMode ? '#8e8e93' : '#718096'}}>
                      Distance, paths, angles & slopes
                    </div>
                  </div>
                </div>
                <div style={{fontSize: '18px', color: darkMode ? '#8e8e93' : '#718096'}}>
                  {expandedSection === 'linear' ? '▼' : '▶'}
                </div>
              </div>
              
              {expandedSection === 'linear' && (
                <div style={{marginTop: '12px', display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px'}}>
                  <button
                    onClick={() => calibration && startMeasurement()}
                    style={{
                      ...styles.toolCard,
                      padding: '12px 8px',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      gap: '6px',
                      cursor: calibration ? 'pointer' : 'not-allowed',
                      border: darkMode ? '2px solid #3a3a3c' : '2px solid #2d3748',
                      background: darkMode ? '#1c1c1e' : '#f8fafc',
                      color: darkMode ? '#ffffff' : '#2d3748',
                      opacity: calibration ? 1 : 0.5
                    }}
                    onMouseEnter={(e) => calibration && (e.currentTarget.style.borderColor = '#10bb82')}
                    onMouseLeave={(e) => e.currentTarget.style.borderColor = darkMode ? '#3a3a3c' : '#2d3748'}
                    title="Measure distance between two points"
                  >
                    <MdBarChart size={20} />
                    <span style={{fontSize: '11px', fontWeight: '600', textAlign: 'center'}}>Distance</span>
                  </button>
                  
                  <button
                    onClick={() => calibration && startPolylineMeasurement()}
                    style={{
                      ...styles.toolCard,
                      padding: '12px 8px',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      gap: '6px',
                      cursor: calibration ? 'pointer' : 'not-allowed',
                      border: darkMode ? '2px solid #3a3a3c' : '2px solid #2d3748',
                      background: darkMode ? '#1c1c1e' : '#f8fafc',
                      color: darkMode ? '#ffffff' : '#2d3748',
                      opacity: calibration ? 1 : 0.5
                    }}
                    onMouseEnter={(e) => calibration && (e.currentTarget.style.borderColor = '#10bb82')}
                    onMouseLeave={(e) => e.currentTarget.style.borderColor = darkMode ? '#3a3a3c' : '#2d3748'}
                    title="Measure multi-segment path length"
                  >
                    <TbVectorBezier2 size={20} />
                    <span style={{fontSize: '11px', fontWeight: '600', textAlign: 'center'}}>Path</span>
                  </button>
                  
                  <button
                    onClick={() => calibration && startAngleMeasurement()}
                    style={{
                      ...styles.toolCard,
                      padding: '12px 8px',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      gap: '6px',
                      cursor: calibration ? 'pointer' : 'not-allowed',
                      border: darkMode ? '2px solid #3a3a3c' : '2px solid #2d3748',
                      background: darkMode ? '#1c1c1e' : '#f8fafc',
                      color: darkMode ? '#ffffff' : '#2d3748',
                      opacity: calibration ? 1 : 0.5
                    }}
                    onMouseEnter={(e) => calibration && (e.currentTarget.style.borderColor = '#10bb82')}
                    onMouseLeave={(e) => e.currentTarget.style.borderColor = darkMode ? '#3a3a3c' : '#2d3748'}
                    title="Measure angle between three points"
                  >
                    <TbAngle size={20} />
                    <span style={{fontSize: '11px', fontWeight: '600', textAlign: 'center'}}>Angle</span>
                  </button>
                  
                  <button
                    onClick={() => calibration && startSlopeMeasurement()}
                    style={{
                      ...styles.toolCard,
                      padding: '12px 8px',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      gap: '6px',
                      cursor: calibration ? 'pointer' : 'not-allowed',
                      border: darkMode ? '2px solid #3a3a3c' : '2px solid #2d3748',
                      background: darkMode ? '#1c1c1e' : '#f8fafc',
                      color: darkMode ? '#ffffff' : '#2d3748',
                      opacity: calibration ? 1 : 0.5
                    }}
                    onMouseEnter={(e) => calibration && (e.currentTarget.style.borderColor = '#10bb82')}
                    onMouseLeave={(e) => e.currentTarget.style.borderColor = darkMode ? '#3a3a3c' : '#2d3748'}
                    title="Measure slope/pitch (rise over run)"
                  >
                    <TbStairs size={20} />
                    <span style={{fontSize: '11px', fontWeight: '600', textAlign: 'center'}}>Slope</span>
                  </button>
                  
                  <button
                    onClick={() => calibration && startCircleMeasurement()}
                    style={{
                      ...styles.toolCard,
                      padding: '12px 8px',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      gap: '6px',
                      cursor: calibration ? 'pointer' : 'not-allowed',
                      border: darkMode ? '2px solid #3a3a3c' : '2px solid #2d3748',
                      background: darkMode ? '#1c1c1e' : '#f8fafc',
                      color: darkMode ? '#ffffff' : '#2d3748',
                      opacity: calibration ? 1 : 0.5
                    }}
                    onMouseEnter={(e) => calibration && (e.currentTarget.style.borderColor = '#10bb82')}
                    onMouseLeave={(e) => e.currentTarget.style.borderColor = darkMode ? '#3a3a3c' : '#2d3748'}
                    title="Measure circle radius, diameter, circumference"
                  >
                    <TbCircle size={20} />
                    <span style={{fontSize: '11px', fontWeight: '600', textAlign: 'center'}}>Circle</span>
                  </button>
                </div>
              )}
            </div>

            {/* AREA & VOLUME SECTION */}
            <div style={{
              background: darkMode ? '#1c1c1e' : 'white',
              borderRadius: '12px',
              padding: '12px',
              boxShadow: darkMode ? '0 1px 3px rgba(0, 0, 0, 0.3)' : '0 1px 3px rgba(0, 0, 0, 0.05)',
              border: darkMode ? '2px solid #3a3a3c' : '2px solid #e2e8f0'
            }}>
              <div 
                onClick={() => setExpandedSection(expandedSection === 'area' ? null : 'area')}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  cursor: 'pointer',
                  padding: '4px'
                }}
              >
                <div style={{display: 'flex', alignItems: 'center', gap: '8px'}}>
                  <div style={{...styles.toolIcon, ...styles.toolIcon3, width: '32px', height: '32px'}}>
                    <TbSquare size={20} />
                  </div>
                  <div>
                    <div style={{fontWeight: '600', fontSize: '14px', color: darkMode ? '#ffffff' : '#1a202c'}}>
                      Area & Volume
                    </div>
                    <div style={{fontSize: '11px', color: darkMode ? '#8e8e93' : '#718096'}}>
                      Areas, volumes, cutouts & circles
                    </div>
                  </div>
                </div>
                <div style={{fontSize: '18px', color: darkMode ? '#8e8e93' : '#718096'}}>
                  {expandedSection === 'area' ? '▼' : '▶'}
                </div>
              </div>
              
              {expandedSection === 'area' && (
                <div style={{marginTop: '12px', display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '8px'}}>
                  <button
                    onClick={() => calibration && startAreaMeasurement()}
                    style={{
                      ...styles.toolCard,
                      padding: '12px 8px',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      gap: '6px',
                      cursor: calibration ? 'pointer' : 'not-allowed',
                      border: darkMode ? '2px solid #3a3a3c' : '2px solid #2d3748',
                      background: darkMode ? '#1c1c1e' : '#f8fafc',
                      color: darkMode ? '#ffffff' : '#2d3748',
                      opacity: calibration ? 1 : 0.5
                    }}
                    onMouseEnter={(e) => calibration && (e.currentTarget.style.borderColor = '#10bb82')}
                    onMouseLeave={(e) => e.currentTarget.style.borderColor = darkMode ? '#3a3a3c' : '#2d3748'}
                    title="Measure polygon area"
                  >
                    <TbSquare size={20} />
                    <span style={{fontSize: '12px', fontWeight: '600', textAlign: 'center'}}>Area</span>
                  </button>
                  
                  <button
                    onClick={() => calibration && startVolumeMeasurement()}
                    style={{
                      ...styles.toolCard,
                      padding: '12px 8px',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      gap: '6px',
                      cursor: calibration ? 'pointer' : 'not-allowed',
                      border: darkMode ? '2px solid #3a3a3c' : '2px solid #2d3748',
                      background: darkMode ? '#1c1c1e' : '#f8fafc',
                      color: darkMode ? '#ffffff' : '#2d3748',
                      opacity: calibration ? 1 : 0.5
                    }}
                    onMouseEnter={(e) => calibration && (e.currentTarget.style.borderColor = '#10bb82')}
                    onMouseLeave={(e) => e.currentTarget.style.borderColor = darkMode ? '#3a3a3c' : '#2d3748'}
                    title="Calculate volume (area × height)"
                  >
                    <TbCube size={20} />
                    <span style={{fontSize: '12px', fontWeight: '600', textAlign: 'center'}}>Volume</span>
                  </button>
                  
                  <button
                    onClick={() => calibration && startCutoutArea()}
                    style={{
                      ...styles.toolCard,
                      padding: '12px 8px',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      gap: '6px',
                      cursor: calibration ? 'pointer' : 'not-allowed',
                      border: darkMode ? '2px solid #3a3a3c' : '2px solid #2d3748',
                      background: darkMode ? '#1c1c1e' : '#f8fafc',
                      color: darkMode ? '#ffffff' : '#2d3748',
                      opacity: calibration ? 1 : 0.5
                    }}
                    onMouseEnter={(e) => calibration && (e.currentTarget.style.borderColor = '#10bb82')}
                    onMouseLeave={(e) => e.currentTarget.style.borderColor = darkMode ? '#3a3a3c' : '#2d3748'}
                    title="Measure area with exclusions/holes"
                  >
                    <TbLayersDifference size={20} />
                    <span style={{fontSize: '12px', fontWeight: '600', textAlign: 'center'}}>Cutouts</span>
                  </button>
                </div>
              )}
            </div>

            {/* UTILITIES SECTION */}
            <div style={{
              background: darkMode ? '#1c1c1e' : 'white',
              borderRadius: '12px',
              padding: '12px',
              boxShadow: darkMode ? '0 1px 3px rgba(0, 0, 0, 0.3)' : '0 1px 3px rgba(0, 0, 0, 0.05)',
              border: darkMode ? '2px solid #3a3a3c' : '2px solid #e2e8f0'
            }}>
              <div style={{display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px'}}>
                <button
                  onClick={selectImage}
                  style={{
                    ...styles.toolCard,
                    padding: '12px 8px',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '6px',
                    cursor: 'pointer',
                    border: darkMode ? '2px solid #3a3a3c' : '2px solid #2d3748',
                    background: darkMode ? '#1c1c1e' : '#f8fafc',
                    color: darkMode ? '#ffffff' : '#2d3748'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.borderColor = '#10bb82'}
                  onMouseLeave={(e) => e.currentTarget.style.borderColor = darkMode ? '#3a3a3c' : '#2d3748'}
                  title="Select reference image"
                >
                  <MdImage size={20} />
                  <span style={{fontSize: '11px', fontWeight: '600', textAlign: 'center'}}>
                    {selectedImage ? '✓ Image' : 'Image'}
                  </span>
                </button>
                
                <button
                  onClick={() => calibration && startCountTool()}
                  style={{
                    ...styles.toolCard,
                    padding: '12px 8px',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '6px',
                    cursor: calibration ? 'pointer' : 'not-allowed',
                    border: darkMode ? '2px solid #3a3a3c' : '2px solid #2d3748',
                    background: darkMode ? '#1c1c1e' : '#f8fafc',
                    color: darkMode ? '#ffffff' : '#2d3748',
                    opacity: calibration ? 1 : 0.5
                  }}
                  onMouseEnter={(e) => calibration && (e.currentTarget.style.borderColor = '#10bb82')}
                  onMouseLeave={(e) => e.currentTarget.style.borderColor = darkMode ? '#3a3a3c' : '#2d3748'}
                  title="Count items on board"
                >
                  <TbNumbers size={20} />
                  <span style={{fontSize: '11px', fontWeight: '600', textAlign: 'center'}}>
                    Count {mode === 'count' && `(${countTotal})`}
                  </span>
                </button>
                
                <button
                  onClick={() => {
                    if (latestMeasurement) {
                      setShowUnitsModal(true);
                    } else {
                      alert('No measurements yet. Take a measurement first!');
                    }
                  }}
                  style={{
                    ...styles.toolCard,
                    padding: '12px 8px',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '6px',
                    cursor: 'pointer',
                    border: darkMode ? '2px solid #3a3a3c' : '2px solid #2d3748',
                    background: darkMode ? '#1c1c1e' : '#f8fafc',
                    color: darkMode ? '#ffffff' : '#2d3748'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.borderColor = '#10bb82'}
                  onMouseLeave={(e) => e.currentTarget.style.borderColor = darkMode ? '#3a3a3c' : '#2d3748'}
                  title="View all unit conversions"
                >
                  <MdBarChart size={20} />
                  <span style={{fontSize: '11px', fontWeight: '600', textAlign: 'center'}}>Units</span>
                </button>
                
                <button
                  onClick={updateSelectedMeasurement}
                  style={{
                    ...styles.toolCard,
                    padding: '12px 8px',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '6px',
                    cursor: 'pointer',
                    border: darkMode ? '2px solid #3a3a3c' : '2px solid #2d3748',
                    background: darkMode ? '#1c1c1e' : '#f8fafc',
                    color: darkMode ? '#ffffff' : '#2d3748'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.borderColor = '#10bb82'}
                  onMouseLeave={(e) => e.currentTarget.style.borderColor = darkMode ? '#3a3a3c' : '#2d3748'}
                  title="Recalculate moved measurement"
                >
                  <MdEdit size={20} />
                  <span style={{fontSize: '11px', fontWeight: '600', textAlign: 'center'}}>Update</span>
                </button>
                
                <button
                  onClick={() => measurements.length > 0 && exportMeasurementsToCSV()}
                  style={{
                    ...styles.toolCard,
                    padding: '12px 8px',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '6px',
                    cursor: measurements.length > 0 ? 'pointer' : 'not-allowed',
                    border: darkMode ? '2px solid #3a3a3c' : '2px solid #2d3748',
                    background: darkMode ? '#1c1c1e' : '#f8fafc',
                    color: darkMode ? '#ffffff' : '#2d3748',
                    opacity: measurements.length > 0 ? 1 : 0.5,
                    gridColumn: '2 / 4'
                  }}
                  onMouseEnter={(e) => measurements.length > 0 && (e.currentTarget.style.borderColor = '#10bb82')}
                  onMouseLeave={(e) => e.currentTarget.style.borderColor = darkMode ? '#3a3a3c' : '#2d3748'}
                  title="Export measurements to CSV"
                >
                  <MdSave size={20} />
                  <span style={{fontSize: '11px', fontWeight: '600', textAlign: 'center'}}>
                    Export {measurements.length > 0 && `(${measurements.length})`}
                  </span>
                </button>
              </div>
            </div>
          </div>

          {/* Area Measurement Mode Buttons */}
          {mode === 'area' && (
            <div style={{marginTop: '12px', textAlign: 'center'}}>
              <button
                onClick={promptForAreaPoint}
                style={{
                  ...styles.btnPrimary,
                  padding: '10px 16px',
                  fontSize: '13px',
                  marginBottom: '8px',
                  width: '100%'
                }}
              >
                + Add Point ({areaPoints.length} added)
              </button>
              <div style={{display: 'flex', gap: '8px'}}>
                <button
                  onClick={finishAreaMeasurement}
                  style={{
                    ...styles.btnPrimary,
                    padding: '10px 16px',
                    fontSize: '13px',
                    flex: 1
                  }}
                >
                  ✓ Finish Area
                </button>
                <button
                  onClick={cancelAreaMeasurement}
                  style={{
                    ...styles.btnSecondary,
                    padding: '10px 16px',
                    fontSize: '13px',
                    flex: 1
                  }}
                >
                  Cancel
                </button>
              </div>
              <p style={{marginTop: '8px', color: '#718096', fontSize: '11px'}}>
                Click on the board to add points. Need at least 3 points.
              </p>
            </div>
          )}

          {/* Count Mode Buttons */}
          {mode === 'count' && (
            <div style={{marginTop: '12px', textAlign: 'center'}}>
              <div style={{display: 'flex', gap: '8px'}}>
                <button
                  onClick={addCountMarker}
                  style={{
                    ...styles.btnPrimary,
                    padding: '10px 16px',
                    fontSize: '13px',
                    flex: 1
                  }}
                >
                  ➕ Add Marker ({countTotal})
                </button>
                <button
                  onClick={resetCount}
                  style={{
                    ...styles.btnSecondary,
                    padding: '10px 16px',
                    fontSize: '13px',
                    flex: 1
                  }}
                >
                  Reset
                </button>
              </div>
              <p style={{marginTop: '8px', color: '#718096', fontSize: '11px'}}>
                Click "Add Marker" to place numbered markers on the board
              </p>
            </div>
          )}

          {/* Volume Measurement Mode Buttons */}
          {mode === 'volume' && !showVolumeModal && (
            <div style={{marginTop: '12px', textAlign: 'center'}}>
              <div style={{display: 'flex', gap: '8px'}}>
                <button
                  onClick={finishVolumeBase}
                  style={{
                    ...styles.btnPrimary,
                    padding: '10px 16px',
                    fontSize: '13px',
                    flex: 1
                  }}
                >
                  ✓ Define Base ({areaPoints.length} points)
                </button>
                <button
                  onClick={cancelAreaMeasurement}
                  style={{
                    ...styles.btnSecondary,
                    padding: '10px 16px',
                    fontSize: '13px',
                    flex: 1
                  }}
                >
                  Cancel
                </button>
              </div>
              <p style={{marginTop: '8px', color: '#718096', fontSize: '11px'}}>
                Click points to define base area, then enter height
              </p>
            </div>
          )}

          {/* Cutout/Subtract Areas Mode Buttons */}
          {mode === 'cutout' && (
            <div style={{marginTop: '12px', textAlign: 'center'}}>
              {cutoutMode === 'main' ? (
                <>
                  <div style={{display: 'flex', gap: '8px'}}>
                    <button
                      onClick={finishMainArea}
                      style={{
                        ...styles.btnPrimary,
                        padding: '10px 16px',
                        fontSize: '13px',
                        flex: 1
                      }}
                    >
                      ✓ Complete Main ({cutoutMainPoints.length} pts)
                    </button>
                    <button
                      onClick={cancelCutoutMeasurement}
                      style={{
                        ...styles.btnSecondary,
                        padding: '10px 16px',
                        fontSize: '13px',
                        flex: 1
                      }}
                    >
                      Cancel
                    </button>
                  </div>
                  <p style={{marginTop: '8px', color: '#718096', fontSize: '11px'}}>
                    Click points to define main area (need 3+ points)
                  </p>
                </>
              ) : (
                <>
                  <div style={{display: 'flex', gap: '8px', marginBottom: '8px'}}>
                    <button
                      onClick={finishCutout}
                      style={{
                        ...styles.btnPrimary,
                        padding: '10px 16px',
                        fontSize: '13px',
                        flex: 1
                      }}
                    >
                      ✓ Complete Cutout ({currentCutoutPoints.length} pts)
                    </button>
                    <button
                      onClick={finishCutoutMeasurement}
                      style={{
                        ...styles.btnSuccess,
                        padding: '10px 16px',
                        fontSize: '13px',
                        flex: 1,
                        background: '#10bb82',
                        color: 'white'
                      }}
                    >
                      Finish ({cutoutPolygons.length} cutouts)
                    </button>
                  </div>
                  <button
                    onClick={cancelCutoutMeasurement}
                    style={{
                      ...styles.btnSecondary,
                      padding: '10px 16px',
                      fontSize: '13px',
                      width: '100%'
                    }}
                  >
                    Cancel
                  </button>
                  <p style={{marginTop: '8px', color: '#718096', fontSize: '11px'}}>
                    Click points for cutout areas. Finish when done.
                  </p>
                </>
              )}
            </div>
          )}

          {/* Scale Region Definition Mode Buttons */}
          {mode === 'scaleRegion' && (
            <div style={{marginTop: '12px', textAlign: 'center'}}>
              <div style={{display: 'flex', gap: '8px'}}>
                <button
                  onClick={finishScaleRegion}
                  style={{
                    ...styles.btnPrimary,
                    padding: '10px 16px',
                    fontSize: '13px',
                    flex: 1
                  }}
                >
                  ✓ Complete Region ({currentRegionPoints.length} pts)
                </button>
                <button
                  onClick={cancelScaleRegion}
                  style={{
                    ...styles.btnSecondary,
                    padding: '10px 16px',
                    fontSize: '13px',
                    flex: 1
                  }}
                >
                  Cancel
                </button>
              </div>
              <p style={{marginTop: '8px', color: '#718096', fontSize: '11px'}}>
                Click points to define the scale region boundary (need 3+ points)
              </p>
            </div>
          )}
        </main>

        {/* Latest Measurement Display */}
        {latestMeasurement && (
          <div style={styles.panel}>
            <h2 style={styles.panelTitle}>Latest Measurement</h2>
            <div style={styles.measurementDisplay}>
              <div style={styles.measurementValue}>
                {latestMeasurement.type === 'area' ? formatNumber(latestMeasurement.area) : 
                 latestMeasurement.type === 'polyline' ? formatNumber(latestMeasurement.totalLength) :
                 latestMeasurement.type === 'count' ? latestMeasurement.number :
                 latestMeasurement.type === 'volume' ? formatNumber(latestMeasurement.volume) :
                 latestMeasurement.type === 'angle' ? formatNumber(latestMeasurement.angle, 1) :
                 latestMeasurement.type === 'circle' ? formatNumber(latestMeasurement.radius) :
                 latestMeasurement.type === 'cutout' ? formatNumber(latestMeasurement.netArea) :
                 latestMeasurement.type === 'slope' ? latestMeasurement.riseRunRatio :
                 formatNumber(latestMeasurement.distance)}
              </div>
              <div style={styles.measurementUnit}>
                {latestMeasurement.type === 'area' ? `${latestMeasurement.unit}²` :
                 latestMeasurement.type === 'volume' ? `${latestMeasurement.unit}³` :
                 latestMeasurement.type === 'angle' ? '°' :
                 latestMeasurement.type === 'circle' ? `${latestMeasurement.unit} radius` :
                 latestMeasurement.type === 'cutout' ? `${latestMeasurement.unit}² net` :
                 latestMeasurement.type === 'slope' ? `(${formatNumber(latestMeasurement.slopePercentage, 1)}%)` :
                 latestMeasurement.type === 'count' ? 'items' :
                 latestMeasurement.unit}
              </div>
            </div>
            {latestMeasurement.type === 'cutout' && (
              <div style={{textAlign: 'center', marginTop: '8px', color: '#718096', fontSize: '12px'}}>
                <div>Gross: {formatNumber(latestMeasurement.grossArea)} {latestMeasurement.unit}²</div>
                <div>Cutouts: {formatNumber(latestMeasurement.cutoutArea)} {latestMeasurement.unit}²</div>
                <div style={{fontWeight: 'bold', color: '#10bb82'}}>Net: {formatNumber(latestMeasurement.netArea)} {latestMeasurement.unit}²</div>
              </div>
            )}
            {latestMeasurement.type === 'slope' && (
              <div style={{textAlign: 'center', marginTop: '8px', color: '#718096', fontSize: '12px'}}>
                <div>Rise: {formatNumber(latestMeasurement.rise, 2)} {latestMeasurement.unit}</div>
                <div>Run: {formatNumber(latestMeasurement.run, 2)} {latestMeasurement.unit}</div>
                <div>Angle: {formatNumber(latestMeasurement.slopeDegrees, 1)}°</div>
              </div>
            )}
            {latestMeasurement.type === 'area' && latestMeasurement.perimeter && (
              <div style={{textAlign: 'center', marginTop: '8px', color: '#718096', fontSize: '12px'}}>
                Perimeter: {formatNumber(latestMeasurement.perimeter)} {latestMeasurement.unit}
              </div>
            )}
            {latestMeasurement.type === 'volume' && (
              <div style={{textAlign: 'center', marginTop: '8px', color: '#718096', fontSize: '12px'}}>
                Base: {formatNumber(latestMeasurement.baseArea)} {latestMeasurement.unit}² × Height: {formatNumber(latestMeasurement.height)} {latestMeasurement.unit}
              </div>
            )}
            {latestMeasurement.type === 'circle' && (
              <div style={{textAlign: 'center', marginTop: '8px', color: '#718096', fontSize: '12px'}}>
                D: {formatNumber(latestMeasurement.diameter)} {latestMeasurement.unit} | C: {formatNumber(latestMeasurement.circumference)} {latestMeasurement.unit} | A: {formatNumber(latestMeasurement.area)} {latestMeasurement.unit}²
              </div>
            )}
          </div>
        )}

        {/* Measurement History */}
        {measurements.length > 1 && (
          <div style={styles.panel}>
            <h2 style={styles.panelTitle}>Measurement History ({measurements.length} total)</h2>
            {measurements.slice(-5).reverse().map((m, idx) => (
              <div key={m.id} style={styles.historyItem}>
                <span style={styles.historyLabel}>
                  {m.type === 'area' ? '📐 Area' :
                   m.type === 'count' ? '🔢 Count' :
                   m.type === 'polyline' ? '📏 Path' :
                   m.type === 'volume' ? '📦 Volume' :
                   m.type === 'angle' ? '∠ Angle' :
                   m.type === 'circle' ? '⭕ Circle' :
                   m.type === 'cutout' ? '⬚ Cutout' :
                   m.type === 'slope' ? '� Slope' :
                   '�📏 Linear'} #{measurements.length - idx}
                </span>
                <span style={styles.historyValue}>
                  {m.type === 'area' ? `${formatNumber(m.area)} ${m.unit}²` :
                   m.type === 'count' ? `#${m.number}` :
                   m.type === 'polyline' ? `${formatNumber(m.totalLength)} ${m.unit}` :
                   m.type === 'volume' ? `${formatNumber(m.volume)} ${m.unit}³` :
                   m.type === 'angle' ? `${formatNumber(m.angle, 1)}°` :
                   m.type === 'circle' ? `R:${formatNumber(m.radius)} ${m.unit}` :
                   m.type === 'cutout' ? `${formatNumber(m.netArea)} ${m.unit}² net` :
                   m.type === 'slope' ? `${m.riseRunRatio} (${formatNumber(m.slopePercentage, 1)}%)` :
                   `${formatNumber(m.distance)} ${m.unit}`}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Volume Height Modal */}
      {showVolumeModal && (
        <div style={styles.modal}>
          <div style={styles.modalContent}>
            <h3 style={styles.modalTitle}>Volume Calculation</h3>
            
            <div style={styles.formGroup}>
              <label style={styles.label}>Base Area: {formatNumber(volumeBaseArea?.area, 2)} {calibration.unit}²</label>
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>Enter Height ({calibration.unit}):</label>
              <input
                type="number"
                value={volumeHeight}
                onChange={(e) => setVolumeHeight(e.target.value)}
                placeholder="0.00"
                step="0.01"
                style={styles.input}
                autoFocus
              />
            </div>

            <div style={styles.modalButtons}>
              <button onClick={completeVolumeCalculation} style={styles.btnPrimary}>
                Calculate Volume
              </button>
              <button
                onClick={() => {
                  setShowVolumeModal(false);
                  setVolumeHeight('');
                  setVolumeBaseArea(null);
                  cancelAreaMeasurement();
                }}
                style={styles.btnSecondary}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Calibration Modal */}
      {showCalibrationModal && (
        <div style={styles.modal}>
          <div style={styles.modalContent}>
            <h3 style={styles.modalTitle}>Calibration Setup</h3>
            
            <div style={styles.formGroup}>
              <label style={styles.label}>Select Unit:</label>
              <div style={styles.unitGrid}>
                {CONVERSIONS[unitSystem].map((u) => (
                  <button
                    key={u.abbr}
                    onClick={() => setCalibrationUnit(u.abbr)}
                    style={{
                      ...styles.unitGridBtn,
                      ...(calibrationUnit === u.abbr ? styles.unitGridBtnActive : {})
                    }}
                  >
                    {u.name}
                  </button>
                ))}
              </div>
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>Enter Distance ({calibrationUnit}):</label>
              <input
                type="text"
                value={calibrationValue}
                onChange={(e) => setCalibrationValue(e.target.value)}
                placeholder="e.g., 12.5 or 12' 6&quot; or 6&quot;"
                style={styles.input}
                autoFocus
              />
            </div>

            <div style={styles.modalButtons}>
              <button onClick={handleCalibrationComplete} style={styles.btnPrimary}>
                Set Calibration
              </button>
              <button
                onClick={() => {
                  setShowCalibrationModal(false);
                  setCalibrationValue('');
                  setMode('none');
                }}
                style={styles.btnSecondary}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Units Modal */}
      {showUnitsModal && latestMeasurement && (
        <div style={styles.modal} onClick={() => setShowUnitsModal(false)}>
          <div style={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <h3 style={styles.modalTitle}>All Unit Conversions</h3>
            <div style={styles.formGroup}>
              <label style={styles.label}>Imperial Units:</label>
              {CONVERSIONS.imperial.map((u) => (
                <div key={u.abbr} style={styles.historyItem}>
                  <span style={styles.historyLabel}>{u.name}</span>
                  <span style={styles.historyValue}>
                    {formatNumber(latestMeasurement.conversions[u.abbr])} {u.abbr}
                  </span>
                </div>
              ))}
            </div>
            <div style={styles.formGroup}>
              <label style={styles.label}>Metric Units:</label>
              {CONVERSIONS.metric.map((u) => (
                <div key={u.abbr} style={styles.historyItem}>
                  <span style={styles.historyLabel}>{u.name}</span>
                  <span style={styles.historyValue}>
                    {formatNumber(latestMeasurement.conversions[u.abbr])} {u.abbr}
                  </span>
                </div>
              ))}
            </div>
            <button onClick={() => setShowUnitsModal(false)} style={styles.btnPrimary}>
              Close
            </button>
          </div>
        </div>
      )}

      {/* Scale Presets Modal */}
      {showScalePresetsModal && (
        <div style={styles.modal} onClick={() => setShowScalePresetsModal(false)}>
          <div style={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <h3 style={styles.modalTitle}>Scale Presets</h3>
            
            <div style={styles.formGroup}>
              <label style={styles.label}>Imperial Scales:</label>
              <div style={{maxHeight: '200px', overflowY: 'auto', marginBottom: '16px'}}>
                {ARCHITECTURAL_SCALES.imperial.map((scale, idx) => (
                  <div 
                    key={idx}
                    onClick={() => applyScalePreset(scale)}
                    style={{
                      padding: '12px',
                      margin: '4px 0',
                      background: '#f8fafc',
                      border: '2px solid #e2e8f0',
                      borderRadius: '8px',
                      cursor: 'pointer',
                      transition: 'all 0.2s'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.borderColor = '#10bb82'}
                    onMouseLeave={(e) => e.currentTarget.style.borderColor = '#e2e8f0'}
                  >
                    <div style={{fontWeight: '600', color: '#1a202c', fontSize: '14px'}}>
                      {scale.name}
                    </div>
                    <div style={{fontSize: '11px', color: '#718096', marginTop: '4px'}}>
                      {scale.description}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>Metric Scales:</label>
              <div style={{maxHeight: '200px', overflowY: 'auto'}}>
                {ARCHITECTURAL_SCALES.metric.map((scale, idx) => (
                  <div 
                    key={idx}
                    onClick={() => applyScalePreset(scale)}
                    style={{
                      padding: '12px',
                      margin: '4px 0',
                      background: '#f8fafc',
                      border: '2px solid #e2e8f0',
                      borderRadius: '8px',
                      cursor: 'pointer',
                      transition: 'all 0.2s'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.borderColor = '#10bb82'}
                    onMouseLeave={(e) => e.currentTarget.style.borderColor = '#e2e8f0'}
                  >
                    <div style={{fontWeight: '600', color: '#1a202c', fontSize: '14px'}}>
                      {scale.name}
                    </div>
                    <div style={{fontSize: '11px', color: '#718096', marginTop: '4px'}}>
                      {scale.description}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <button 
              onClick={() => setShowScalePresetsModal(false)} 
              style={{...styles.btnSecondary, width: '100%', marginTop: '12px'}}
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Scale Regions Management Modal */}
      {showScaleRegionsModal && (
        <div style={styles.modal}>
          <div style={{...styles.modalContent, maxWidth: '600px', maxHeight: '80vh', overflow: 'auto'}}>
            <h3 style={styles.modalTitle}>Scale Regions Management</h3>
            
            <p style={{fontSize: '13px', color: '#718096', marginBottom: '16px'}}>
              Define different scales for different areas of your drawing. Useful for mixed-scale drawings with detail callouts.
            </p>

            {/* Active Region Indicator */}
            {activeScaleRegion && (
              <div style={{
                background: '#10bb82',
                color: 'white',
                padding: '12px',
                borderRadius: '8px',
                marginBottom: '16px',
                fontSize: '13px'
              }}>
                <strong>Active Region:</strong> {activeScaleRegion.name}
                <div style={{fontSize: '11px', marginTop: '4px', opacity: 0.9}}>
                  Scale: 1:{activeScaleRegion.calibration.ratio || 'Custom'}
                </div>
              </div>
            )}

            {/* Existing Regions List */}
            {scaleRegions.length > 0 ? (
              <div style={{marginBottom: '20px'}}>
                <h4 style={{fontSize: '14px', color: '#1a202c', marginBottom: '12px', fontWeight: '600'}}>
                  Existing Regions ({scaleRegions.length})
                </h4>
                <div style={{display: 'flex', flexDirection: 'column', gap: '8px'}}>
                  {scaleRegions.map((region) => (
                    <div
                      key={region.regionId}
                      style={{
                        padding: '12px',
                        border: `2px solid ${activeScaleRegion?.regionId === region.regionId ? '#10bb82' : (darkMode ? '#3a3a3c' : '#e2e8f0')}`,
                        borderRadius: '8px',
                        background: activeScaleRegion?.regionId === region.regionId ? (darkMode ? '#0d3d2d' : '#f0fdf4') : (darkMode ? '#1c1c1e' : 'white'),
                        cursor: 'pointer',
                        transition: 'all 0.2s'
                      }}
                    >
                      <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start'}}>
                        <div style={{flex: 1}} onClick={() => selectScaleRegion(region.regionId)}>
                          <div style={{fontWeight: '600', color: darkMode ? '#ffffff' : '#1a202c', fontSize: '14px'}}>
                            {region.name}
                          </div>
                          <div style={{fontSize: '12px', color: '#718096', marginTop: '4px'}}>
                            Scale: 1:{region.calibration.ratio || 'Custom'} • 
                            {region.calibration.actualDistance} {region.calibration.unit} calibration
                          </div>
                          <div style={{fontSize: '11px', color: '#a0aec0', marginTop: '2px'}}>
                            {region.points.length} boundary points
                          </div>
                        </div>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            if (confirm(`Delete region "${region.name}"?`)) {
                              deleteScaleRegion(region.regionId);
                            }
                          }}
                          style={{
                            background: '#fee2e2',
                            color: '#dc2626',
                            border: 'none',
                            borderRadius: '6px',
                            padding: '6px 12px',
                            fontSize: '12px',
                            cursor: 'pointer',
                            fontWeight: '500'
                          }}
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div style={{
                padding: '20px',
                background: '#f7fafc',
                borderRadius: '8px',
                textAlign: 'center',
                color: '#718096',
                fontSize: '13px',
                marginBottom: '20px'
              }}>
                No scale regions defined yet. Create one to get started!
              </div>
            )}

            {/* Action Buttons */}
            <div style={{display: 'flex', gap: '8px'}}>
              <button 
                onClick={() => {
                  setShowScaleRegionsModal(false);
                  startScaleRegion();
                }} 
                style={{...styles.btnPrimary, flex: 1}}
              >
                ➕ Create New Region
              </button>
              {activeScaleRegion && (
                <button 
                  onClick={() => {
                    setActiveScaleRegion(null);
                    alert('Switched to global calibration mode');
                  }} 
                  style={{...styles.btnSecondary, flex: 1}}
                >
                  Use Global Scale
                </button>
              )}
              <button 
                onClick={() => setShowScaleRegionsModal(false)} 
                style={{...styles.btnSecondary, flex: activeScaleRegion ? 0 : 1, minWidth: '80px'}}
              >
                Close
              </button>
            </div>

            <div style={{
              marginTop: '16px',
              padding: '12px',
              background: '#eff6ff',
              borderRadius: '8px',
              fontSize: '11px',
              color: '#1e40af',
              borderLeft: '3px solid #3b82f6'
            }}>
              <strong>💡 How to use:</strong>
              <ol style={{margin: '8px 0 0 0', paddingLeft: '20px'}}>
                <li>Click "Create New Region" and draw the boundary</li>
                <li>Calibrate the scale for that specific region</li>
                <li>Select a region to make it active for measurements</li>
                <li>Measurements will automatically use the region's scale</li>
              </ol>
            </div>
          </div>
        </div>
      )}

      {/* Custom Modal (replaces browser alerts/confirms) */}
      {customModal.show && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 10000
        }}>
          <div style={{
            background: darkMode ? '#2c2c2e' : 'white',
            borderRadius: '12px',
            padding: '24px',
            maxWidth: '500px',
            width: '90%',
            boxShadow: darkMode ? '0 10px 40px rgba(0, 0, 0, 0.6)' : '0 10px 40px rgba(0, 0, 0, 0.2)'
          }}>
            <h3 style={{
              margin: '0 0 16px 0',
              fontSize: '18px',
              fontWeight: '600',
              color: darkMode ? '#ffffff' : '#1a202c'
            }}>
              {customModal.title}
            </h3>
            <p style={{
              margin: '0 0 24px 0',
              fontSize: '14px',
              color: darkMode ? '#aeaeb2' : '#4a5568',
              whiteSpace: 'pre-line',
              lineHeight: '1.6'
            }}>
              {customModal.message}
            </p>
            <div style={{
              display: 'flex',
              gap: '12px',
              justifyContent: 'flex-end'
            }}>
              {customModal.type === 'confirm' && (
                <button
                  onClick={customModal.onCancel}
                  style={{
                    ...styles.btnSecondary,
                    padding: '10px 20px'
                  }}
                >
                  Cancel
                </button>
              )}
              <button
                onClick={customModal.onConfirm}
                style={{
                  ...styles.btnPrimary,
                  padding: '10px 20px'
                }}
              >
                OK
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}


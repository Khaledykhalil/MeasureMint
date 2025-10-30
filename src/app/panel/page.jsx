'use client';

import { useState, useEffect } from 'react';
import { 
  MdImage, 
  MdSettings, 
  MdRefresh, 
  MdBarChart, 
  MdEdit,
  MdSave
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
  TbLayoutGridAdd
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

// Function to format measurement based on unit type
function formatMeasurement(value, unit, decimals = 2) {
  if (unit === 'ft') {
    return formatFeetInches(value);
  }
  return formatNumber(value, decimals);
}

const styles = {
  body: {
    fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
    background: 'linear-gradient(135deg, #f5f7fa 0%, #e8ecf1 100%)',
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
    background: 'white',
    borderRadius: '12px',
    padding: '12px 16px',
    marginBottom: '12px',
    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)',
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
    color: '#1a202c',
    letterSpacing: '-0.5px'
  },
  brandTagline: {
    fontSize: '10px',
    color: '#718096',
    fontWeight: '500',
    textTransform: 'uppercase',
    letterSpacing: '0.5px'
  },
  unitToggle: {
    display: 'flex',
    gap: '4px',
    background: '#f7fafc',
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
    color: '#4a5568',
    background: 'transparent'
  },
  unitBtnActive: {
    background: 'white',
    color: '#10bb82',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.08)'
  },
  panel: {
    background: 'white',
    borderRadius: '12px',
    padding: '16px',
    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)',
    marginBottom: '12px'
  },
  panelTitle: {
    fontSize: '12px',
    fontWeight: '600',
    color: '#718096',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
    marginBottom: '12px',
    paddingBottom: '8px',
    borderBottom: '2px solid #e2e8f0'
  },
  toolsGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr',
    gap: '8px'
  },
  toolCard: {
    background: '#f8fafc',
    border: '2px solid #e2e8f0',
    borderRadius: '8px',
    padding: '10px',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    position: 'relative',
    overflow: 'hidden'
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
    color: '#1a202c',
    marginBottom: '2px',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis'
  },
  toolDescription: {
    fontSize: '11px',
    color: '#718096',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis'
  },
  emptyCard: {
    background: '#fafafa',
    border: '2px dashed #cbd5e0',
    borderRadius: '12px',
    padding: '32px',
    textAlign: 'center',
    color: '#a0aec0',
    cursor: 'default'
  },
  emptyIcon: {
    fontSize: '32px',
    marginBottom: '8px'
  },
  measurementDisplay: {
    background: 'white',
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
    color: '#718096',
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
    background: 'white',
    borderRadius: '16px',
    padding: '32px',
    maxWidth: '500px',
    width: '90%',
    maxHeight: '90vh',
    overflowY: 'auto',
    boxShadow: '0 20px 60px rgba(0,0,0,0.3)'
  },
  modalTitle: {
    fontSize: '24px',
    fontWeight: '700',
    color: '#1a202c',
    marginBottom: '24px',
    paddingBottom: '16px',
    borderBottom: '2px solid #e2e8f0'
  },
  formGroup: {
    marginBottom: '24px'
  },
  label: {
    display: 'block',
    fontSize: '14px',
    fontWeight: '600',
    marginBottom: '8px',
    color: '#4a5568',
    textTransform: 'uppercase',
    letterSpacing: '0.5px'
  },
  input: {
    width: '100%',
    padding: '12px 16px',
    border: '2px solid #e2e8f0',
    borderRadius: '10px',
    fontSize: '16px',
    boxSizing: 'border-box',
    fontFamily: 'monospace',
    transition: 'border-color 0.2s ease'
  },
  unitGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, 1fr)',
    gap: '12px'
  },
  unitGridBtn: {
    padding: '12px 16px',
    border: '2px solid #e2e8f0',
    borderRadius: '10px',
    background: 'white',
    fontSize: '14px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.2s',
    textAlign: 'center',
    color: '#4a5568'
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
    border: '2px solid #e2e8f0',
    borderRadius: '8px',
    fontSize: '13px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    background: 'white',
    color: '#4a5568'
  },
  historyItem: {
    padding: '16px',
    background: '#f8fafc',
    border: '2px solid #e2e8f0',
    borderRadius: '10px',
    marginBottom: '12px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  historyLabel: {
    color: '#718096',
    fontSize: '14px',
    fontWeight: '500'
  },
  historyValue: {
    fontWeight: '700',
    color: '#10bb82',
    fontFamily: 'monospace',
    fontSize: '16px'
  }
};

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

  // Set up board click listener for multi-point measurement tools
  useEffect(() => {
    if (!window.miro) return;

    const handleBoardClick = async (event) => {
      // Get click position
      const x = event.x;
      const y = event.y;

      // Route to appropriate handler based on current mode
      if (mode === 'area') {
        await addAreaPoint(x, y);
      } else if (mode === 'polyline') {
        await addPolylinePoint(x, y);
      } else if (mode === 'angle') {
        await addAnglePoint(x, y);
      } else if (mode === 'circle') {
        await addCirclePoint(x, y);
      } else if (mode === 'cutout') {
        await addCutoutPoint(x, y);
      } else if (mode === 'slope') {
        await addSlopePoint(x, y);
      } else if (mode === 'scale-region') {
        await addRegionPoint(x, y);
      }
    };

    // Only set up listener for modes that need board clicks
    const clickModes = ['area', 'polyline', 'angle', 'circle', 'cutout', 'slope', 'scale-region'];
    if (clickModes.includes(mode)) {
      window.miro.board.ui.on('click', handleBoardClick);
      
      return () => {
        // Cleanup: remove the event listener when mode changes or component unmounts
        window.miro.board.ui.off('click', handleBoardClick);
      };
    }
  }, [mode, areaPoints, polylinePoints, anglePoints, circleCenter, cutoutMainPoints, cutoutPolygons, cutoutMode, slopePoints, currentRegionPoints]);

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
    // User draws one reference line, then we apply the scale preset
    
    setShowScalePresetsModal(false);
    
    // Ask user if they want to draw a reference line or enter measurements directly
    const useReferenceLine = confirm(
      `Selected: ${scale.name} (${scale.description})\n\n` +
      `Choose calibration method:\n\n` +
      `OK = Draw a reference line on your drawing\n` +
      `Cancel = Enter pixel distance manually\n\n` +
      `Drawing a line is recommended for accuracy!`
    );
    
    if (useReferenceLine) {
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
    } else {
      // Manual entry method
      const referenceDistance = prompt(
        `Enter a reference distance from your drawing:\n` +
        `(e.g., if you see "10 ft" marked on the drawing, enter 10)`
      );
      
      if (!referenceDistance || isNaN(referenceDistance) || parseFloat(referenceDistance) <= 0) {
        alert('Invalid distance. Scale preset not applied.');
        return;
      }
      
      const actualDistance = parseFloat(referenceDistance);
      
      // Ask for the unit
      const unitOptions = ['ft', 'in', 'm', 'cm', 'yd', 'mm'];
      const unit = prompt(
        `What unit is the ${actualDistance} in?\n\n` +
        `Options: ${unitOptions.join(', ')}`,
        'ft'
      );
      
      const finalUnit = (unit && CONVERSIONS.toMeters[unit]) ? unit : 'ft';
      
      // Simplified: use scale ratio to calculate a standard calibration
      // Assume 100 pixels = actualDistance on screen (user can recalibrate later)
      const pixelDist = 100;
      
      const newCalibration = {
        pixelDistance: pixelDist,
        actualDistance: actualDistance,
        unit: finalUnit,
        ratio: scale.ratio,
        scaleName: scale.name,
        timestamp: new Date().toISOString()
      };
      
      setCalibration(newCalibration);
      setMode('none');
      
      alert(
        `✓ Scale preset applied!\n\n` +
        `${scale.name} (1:${scale.ratio})\n` +
        `Reference: ${actualDistance} ${finalUnit}\n\n` +
        `You can now take measurements!\n` +
        `(Recalibrate manually for precise measurements)`
      );
    }
  };

  const startCalibration = async () => {
    // Check if Miro API is available
    if (!window.miro) {
      alert('Miro API not ready. Please wait a moment and try again.');
      return;
    }

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
    
    try {
      // Create a draggable line for the user to position
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
          strokeColor: '#f5576c',
          strokeWidth: 6,
          startStrokeCap: 'stealth',
          endStrokeCap: 'stealth'
        },
        captions: [{
          content: 'Calibration Line - Drag endpoints to known distance',
          position: 0.5
        }]
      });

      setCalibrationLine(line);
    } catch (error) {
      console.error('Error starting calibration:', error);
      alert('Error creating calibration line: ' + error.message);
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

  const startMeasurement = async () => {
    if (!calibration) {
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
          strokeWidth: 6,
          startStrokeCap: 'stealth',
          endStrokeCap: 'stealth'
        },
        captions: [{
          content: 'Measurement Line - Drag endpoints to measure',
          position: 0.5
        }]
      });

      setCalibrationLine(line);
    } catch (error) {
      console.error('Error starting measurement:', error);
    }
  };

  const finishMeasurement = async () => {
    if (!calibrationLine) {
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
      const formattedValue = formatMeasurement(actualDistance, primaryUnit);
      const measurementText = primaryUnit === 'ft' ? formattedValue : `${formattedValue} ${primaryUnit}`;

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
          strokeWidth: 6,
          startStrokeCap: 'stealth',
          endStrokeCap: 'stealth'
        },
        captions: [{
          content: measurementText,
          position: 0.5
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
          strokeWidth: 6,
          startStrokeCap: 'stealth',
          endStrokeCap: 'stealth'
        },
        captions: [{
          content: measurementText,
          position: 0.5
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

      const formattedArea = formatMeasurement(actualArea, calibration.unit);
      const formattedPerimeter = formatMeasurement(actualPerimeter, calibration.unit);
      const areaDisplay = calibration.unit === 'ft' ? `${formattedArea} sq` : `${formattedArea} ${calibration.unit}²`;
      const perimDisplay = calibration.unit === 'ft' ? formattedPerimeter : `${formattedPerimeter} ${calibration.unit}`;
      
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

  const handleCalibrationComplete = async () => {
    const actualDistance = parseFloat(calibrationValue);
    
    if (!actualDistance || actualDistance <= 0) {
      alert('Please enter a valid distance');
      return;
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
              strokeWidth: 6,
              startStrokeCap: 'stealth',
              endStrokeCap: 'stealth'
            },
            captions: [{
              content: `Calibration: ${actualDistance} ${calibrationUnit}${scalePreset ? ` (${scalePreset.name})` : ''}`,
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
              strokeWidth: 6,
              startStrokeCap: 'stealth',
              endStrokeCap: 'stealth'
            },
            captions: [{
              content: `Calibration: ${actualDistance} ${calibrationUnit}${scalePreset ? ` (${scalePreset.name})` : ''}`,
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
          `Calibration: ${actualDistance} ${calibrationUnit}\n\n` +
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
          value = formatMeasurement(m.area, m.unit);
          unit = m.unit === 'ft' ? 'sq ft' : `${m.unit}²`;
          additionalInfo = m.unit === 'ft' ? `Perimeter: ${formatMeasurement(m.perimeter, m.unit)}` : `Perimeter: ${formatMeasurement(m.perimeter, m.unit)} ${m.unit}`;
          break;
        case 'polyline':
          value = formatMeasurement(m.totalLength, m.unit);
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
          value = formatMeasurement(m.radius, m.unit);
          unit = m.unit === 'ft' ? '(radius)' : `${m.unit} (radius)`;
          const formattedD = formatMeasurement(m.diameter, m.unit);
          const formattedC = formatMeasurement(m.circumference, m.unit);
          const formattedA = formatMeasurement(m.area, m.unit);
          additionalInfo = m.unit === 'ft' ? `D: ${formattedD}, C: ${formattedC}, A: ${formattedA} sq` : `D: ${formattedD}, C: ${formattedC}, A: ${formattedA} ${m.unit}²`;
          break;
        case 'cutout':
          value = formatMeasurement(m.netArea, m.unit);
          unit = m.unit === 'ft' ? 'sq ft (net)' : `${m.unit}² (net)`;
          const formattedGross = formatMeasurement(m.grossArea, m.unit);
          const formattedCutout = formatMeasurement(m.cutoutArea, m.unit);
          const formattedNet = formatMeasurement(m.netArea, m.unit);
          const sqUnit = m.unit === 'ft' ? 'sq' : `${m.unit}²`;
          additionalInfo = `Gross: ${formattedGross} ${sqUnit}, Cutouts: ${formattedCutout} ${sqUnit}, Net: ${formattedNet} ${sqUnit}`;
          break;
        case 'slope':
          value = m.riseRunRatio;
          unit = 'ratio';
          const formattedRise = formatMeasurement(m.rise, m.unit);
          const formattedRun = formatMeasurement(m.run, m.unit);
          additionalInfo = m.unit === 'ft' ? `${formatNumber(m.slopePercentage, 1)}% / ${formatNumber(m.slopeDegrees, 1)}°, Rise: ${formattedRise}, Run: ${formattedRun}` : `${formatNumber(m.slopePercentage, 1)}% / ${formatNumber(m.slopeDegrees, 1)}°, Rise: ${formattedRise} ${m.unit}, Run: ${formattedRun} ${m.unit}`;
          break;
        case 'volume':
          value = formatMeasurement(m.volume, m.unit);
          unit = m.unit === 'ft' ? 'cu ft' : `${m.unit}³`;
          const formattedBase = formatMeasurement(m.baseArea, m.unit);
          const formattedHeight = formatMeasurement(m.height, m.unit);
          additionalInfo = m.unit === 'ft' ? `Base: ${formattedBase} sq, Height: ${formattedHeight}` : `Base: ${formattedBase} ${m.unit}², Height: ${formattedHeight} ${m.unit}`;
          break;
        default: // linear
          value = formatMeasurement(m.distance, m.unit);
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
  const startPolylineMeasurement = () => {
    if (!calibration) {
      return;
    }
    setMode('polyline');
    setPolylinePoints([]);
    setTempPolylineLines([]);
  };

  const addPolylinePoint = async (x, y) => {
    const newPoint = { x, y };
    const updatedPoints = [...polylinePoints, newPoint];
    setPolylinePoints(updatedPoints);

    // Draw line from previous point to new point
    if (polylinePoints.length > 0) {
      const prevPoint = polylinePoints[polylinePoints.length - 1];
      
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
            strokeColor: '#ff6b6b', // Red for polyline
            strokeWidth: 4,
            startStrokeCap: 'stealth',
            endStrokeCap: 'stealth'
          }
        });
        
        setTempPolylineLines([...tempPolylineLines, line.id]);
      } catch (error) {
        console.error('Error drawing polyline segment:', error);
      }
    }
  };

  const finishPolylineMeasurement = async () => {
    if (polylinePoints.length < 2) {
      alert('Please select at least 2 points');
      return;
    }

    try {
      // Calculate total length
      let totalLength = 0;
      const segments = [];
      
      for (let i = 0; i < polylinePoints.length - 1; i++) {
        const dx = polylinePoints[i + 1].x - polylinePoints[i].x;
        const dy = polylinePoints[i + 1].y - polylinePoints[i].y;
        const segmentLength = Math.sqrt(dx * dx + dy * dy);
        totalLength += segmentLength;
        segments.push(segmentLength / calibration.pixelsPerUnit);
      }

      const actualLength = totalLength / calibration.pixelsPerUnit;

      // Add label at the end point
      const lastPoint = polylinePoints[polylinePoints.length - 1];
      const formattedLength = formatMeasurement(actualLength, calibration.unit);
      const lengthDisplay = calibration.unit === 'ft' ? formattedLength : `${formattedLength} ${calibration.unit}`;
      const lengthText = await window.miro.board.createText({
        content: `Total: ${lengthDisplay}\n${polylinePoints.length} points`,
        x: lastPoint.x,
        y: lastPoint.y + 50,
        width: 200,
        style: {
          color: '#ff6b6b',
          fontSize: 14,
          textAlign: 'center'
        }
      });

      // Store the polyline measurement
      const polylineMeasurement = {
        id: Date.now(),
        type: 'polyline',
        totalLength: actualLength,
        segments,
        unit: calibration.unit,
        points: polylinePoints,
        lineIds: tempPolylineLines,
        textId: lengthText.id,
        timestamp: new Date()
      };

      setPolylineShapes([...polylineShapes, polylineMeasurement]);
      setMeasurements([...measurements, polylineMeasurement]);

      // Reset for next polyline
      setPolylinePoints([]);
      setTempPolylineLines([]);
      setMode('none');
    } catch (error) {
      console.error('Error finishing polyline measurement:', error);
      alert('Error: ' + error.message);
    }
  };

  const cancelPolylineMeasurement = async () => {
    // Remove temporary lines
    if (tempPolylineLines.length > 0) {
      try {
        for (const lineId of tempPolylineLines) {
          await window.miro.board.remove({ id: lineId });
        }
      } catch (error) {
        console.error('Error removing temp lines:', error);
      }
    }
    
    setPolylinePoints([]);
    setTempPolylineLines([]);
    setMode('none');
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
  const startAngleMeasurement = () => {
    if (!calibration) {
      return;
    }
    setMode('angle');
    setAnglePoints([]);
    setAngleLines([]);
  };

  const addAnglePoint = async (x, y) => {
    const newPoint = { x, y };
    const updatedPoints = [...anglePoints, newPoint];
    setAnglePoints(updatedPoints);

    // Draw line from previous point
    if (anglePoints.length > 0 && anglePoints.length < 3) {
      const prevPoint = anglePoints[anglePoints.length - 1];
      
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
            strokeColor: '#ff9800', // Orange for angle
            strokeWidth: 4,
            startStrokeCap: 'none',
            endStrokeCap: 'stealth'
          }
        });
        
        setAngleLines([...angleLines, line.id]);
      } catch (error) {
        console.error('Error drawing angle line:', error);
      }
    }

    // If we have 3 points, calculate angle
    if (updatedPoints.length === 3) {
      finishAngleMeasurement(updatedPoints);
    }
  };

  const finishAngleMeasurement = async (points) => {
    try {
      // Calculate angle using vectors
      const [p1, vertex, p2] = points;
      
      // Vectors from vertex
      const v1 = { x: p1.x - vertex.x, y: p1.y - vertex.y };
      const v2 = { x: p2.x - vertex.x, y: p2.y - vertex.y };
      
      // Calculate angle using dot product
      const dot = v1.x * v2.x + v1.y * v2.y;
      const mag1 = Math.sqrt(v1.x * v1.x + v1.y * v1.y);
      const mag2 = Math.sqrt(v2.x * v2.x + v2.y * v2.y);
      const angleRad = Math.acos(dot / (mag1 * mag2));
      const angleDeg = angleRad * (180 / Math.PI);

      // Add label at vertex
      const angleText = await window.miro.board.createText({
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
        points,
        lineIds: angleLines,
        textId: angleText.id,
        timestamp: new Date()
      };

      setMeasurements([...measurements, angleMeasurement]);
      setAnglePoints([]);
      setAngleLines([]);
      setMode('none');
    } catch (error) {
      console.error('Error calculating angle:', error);
    }
  };

  const cancelAngleMeasurement = async () => {
    if (angleLines.length > 0) {
      try {
        for (const lineId of angleLines) {
          await window.miro.board.remove({ id: lineId });
        }
      } catch (error) {
        console.error('Error removing angle lines:', error);
      }
    }
    setAnglePoints([]);
    setAngleLines([]);
    setMode('none');
  };

  // Circle Measurement Functions
  const startCircleMeasurement = () => {
    if (!calibration) {
      return;
    }
    setMode('circle');
    setCircleCenter(null);
    setCircleRadius(null);
    setTempCircle(null);
  };

  const addCirclePoint = async (x, y) => {
    if (!circleCenter) {
      // First click - set center
      setCircleCenter({ x, y });
      
      // Create a small marker at center
      try {
        const marker = await window.miro.board.createShape({
          content: '⊕',
          shape: 'circle',
          x,
          y,
          width: 20,
          height: 20,
          style: {
            fillColor: '#e91e63', // Pink for circle
            borderColor: '#e91e63'
          }
        });
        setTempCircle(marker.id);
      } catch (error) {
        console.error('Error creating center marker:', error);
      }
    } else {
      // Second click - calculate radius and finish
      const dx = x - circleCenter.x;
      const dy = y - circleCenter.y;
      const radiusPixels = Math.sqrt(dx * dx + dy * dy);
      const radius = radiusPixels / calibration.pixelsPerUnit;
      
      finishCircleMeasurement(radiusPixels, radius);
    }
  };

  const finishCircleMeasurement = async (radiusPixels, radius) => {
    try {
      const diameter = radius * 2;
      const circumference = 2 * Math.PI * radius;
      const area = Math.PI * radius * radius;

      // Draw circle
      const circle = await window.miro.board.createShape({
        shape: 'circle',
        x: circleCenter.x,
        y: circleCenter.y,
        width: radiusPixels * 2,
        height: radiusPixels * 2,
        style: {
          fillOpacity: 0,
          borderColor: '#e91e63',
          borderWidth: 4
        }
      });

      // Add label
      const circleText = await window.miro.board.createText({
        content: `R: ${formatNumber(radius, 2)} ${calibration.unit}\nD: ${formatNumber(diameter, 2)} ${calibration.unit}\nC: ${formatNumber(circumference, 2)} ${calibration.unit}\nA: ${formatNumber(area, 2)} ${calibration.unit}²`,
        x: circleCenter.x,
        y: circleCenter.y + radiusPixels + 60,
        width: 200,
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
        center: circleCenter,
        shapeId: circle.id,
        textId: circleText.id,
        timestamp: new Date()
      };

      setMeasurements([...measurements, circleMeasurement]);
      
      // Remove temp marker
      if (tempCircle) {
        await window.miro.board.remove({ id: tempCircle });
      }
      
      setCircleCenter(null);
      setCircleRadius(null);
      setTempCircle(null);
      setMode('none');
    } catch (error) {
      console.error('Error finishing circle measurement:', error);
    }
  };

  const cancelCircleMeasurement = async () => {
    if (tempCircle) {
      try {
        await window.miro.board.remove({ id: tempCircle });
      } catch (error) {
        console.error('Error removing temp circle:', error);
      }
    }
    setCircleCenter(null);
    setCircleRadius(null);
    setTempCircle(null);
    setMode('none');
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
  const startSlopeMeasurement = () => {
    setMode('slope');
    setSlopePoints([]);
    setSlopeLine(null);
  };

  const addSlopePoint = async (x, y) => {
    const newPoint = { x, y };
    const updatedPoints = [...slopePoints, newPoint];
    setSlopePoints(updatedPoints);

    // If this is the second point, create the line and calculate slope
    if (updatedPoints.length === 2) {
      try {
        const [p1, p2] = updatedPoints;
        
        // Create line
        const line = await window.miro.board.createConnector({
          start: { 
            position: p1
          },
          end: { 
            position: p2
          },
          shape: 'straight',
          style: {
            strokeColor: '#9c27b0', // Purple for slope
            strokeWidth: 6,
            startStrokeCap: 'stealth',
            endStrokeCap: 'stealth'
          }
        });

        setSlopeLine(line.id);
        
        // Calculate slope
        await finishSlopeMeasurement(updatedPoints, line.id);
      } catch (error) {
        console.error('Error creating slope line:', error);
      }
    }
  };

  const finishSlopeMeasurement = async (points, lineId) => {
    try {
      const [p1, p2] = points;
      
      // Calculate rise and run in pixels
      const runPixels = Math.abs(p2.x - p1.x);
      const risePixels = Math.abs(p2.y - p1.y);
      
      // Convert to real-world units
      const pixelsPerUnit = calibration.pixelDistance / calibration.actualDistance;
      const run = runPixels / pixelsPerUnit;
      const rise = risePixels / pixelsPerUnit;
      
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

      // Get conversions for rise and run
      const riseConversions = getAllConversions(rise, calibration.unit);
      const runConversions = getAllConversions(run, calibration.unit);

      // Update line with caption
      const line = await window.miro.board.get({ id: [lineId] });
      if (line.length > 0) {
        const updatedLine = await window.miro.board.createConnector({
          start: { ...line[0].start },
          end: { ...line[0].end },
          shape: 'straight',
          style: {
            strokeColor: '#9c27b0',
            strokeWidth: 6,
            startStrokeCap: 'stealth',
            endStrokeCap: 'stealth'
          },
          captions: [{
            content: `Slope: ${riseRunRatio} (${formatNumber(slopePercentage, 1)}%, ${formatNumber(slopeDegrees, 1)}°)`,
            position: 0.5
          }]
        });

        // Remove old line
        await window.miro.board.remove(line[0]);

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
          riseConversions,
          runConversions,
          points,
          lineId: updatedLine.id,
          timestamp: new Date().toISOString()
        };

        setMeasurements([...measurements, slopeMeasurement]);
        
        // Reset state
        setSlopePoints([]);
        setSlopeLine(null);
        setMode('none');
      }
    } catch (error) {
      console.error('Error finishing slope measurement:', error);
      alert('Error calculating slope. Please try again.');
    }
  };

  const cancelSlopeMeasurement = async () => {
    if (slopeLine) {
      try {
        await window.miro.board.remove({ id: slopeLine });
      } catch (error) {
        console.error('Error removing slope line:', error);
      }
    }
    setSlopePoints([]);
    setSlopeLine(null);
    setMode('none');
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

  const getCalibrationForPoint = (x, y) => {
    // Check if point is inside any scale region
    for (const region of scaleRegions) {
      if (isPointInPolygon({ x, y }, region.points)) {
        return region.calibration;
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
        </header>

        {/* Main Panel */}
        <main style={styles.panel}>
          <h2 style={styles.panelTitle}>Measurement Tools</h2>
          <div style={styles.toolsGrid}>
            {/* Select Image */}
            <div
              style={{
                ...styles.toolCard,
                ...(hoveredCard === 'select' ? styles.toolCardHover : {})
              }}
              onClick={selectImage}
              onMouseEnter={() => setHoveredCard('select')}
              onMouseLeave={() => setHoveredCard(null)}
            >
              <div style={{...styles.toolIcon, ...styles.toolIcon1}}>
                <MdImage size={24} />
              </div>
              <div style={styles.toolContent}>
                <div style={styles.toolName}>Select Image</div>
                <div style={styles.toolDescription}>
                  {selectedImage ? '✓ Image selected' : 'Optional: Select reference image'}
                </div>
              </div>
            </div>

            {/* Scale Presets */}
            <div
              style={{
                ...styles.toolCard,
                ...(hoveredCard === 'scalePresets' ? styles.toolCardHover : {})
              }}
              onClick={() => setShowScalePresetsModal(true)}
              onMouseEnter={() => setHoveredCard('scalePresets')}
              onMouseLeave={() => setHoveredCard(null)}
            >
              <div style={{...styles.toolIcon, ...styles.toolIcon1}}>
                <TbClipboardList size={24} />
              </div>
              <div style={styles.toolContent}>
                <div style={styles.toolName}>Scale Presets</div>
                <div style={styles.toolDescription}>
                  Scale templates
                </div>
              </div>
            </div>

            {/* Calibrate */}
            <div
              style={{
                ...styles.toolCard,
                ...(hoveredCard === 'calibrate' ? styles.toolCardHover : {})
              }}
              onClick={startCalibration}
              onMouseEnter={() => setHoveredCard('calibrate')}
              onMouseLeave={() => setHoveredCard(null)}
            >
              <div style={{...styles.toolIcon, ...styles.toolIcon2}}>
                <MdSettings size={24} />
              </div>
              <div style={styles.toolContent}>
                <div style={styles.toolName}>Calibrate</div>
                <div style={styles.toolDescription}>
                  {calibration ? '✓ Calibrated' : 'Set measurement scale'}
                </div>
              </div>
            </div>

            {/* Update Calibration */}
            <div
              style={{
                ...styles.toolCard,
                ...(hoveredCard === 'updateCalibration' ? styles.toolCardHover : {}),
                ...(calibrationLineId ? {} : {opacity: 0.5, cursor: 'not-allowed'})
              }}
              onClick={() => calibrationLineId && updateCalibration()}
              onMouseEnter={() => setHoveredCard('updateCalibration')}
              onMouseLeave={() => setHoveredCard(null)}
            >
              <div style={{...styles.toolIcon, ...styles.toolIcon2}}>
                <MdRefresh size={24} />
              </div>
              <div style={styles.toolContent}>
                <div style={styles.toolName}>Update Calibration</div>
                <div style={styles.toolDescription}>
                  Recalibrate moved line
                </div>
              </div>
            </div>

            {/* Measure */}
            <div
              style={{
                ...styles.toolCard,
                ...(hoveredCard === 'measure' ? styles.toolCardHover : {}),
                ...(calibration ? {} : {opacity: 0.5, cursor: 'not-allowed'})
              }}
              onClick={() => calibration && startMeasurement()}
              onMouseEnter={() => setHoveredCard('measure')}
              onMouseLeave={() => setHoveredCard(null)}
            >
              <div style={{...styles.toolIcon, ...styles.toolIcon3}}>
                <TbRuler size={24} />
              </div>
              <div style={styles.toolContent}>
                <div style={styles.toolName}>Measure</div>
                <div style={styles.toolDescription}>
                  {mode === 'measure' ? 'Click two points...' : 'Take measurements'}
                </div>
              </div>
            </div>

            {/* View All Units */}
            <div
              style={{
                ...styles.toolCard,
                ...(hoveredCard === 'units' ? styles.toolCardHover : {})
              }}
              onClick={() => {
                if (latestMeasurement) {
                  setShowUnitsModal(true);
                } else {
                  alert('No measurements yet. Take a measurement first!');
                }
              }}
              onMouseEnter={() => setHoveredCard('units')}
              onMouseLeave={() => setHoveredCard(null)}
            >
              <div style={{...styles.toolIcon, ...styles.toolIcon4}}>
                <MdBarChart size={24} />
              </div>
              <div style={styles.toolContent}>
                <div style={styles.toolName}>View All Units</div>
                <div style={styles.toolDescription}>Browse measurement conversions</div>
              </div>
            </div>

            {/* Update Selected Measurement */}
            <div
              style={{
                ...styles.toolCard,
                ...(hoveredCard === 'update' ? styles.toolCardHover : {})
              }}
              onClick={updateSelectedMeasurement}
              onMouseEnter={() => setHoveredCard('update')}
              onMouseLeave={() => setHoveredCard(null)}
            >
              <div style={{...styles.toolIcon, ...styles.toolIcon3}}>
                <MdEdit size={24} />
              </div>
              <div style={styles.toolContent}>
                <div style={styles.toolName}>Update Selected</div>
                <div style={styles.toolDescription}>Recalculate moved measurement</div>
              </div>
            </div>

            {/* Area Measurement */}
            <div
              style={{
                ...styles.toolCard,
                ...(hoveredCard === 'area' ? styles.toolCardHover : {}),
                ...(calibration ? {} : {opacity: 0.5, cursor: 'not-allowed'})
              }}
              onClick={() => calibration && startAreaMeasurement()}
              onMouseEnter={() => setHoveredCard('area')}
              onMouseLeave={() => setHoveredCard(null)}
            >
              <div style={{...styles.toolIcon, ...styles.toolIcon2}}>
                <TbRectangle size={24} />
              </div>
              <div style={styles.toolContent}>
                <div style={styles.toolName}>Measure Area</div>
                <div style={styles.toolDescription}>
                  {mode === 'area' ? `${areaPoints.length} points` : 'Click points to define area'}
                </div>
              </div>
            </div>

            {/* Count Tool */}
            <div
              style={{
                ...styles.toolCard,
                ...(hoveredCard === 'count' ? styles.toolCardHover : {}),
                ...(calibration ? {} : {opacity: 0.5, cursor: 'not-allowed'})
              }}
              onClick={() => calibration && startCountTool()}
              onMouseEnter={() => setHoveredCard('count')}
              onMouseLeave={() => setHoveredCard(null)}
            >
              <div style={{...styles.toolIcon, ...styles.toolIcon1}}>
                <TbNumbers size={24} />
              </div>
              <div style={styles.toolContent}>
                <div style={styles.toolName}>Count Items</div>
                <div style={styles.toolDescription}>
                  {mode === 'count' ? `Count: ${countTotal}` : 'Mark and count items'}
                </div>
              </div>
            </div>

            {/* Polyline Measurement */}
            <div
              style={{
                ...styles.toolCard,
                ...(hoveredCard === 'polyline' ? styles.toolCardHover : {}),
                ...(calibration ? {} : {opacity: 0.5, cursor: 'not-allowed'})
              }}
              onClick={() => calibration && startPolylineMeasurement()}
              onMouseEnter={() => setHoveredCard('polyline')}
              onMouseLeave={() => setHoveredCard(null)}
            >
              <div style={{...styles.toolIcon, ...styles.toolIcon3}}>
                <TbWaveSine size={24} />
              </div>
              <div style={styles.toolContent}>
                <div style={styles.toolName}>Polyline Path</div>
                <div style={styles.toolDescription}>
                  {mode === 'polyline' ? `${polylinePoints.length} points` : 'Multi-segment measurement'}
                </div>
              </div>
            </div>

            {/* Volume Measurement */}
            <div
              style={{
                ...styles.toolCard,
                ...(hoveredCard === 'volume' ? styles.toolCardHover : {}),
                ...(calibration ? {} : {opacity: 0.5, cursor: 'not-allowed'})
              }}
              onClick={() => calibration && startVolumeMeasurement()}
              onMouseEnter={() => setHoveredCard('volume')}
              onMouseLeave={() => setHoveredCard(null)}
            >
              <div style={{...styles.toolIcon, ...styles.toolIcon2}}>
                <TbBox size={24} />
              </div>
              <div style={styles.toolContent}>
                <div style={styles.toolName}>Measure Volume</div>
                <div style={styles.toolDescription}>
                  {mode === 'volume' ? 'Define base area' : 'Base area + height'}
                </div>
              </div>
            </div>

            {/* Angle Measurement */}
            <div
              style={{
                ...styles.toolCard,
                ...(hoveredCard === 'angle' ? styles.toolCardHover : {}),
                ...(calibration ? {} : {opacity: 0.5, cursor: 'not-allowed'})
              }}
              onClick={() => calibration && startAngleMeasurement()}
              onMouseEnter={() => setHoveredCard('angle')}
              onMouseLeave={() => setHoveredCard(null)}
            >
              <div style={{...styles.toolIcon, ...styles.toolIcon3}}>
                <TbAngle size={24} />
              </div>
              <div style={styles.toolContent}>
                <div style={styles.toolName}>Measure Angle</div>
                <div style={styles.toolDescription}>
                  {mode === 'angle' ? `${anglePoints.length}/3 points` : 'Click 3 points for angle'}
                </div>
              </div>
            </div>

            {/* Circle Measurement */}
            <div
              style={{
                ...styles.toolCard,
                ...(hoveredCard === 'circle' ? styles.toolCardHover : {}),
                ...(calibration ? {} : {opacity: 0.5, cursor: 'not-allowed'})
              }}
              onClick={() => calibration && startCircleMeasurement()}
              onMouseEnter={() => setHoveredCard('circle')}
              onMouseLeave={() => setHoveredCard(null)}
            >
              <div style={{...styles.toolIcon, ...styles.toolIcon1}}>
                <TbCircle size={24} />
              </div>
              <div style={styles.toolContent}>
                <div style={styles.toolName}>Measure Circle</div>
                <div style={styles.toolDescription}>
                  {mode === 'circle' ? (circleCenter ? 'Click edge' : 'Click center') : 'Center + edge point'}
                </div>
              </div>
            </div>

            {/* Cutout/Subtract Areas */}
            <div
              style={{
                ...styles.toolCard,
                ...(hoveredCard === 'cutout' ? styles.toolCardHover : {}),
                ...(calibration ? {} : {opacity: 0.5, cursor: 'not-allowed'})
              }}
              onClick={() => calibration && startCutoutArea()}
              onMouseEnter={() => setHoveredCard('cutout')}
              onMouseLeave={() => setHoveredCard(null)}
            >
              <div style={{...styles.toolIcon, ...styles.toolIcon2}}>
                <TbLayersDifference size={24} />
              </div>
              <div style={styles.toolContent}>
                <div style={styles.toolName}>Cutout Areas</div>
                <div style={styles.toolDescription}>
                  {mode === 'cutout' ? (cutoutMode === 'main' ? `Main: ${cutoutMainPoints.length} pts` : `Cutout: ${cutoutPolygons.length} done`) : 'Area with exclusions'}
                </div>
              </div>
            </div>

            {/* Slope/Pitch Measurement */}
            <div
              style={{
                ...styles.toolCard,
                ...(hoveredCard === 'slope' ? styles.toolCardHover : {}),
                ...(calibration ? {} : {opacity: 0.5, cursor: 'not-allowed'})
              }}
              onClick={() => calibration && startSlopeMeasurement()}
              onMouseEnter={() => setHoveredCard('slope')}
              onMouseLeave={() => setHoveredCard(null)}
            >
              <div style={{...styles.toolIcon, ...styles.toolIcon3}}>
                <TbStairs size={24} />
              </div>
              <div style={styles.toolContent}>
                <div style={styles.toolName}>Slope/Pitch</div>
                <div style={styles.toolDescription}>
                  {mode === 'slope' ? `${slopePoints.length}/2 points` : 'Rise over run'}
                </div>
              </div>
            </div>

            {/* Scale Regions Management */}
            <div
              style={{
                ...styles.toolCard,
                ...(hoveredCard === 'scaleRegions' ? styles.toolCardHover : {})
              }}
              onClick={() => setShowScaleRegionsModal(true)}
              onMouseEnter={() => setHoveredCard('scaleRegions')}
              onMouseLeave={() => setHoveredCard(null)}
            >
              <div style={{...styles.toolIcon, ...styles.toolIcon3}}>
                <TbLayoutGridAdd size={24} />
              </div>
              <div style={styles.toolContent}>
                <div style={styles.toolName}>Scale Regions</div>
                <div style={styles.toolDescription}>
                  {scaleRegions.length > 0 ? `Manage ${scaleRegions.length} region${scaleRegions.length > 1 ? 's' : ''}` : 'Define scale regions'}
                </div>
              </div>
            </div>

            {/* Export Measurements */}
            <div
              style={{
                ...styles.toolCard,
                ...(hoveredCard === 'export' ? styles.toolCardHover : {}),
                ...(measurements.length > 0 ? {} : {opacity: 0.5, cursor: 'not-allowed'})
              }}
              onClick={() => measurements.length > 0 && exportMeasurementsToCSV()}
              onMouseEnter={() => setHoveredCard('export')}
              onMouseLeave={() => setHoveredCard(null)}
            >
              <div style={{...styles.toolIcon, ...styles.toolIcon4}}>
                <MdSave size={24} />
              </div>
              <div style={styles.toolContent}>
                <div style={styles.toolName}>Export Data</div>
                <div style={styles.toolDescription}>
                  {measurements.length > 0 ? `Download ${measurements.length} measurements` : 'No measurements yet'}
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons for Calibrate/Measure */}
          {mode === 'calibrate' && calibrationLine && (
            <div style={{marginTop: '12px', textAlign: 'center'}}>
              <button
                onClick={finishCalibration}
                style={{
                  ...styles.btnPrimary,
                  padding: '10px 20px',
                  fontSize: '13px',
                  width: '100%'
                }}
              >
                ✓ Set Calibration Distance
              </button>
              <p style={{marginTop: '8px', color: '#718096', fontSize: '11px'}}>
                Drag the line endpoints to match a known distance on your image
              </p>
            </div>
          )}

          {mode === 'measure' && calibrationLine && (
            <div style={{marginTop: '12px', textAlign: 'center'}}>
              <button
                onClick={finishMeasurement}
                style={{
                  ...styles.btnPrimary,
                  padding: '10px 20px',
                  fontSize: '13px',
                  width: '100%'
                }}
              >
                📐 Calculate Measurement
              </button>
              <p style={{marginTop: '8px', color: '#718096', fontSize: '11px'}}>
                Drag the line endpoints to the points you want to measure
              </p>
            </div>
          )}

          {/* Area Measurement Mode Buttons */}
          {mode === 'area' && (
            <div style={{marginTop: '12px', textAlign: 'center'}}>
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
                  ✓ Finish Area ({areaPoints.length} points)
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

          {/* Polyline Measurement Mode Buttons */}
          {mode === 'polyline' && (
            <div style={{marginTop: '12px', textAlign: 'center'}}>
              <div style={{display: 'flex', gap: '8px'}}>
                <button
                  onClick={finishPolylineMeasurement}
                  style={{
                    ...styles.btnPrimary,
                    padding: '10px 16px',
                    fontSize: '13px',
                    flex: 1
                  }}
                >
                  ✓ Finish Path ({polylinePoints.length} points)
                </button>
                <button
                  onClick={cancelPolylineMeasurement}
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
                Click on the board to add path points. Need at least 2 points.
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

          {/* Angle Measurement Mode Buttons */}
          {mode === 'angle' && anglePoints.length < 3 && (
            <div style={{marginTop: '12px', textAlign: 'center'}}>
              <button
                onClick={cancelAngleMeasurement}
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
                Click 3 points: Start → Vertex → End ({anglePoints.length}/3)
              </p>
            </div>
          )}

          {/* Circle Measurement Mode Buttons */}
          {mode === 'circle' && !circleRadius && (
            <div style={{marginTop: '12px', textAlign: 'center'}}>
              <button
                onClick={cancelCircleMeasurement}
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
                {circleCenter ? 'Click edge point to define radius' : 'Click center point of circle'}
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

          {/* Slope/Pitch Mode Buttons */}
          {mode === 'slope' && slopePoints.length < 2 && (
            <div style={{marginTop: '12px', textAlign: 'center'}}>
              <button
                onClick={cancelSlopeMeasurement}
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
                Click 2 points to measure slope: Start → End ({slopePoints.length}/2)
              </p>
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
                type="number"
                value={calibrationValue}
                onChange={(e) => setCalibrationValue(e.target.value)}
                placeholder="0.00"
                step="0.01"
                style={styles.input}
                autoFocus
              />
            </div>

            <div style={styles.modalButtons}>
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
                type="number"
                value={calibrationValue}
                onChange={(e) => setCalibrationValue(e.target.value)}
                placeholder="0.00"
                step="0.01"
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
                        border: `2px solid ${activeScaleRegion?.regionId === region.regionId ? '#10bb82' : '#e2e8f0'}`,
                        borderRadius: '8px',
                        background: activeScaleRegion?.regionId === region.regionId ? '#f0fdf4' : 'white',
                        cursor: 'pointer',
                        transition: 'all 0.2s'
                      }}
                    >
                      <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start'}}>
                        <div style={{flex: 1}} onClick={() => selectScaleRegion(region.regionId)}>
                          <div style={{fontWeight: '600', color: '#1a202c', fontSize: '14px'}}>
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
    </div>
  );
}


'use client';

import { useState, useEffect } from 'react';

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

const styles = {
  body: {
    fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
    background: 'linear-gradient(135deg, #f5f7fa 0%, #e8ecf1 100%)',
    minHeight: '100vh',
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
    background: '#0ea572'
  },
  toolIcon3: {
    background: '#0d9264'
  },
  toolIcon4: {
    background: '#0c7f57'
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
        alert('Measurement mode stopped. Click "Measure" or create a new calibration to continue.');
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [mode, calibrationLine]);

  const selectImage = async () => {
    try {
      const selection = await window.miro.board.getSelection();
      if (selection.length === 0) {
        alert('Please select an image on the board first');
        return;
      }
      
      const image = selection.find(item => item.type === 'image');
      if (!image) {
        alert('Please select an image (not other widget types)');
        return;
      }
      
      setSelectedImage(image);
      alert('Image selected! Now calibrate to set the scale.');
    } catch (error) {
      console.error('Error selecting image:', error);
      alert('Error selecting image. Please try again.');
    }
  };

  const applyScalePreset = (scale) => {
    // For architectural scales, we know the ratio
    // User needs to draw a line representing a known distance in the drawing
    // For example, for 1/4" = 1', the ratio is 48:1
    // If they measure 1 inch on screen, it represents 4 feet in reality
    
    setShowScalePresetsModal(false);
    alert(`Scale ${scale.name} selected. Now:\n1. Click "Calibrate"\n2. Draw a line on a known dimension in your drawing\n3. Enter what that dimension represents at this scale`);
    
    // Store the scale info for reference
    window.selectedScale = scale;
  };

  const startCalibration = async () => {
    if (!selectedImage) {
      alert('Please select an image first');
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

      // Create line with draggable endpoints (no dots needed)
      const line = await window.miro.board.createConnector({
        start: {
          position: {
            x: centerX - 200,
            y: centerY
          }
        },
        end: {
          position: {
            x: centerX + 200,
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

      alert('Drag the line endpoints to match a known distance on your image, then click "Set Calibration Distance" below');
    } catch (error) {
      console.error('Error starting calibration:', error);
      alert('Error starting calibration: ' + error.message);
    }
  };

  const finishCalibration = async () => {
    if (!calibrationLine) {
      alert('Please start calibration first');
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
      alert('Please calibrate the scale first');
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

      // Create line with draggable endpoints (no dots needed)
      const line = await window.miro.board.createConnector({
        start: {
          position: {
            x: centerX - 200,
            y: centerY
          }
        },
        end: {
          position: {
            x: centerX + 200,
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

      // Only show alert for the first measurement
      if (isFirstMeasurement) {
        alert('Drag the line endpoints to the points you want to measure, then click "Calculate Measurement" below');
      }
    } catch (error) {
      console.error('Error starting measurement:', error);
      alert('Error starting measurement: ' + error.message);
    }
  };

  const finishMeasurement = async () => {
    if (!calibrationLine) {
      alert('Please start measurement first');
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
      const formattedValue = formatNumber(actualDistance, 2);
      const measurementText = `${formattedValue} ${primaryUnit}`;

      // Update the line's caption with the measurement by recreating it
      const updatedLine = await window.miro.board.createConnector({
        start: line.start,
        end: line.end,
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
        start: line.start,
        end: line.end,
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

  const handleCalibrationComplete = async () => {
    const actualDistance = parseFloat(calibrationValue);
    
    if (!actualDistance || actualDistance <= 0) {
      alert('Please enter a valid distance');
      return;
    }

    try {
      setCalibration({
        pixelsPerUnit: tempCalibrationDistance / actualDistance,
        unit: calibrationUnit
      });

      // Update the calibration line caption to show the calibration distance
      if (calibrationLine) {
        // Get the current line to preserve its position
        const items = await window.miro.board.get({ id: [calibrationLine.id] });
        if (items.length === 1) {
          const line = items[0];
          
          // Create a new line with updated caption and green color
          const updatedLine = await window.miro.board.createConnector({
            start: line.start,
            end: line.end,
            shape: 'straight',
            style: {
              strokeColor: '#10bb82',
              strokeWidth: 6,
              startStrokeCap: 'stealth',
              endStrokeCap: 'stealth'
            },
            captions: [{
              content: `Calibration: ${actualDistance} ${calibrationUnit}`,
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
            start: line.start,
            end: line.end,
            shape: 'straight',
            style: {
              strokeColor: '#10bb82',
              strokeWidth: 6,
              startStrokeCap: 'stealth',
              endStrokeCap: 'stealth'
            },
            captions: [{
              content: `Calibration: ${actualDistance} ${calibrationUnit}`,
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
      
      // Only show alert for the first measurement
      if (isFirstMeasurement) {
        alert(`Calibration complete! Position the blue line and click "Calculate Measurement". Press ESC to stop measuring.`);
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
    }
  };

  const handleMeasurementComplete = (pixelDistance) => {
    if (!calibration) return;

    const actualDistance = pixelDistance / calibration.pixelsPerUnit;
    const conversions = getAllConversions(actualDistance, calibration.unit);

    const measurement = {
      id: Date.now(),
      distance: actualDistance,
      unit: calibration.unit,
      conversions: conversions,
      timestamp: new Date()
    };

    setMeasurements([...measurements, measurement]);
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
          <div style={styles.unitToggle}>
            <button
              style={{
                ...styles.unitBtn,
                ...(unitSystem === 'imperial' ? styles.unitBtnActive : {})
              }}
              onClick={() => {
                setUnitSystem('imperial');
                setCalibrationUnit('ft');
              }}
            >
              Imperial
            </button>
            <button
              style={{
                ...styles.unitBtn,
                ...(unitSystem === 'metric' ? styles.unitBtnActive : {})
              }}
              onClick={() => {
                setUnitSystem('metric');
                setCalibrationUnit('m');
              }}
            >
              Metric
            </button>
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
                🖼️
              </div>
              <div style={styles.toolContent}>
                <div style={styles.toolName}>Select Image</div>
                <div style={styles.toolDescription}>
                  {selectedImage ? '✓ Image selected' : 'Choose an image from board'}
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
                📐
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
                ...(hoveredCard === 'calibrate' ? styles.toolCardHover : {}),
                ...(selectedImage ? {} : {opacity: 0.5, cursor: 'not-allowed'})
              }}
              onClick={() => selectedImage && startCalibration()}
              onMouseEnter={() => setHoveredCard('calibrate')}
              onMouseLeave={() => setHoveredCard(null)}
            >
              <div style={{...styles.toolIcon, ...styles.toolIcon2}}>
                ⚙️
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
                🔄
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
                📐
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
                📊
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
                🔄
              </div>
              <div style={styles.toolContent}>
                <div style={styles.toolName}>Update Selected</div>
                <div style={styles.toolDescription}>Recalculate moved measurement</div>
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
        </main>

        {/* Latest Measurement Display */}
        {latestMeasurement && (
          <div style={styles.panel}>
            <h2 style={styles.panelTitle}>Latest Measurement</h2>
            <div style={styles.measurementDisplay}>
              <div style={styles.measurementValue}>
                {formatNumber(latestMeasurement.distance)}
              </div>
              <div style={styles.measurementUnit}>
                {latestMeasurement.unit}
              </div>
            </div>
          </div>
        )}

        {/* Measurement History */}
        {measurements.length > 1 && (
          <div style={styles.panel}>
            <h2 style={styles.panelTitle}>Measurement History ({measurements.length} total)</h2>
            {measurements.slice(-5).reverse().map((m, idx) => (
              <div key={m.id} style={styles.historyItem}>
                <span style={styles.historyLabel}>Measurement #{measurements.length - idx}</span>
                <span style={styles.historyValue}>
                  {formatNumber(m.distance)} {m.unit}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

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
    </div>
  );
}

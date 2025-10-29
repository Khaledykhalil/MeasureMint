'use client';

import { useState } from 'react';
import '../../assets/style.css';

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

// Bluebeam Revu-inspired styles with MeasureMint green (#10bb82)
const styles = {
  container: {
    height: '100vh',
    display: 'flex',
    flexDirection: 'column',
    background: '#f5f5f5',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
    overflow: 'hidden'
  },
  header: {
    background: '#2c2c2c',
    borderBottom: '3px solid #10bb82',
    padding: '12px 16px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
  },
  headerLeft: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px'
  },
  logo: {
    fontSize: '20px',
    fontWeight: '700',
    color: '#10bb82',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    letterSpacing: '-0.5px'
  },
  logoIcon: {
    fontSize: '24px'
  },
  appName: {
    color: '#ffffff',
    fontSize: '16px',
    fontWeight: '600'
  },
  headerRight: {
    fontSize: '11px',
    color: '#999',
    textTransform: 'uppercase',
    letterSpacing: '0.5px'
  },
  ribbon: {
    background: '#3a3a3a',
    borderBottom: '1px solid #555',
    padding: '8px 12px',
    display: 'flex',
    gap: '4px',
    flexWrap: 'wrap'
  },
  ribbonSection: {
    display: 'flex',
    gap: '4px',
    paddingRight: '12px',
    borderRight: '1px solid #555'
  },
  ribbonSectionLast: {
    display: 'flex',
    gap: '4px',
    border: 'none'
  },
  content: {
    flex: 1,
    overflow: 'auto',
    padding: '16px',
    background: '#f5f5f5'
  },
  statusBar: {
    background: '#2c2c2c',
    borderTop: '1px solid #555',
    padding: '8px 16px',
    fontSize: '12px',
    color: '#ccc',
    display: 'flex',
    alignItems: 'center',
    gap: '8px'
  },
  statusIndicator: {
    width: '8px',
    height: '8px',
    borderRadius: '50%'
  },
  toolbar: {
    background: 'white',
    border: '1px solid #ddd',
    borderRadius: '4px',
    padding: '16px',
    marginBottom: '16px',
    boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
  },
  toolbarTitle: {
    fontSize: '13px',
    fontWeight: '600',
    color: '#333',
    marginBottom: '12px',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
    borderBottom: '2px solid #10bb82',
    paddingBottom: '8px'
  },
  toolbarGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, 1fr)',
    gap: '8px'
  },
  btn: {
    padding: '10px 14px',
    border: '1px solid #ccc',
    borderRadius: '3px',
    fontSize: '13px',
    fontWeight: '500',
    cursor: 'pointer',
    transition: 'all 0.15s ease',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '6px',
    background: 'white',
    color: '#333',
    boxShadow: '0 1px 2px rgba(0,0,0,0.05)'
  },
  btnPrimary: {
    background: '#10bb82',
    color: 'white',
    borderColor: '#0ea873',
    fontWeight: '600'
  },
  btnSuccess: {
    background: '#10bb82',
    color: 'white',
    borderColor: '#0ea873',
    fontWeight: '600'
  },
  btnSecondary: {
    background: '#4a4a4a',
    color: 'white',
    borderColor: '#3a3a3a'
  },
  btnDisabled: {
    opacity: 0.4,
    cursor: 'not-allowed',
    background: '#f0f0f0'
  },
  ribbonBtn: {
    padding: '6px 12px',
    border: '1px solid #555',
    borderRadius: '3px',
    fontSize: '11px',
    fontWeight: '500',
    cursor: 'pointer',
    transition: 'all 0.15s ease',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '4px',
    background: '#4a4a4a',
    color: '#fff',
    minWidth: '80px'
  },
  ribbonBtnActive: {
    background: '#10bb82',
    borderColor: '#0ea873',
    boxShadow: '0 0 0 2px rgba(16,187,130,0.3)'
  },
  panel: {
    background: 'white',
    border: '1px solid #ddd',
    borderRadius: '4px',
    padding: '16px',
    marginBottom: '16px',
    boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
  },
  panelTitle: {
    fontSize: '13px',
    fontWeight: '600',
    color: '#333',
    marginBottom: '12px',
    textTransform: 'uppercase',
    letterSpacing: '0.5px'
  },
  infoPanel: {
    background: '#fff9e6',
    border: '1px solid #ffd966',
    borderRadius: '3px',
    padding: '12px',
    marginBottom: '16px',
    fontSize: '12px',
    lineHeight: 1.5,
    color: '#664d00'
  },
  infoPanelCalibrate: {
    background: '#e6f9f0',
    borderColor: '#10bb82',
    color: '#0a5a41'
  },
  infoPanelMeasure: {
    background: '#e6f4ff',
    borderColor: '#4a9eff',
    color: '#003d7a'
  },
  measurementDisplay: {
    background: '#ffffff',
    border: '2px solid #10bb82',
    borderRadius: '4px',
    padding: '20px',
    marginBottom: '16px',
    textAlign: 'center',
    boxShadow: '0 2px 4px rgba(16,187,130,0.1)'
  },
  measurementValue: {
    fontSize: '36px',
    fontWeight: '700',
    color: '#10bb82',
    marginBottom: '8px',
    fontFamily: 'monospace'
  },
  measurementUnit: {
    fontSize: '14px',
    color: '#666',
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
    background: 'rgba(0,0,0,0.6)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000
  },
  modalContent: {
    background: 'white',
    borderRadius: '4px',
    padding: '24px',
    maxWidth: '450px',
    width: '90%',
    maxHeight: '90vh',
    overflowY: 'auto',
    boxShadow: '0 4px 20px rgba(0,0,0,0.3)',
    border: '1px solid #ddd'
  },
  modalTitle: {
    fontSize: '16px',
    fontWeight: '600',
    color: '#333',
    marginBottom: '20px',
    paddingBottom: '12px',
    borderBottom: '2px solid #10bb82'
  },
  formGroup: {
    marginBottom: '20px'
  },
  label: {
    display: 'block',
    fontSize: '11px',
    fontWeight: '600',
    marginBottom: '8px',
    color: '#333',
    textTransform: 'uppercase',
    letterSpacing: '0.3px'
  },
  input: {
    width: '100%',
    padding: '10px 12px',
    border: '1px solid #ccc',
    borderRadius: '3px',
    fontSize: '14px',
    boxSizing: 'border-box',
    fontFamily: 'monospace',
    transition: 'border-color 0.15s ease'
  },
  unitGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, 1fr)',
    gap: '8px'
  },
  unitBtn: {
    padding: '10px 12px',
    border: '1px solid #ccc',
    borderRadius: '3px',
    background: 'white',
    fontSize: '12px',
    fontWeight: '500',
    cursor: 'pointer',
    transition: 'all 0.15s',
    textAlign: 'center'
  },
  unitBtnActive: {
    background: '#10bb82',
    color: 'white',
    borderColor: '#0ea873',
    fontWeight: '600'
  },
  modalButtons: {
    display: 'flex',
    gap: '8px',
    marginTop: '24px'
  }
};

export default function PanelPage() {
  const [mode, setMode] = useState('none');
  const [calibration, setCalibration] = useState(null);
  const [measurements, setMeasurements] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);
  const [unitSystem, setUnitSystem] = useState('imperial');
  const [clickCount, setClickCount] = useState(0);
  const [firstPoint, setFirstPoint] = useState(null);
  const [showCalibrationModal, setShowCalibrationModal] = useState(false);
  const [tempCalibrationDistance, setTempCalibrationDistance] = useState(null);
  const [calibrationUnit, setCalibrationUnit] = useState('ft');
  const [calibrationValue, setCalibrationValue] = useState('');

  const statusText = () => {
    if (calibration) return 'System Calibrated - Ready to Measure';
    if (mode === 'calibrate') return 'Calibration Mode: Select two points on known distance';
    if (mode === 'measure') return 'Measurement Mode: Select two points to measure';
    return 'Ready - Please calibrate before measuring';
  };

  const statusIndicatorStyle = () => {
    const base = { ...styles.statusIndicator };
    if (calibration) base.background = '#10bb82';
    else if (mode === 'calibrate') base.background = '#ffa500';
    else if (mode === 'measure') base.background = '#10bb82';
    else base.background = '#ff4444';
    return base;
  };

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
      alert('Image selected! You can now calibrate.');
    } catch (error) {
      console.error('Error selecting image:', error);
      alert('Error selecting image. Please try again.');
    }
  };

  const startCalibration = async () => {
    if (!selectedImage) {
      alert('Please select an image first');
      return;
    }

    setMode('calibrate');
    setClickCount(0);
    setFirstPoint(null);
    
    try {
      await window.miro.board.ui.on('drop', handleBoardClick);
      alert('Click two points on the board on a known distance');
    } catch (error) {
      console.error('Error starting calibration:', error);
    }
  };

  const startMeasurement = () => {
    if (!calibration) {
      alert('Please calibrate the scale first');
      return;
    }

    setMode('measure');
    setClickCount(0);
    setFirstPoint(null);
    alert('Click two points on the board to measure distance');
  };

  const handleBoardClick = async (event) => {
    if (mode === 'none') return;

    const point = { x: event.x, y: event.y };
    
    if (clickCount === 0) {
      setFirstPoint(point);
      setClickCount(1);
      console.log(`First point: (${point.x}, ${point.y})`);
    } else if (clickCount === 1) {
      const distance = Math.sqrt(
        Math.pow(point.x - firstPoint.x, 2) + 
        Math.pow(point.y - firstPoint.y, 2)
      );

      if (mode === 'calibrate') {
        setTempCalibrationDistance(distance);
        setShowCalibrationModal(true);
      } else if (mode === 'measure') {
        handleMeasurementComplete(distance);
      }

      setClickCount(0);
      setFirstPoint(null);
    }
  };

  const handleCalibrationComplete = () => {
    const actualDistance = parseFloat(calibrationValue);
    
    if (!actualDistance || actualDistance <= 0) {
      alert('Please enter a valid distance');
      return;
    }

    setCalibration({
      pixelsPerUnit: tempCalibrationDistance / actualDistance,
      unit: calibrationUnit
    });

    setMode('none');
    setShowCalibrationModal(false);
    setCalibrationValue('');
    
    alert(`Calibration complete! ${formatNumber(tempCalibrationDistance)}px = ${actualDistance} ${calibrationUnit}`);
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
    
    alert(`Distance: ${formatNumber(actualDistance)} ${calibration.unit}`);
  };

  const toggleUnitSystem = (system) => {
    setUnitSystem(system);
    if (system === 'imperial') {
      setCalibrationUnit('ft');
    } else {
      setCalibrationUnit('m');
    }
  };

  const clearMeasurements = () => {
    if (confirm('Clear all measurements and calibration data?')) {
      setMeasurements([]);
      setCalibration(null);
      setSelectedImage(null);
      setMode('none');
    }
  };

  const latestMeasurement = measurements.length > 0 ? measurements[measurements.length - 1] : null;

  return (
    <div style={styles.container}>
      {/* Header - Bluebeam Revu style */}
      <div style={styles.header}>
        <div style={styles.headerLeft}>
          <div style={styles.logo}>
            <span style={styles.logoIcon}>📏</span>
            <span style={styles.appName}>MeasureMint</span>
          </div>
        </div>
        <div style={styles.headerRight}>
          Professional Measurement Tool
        </div>
      </div>

      {/* Ribbon - Tool selection ribbon */}
      <div style={styles.ribbon}>
        <div style={styles.ribbonSection}>
          <button
            onClick={() => toggleUnitSystem('imperial')}
            style={{
              ...styles.ribbonBtn,
              ...(unitSystem === 'imperial' ? styles.ribbonBtnActive : {})
            }}
          >
            🇺🇸 Imperial
          </button>
          <button
            onClick={() => toggleUnitSystem('metric')}
            style={{
              ...styles.ribbonBtn,
              ...(unitSystem === 'metric' ? styles.ribbonBtnActive : {})
            }}
          >
            🌍 Metric
          </button>
        </div>
        <div style={styles.ribbonSectionLast}>
          <button
            onClick={clearMeasurements}
            disabled={!selectedImage}
            style={{
              ...styles.ribbonBtn,
              ...(selectedImage ? {} : styles.btnDisabled)
            }}
          >
            🗑️ Clear All
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div style={styles.content}>
        {/* Measurement Tools */}
        <div style={styles.toolbar}>
          <div style={styles.toolbarTitle}>Measurement Tools</div>
          <div style={styles.toolbarGrid}>
            <button onClick={selectImage} style={styles.btn}>
              <span>🖼️</span> Select Image
            </button>
            <button
              onClick={startCalibration}
              disabled={!selectedImage}
              style={{
                ...styles.btn,
                ...styles.btnSuccess,
                ...(selectedImage ? {} : styles.btnDisabled)
              }}
            >
              <span>⚙️</span> Calibrate
            </button>
            <button
              onClick={startMeasurement}
              disabled={!calibration}
              style={{
                ...styles.btn,
                ...styles.btnPrimary,
                ...(calibration ? {} : styles.btnDisabled)
              }}
            >
              <span>📐</span> Measure
            </button>
            <button
              onClick={() => {
                if (latestMeasurement) {
                  const conv = latestMeasurement.conversions;
                  let text = `Measurement Results:\n\n`;
                  text += `Imperial:\n`;
                  text += `• ${formatNumber(conv.ft)} ft\n`;
                  text += `• ${formatNumber(conv.in)} in\n`;
                  text += `• ${formatNumber(conv.yd)} yd\n\n`;
                  text += `Metric:\n`;
                  text += `• ${formatNumber(conv.m)} m\n`;
                  text += `• ${formatNumber(conv.cm)} cm\n`;
                  text += `• ${formatNumber(conv.mm)} mm\n`;
                  alert(text);
                }
              }}
              disabled={!latestMeasurement}
              style={{
                ...styles.btn,
                ...(latestMeasurement ? {} : styles.btnDisabled)
              }}
            >
              <span>📊</span> View All Units
            </button>
          </div>
        </div>

        {/* Info Panels */}
        {mode === 'calibrate' && (
          <div style={{...styles.infoPanel, ...styles.infoPanelCalibrate}}>
            <strong>📍 Calibration Mode Active</strong><br/>
            Click two points on the board at a known distance apart. You'll then enter the actual measurement to set the scale.
          </div>
        )}

        {mode === 'measure' && (
          <div style={{...styles.infoPanel, ...styles.infoPanelMeasure}}>
            <strong>📐 Measurement Mode Active</strong><br/>
            Click two points on the board to measure the distance between them. Results will be shown in all available units.
          </div>
        )}

        {/* Measurement Display */}
        {latestMeasurement && (
          <div style={styles.panel}>
            <div style={styles.panelTitle}>Latest Measurement</div>
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
            <div style={styles.panelTitle}>Measurement History ({measurements.length} total)</div>
            {measurements.slice(-5).reverse().map((m, idx) => (
              <div key={m.id} style={{
                padding: '8px 12px',
                background: '#f9f9f9',
                border: '1px solid #e0e0e0',
                borderRadius: '3px',
                marginBottom: '4px',
                fontSize: '12px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}>
                <span style={{color: '#666'}}>Measurement #{measurements.length - idx}</span>
                <span style={{fontWeight: '600', color: '#10bb82', fontFamily: 'monospace'}}>
                  {formatNumber(m.distance)} {m.unit}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Status Bar */}
      <div style={styles.statusBar}>
        <div style={statusIndicatorStyle()}></div>
        <span>{statusText()}</span>
      </div>

      {/* Calibration Modal */}
      {showCalibrationModal && (
        <div style={styles.modal}>
          <div style={styles.modalContent}>
            <h3 style={styles.modalTitle}>Calibration Setup</h3>
            
            <div style={styles.formGroup}>
              <label style={styles.label}>
                Select Unit of Known Distance:
              </label>
              <div style={styles.unitGrid}>
                {CONVERSIONS[unitSystem].map((u) => (
                  <button
                    key={u.abbr}
                    onClick={() => setCalibrationUnit(u.abbr)}
                    style={{
                      ...styles.unitBtn,
                      ...(calibrationUnit === u.abbr ? styles.unitBtnActive : {})
                    }}
                  >
                    {u.name}
                  </button>
                ))}
              </div>
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>
                Enter Known Distance ({calibrationUnit}):
              </label>
              <input
                type="number"
                value={calibrationValue}
                onChange={(e) => setCalibrationValue(e.target.value)}
                placeholder={`Enter distance in ${calibrationUnit}`}
                step="0.01"
                style={styles.input}
                autoFocus
              />
            </div>

            <div style={styles.modalButtons}>
              <button
                onClick={handleCalibrationComplete}
                style={{...styles.btn, ...styles.btnSuccess, flex: 1}}
              >
                ✓ Set Calibration
              </button>
              <button
                onClick={() => {
                  setShowCalibrationModal(false);
                  setCalibrationValue('');
                  setMode('none');
                }}
                style={{...styles.btn, flex: 1}}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

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

export default function PanelPage() {
  const [mode, setMode] = useState('none');
  const [calibration, setCalibration] = useState(null);
  const [measurements, setMeasurements] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);
  const [unit, setUnit] = useState('ft');
  const [unitSystem, setUnitSystem] = useState('imperial');
  const [clickCount, setClickCount] = useState(0);
  const [firstPoint, setFirstPoint] = useState(null);
  const [showCalibrationModal, setShowCalibrationModal] = useState(false);
  const [tempCalibrationDistance, setTempCalibrationDistance] = useState(null);
  const [calibrationUnit, setCalibrationUnit] = useState('ft');
  const [calibrationValue, setCalibrationValue] = useState('');

  const statusText = () => {
    if (calibration) return 'Calibrated and ready to measure';
    if (mode === 'calibrate') return 'Click two points to calibrate';
    if (mode === 'measure') return 'Click two points to measure';
    return 'Please calibrate first';
  };

  const statusIndicatorClass = () => {
    if (calibration) return 'bg-green-500';
    if (mode === 'calibrate') return 'bg-orange-500';
    if (mode === 'measure') return 'bg-green-500';
    return 'bg-red-500';
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
    
    // Enable click mode on the board
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
      setUnit('ft');
      setCalibrationUnit('ft');
    } else {
      setUnit('m');
      setCalibrationUnit('m');
    }
  };

  const clearMeasurements = () => {
    if (confirm('Are you sure you want to clear all measurements?')) {
      setMeasurements([]);
    }
  };

  const latestMeasurement = measurements.length > 0 ? measurements[measurements.length - 1] : null;

  return (
    <div className="max-w-md mx-auto bg-white border border-gray-200 rounded-xl shadow-lg overflow-hidden">
      <div className="bg-gradient-to-br from-purple-600 to-purple-800 text-white p-5 text-center">
        <h1 className="text-lg font-semibold flex items-center justify-center gap-2">
          <span>📏</span>
          MeasureMint
        </h1>
        <div className="text-xs opacity-90 mt-1">Professional Measurement Tool</div>
      </div>

      <div className="p-6">
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-3 mb-5 text-sm text-gray-700 flex items-center gap-2">
          <div className={`w-2 h-2 rounded-full ${statusIndicatorClass()}`}></div>
          <span>{statusText()}</span>
        </div>

        <div className="grid grid-cols-2 gap-3 mb-5">
          <button
            onClick={selectImage}
            className="px-4 py-3 border border-gray-200 rounded-lg text-sm font-medium hover:border-purple-500 hover:text-purple-500 transition-all flex items-center justify-center gap-2"
          >
            <span>🖼️</span> Select Image
          </button>
          <button
            onClick={startCalibration}
            disabled={!selectedImage}
            className="px-4 py-3 bg-green-500 text-white rounded-lg text-sm font-medium hover:bg-green-600 disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            <span>⚙️</span> Calibrate
          </button>
          <button
            onClick={startMeasurement}
            disabled={!calibration}
            className="px-4 py-3 bg-purple-600 text-white rounded-lg text-sm font-medium hover:bg-purple-700 disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            <span>📏</span> Measure
          </button>
          <button
            onClick={clearMeasurements}
            disabled={!selectedImage}
            className="px-4 py-3 border border-gray-200 rounded-lg text-sm font-medium hover:border-purple-500 hover:text-purple-500 transition-all disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            <span>🗑️</span> Clear
          </button>
        </div>

        <div className="flex gap-2 mb-5">
          <button
            onClick={() => toggleUnitSystem('imperial')}
            className={`flex-1 py-2 px-3 border-2 rounded-md text-sm font-medium transition-all ${
              unitSystem === 'imperial'
                ? 'bg-purple-600 text-white border-purple-600'
                : 'bg-white border-gray-200 hover:border-purple-500'
            }`}
          >
            🇺🇸 Imperial
          </button>
          <button
            onClick={() => toggleUnitSystem('metric')}
            className={`flex-1 py-2 px-3 border-2 rounded-md text-sm font-medium transition-all ${
              unitSystem === 'metric'
                ? 'bg-purple-600 text-white border-purple-600'
                : 'bg-white border-gray-200 hover:border-purple-500'
            }`}
          >
            🌍 Metric
          </button>
        </div>

        {mode === 'calibrate' && (
          <div className="bg-green-50 border border-green-500 rounded-lg p-4 mb-4 text-sm text-green-800">
            <strong>Calibration Mode:</strong> Click two points on a known distance, then enter the actual measurement.
          </div>
        )}

        {mode === 'measure' && (
          <div className="bg-blue-50 border border-purple-500 rounded-lg p-4 mb-4 text-sm text-blue-800">
            <strong>Measurement Mode:</strong> Click two points to measure the distance between them.
          </div>
        )}

        {latestMeasurement && (
          <div className="bg-white border border-gray-200 rounded-lg p-4 mb-4">
            <div className="text-2xl font-semibold text-gray-800 text-center mb-2">
              {formatNumber(latestMeasurement.distance)}
            </div>
            <div className="text-sm text-gray-500 text-center uppercase tracking-wide">
              {latestMeasurement.unit}
            </div>
          </div>
        )}

        {showCalibrationModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-md w-11/12 max-h-[90vh] overflow-y-auto">
              <h3 className="text-lg font-semibold mb-4">Enter Known Distance</h3>
              
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2 text-gray-700">
                  Select the unit for your known distance:
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {CONVERSIONS[unitSystem].map((u) => (
                    <button
                      key={u.abbr}
                      onClick={() => setCalibrationUnit(u.abbr)}
                      className={`py-2 px-3 border rounded-md text-sm ${
                        calibrationUnit === u.abbr
                          ? 'bg-purple-600 text-white border-purple-600'
                          : 'bg-white border-gray-300 hover:border-purple-500'
                      }`}
                    >
                      {u.name}
                    </button>
                  ))}
                </div>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium mb-2 text-gray-700">
                  Enter the distance in {calibrationUnit}:
                </label>
                <input
                  type="number"
                  value={calibrationValue}
                  onChange={(e) => setCalibrationValue(e.target.value)}
                  placeholder="Enter distance"
                  step="0.01"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                  autoFocus
                />
              </div>

              <div className="flex gap-2">
                <button
                  onClick={handleCalibrationComplete}
                  className="flex-1 px-4 py-2 bg-green-500 text-white rounded-md text-sm font-medium hover:bg-green-600"
                >
                  ✓ Set Calibration
                </button>
                <button
                  onClick={() => {
                    setShowCalibrationModal(false);
                    setCalibrationValue('');
                    setMode('none');
                  }}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-md text-sm font-medium hover:border-purple-500"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

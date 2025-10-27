/**
 * MeasureMint Panel Functionality
 * Handles all panel UI interactions and measurement tools
 */

// Unit conversion constants
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
  
  let state = {
    mode: 'none',
    calibration: null,
    measurements: [],
    selectedImage: null,
    unit: 'ft',
    unitSystem: 'imperial',
    clickCount: 0,
    firstPoint: null,
    tempCalibrationDistance: null,
    calibrationUnit: 'ft'
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
  
  async function init() {
    await miro.board.ui.on('icon:click', async () => {
      await miro.board.ui.openPanel({url: 'index.html'});
    });
  
    setupEventListeners();
    updateUnitSelector();
    updateUI();
  }
  
  function setupEventListeners() {
    document.getElementById('selectImageBtn').addEventListener('click', selectImage);
    document.getElementById('calibrateBtn').addEventListener('click', startCalibrate);
    document.getElementById('measureBtn').addEventListener('click', startMeasure);
    document.getElementById('clearBtn').addEventListener('click', clearAll);
    document.getElementById('unitSelect').addEventListener('change', (e) => {
      state.unit = e.target.value;
      updateUI();
    });
    document.getElementById('setCalibrationBtn').addEventListener('click', setCalibration);
    document.getElementById('cancelCalibrationBtn').addEventListener('click', cancelCalibration);
    document.getElementById('toggleConversions').addEventListener('click', toggleConversions);
  
    document.querySelectorAll('.unit-system-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        state.unitSystem = e.target.dataset.system;
        document.querySelectorAll('.unit-system-btn').forEach(b => b.classList.remove('active'));
        e.target.classList.add('active');
        updateUnitSelector();
        updateUI();
      });
    });
  }
  
  function updateUnitSelector() {
    const unitSelect = document.getElementById('unitSelect');
    const units = CONVERSIONS[state.unitSystem];
    
    unitSelect.innerHTML = units.map(u => 
      `<option value="${u.abbr}">${u.name} (${u.abbr})</option>`
    ).join('');
    
    state.unit = units[0].abbr;
  }
  
  async function selectImage() {
    try {
      const selection = await miro.board.getSelection();
      const images = selection.filter(item => item.type === 'image');
      
      if (images.length === 0) {
        await miro.board.notifications.showError('Please select an image on the board first');
        return;
      }
  
      state.selectedImage = images[0];
      updateStatus(`Image selected. Now you can calibrate the scale.`);
      document.getElementById('calibrateBtn').disabled = false;
      updateUI();
    } catch (error) {
      await miro.board.notifications.showError('Error selecting image: ' + error.message);
    }
  }
  
  async function startCalibrate() {
    if (state.mode === 'calibrate') {
      stopMode();
      return;
    }
  
    state.mode = 'calibrate';
    state.clickCount = 0;
    state.firstPoint = null;
    updateStatus('Calibration mode: Click first point on a known distance...');
    updateUI();
  
    document.getElementById('calibrateInfo').style.display = 'block';
    document.getElementById('measureInfo').style.display = 'none';
  
    await miro.board.ui.on('click', handleBoardClick);
  }
  
  async function startMeasure() {
    if (!state.calibration) {
      await miro.board.notifications.showError('Please calibrate the scale first');
      return;
    }
  
    if (state.mode === 'measure') {
      stopMode();
      return;
    }
  
    state.mode = 'measure';
    state.clickCount = 0;
    state.firstPoint = null;
    updateStatus('Measure mode: Click first point to measure...');
    updateUI();
  
    document.getElementById('calibrateInfo').style.display = 'none';
    document.getElementById('measureInfo').style.display = 'block';
  
    await miro.board.ui.on('click', handleBoardClick);
  }
  
  async function handleBoardClick(event) {
    if (state.mode === 'none') return;
  
    const x = event.x;
    const y = event.y;
  
    if (state.clickCount === 0) {
      state.firstPoint = {x, y};
      state.clickCount = 1;
      
      await miro.board.createShape({
        shape: 'circle',
        x: x,
        y: y,
        width: 20,
        height: 20,
        style: {
          fillColor: state.mode === 'calibrate' ? '#10b981' : '#4262ff',
          borderColor: 'transparent'
        }
      });
  
      updateStatus(`${state.mode === 'calibrate' ? 'Calibration' : 'Measure'} mode: Click second point...`);
    } else if (state.clickCount === 1) {
      const secondPoint = {x, y};
      
      await miro.board.createShape({
        shape: 'circle',
        x: x,
        y: y,
        width: 20,
        height: 20,
        style: {
          fillColor: state.mode === 'calibrate' ? '#10b981' : '#4262ff',
          borderColor: 'transparent'
        }
      });
  
      await miro.board.createConnector({
        start: {
          position: {x: state.firstPoint.x, y: state.firstPoint.y}
        },
        end: {
          position: {x: secondPoint.x, y: secondPoint.y}
        },
        style: {
          strokeColor: state.mode === 'calibrate' ? '#10b981' : '#4262ff',
          strokeWidth: 3
        }
      });
  
      const distance = calculateDistance(state.firstPoint, secondPoint);
  
      if (state.mode === 'calibrate') {
        state.tempCalibrationDistance = distance;
        showCalibrationModal();
      } else if (state.mode === 'measure') {
        const realDistanceInCalibrationUnit = (distance / state.calibration.pixelLength) * state.calibration.distance;
        const realDistance = convertUnits(realDistanceInCalibrationUnit, state.calibration.unit, state.unit);
        
        const allConversions = getAllConversions(realDistance, state.unit);
        
        state.measurements.push({
          id: Date.now(),
          distance: realDistance,
          unit: state.unit,
          pixels: distance,
          conversions: allConversions
        });
  
        await miro.board.createText({
          content: `${realDistance.toFixed(2)} ${state.unit}`,
          x: (state.firstPoint.x + secondPoint.x) / 2,
          y: (state.firstPoint.y + secondPoint.y) / 2 - 30,
          width: 200,
          style: {
            color: '#4262ff',
            fontSize: 14,
            textAlign: 'center',
            fontWeight: 'bold'
          }
        });
  
        await miro.board.notifications.showInfo(`Measured: ${realDistance.toFixed(2)} ${state.unit}`);
      }
  
      state.clickCount = 0;
      state.firstPoint = null;
      updateUI();
    }
  }
  
  function calculateDistance(p1, p2) {
    return Math.sqrt(Math.pow(p2.x - p1.x, 2) + Math.pow(p2.y - p1.y, 2));
  }
  
  function showCalibrationModal() {
    const modal = document.getElementById('calibrationModal');
    const unitGrid = document.getElementById('unitGrid');
    
    const allUnits = [...CONVERSIONS.imperial, ...CONVERSIONS.metric];
    unitGrid.innerHTML = allUnits.map(u => `
      <div class="unit-option ${u.abbr === state.unit ? 'selected' : ''}" data-unit="${u.abbr}">
        <div class="unit-option-name">${u.name}</div>
        <div class="unit-option-abbr">${u.abbr}</div>
      </div>
    `).join('');
  
    unitGrid.querySelectorAll('.unit-option').forEach(option => {
      option.addEventListener('click', (e) => {
        unitGrid.querySelectorAll('.unit-option').forEach(o => o.classList.remove('selected'));
        option.classList.add('selected');
        state.calibrationUnit = option.dataset.unit;
        document.getElementById('distanceLabel').textContent = 
          `Enter the distance in ${option.querySelector('.unit-option-name').textContent}:`;
      });
    });
  
    state.calibrationUnit = state.unit;
    modal.classList.add('show');
    document.getElementById('distanceInput').focus();
  }
  
  function setCalibration() {
    const distance = parseFloat(document.getElementById('distanceInput').value);
    
    if (!distance || distance <= 0) {
      miro.board.notifications.showError('Please enter a valid distance');
      return;
    }
  
    state.calibration = {
      pixelLength: state.tempCalibrationDistance,
      distance: distance,
      unit: state.calibrationUnit
    };
  
    document.getElementById('calibrationModal').classList.remove('show');
    document.getElementById('distanceInput').value = '';
    
    stopMode();
    document.getElementById('measureBtn').disabled = false;
    
    const pixelsPerUnit = state.calibration.pixelLength / state.calibration.distance;
    updateStatus(`Calibration set: 1 ${state.calibration.unit} = ${pixelsPerUnit.toFixed(2)} pixels`);
    
    document.getElementById('unitDetails').style.display = 'block';
    updateCalibrationInfo();
    
    miro.board.notifications.showInfo(`Calibration complete! You can now measure distances.`);
  }
  
  function updateCalibrationInfo() {
    if (!state.calibration) return;
  
    const pixelsPerUnit = state.calibration.pixelLength / state.calibration.distance;
    const calibInfo = document.getElementById('calibrationInfo');
    calibInfo.innerHTML = `
      Scale: 1 ${state.calibration.unit} = ${pixelsPerUnit.toFixed(2)} pixels<br>
      Base measurement: ${state.calibration.distance} ${state.calibration.unit}
    `;
  }
  
  function toggleConversions() {
    const table = document.getElementById('conversionTable');
    const btn = document.getElementById('toggleConversions');
    
    if (table.style.display === 'none') {
      table.style.display = 'block';
      btn.textContent = 'Hide conversion table';
      generateConversionTable();
    } else {
      table.style.display = 'none';
      btn.textContent = 'Show conversion table';
    }
  }
  
  function generateConversionTable() {
    if (!state.calibration) return;
  
    const conversions = getAllConversions(state.calibration.distance, state.calibration.unit);
    const table = document.getElementById('conversionTable');
    
    const imperialUnits = CONVERSIONS.imperial.map(u => u.abbr);
    const metricUnits = CONVERSIONS.metric.map(u => u.abbr);
  
    let html = '<table><tr><th>Unit</th><th>Value</th></tr>';
    
    html += '<tr><td colspan="2" style="font-weight: 600; background: #f3f4f6;">Imperial</td></tr>';
    imperialUnits.forEach(unit => {
      const unitInfo = CONVERSIONS.imperial.find(u => u.abbr === unit);
      html += `<tr><td>${unitInfo.name}</td><td>${conversions[unit].toFixed(4)} ${unit}</td></tr>`;
    });
    
    html += '<tr><td colspan="2" style="font-weight: 600; background: #f3f4f6;">Metric</td></tr>';
    metricUnits.forEach(unit => {
      const unitInfo = CONVERSIONS.metric.find(u => u.abbr === unit);
      html += `<tr><td>${unitInfo.name}</td><td>${conversions[unit].toFixed(4)} ${unit}</td></tr>`;
    });
    
    html += '</table>';
    table.innerHTML = html;
  }
  
  function cancelCalibration() {
    document.getElementById('calibrationModal').classList.remove('show');
    document.getElementById('distanceInput').value = '';
    stopMode();
  }
  
  function stopMode() {
    state.mode = 'none';
    state.clickCount = 0;
    state.firstPoint = null;
    updateUI();
    miro.board.ui.off('click', handleBoardClick);
  }
  
  async function clearAll() {
    if (confirm('Clear all measurements and calibration?')) {
      state.calibration = null;
      state.measurements = [];
      state.clickCount = 0;
      state.firstPoint = null;
      stopMode();
      
      document.getElementById('measureBtn').disabled = true;
      document.getElementById('unitDetails').style.display = 'none';
      updateStatus('Cleared. Select an image to start again.');
      updateUI();
      
      await miro.board.notifications.showInfo('All measurements cleared');
    }
  }
  
  function updateStatus(message) {
    const statusEl = document.getElementById('status');
    statusEl.textContent = message;
    
    if (state.calibration) {
      statusEl.classList.add('status-active');
    } else {
      statusEl.classList.remove('status-active');
    }
  }
  
  function updateUI() {
    const calibrateBtn = document.getElementById('calibrateBtn');
    const measureBtn = document.getElementById('measureBtn');
    const clearBtn = document.getElementById('clearBtn');
  
    calibrateBtn.classList.toggle('btn-active', state.mode === 'calibrate');
    measureBtn.classList.toggle('btn-active', state.mode === 'measure');
    
    clearBtn.disabled = !state.calibration && state.measurements.length === 0;
  
    const measurementsList = document.getElementById('measurementsList');
    const measurementsContainer = document.getElementById('measurementsContainer');
    
    if (state.measurements.length > 0) {
      measurementsList.style.display = 'block';
      measurementsContainer.innerHTML = state.measurements.map((m, i) => {
        const currentValue = convertUnits(m.distance, m.unit, state.unit);
        const imperialConv = `${m.conversions.ft.toFixed(2)} ft, ${m.conversions.in.toFixed(2)} in`;
        const metricConv = `${m.conversions.m.toFixed(2)} m, ${m.conversions.cm.toFixed(2)} cm`;
        
        return `
          <div class="measurement-item">
            <div>
              <div class="measurement-label">Measurement ${i + 1}</div>
              <div class="measurement-value">${currentValue.toFixed(2)} ${state.unit}</div>
              <div class="measurement-conversions">
                Imperial: ${imperialConv} | Metric: ${metricConv}
              </div>
            </div>
          </div>
        `;
      }).join('');
    } else {
      measurementsList.style.display = 'none';
    }
  
    document.getElementById('calibrateInfo').style.display = 
      state.mode === 'calibrate' ? 'block' : 'none';
    document.getElementById('measureInfo').style.display = 
      state.mode === 'measure' ? 'block' : 'none';
  }
  
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
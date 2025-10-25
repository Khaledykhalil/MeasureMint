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
  
  function formatNumber(num, decimals = 2) {
    return parseFloat(num.toFixed(decimals));
  }
  
  function updateUI() {
    // Update status bar
    const statusBar = document.getElementById('status');
    if (statusBar) {
      const indicator = statusBar.querySelector('.status-indicator');
      const text = statusBar.querySelector('span');
      
      if (state.calibration) {
        indicator.className = 'status-indicator';
        text.textContent = 'Calibrated and ready to measure';
      } else if (state.mode === 'calibrate') {
        indicator.className = 'status-indicator warning';
        text.textContent = 'Click two points to calibrate';
      } else if (state.mode === 'measure') {
        indicator.className = 'status-indicator';
        text.textContent = 'Click two points to measure';
      } else {
        indicator.className = 'status-indicator error';
        text.textContent = 'Please calibrate first';
      }
    }
    
    // Update unit system buttons
    const unitButtons = document.querySelectorAll('.unit-btn');
    unitButtons.forEach(btn => {
      const system = btn.dataset.system;
      btn.classList.toggle('active', system === state.unitSystem);
    });
    
    // Update measurement display
    const measurementDisplay = document.getElementById('measurementDisplay');
    if (measurementDisplay && state.measurements.length > 0) {
      const latest = state.measurements[state.measurements.length - 1];
      const measurementValue = document.getElementById('measurementValue');
      const measurementUnit = document.getElementById('measurementUnit');
      
      if (measurementValue) measurementValue.textContent = formatNumber(latest.distance);
      if (measurementUnit) measurementUnit.textContent = latest.unit;
      
      measurementDisplay.style.display = 'block';
    }
    
    // Update mode-specific UI
    updateModeUI();
  }
  
  function updateModeUI() {
    // Show/hide mode-specific instructions
    const calibrateInfo = document.getElementById('calibrateInfo');
    const measureInfo = document.getElementById('measureInfo');
    
    if (calibrateInfo) {
      calibrateInfo.style.display = state.mode === 'calibrate' ? 'block' : 'none';
    }
    if (measureInfo) {
      measureInfo.style.display = state.mode === 'measure' ? 'block' : 'none';
    }
  }
  
  function uploadImage() {
    console.log('Upload image button clicked');
    const fileInput = document.getElementById('imageInput');
    if (fileInput) {
      console.log('File input found, opening file dialog');
      fileInput.click();
    } else {
      console.error('File input not found');
    }
  }

  function handleImageUpload(event) {
    console.log('File input changed');
    const file = event.target.files[0];
    if (!file) {
      console.log('No file selected');
      return;
    }
    
    console.log('File selected:', file.name, file.type, file.size);

    const reader = new FileReader();
    reader.onload = function(e) {
      console.log('File read successfully');
      const imageContainer = document.getElementById('imageContainer');
      const uploadedImage = document.getElementById('uploadedImage');
      
      if (!imageContainer || !uploadedImage) {
        console.error('Image container or uploaded image element not found');
        return;
      }
      
      uploadedImage.src = e.target.result;
      imageContainer.style.display = 'block';
      
      // Store the image data
      state.selectedImage = {
        src: e.target.result,
        file: file,
        element: uploadedImage
      };
      
      // Enable buttons
      const calibrateBtn = document.getElementById('calibrateBtn');
      const measureBtn = document.getElementById('measureBtn');
      const clearBtn = document.getElementById('clearBtn');
      
      if (calibrateBtn) calibrateBtn.disabled = false;
      if (measureBtn) measureBtn.disabled = false;
      if (clearBtn) clearBtn.disabled = false;
      
      updateUI();
      console.log('Image uploaded successfully');
    };
    reader.readAsDataURL(file);
  }

  async function selectImage() {
    try {
      // Initialize Miro SDK
      await miro.board.ui.openModal({
        url: 'https://miro.com/app/board/',
        width: 800,
        height: 600
      });
      
      // Get selected images from Miro board
      const images = await miro.board.get({ type: 'image' });
      
      if (images.length === 0) {
        alert('Please add an image to your Miro board first');
        return;
      }
      
      // For now, select the first image
      state.selectedImage = images[0];
      
      // Enable buttons
      const calibrateBtn = document.getElementById('calibrateBtn');
      const measureBtn = document.getElementById('measureBtn');
      const clearBtn = document.getElementById('clearBtn');
      
      if (calibrateBtn) calibrateBtn.disabled = false;
      if (measureBtn) measureBtn.disabled = false;
      if (clearBtn) clearBtn.disabled = false;
      
      updateUI();
      
      console.log('Image selected:', state.selectedImage);
      
    } catch (error) {
      console.error('Error selecting image:', error);
      alert('Error selecting image. Make sure you\'re running this in a Miro app context.');
      
      // Fallback for testing outside Miro
      state.selectedImage = true;
      const calibrateBtn = document.getElementById('calibrateBtn');
      const measureBtn = document.getElementById('measureBtn');
      const clearBtn = document.getElementById('clearBtn');
      
      if (calibrateBtn) calibrateBtn.disabled = false;
      if (measureBtn) measureBtn.disabled = false;
      if (clearBtn) clearBtn.disabled = false;
      
      updateUI();
    }
  }
  
  function startCalibration() {
    if (!state.selectedImage) {
      alert('Please select an image first');
      return;
    }
    
    state.mode = 'calibrate';
    state.clickCount = 0;
    state.firstPoint = null;
    updateUI();
    
    console.log('Calibration mode started - click two points on a known distance');
  }
  
  function startMeasurement() {
    if (!state.calibration) {
      alert('Please calibrate the scale first');
      return;
    }
    
    state.mode = 'measure';
    state.clickCount = 0;
    state.firstPoint = null;
    updateUI();
    
    console.log('Measurement mode started - click two points to measure');
  }
  
  function handleImageClick(event) {
    if (state.mode === 'none') return;
    
    const rect = event.target.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    
    state.clickCount++;
    
    if (state.clickCount === 1) {
      state.firstPoint = { x, y };
      console.log(`First point: (${x}, ${y})`);
    } else if (state.clickCount === 2) {
      const secondPoint = { x, y };
      const distance = Math.sqrt(
        Math.pow(secondPoint.x - state.firstPoint.x, 2) + 
        Math.pow(secondPoint.y - state.firstPoint.y, 2)
      );
      
      if (state.mode === 'calibrate') {
        handleCalibrationComplete(distance);
      } else if (state.mode === 'measure') {
        handleMeasurementComplete(distance);
      }
      
      state.clickCount = 0;
      state.firstPoint = null;
    }
  }
  
  function handleCalibrationComplete(pixelDistance) {
    const actualDistance = parseFloat(document.getElementById('calibrationDistance').value);
    const unit = document.getElementById('calibrationUnit').value;
    
    if (!actualDistance || actualDistance <= 0) {
      alert('Please enter a valid distance');
      return;
    }
    
    state.calibration = {
      pixelsPerUnit: pixelDistance / actualDistance,
      unit: unit
    };
    
    state.mode = 'none';
    updateUI();
    
    console.log(`Calibration complete: ${pixelDistance}px = ${actualDistance} ${unit}`);
    alert(`Calibration complete! ${pixelDistance}px = ${actualDistance} ${unit}`);
  }
  
  function handleMeasurementComplete(pixelDistance) {
    if (!state.calibration) return;
    
    const actualDistance = pixelDistance / state.calibration.pixelsPerUnit;
    const conversions = getAllConversions(actualDistance, state.calibration.unit);
    
    const measurement = {
      id: Date.now(),
      distance: actualDistance,
      unit: state.calibration.unit,
      conversions: conversions,
      timestamp: new Date()
    };
    
    state.measurements.push(measurement);
    state.mode = 'none';
    updateUI();
    
    console.log('Measurement:', measurement);
    alert(`Distance: ${formatNumber(actualDistance)} ${state.calibration.unit}`);
  }
  
  function toggleUnitSystem() {
    state.unitSystem = state.unitSystem === 'imperial' ? 'metric' : 'imperial';
    
    // Set default unit for the new system
    if (state.unitSystem === 'imperial') {
      state.unit = 'ft';
    } else {
      state.unit = 'm';
    }
    
    updateUI();
  }
  
  function changeUnit(newUnit) {
    state.unit = newUnit;
    updateUI();
  }
  
  function showConversions() {
    if (state.measurements.length === 0) {
      alert('No measurements to show');
      return;
    }
    
    const latest = state.measurements[state.measurements.length - 1];
    const conversions = latest.conversions;
    
    let conversionText = `Measurement: ${formatNumber(latest.distance)} ${latest.unit}\n\n`;
    conversionText += 'All unit conversions:\n';
    
    for (const [unit, value] of Object.entries(conversions)) {
      conversionText += `${unit}: ${formatNumber(value)}\n`;
    }
    
    alert(conversionText);
  }
  
  function clearMeasurements() {
    if (confirm('Are you sure you want to clear all measurements?')) {
      state.measurements = [];
      updateUI();
    }
  }
  
  async function init() {
    console.log('MeasureMint initialized');
    
    // Initialize Miro SDK
    try {
      await miro.board.ui.on('icon:click', async () => {
        console.log('Miro app opened');
      });
      
      // Check if we're in Miro context
      if (typeof miro !== 'undefined') {
        console.log('Running in Miro context');
        // You can add Miro-specific initialization here
      }
    } catch (error) {
      console.log('Not running in Miro context, using fallback mode');
    }
    
    updateUI();
    
    // Add event listeners
    const uploadImageBtn = document.getElementById('uploadImageBtn');
    const selectImageBtn = document.getElementById('selectImageBtn');
    const imageInput = document.getElementById('imageInput');
    const calibrateBtn = document.getElementById('calibrateBtn');
    const measureBtn = document.getElementById('measureBtn');
    const clearBtn = document.getElementById('clearBtn');
    const unitButtons = document.querySelectorAll('.unit-btn');
    
    if (uploadImageBtn) {
      console.log('Adding click listener to upload button');
      uploadImageBtn.addEventListener('click', uploadImage);
    } else {
      console.error('Upload image button not found');
    }
    
    if (imageInput) {
      console.log('Adding change listener to file input');
      imageInput.addEventListener('change', handleImageUpload);
    } else {
      console.error('File input not found');
    }
    
    // Add click listener to uploaded image
    const uploadedImage = document.getElementById('uploadedImage');
    if (uploadedImage) {
      uploadedImage.addEventListener('click', handleImageClick);
    }
    
    if (selectImageBtn) {
      selectImageBtn.addEventListener('click', selectImage);
    }
    
    if (calibrateBtn) {
      calibrateBtn.addEventListener('click', startCalibration);
    }
    
    if (measureBtn) {
      measureBtn.addEventListener('click', startMeasurement);
    }
    
    if (clearBtn) {
      clearBtn.addEventListener('click', clearMeasurements);
    }
    
    // Unit system toggle
    unitButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        const system = btn.dataset.system;
        if (system !== state.unitSystem) {
          toggleUnitSystem();
        }
      });
    });
    
    // Enable buttons when image is selected
    if (state.selectedImage) {
      calibrateBtn.disabled = false;
      measureBtn.disabled = false;
    }
  }
  
  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

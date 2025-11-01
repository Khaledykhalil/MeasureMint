# 📏 MeasureMint for Miro

**Professional measurement and calibration tool for Miro boards**

![Version](https://img.shields.io/badge/version-1.0.0-blue)
![License](https://img.shields.io/badge/license-MIT-green)
![Miro SDK](https://img.shields.io/badge/Miro%20SDK-v2.0-orange)

## ✨ Features

### 🎯 Core Capabilities
- **Precise Scale Calibration** - Set scale using any known distance on your drawing
- **Dual-Axis Calibration** - Separate X and Y axis calibration for distorted or stretched images
- **Linear Distance Measurement** - Click two points to measure straight-line distances
- **8 Unit Types** - ft, in, m, cm, mm, yd, mi, km with automatic conversions
- **No Image Selection Required** - Measure anywhere on the board instantly
- **Visual Feedback** - See your measurements directly on the board with connecting lines
- **Real-time Updates** - All measurements update when you change units

### 📐 Measurement Tools

#### **Linear Distance** 
Click two points to measure straight-line distance. Perfect for dimensions, diagonals, and direct measurements on blueprints, floor plans, and technical drawings.

### 🏗️ Built for Professionals
Perfect for:
- **Architecture** - Floor plans, elevations, site plans
- **Engineering** - Technical drawings, schematics, diagrams
- **Construction** - Blueprints, shop drawings, as-built documentation
- **Interior Design** - Space planning, furniture layouts
- **Real Estate** - Property measurements, site analysis, lot dimensions
- **Project Management** - Visual project documentation

### 🎯 Calibration System

MeasureMint features a robust dual-axis calibration system to handle real-world drawings:

#### **Draw Calibration Line**
1. Click "Draw New Line" under Calibration
2. Click two points on a known distance (e.g., a dimension line showing "20 ft")
3. Enter the actual distance in the dialog
4. Choose your unit (ft, in, m, cm, etc.)
5. Choose which axis to calibrate (X, Y, or Both)
6. Click "Set Calibration"

#### **Reuse Existing Line**
If you have existing lines or shapes on the board:
1. Click "Reuse Existing Line"
2. Select a line or connector from your board
3. Enter the actual distance it represents
4. Choose your unit and axis
5. The app uses your existing line for calibration

#### **Update Calibration**
Modify your calibration settings at any time without redrawing:
- Change the reference distance
- Switch between units
- Adjust X or Y axis independently
- Perfect for handling distorted or stretched images

### 🔄 Smart Unit Conversion
Seamlessly convert between:
- **Imperial**: feet, inches, yards, miles
- **Metric**: meters, centimeters, millimeters, kilometers
- All conversions happen automatically!

### 🎨 User Experience
- Clean, intuitive interface
- No image selection required - measure anywhere
- Works with any drawing, PDF, or image on Miro
- Dual-axis support for distorted images
- Professional measurement display
- Persistent measurements on the board

## 🎬 Demo

Perfect for:
- 🏗️ Construction blueprints
- 🏠 Floor plans
- 🗺️ Site plans
- 📐 Technical drawings
- 🎨 Architectural designs

## 🚀 Quick Start

### Prerequisites

Choose one of the following setup methods:

#### Option 1: Docker (Recommended)
- Docker Desktop
- A Miro Developer account
- A Miro Developer team

#### Option 2: Local Setup
- Node.js 14.15 or later
- A Miro Developer account
- A Miro Developer team

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/Khaledykhalil/MeasureMint.git
cd MeasureMint
```

2. **Choose your setup method:**

#### Docker Setup (Recommended)

a. **Start the application**
```bash
# Build and start the containers
npm run docker:dev
```

This command will:
- Build the Docker image
- Start the Node.js application
- Start ngrok for HTTPS tunneling
- Mount your code for live development
- Set up persistent database storage

The app will be available at the ngrok URL displayed in the console.

b. **Other Docker commands**
```bash
# Build the Docker images
npm run docker:build

# Start the containers
npm run docker:up

# Stop the containers
npm run docker:down
```

#### Local Setup

a. **Install dependencies**
```bash
npm install
```

b. **Configure environment variables**
```bash
cp .sample.env .env
```
Update the `.env` file with your:
- Miro app client ID and secret
- OAuth redirect URL
- Encryption key (32 characters)
- Port and environment settings

4. **Start the development server**
```bash
npm run dev
```

### Configuration

The app requires the following environment variables in your `.env` file:

```env
# Miro App credentials
MIRO_CLIENT_ID=your_miro_client_id
MIRO_CLIENT_SECRET=your_miro_client_secret
MIRO_REDIRECT_URL=http://localhost:3000/auth

# Server configuration
PORT=3000
NODE_ENV=development

# Security
ENCRYPTION_KEY=your_32_character_encryption_key

# Database configuration
DB_PATH=db/tokens.db
```
```bash
   npm start
```
   
   The app will be available at `http://localhost:3000`

### Miro Developer Setup

1. Go to [Miro App Settings](https://miro.com/app/settings/user-profile/apps/)
2. Click "Create new app"
3. Configure:
   - **App name**: MeasureMint
   - **App URL**: `http://localhost:3000`
   - **Redirect URI**: `http://localhost:3000/`
   - **Permissions**: `boards:read`, `boards:write`
   - **SDK URI**: `http://localhost:3000/index.html`
4. Install the app to your Miro board

## 📖 How to Use

### Quick Start (2 Simple Steps!)

#### 1. Calibrate Scale
1. Click "Draw New Line" under Calibration
2. Click two points on a known distance in your drawing (e.g., a dimension line showing "20 ft")
3. Enter the actual distance
4. Choose your unit (ft, in, m, cm, etc.)
5. Choose which axis to calibrate:
   - **Both** - Normal drawings (default)
   - **X-Axis Only** - If horizontal distances are distorted
   - **Y-Axis Only** - If vertical distances are distorted
6. Click "Set Calibration"

**Alternative: Reuse Existing Line**
- If you have lines already on the board, click "Reuse Existing Line"
- Select any line or connector
- Enter its actual distance
- Perfect for using existing dimension lines!

#### 2. Measure Distances
1. Click "Measure Distance" under Measurements
2. Click your start point on the board
3. Click your end point
4. See the measurement displayed with a connecting line
5. Change units anytime using the unit dropdown

### Advanced Features

#### Update Calibration
Made a mistake or need to adjust? Click "Update Calibration" to:
- Change the reference distance
- Switch between units
- Modify which axis is calibrated
- No need to redraw your calibration line!

#### Dual-Axis Calibration
For distorted or stretched images:
1. Set X-axis calibration using a horizontal reference
2. Set Y-axis calibration using a vertical reference
3. MeasureMint automatically applies the correct scale based on measurement direction

### Switch Units Anytime
Change units without re-measuring:
1. Use the unit selector on any measurement
2. Choose from: ft, in, yd, mi, m, cm, mm, km
3. All measurements update automatically

## 🛠️ Development

### Project Structure

```
measuremint/
├── LICENSE                 # License 
├── index.html              # Main app interface
├── app.js                  # Application logic
├── package.json           # Dependencies
├── privacy-policy.html    # Privacy policy
├── terms-of-service.html  # Terms of service
├── README.md             # This file
├── jest.config.js        # Jest configuration
├── jest.setup.js         # Test setup
├── .gitignore            # Git exclusions
├── src/
│   ├── app/
│   │   └── panel/
│   │       └── page.jsx  # Main panel component
│   └── utils/
│       ├── measurements.js           # Utility functions
│       ├── performance.js            # Performance monitoring
│       └── __tests__/
│           └── measurements.test.js  # Unit tests
└── docs/
    ├── USER_GUIDE.md     # User documentation
    ├── TECHNICAL.md      # Technical documentation
    ├── PERFORMANCE.md    # Performance guide
    └── DEPLOYMENT.md     # Deployment guide
```

### Available Scripts

- `npm start` - Start development server
- `npm run dev` - Start development server (alias)
- `npm run build` - Build for production
- `npm test` - Run test suite
- `npm run test:watch` - Run tests in watch mode
- `npm run test:coverage` - Run tests with coverage report
- `npm run test:ci` - Run tests in CI mode

### Testing

MeasureMint includes comprehensive unit tests for all utility functions:

```bash
# Run all tests
npm test

# Run tests in watch mode (during development)
npm run test:watch

# Generate coverage report
npm run test:coverage
```

**Test Coverage:**
- Unit conversions (ft, in, m, cm, mm, yd, mi, km)
- Distance calculations (pixel distance, actual distance, dual-axis)
- Measurement formatting (decimal, feet-inches)
- Input parsing (feet-inches format)
- Calibration validation
- Angle calculations
- Orientation detection

### Performance

Performance utilities and monitoring:

```jsx
import { measureAsync, debounce, throttle, memoize } from '@/utils/performance';

// Measure operation performance
await measureAsync(async () => {
  // Your async operation
}, 'Operation Label');

// Debounce user input
const debouncedHandler = debounce(handleInput, 300);

// Throttle frequent events
const throttledHandler = throttle(handleScroll, 100);

// Memoize expensive calculations
const memoizedCalc = memoize(expensiveFunction);
```

See [docs/PERFORMANCE.md](docs/PERFORMANCE.md) for detailed optimization guide.

## 🌐 Deployment

### Quick Deploy with Vercel
```bash
npm install -g vercel
vercel
```

### Other Options
- Netlify
- GitHub Pages
- AWS S3 + CloudFront
- Google Cloud Storage

See full deployment guide in documentation.

## 📋 Marketplace Requirements

- [x] Privacy Policy
- [x] Terms of Service
- [ ] App Icon (512x512px)
- [ ] Toolbar Icon (24x24px)
- [ ] Screenshots (3-5 images, 1280x720px)
- [ ] Demo video (optional but recommended)

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## � Troubleshooting

### Common Issues

1. **OAuth Error: redirect_uri_mismatch**
   - Verify the redirect URI in your Miro app settings matches your .env file
   - Make sure you're using HTTPS when required
   - When using Docker, check the ngrok URL matches your Miro app settings

2. **Cannot find module 'xyz'**
   - In Docker: Run `npm run docker:dev` to rebuild with new dependencies
   - Local setup: Run `npm install`

### Docker-Specific Issues

1. **Port already in use**
   ```bash
   # Stop all running containers
   npm run docker:down
   
   # Remove any orphaned containers
   docker-compose down --remove-orphans
   ```

2. **Changes not reflecting**
   - Ensure your code is properly mounted in docker-compose.yml
   - Try rebuilding the containers: `npm run docker:dev`

3. **Database connectivity issues**
   - Check if the db volume is properly mounted
   - Verify permissions on the db directory
   - Ensure the database path in .env matches the Docker volume path

4. **Ngrok issues**
   - Verify your authtoken is correctly set in .env
   - Check the ngrok container logs: `docker-compose logs ngrok`
   - Try restarting the containers: `npm run docker:down && npm run docker:dev`

## �📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🔗 Links

- [Miro Marketplace](https://miro.com/marketplace/) - Coming soon!
- [Miro Developer Platform](https://developers.miro.com)
- [Miro SDK Documentation](https://developers.miro.com/docs/)
- [Report Issues](https://github.com/Khaledykhalil/MeasureMint/issues)
- [Privacy Policy](https://measuremint.app/privacy-policy)
- [Terms of Service](https://measuremint.app/terms-of-service)

## 👤 Author

**Khaled Khalil**
- GitHub: [@Khaledykhalil](https://github.com/Khaledykhalil)
- Website: [measuremint.app](https://measuremint.app)
- Email: khaledykhalil09@gmail.com

## 🙏 Acknowledgments

- Built with Miro Web SDK v2.0
- Inspired by Bluebeam Revu's professional measurement tools
- Designed for the AEC (Architecture, Engineering, Construction) industry

## 🐛 Known Issues

None currently. Please report any issues on GitHub!

## 🗺️ Roadmap

### Current Version ✅
- [x] Linear distance measurements with visual feedback
- [x] Dual-axis calibration system (X, Y, or Both)
- [x] Draw new calibration line or reuse existing lines
- [x] Update calibration without redrawing
- [x] 8 unit types with automatic conversion
- [x] No image selection required
- [x] Real-time measurement display

### Coming Soon 🚀
- [ ] Area calculations with perimeter
- [ ] Polyline (multi-point path) measurements
- [ ] Angle measurements
- [ ] Circle measurements (radius, diameter, circumference, area)
- [ ] Volume calculations
- [ ] Count tool with markers
- [ ] Slope/pitch tool (rise:run, percentage, degrees)
- [ ] Export measurements to CSV
- [ ] Multiple scale regions for mixed-scale drawings
- [ ] Scale presets (architectural scales)
- [ ] Measurement templates and saved configurations
- [ ] Custom unit definitions
- [ ] Multi-language support

### Future Enhancements 🔮
- [ ] Cutout/subtract areas
- [ ] Feet-inches formatting for construction professionals
- [ ] Measurement annotations and notes
- [ ] Batch measurement operations
- [ ] Advanced reporting features

---

**MeasureMint** - Making measurements on Miro as easy as they should be.

Made with ❤️ for architects, engineers, and construction professionals.

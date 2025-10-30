# 📏 MeasureMint for Miro

**Professional measurement and calibration tool for Miro boards**

![Version](https://img.shields.io/badge/version-1.0.0-blue)
![License](https://img.shields.io/badge/license-MIT-green)
![Miro SDK](https://img.shields.io/badge/Miro%20SDK-v2.0-orange)

## ✨ Features

### 🎯 Core Capabilities
- **9 Professional Measurement Tools** - Complete toolkit for construction and design professionals
- **Precise Scale Calibration** - Set scale using any known distance, or choose from 20+ architectural scale presets
- **Feet-Inches Formatting** - Measurements display in construction-standard format (e.g., 12' 6" instead of 12.5 ft)
- **Multiple Scale Regions** - Handle mixed-scale drawings by defining different calibration zones
- **8 Unit Types** - ft, in, m, cm, mm, yd, mi, km with automatic conversions
- **No Image Selection Required** - Measure anywhere on the board instantly
- **Visual Feedback** - See your measurements directly on the board with connecting lines
- **CSV Export** - Export all measurements to CSV for analysis or documentation
- **Real-time Updates** - All measurements update when you change units

### 📐 Measurement Tools

#### 1. **Linear Distance** 
Click two points to measure straight-line distance. Perfect for dimensions, diagonals, and direct measurements.

#### 2. **Area & Perimeter**
Click multiple points to define a polygon. Get both area and perimeter measurements instantly. Ideal for rooms, lots, or any bounded space.

#### 3. **Polyline Length**
Measure complex paths by clicking multiple points. Total length is calculated along the entire path. Essential for roads, piping, or winding routes.

#### 4. **Count Tool**
Click to place counting markers on the board. Keep track of items like fixtures, columns, or repeated elements.

#### 5. **Volume Calculation**
Define a polygon area and specify height to calculate volume. Perfect for concrete pours, excavation, or material estimates.

#### 6. **Angle Measurement**
Click three points to measure angles. Displays in degrees with full 360° range. Essential for slopes, intersections, and alignments.

#### 7. **Circle Measurements**
Click center and edge to get radius, diameter, circumference, and area. Perfect for circular features like columns or roundabouts.

#### 8. **Cutout/Subtract Areas** ⭐
Calculate net areas by subtracting openings from main areas. Define a main polygon, then click "Add Cutout" to subtract windows, doors, or other openings. Shows gross area, total cutouts, and net area (Gross - Cutouts = Net).

#### 9. **Slope/Pitch Tool** ⭐
Click two points and enter height change to get:
- **Rise:Run ratio** (e.g., 4:12 for roofing)
- **Percentage** (e.g., 33.3% for roads)
- **Degrees** (e.g., 18.4° for ramps)

### 🏗️ Built for Professionals
Perfect for:
- **Architecture** - Floor plans, elevations, site plans, room areas
- **Engineering** - Technical drawings, schematics, diagrams, slope analysis  
- **Construction** - Blueprints, shop drawings, as-built documentation, material takeoffs
- **Interior Design** - Space planning, furniture layouts, area calculations
- **Real Estate** - Property measurements, site analysis, lot dimensions
- **Project Management** - Visual project documentation, quantity tracking

### 🎯 Scale Calibration Options

#### Option 1: Draw Calibration Line (Recommended)
1. Click "Calibrate" tool
2. Click two points on a known distance
3. Enter the actual distance
4. Choose your unit
5. Click "Set Calibration"

#### Option 2: Quick Scale Presets
Choose from 20+ pre-configured architectural scales:
- **Imperial**: 1/16"=1', 1/8"=1', 1/4"=1', 1/2"=1', 1"=1', and more
- **Metric**: 1:50, 1:100, 1:200, 1:500, and more

Simply select a scale preset and start measuring immediately!

### 🗺️ Multiple Scale Regions ⭐
Handle drawings with different scales in different areas:
1. Click "Add Scale Region"
2. Draw a polygon around an area with a specific scale
3. Set the calibration for that region
4. Repeat for other scale zones
5. MeasureMint automatically detects which region you're measuring in and applies the correct scale

Perfect for site plans with detail callouts, multi-scale construction documents, or mixed drawings.

### 🔄 Smart Unit Conversion
Seamlessly convert between:
- **Imperial**: feet, inches, yards, miles
- **Metric**: meters, centimeters, millimeters, kilometers
- **Feet-Inches Format**: Toggle feet measurements to display as 12' 6" (rounded to nearest inch)
- All conversions happen automatically!

### 🎨 User Experience
- Clean, intuitive interface
- No image selection required - measure anywhere
- Works with any drawing, PDF, or image on Miro
- Scale presets for instant measurement
- Multiple scale regions for complex drawings
- Professional measurement display with feet-inches formatting
- CSV export for all measurements
- Keyboard shortcuts support

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
git clone https://github.com/YOUR-USERNAME/measuremint.git
cd measuremint
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

### Quick Start (3 Simple Steps!)

#### 1. Calibrate Scale
**Option A: Draw a Line** (Recommended)
1. Click "Calibrate Scale" 
2. Click two points on a known distance (e.g., a dimension line showing "20 ft")
3. Enter the actual distance
4. Choose your unit (ft, in, m, cm, etc.)
5. Click "Set Calibration"

**Option B: Use Scale Preset** (Even Faster!)
1. Click "Calibrate Scale"
2. Click "Use Scale Preset"
3. Select your drawing's scale (e.g., 1/4"=1'-0")
4. Start measuring immediately!

#### 2. Choose Your Measurement Tool
Click any tool to start measuring:
- **Linear** - Two-point distance measurement
- **Area** - Multi-point polygon area and perimeter
- **Polyline** - Multi-point path length
- **Count** - Place counting markers
- **Volume** - Area × Height for volume calculations
- **Angle** - Three-point angle measurement
- **Circle** - Center + edge for radius, diameter, area
- **Cutout** - Calculate net area (gross - cutouts)
- **Slope** - Rise/run, percentage, and degree measurements

#### 3. Take Measurements
Each tool has its own interaction:
- **Linear**: Click start point → click end point
- **Area**: Click points to draw polygon → click "Complete Area"
- **Polyline**: Click points along path → click "Complete Polyline"
- **Count**: Click anywhere to place markers
- **Volume**: Draw area polygon → enter height → complete
- **Angle**: Click vertex → first point → second point
- **Circle**: Click center → click edge point
- **Cutout**: Draw main area → click "Add Cutout" → draw cutout polygons → complete
- **Slope**: Click start point → click end point → enter height change

### Advanced Features

#### Multiple Scale Regions
For drawings with different scales in different areas:
1. Click "Add Scale Region"
2. Click points to draw a polygon around the first scale area
3. Calibrate the scale for that region
4. Click "Add Scale Region" again for the next area
5. When measuring, MeasureMint automatically uses the correct scale based on location

#### Cutout/Subtract Areas
Calculate net areas by subtracting openings:
1. Click "Cutout Areas" tool
2. Draw the main polygon (gross area)
3. Click "Complete Main Area"
4. Click "Add Cutout" for each opening
5. Draw each cutout polygon
6. Complete each cutout
7. See: Gross Area - Total Cutouts = Net Area

#### Slope/Pitch Calculations
Get comprehensive slope measurements:
1. Click "Slope/Pitch" tool
2. Click start point (e.g., bottom of slope)
3. Click end point (e.g., top of slope)
4. Enter the height change (rise)
5. Get three formats:
   - Rise:Run (e.g., 4:12 for roofing)
   - Percentage (e.g., 8.33% for ADA ramps)
   - Degrees (e.g., 18.43° for general use)

#### Feet-Inches Display
For imperial measurements in feet:
1. Take any measurement in feet
2. The display shows feet-inches format: "12' 6"" instead of "12.5 ft"
3. Rounded to the nearest inch for construction accuracy

#### Export to CSV
1. Take multiple measurements of any type
2. Click "Export to CSV"
3. Get a spreadsheet with:
   - Measurement type
   - All values (area, perimeter, volume, etc.)
   - Units
   - Timestamp
   
Perfect for quantity takeoffs, documentation, and cost estimation!

### Switch Units Anytime
Change units at any time without re-measuring:
1. Use the unit selector on any measurement
2. Choose from: ft, in, yd, mi, m, cm, mm, km
3. All measurements update automatically
4. Each measurement can use different units

## 🛠️ Development

### Project Structure

measuremint/
├── LICENSE                 # License 
├── index.html              # Main app interface
├── app.js                  # Application logic
├── package.json           # Dependencies
├── privacy-policy.html    # Privacy policy
├── terms-of-service.html  # Terms of service
├── README.md             # This file
└── .gitignore            # Git exclusions

### Available Scripts

- `npm start` - Start development server
- `npm run dev` - Start development server (alias)

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
- [Report Issues](https://github.com/YOUR-USERNAME/measuremint/issues)

## 👤 Author

**Khaled Khalil**
- GitHub: [@khaledykhalil](https://github.com/YOUR-USERNAME)
- Email: khaledykhalil09@gmail.com

## 🙏 Acknowledgments

- Built with Miro Web SDK v2.0
- Inspired by Bluebeam Revu's professional measurement tools
- Designed for the AEC (Architecture, Engineering, Construction) industry

## 🐛 Known Issues

None currently. Please report any issues on GitHub!

## 🗺️ Roadmap

### Completed ✅
- [x] Linear distance measurements
- [x] Area calculations with perimeter
- [x] Polyline (multi-point path) measurements
- [x] Angle measurements  
- [x] Circle measurements (radius, diameter, circumference, area)
- [x] Volume calculations
- [x] Count tool with markers
- [x] Cutout/subtract areas
- [x] Slope/pitch tool (rise:run, percentage, degrees)
- [x] Multiple scale regions for mixed-scale drawings
- [x] Scale presets (20+ architectural scales)
- [x] Feet-inches formatting for construction professionals
- [x] Export measurements to CSV
- [x] No image selection required
- [x] 8 unit types with automatic conversion

### Coming Soon 🚀
- [ ] Measurement templates and saved configurations
- [ ] Custom unit definitions
- [ ] Multi-language support
- [ ] Measurement annotations and notes
- [ ] Batch measurement operations
- [ ] Advanced reporting features

---

**MeasureMint** - Making measurements on Miro as easy as they should be.

Made with ❤️ for architects, engineers, and construction professionals.

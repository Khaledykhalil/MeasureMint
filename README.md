# 📏 MiroMeasure

**Professional measurement and calibration tool for Miro boards** - similar to Bluebeam Revu's calibrate and measure functionality.

![Version](https://img.shields.io/badge/version-1.0.0-blue)
![License](https://img.shields.io/badge/license-MIT-green)
![Miro SDK](https://img.shields.io/badge/Miro%20SDK-v2.0-orange)

## 🎯 Features

- **Scale Calibration** - Set a known distance to establish accurate scale
- **Precise Measurements** - Measure any distance on calibrated drawings
- **Dual Unit Systems** - Full Imperial and Metric support with instant conversion
- **8 Unit Types** - Feet, inches, yards, miles, meters, centimeters, millimeters, kilometers
- **Visual Feedback** - Clear markers and labels directly on the Miro board
- **Measurement History** - Track all measurements with automatic unit conversions
- **Conversion Tables** - View measurements across all units simultaneously
- **Professional Grade** - Built for architects, engineers, and construction professionals

## 🎬 Demo

Perfect for:
- 🏗️ Construction blueprints
- 🏠 Floor plans
- 🗺️ Site plans
- 📐 Technical drawings
- 🎨 Architectural designs

## 🚀 Quick Start

### Prerequisites

- Node.js 14.15 or later
- A Miro Developer account
- A Miro Developer team

### Installation

1. **Clone the repository**
```bash
   git clone https://github.com/YOUR-USERNAME/miromeasure.git
   cd miromeasure
```

2. **Install dependencies**
```bash
   npm install
```

3. **Start the development server**
```bash
   npm start
```
   
   The app will be available at `http://localhost:3000`

### Miro Developer Setup

1. Go to [Miro App Settings](https://miro.com/app/settings/user-profile/apps/)
2. Click "Create new app"
3. Configure:
   - **App name**: MiroMeasure
   - **App URL**: `http://localhost:3000`
   - **Redirect URI**: `http://localhost:3000/`
   - **Permissions**: `boards:read`, `boards:write`
   - **SDK URI**: `http://localhost:3000/index.html`
4. Install the app to your Miro board

## 📖 How to Use

### 1. Select Image
Click "Select Image" and choose a blueprint, floor plan, or technical drawing on your Miro board.

### 2. Calibrate Scale
1. Click "Calibrate Scale"
2. Click two points on a known distance (e.g., a dimension line showing "20 ft")
3. Enter the actual distance
4. Choose your unit
5. Click "Set Calibration"

### 3. Measure Distances
1. Click "Measure Distance"
2. Click any two points on your calibrated image
3. The measurement appears automatically with full unit conversions

### 4. Switch Units Anytime
Toggle between Imperial (🇺🇸) and Metric (🌍) systems or change specific units - all measurements update automatically!

## 🛠️ Development

### Project Structure

miromeasure/
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

## 💰 Pricing Recommendation

**Professional Plan**: $12-15/user/month
- Unlimited measurements
- All unit types
- Measurement history
- Priority support

**Team Plan**: $49/team/month (up to 10 users)
- Everything in Professional
- Shared calibrations
- Team measurement library

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

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🔗 Links

- [Miro Marketplace](https://miro.com/marketplace/) - Coming soon!
- [Miro Developer Platform](https://developers.miro.com)
- [Miro SDK Documentation](https://developers.miro.com/docs/)
- [Report Issues](https://github.com/YOUR-USERNAME/miromeasure/issues)

## 👤 Author

**YOUR_NAME**
- GitHub: [@YOUR-USERNAME](https://github.com/YOUR-USERNAME)
- Email: your.email@example.com
- Website: https://yourwebsite.com

## 🙏 Acknowledgments

- Built with Miro Web SDK v2.0
- Inspired by Bluebeam Revu's professional measurement tools
- Designed for the AEC (Architecture, Engineering, Construction) industry

## 🐛 Known Issues

None currently. Please report any issues on GitHub!

## 🗺️ Roadmap

- [ ] Area calculations
- [ ] Angle measurements
- [ ] Export measurements to CSV
- [ ] Custom unit definitions
- [ ] Measurement templates
- [ ] Multi-language support

---

**MiroMeasure** - Making measurements on Miro as easy as they should be.

Made with ❤️ for architects, engineers, and construction professionals.
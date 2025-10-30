# Changelog

All notable changes to MeasureMint will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added
- **9 Professional Measurement Tools**
  - Linear distance measurements
  - Area and perimeter calculations  
  - Polyline (multi-point path) measurements
  - Count tool with numbered markers
  - Volume calculations (area × height)
  - Angle measurements (3-point, full 360°)
  - Circle measurements (radius, diameter, circumference, area)
  - Cutout/Subtract areas (gross - cutouts = net)
  - Slope/Pitch tool (rise:run, percentage, degrees)

- **Advanced Features**
  - Multiple scale regions for mixed-scale drawings with automatic detection
  - Scale presets with 20+ architectural scales (imperial and metric)
  - Feet-inches formatting for construction professionals (12' 6" instead of 12.5 ft)
  - No image selection required - measure anywhere on the board
  - Board click event handling for all multi-point tools
  - CSV export for all measurement types with formatted values

- **UI/UX Improvements**
  - React Icons library integration (21 icons)
  - Removed Imperial/Metric toggle from header for cleaner interface
  - Scale preset workflow with two-path calibration
  - Enhanced visual feedback for all measurement types
  - Improved calibration caption handling

### Changed
- Migrated from emoji icons to React Icons library for better visual consistency
- Simplified UI by removing Imperial/Metric toggle buttons
- Enhanced scale calibration workflow with preset option
- Improved measurement display formatting with feet-inches support
- Updated calibration to work without image selection requirement

### Fixed
- **Critical**: Board click event listener for multi-point tools (area, polyline, angle, circle, cutout, slope)
- **Critical**: Calibration caption API compatibility (removed unsupported style property)
- Scale preset async handling with proper await
- State variable naming in useEffect dependencies (circlePoints → circleCenter)
- Miro API availability checks in calibration

### Technical
- Added useEffect hook with miro.board.ui.on('click') for board interaction
- Implemented formatFeetInches() for construction-standard formatting
- Added point-in-polygon ray-casting for scale region detection
- Enhanced CSV export with all measurement types and formatted values
- Removed unsupported caption styling for Miro API v2 compatibility

### Documentation
- Comprehensive README update with all 9 measurement tools
- Detailed USER_GUIDE with tool-specific instructions and examples
- Added calibration methods documentation
- Created workflow examples for common use cases
- Added troubleshooting section for all tools

## [1.0.0] - 2025-10-26

### Added
- Initial release
- Basic measurement functionality
- Scale calibration
- Imperial and Metric unit support
- Visual measurement markers
- Measurement history
- Unit conversion system
- OAuth integration with Miro
- Basic error handling

### Security
- OAuth 2.0 implementation
- Environment variable configuration
- Secure token handling

## [0.1.0] - 2025-10-01

### Added
- Project initialization
- Basic Miro SDK integration
- Development environment setup
- Core measurement logic
- Initial documentation

[Unreleased]: https://github.com/Khaledykhalil/MeasureMint/compare/v1.0.0...HEAD
[1.0.0]: https://github.com/Khaledykhalil/MeasureMint/compare/v0.1.0...v1.0.0
[0.1.0]: https://github.com/Khaledykhalil/MeasureMint/releases/tag/v0.1.0
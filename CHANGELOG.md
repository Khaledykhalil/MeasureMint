# Changelog

All notable changes to MeasureMint will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added
- **Dual-Axis Calibration System**
  - Independent X and Y axis calibration for distorted or stretched images
  - Option to calibrate both axes, X-axis only, or Y-axis only
  - Draw new calibration line or reuse existing lines/connectors
  - Update calibration settings without redrawing
  
- **Linear Distance Measurements**
  - Two-point click measurement with visual feedback
  - Real-time distance calculation
  - Measurement lines displayed directly on board
  
- **Unit Conversion System**
  - 8 unit types: ft, in, m, cm, mm, yd, mi, km
  - Real-time unit switching without re-measuring
  - Automatic conversion between imperial and metric
  
- **UI/UX Improvements**
  - React Icons library integration
  - Clean, simplified interface
  - No image selection required - measure anywhere
  - Stacked layout with clear section headers
  - Dark mode support

### Changed
- Simplified UI to focus on core calibration and measurement features
- Removed incomplete features to improve reliability
- Migrated from emoji icons to React Icons library

### Fixed
- Miro API compatibility issues
- Calibration caption API handling

### Removed
- Area, Polyline, Count, Volume, Angle, Circle, Cutout, and Slope tools (available in `full-featured-ui` branch)
- Scale presets feature
- Multiple scale regions
- Feet-inches formatting
- CSV export
- Collapsible UI sections

### Technical
- Cleaned up unused state variables
- Removed unused icon imports
- Removed unused function definitions

### Documentation
- Updated README to reflect current capabilities
- Created comprehensive DEPLOYMENT.md guide
- Updated privacy policy and terms of service
- Added PRIVACY_AND_TERMS.md documentation

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
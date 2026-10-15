# Changelog

## [1.3.2] - 2026-10-15

### Fixed
- Enforced standard-format plugin architecture by removing `adminEntry` from descriptor, resolving EmDash core builder incompatibility.
- Ensured 100% compliance with EmDash Block Kit admin route specifications (`POST /admin`).

### Added
- Added `pluginId` and `cdnSrc` props in companion Astro components (`AccessibilityWidget.astro`, `CoddleAccessWidget.astro`) for automatic registry ID resolution (`r_*`) and CDN fallback support.
- Added comprehensive automated test coverage for registry installation ID scoping and asset fallback handling.

### Improved
- Robust script error handling with non-blocking fallback warnings when host themes do not provide local vendor assets in `public/`.
- Verified live integration on isolated EmDash server instance.

## [1.3.1] - 2026-10-15

### Changed
- Neutralized branding to **Accessibility Toolkit** (`accessibility-toolkit`).
- Exported companion component `./accessibility-widget` alongside `./widget`.
- Preserved compatibility across plugin IDs and settings namespaces.

### Added
- Exported React Admin UI (`./admin`) in `package.json`.
- Added tests for persistence, defaults, and update retention.

### Improved
- Block Kit admin interface aligned with reference specifications.
- Settings API decoupled using canonical EmDash namespaces.

## [1.3.0] - 2026-10-14

### Added
- Block Kit admin interface at `/settings` with preview link and 8 configurable settings.
- Route handler (`POST /admin`) for page load and form submissions.
- Declared `admin.settingsSchema` in plugin manifest.

### Improved
- Streamlined Workerd sandbox bundle.
- Backward compatibility for legacy icon and position values.

## [1.2.0] - 2026-10-13

### Added
- Modern cards, rounded controls, font sizing, and multi-language support.

## [1.1.0] - 2026-10-12

### Added
- Initial standalone accessibility toolkit package with local and CDN font support.



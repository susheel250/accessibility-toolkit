# Changelog

## [1.3.5] - 2026-10-22

### Fixed
- Eliminated legacy vendor branding link from the accessibility widget's Shadow DOM footer via scoped style override.
- Synchronized footer display to collapse cleanly when no visible footer content remains, while preserving accessibility statement links.
- Neutralized floating launcher button aria-label for accessibility compliance.
- Applied identical Shadow DOM overrides across both the `<AccessibilityWidget />` companion component and the standalone `/snippet` loader.

## [1.3.4] - 2026-10-22

### Added
- Added optional `cdnBaseUrl` configuration setting in Block Kit admin and manifest schema for custom HTTPS CDN deployments.
- Added SHA-384 Subresource Integrity (`integrity="sha384-PkHCo9yYYt43CM9mczXrTqkNN0ddgEpZos0hrTEP62/Iox7z6iWI3CfR06lzbWdK"`) and `crossorigin="anonymous"` attributes for remote CDN script loading.
- Added automatic dual-tier fallback in `<AccessibilityWidget />` and dynamic loader, seamlessly failing over from remote CDN to local `/vendor/coddle-access/` assets upon network or HTTP failure.
- Added comprehensive unit tests covering local mode, CDN mode, SRI verification, and duplicate initialization suppression.

### Fixed
- Fixed `/snippet` route to strictly separate local and CDN deployment modes, ensuring local relative URLs are never labeled as CDN URLs.
- Fixed `/snippet` dynamic loader to respect plugin `enabled === false` and exit without DOM insertion or network requests.
- Synchronized duplicate initialization prevention flags (`window.__accessibility_toolkit_initialized`) across all loaders.

## [1.3.3] - 2026-10-19

### Changed
- Prepared clean release for EmDash Plugin Registry publication.
- Updated version metadata across plugin manifest, package definitions, and runtime status telemetry.

## [1.3.2] - 2026-10-15

### Fixed
- Enforced standard-format plugin architecture by removing `adminEntry` from descriptor.
- Ensured compliance with EmDash Block Kit admin route specifications (`POST /admin`).

### Added
- Added `pluginId` and `cdnSrc` props in companion Astro components (`AccessibilityWidget.astro`, `CoddleAccessWidget.astro`) for automatic registry ID resolution (`r_*`) and CDN fallback support.
- Added comprehensive test coverage for registry installation ID scoping and asset fallback handling.

### Improved
- Robust script error handling with non-blocking fallback warnings when local vendor assets are not provided.
- Verified live integration on isolated EmDash server instance.

## [1.3.1] - 2026-10-15

### Changed
- Neutralized branding to **Accessibility Toolkit** (`accessibility-toolkit`).
- Exported companion component `./accessibility-widget` alongside `./widget`.
- Preserved compatibility across plugin IDs and settings namespaces.

### Added
- Exported React Admin UI (`./admin`) in `package.json`.
- Added tests for persistence and update retention.

### Improved
- Block Kit admin interface aligned with reference specs.

## [1.3.0] - 2026-10-14

### Added
- Block Kit admin interface with preview link and 8 configurable settings.
- Route handler (`POST /admin`) for page load and form submissions.
- Declared `admin.settingsSchema` in plugin manifest.

### Improved
- Streamlined Workerd sandbox bundle.
- Backward compatibility for legacy settings.

## [1.2.0] - 2026-10-13

### Added
- Cards, rounded controls, font sizing, and multi-language support.

## [1.1.0] - 2026-10-12

### Added
- Initial standalone accessibility toolkit package with local and CDN font support.

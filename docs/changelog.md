# Changelog

## [1.3.4] - 2026-10-22

### Added
- Added optional `cdnBaseUrl` configuration in Block Kit admin and manifest schema for custom HTTPS CDN deployments.
- Added SHA-384 Subresource Integrity (`integrity="sha384-PkHCo9yYYt43CM9mczXrTqkNN0ddgEpZos0hrTEP62/Iox7z6iWI3CfR06lzbWdK"`) and `crossorigin="anonymous"` for remote CDN script loading.
- Added automatic dual-tier fallback in `<AccessibilityWidget />` and dynamic loader, seamlessly failing over from remote CDN to local `/vendor/coddle-access/` assets upon network failure.
- Added unit tests covering local mode, CDN mode, SRI verification, and duplicate initialization suppression.

### Fixed
- Fixed `/snippet` route to strictly separate local and CDN deployment modes, ensuring local relative URLs are never labeled as CDN URLs.
- Fixed `/snippet` dynamic loader to respect plugin `enabled === false` and exit without DOM insertion or network requests.
- Synchronized duplicate initialization prevention flags (`window.__accessibility_toolkit_initialized`) across all loaders.

## [1.3.3] - 2026-10-19

### Changed
- Prepared clean release for EmDash Plugin Registry publication.
- Updated version metadata across plugin manifest, package definitions, and runtime status telemetry.

## [1.3.2] - 2026-10-15

### Added
- Added `pluginId` and `cdnSrc` props in companion Astro components (`AccessibilityWidget.astro`, `CoddleAccessWidget.astro`) for automatic registry ID resolution (`r_*`) and CDN fallback support.
- Added Block Kit admin interface with preview link and 8 configurable settings.

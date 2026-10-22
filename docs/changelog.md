# Changelog

## [1.3.5] - 2026-10-22

### Fixed
- Eliminated legacy vendor branding link from widget's Shadow DOM footer via scoped style override.
- Synchronized footer display to collapse cleanly when no visible content remains, preserving statement links.
- Neutralized floating launcher button aria-label for accessibility compliance.
- Applied identical Shadow DOM overrides across both `<AccessibilityWidget />` and standalone `/snippet` loader.

## [1.3.4] - 2026-10-22

### Added
- Added optional `cdnBaseUrl` configuration in Block Kit admin and manifest schema for custom HTTPS CDN deployments.
- Added SHA-384 Subresource Integrity and `crossorigin="anonymous"` for remote CDN script loading.
- Added automatic dual-tier fallback in `<AccessibilityWidget />` and dynamic loader, failing over from remote CDN to local vendor assets.
- Added unit tests covering local mode, CDN mode, SRI verification, and duplicate initialization suppression.

### Fixed
- Fixed `/snippet` route to strictly separate local and CDN deployment modes.
- Fixed `/snippet` dynamic loader to respect plugin `enabled === false`.
- Synchronized duplicate initialization prevention flags (`window.__accessibility_toolkit_initialized`).

## [1.3.3] - 2026-10-19

### Changed
- Prepared clean release for EmDash Plugin Registry publication.
- Updated version metadata across plugin manifest, package definitions, and runtime status telemetry.

## [1.3.2] - 2026-10-15

### Added
- Added `pluginId` and `cdnSrc` props in companion Astro components for automatic registry ID resolution and CDN fallback.

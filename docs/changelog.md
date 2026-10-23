# Changelog

## [1.3.6] - 2026-10-23

### Added
- Added `TROUBLESHOOTING.md` diagnostic guide covering CDN setup, SRI integrity, and asset fallbacks.
- Added unit tests for CDN URL sanitization and dual-tier fallback behavior.

### Changed
- Updated default CDN base URL to immutable release tag `v1.3.6`.
- Standardized installation guides and documentation.

### Fixed
- Fixed CDN URL normalization and obsolete repository path migration.

## [1.3.5] - 2026-10-22

### Fixed
- Eliminated legacy vendor branding link from widget Shadow DOM footer via scoped style override.
- Synchronized footer display to collapse cleanly when no visible content remains.
- Neutralized floating launcher button aria-label for accessibility compliance.
- Applied Shadow DOM overrides across `<AccessibilityWidget />` and `/snippet` loader.

## [1.3.4] - 2026-10-22

### Added
- Added optional `cdnBaseUrl` configuration in Block Kit admin and manifest schema.
- Added SHA-384 SRI and `crossorigin="anonymous"` for remote CDN script loading.
- Added automatic dual-tier fallback in `<AccessibilityWidget />` and dynamic loader.
- Added unit tests covering local mode, CDN mode, and duplicate initialization suppression.

### Fixed
- Fixed `/snippet` route to strictly separate local and CDN deployment modes.
- Fixed `/snippet` dynamic loader to respect plugin `enabled === false`.

## [1.3.3] - 2026-10-19

### Changed
- Prepared clean release for EmDash Plugin Registry publication.
- Updated version metadata across plugin manifest, package definitions, and runtime telemetry.

## [1.3.2] - 2026-10-15

### Added
- Added `pluginId` and `cdnSrc` props in companion Astro components for registry ID resolution.

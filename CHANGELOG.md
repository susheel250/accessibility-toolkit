# Changelog

## [1.3.5] - 2026-10-26

### Added
- **Dynamic Plugin State Resolution**: The companion component `<AccessibilityWidget />` automatically resolves the active registry plugin ID at runtime via EmDash `getDb()` and `_plugin_state` without requiring hardcoded IDs.
- **Fail-Safe Lifecycle Handling**: Uninstalled, inactive, or explicitly disabled states are verified both during SSR and client-side via `/_emdash/api/plugins/:id/config`, completely preventing orphan widget instances.
- **Dual-Tier Resilient Asset Delivery**: Remote CDN loading with SHA-384 Subresource Integrity (`sha384-PkHCo9yYYt43CM9mczXrTqkNN0ddgEpZos0hrTEP62/Iox7z6iWI3CfR06lzbWdK`) and automatic fallback to verified local assets upon CDN failure.
- **Automated Multi-State Integration Tests**: Comprehensive test suite covering installed & enabled, installed & disabled, inactive/uninstalled, and CDN failure fallback.
- Added comprehensive `TROUBLESHOOTING.md` and updated `REGISTRY-INSTALLATION.md`.

### Changed
- Standardized canonical CDN base URL to immutable jsDelivr release tag `v1.3.5` (`vendor/accessibility-toolkit/`).
- Removed all obsolete references to unpublished `v1.3.6` CDN assets.
- Standardized documentation across `README.md`, `REGISTRY-INSTALLATION.md`, and `TROUBLESHOOTING.md`.

### Fixed
- Fixed uninstalled plugin state where the widget previously remained visible due to hardcoded fallback mounting.
- Fixed reinstallation failure where dynamically assigned registry IDs (`r_*`) failed to resolve.
- Eliminated legacy vendor branding link from the accessibility widget Shadow DOM footer via scoped style override.
- Synchronized footer display to collapse cleanly when no visible footer content remains, while preserving accessibility statement links.
- Neutralized floating launcher button aria-label for accessibility compliance.

## [1.3.4] - 2026-10-22

### Added
- Added optional `cdnBaseUrl` configuration setting in Block Kit admin and manifest schema for custom HTTPS CDN deployments.
- Added SHA-384 Subresource Integrity and `crossorigin="anonymous"` attributes for remote CDN script loading.
- Added automatic dual-tier fallback in `<AccessibilityWidget />` and dynamic loader.
- Added comprehensive unit tests covering local mode, CDN mode, SRI verification, and duplicate initialization suppression.

## [1.3.3] - 2026-10-19

### Added
- Added support for decentralized EmDash Plugin Registry distribution via ATProto / PDS signed package blobs.
- Sandboxed runtime configuration running within `@emdash-cms/sandbox-workerd` (`"capabilities": []`).
- Block Kit admin settings form with dynamic configuration endpoints.

## [1.3.2] - 2026-10-18

### Fixed
- Fixed Astro SSR rendering compatibility and hydration.

## [1.3.1] - 2026-10-17

### Added
- Added public configuration endpoint for client-side widget initialization.

## [1.3.0] - 2026-10-16

### Added
- Initial EmDash integration for Accessibility Toolkit.

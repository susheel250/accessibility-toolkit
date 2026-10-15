# Changelog

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
- Block Kit admin interface at `/settings` with preview link.
- Controls for status, 12 languages, hex color, icons, sizes, positions.
- Route handler (`POST /admin`) for page load and submissions.
- Declared `admin.settingsSchema` in plugin manifest.

### Improved
- Streamlined Workerd sandbox bundle.
- Backward compatibility for legacy icon and position values.
- Duplicate-initialization protection in Astro components.

## [1.2.1] - 2026-10-14

### Changed
- Updated marketplace listing screenshot to neutral showcase.

## [1.2.0] - 2026-10-13

### Added
- Modern cards, rounded controls, and clean interface styling.
- Font-size controls with percentage and text-alignment.
- Multi-language selector dropdown.

### Improved
- Responsive layouts for desktop, tablet, and mobile.
- Refined focus indicators and interactive states.

## [1.1.0] - 2026-10-12

### Added
- Initial standalone accessibility toolkit package for EmDash CMS.
- Bundled OpenDyslexic font assets locally with CDN fallback.


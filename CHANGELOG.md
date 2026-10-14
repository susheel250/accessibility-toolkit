# Changelog

All notable changes to the Coddle Access accessibility widget will be documented in this file.

## [1.3.0] - 2026-10-14

### Added
- Complete Block Kit custom admin page declared via `admin.pages` at `/settings` with Coddle Access Suite branding, WCAG 2.2 AA compliance badges, and direct "Preview Frontend" action.
- Interactive configuration controls for Master Enable/Disable switch, 12 supported widget languages, primary hex color picker with live palette suggestions, 4 icon shape styles, 3 button sizes, and separate desktop/mobile screen placements.
- Admin route handler (`POST /admin`) supporting initial `page_load`, validated `form_submit`, dynamic error banners, and success feedback toasts.
- Comprehensive setting schema (`admin.settingsSchema`) synchronizing custom admin pages with standard EmDash plugin management.
- Extended automated test suite covering setting defaults, validation, saving, persistence, and registry bundle compliance.

### Improved
- Streamlined backend bundle footprint to 9.12 kB for optimal Cloudflare Workerd execution and instant cold starts.
- Enhanced backward-compatibility mapping for legacy icon and positioning identifiers.
- Updated companion Astro component with duplicate-initialization protection and fallback configuration handling.

## [1.2.0] - 2026-10-13

### Added
- Introduced an updated widget interface with modern cards, rounded controls, and consistent styling.
- Added a Coddle Blue gradient header with reset and close controls.
- Added a custom Coddle Access SVG emblem to the widget header.
- Added improved font-size controls with a percentage indicator.
- Added a segmented indicator for text-alignment controls.
- Enhanced the language selector with updated dropdown styling.
- Added standalone package documentation and distribution files.

### Improved
- Maintained existing accessibility features, event listeners, and state persistence.
- Improved responsive layouts for desktop, tablet, and mobile devices.
- Refined keyboard focus indicators and interactive states for improved usability.

## [1.1.0] - 2026-10-12

### Added
- Introduced Coddle Access branding by Coddle Technologies.
- Bundled OpenDyslexic font assets locally with a CDN fallback.

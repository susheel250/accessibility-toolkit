# Changelog

All notable changes to the Coddle Access widget will be documented in this file.

## [1.3.0] - 2026-10-14

### Added
- Block Kit admin interface at `/settings` with Coddle Access Suite branding and Preview Frontend action.
- Interactive controls for Master Enable/Disable, 12 languages, primary hex color picker, quick palette, 4 icon shapes, 3 button sizes, and separate desktop/mobile positions.
- Admin route handler (`POST /admin`) supporting `page_load`, validated `form_submit`, error banners, and success toasts.
- Comprehensive setting schema (`admin.settingsSchema`) synchronizing settings with EmDash plugin manager.
- Expanded automated test suite covering settings, validation, saving, persistence, and registry bundle compliance.

### Improved
- Streamlined backend bundle to 9.38 kB for fast Workerd execution.
- Added backward-compatibility mapping for legacy icon and positioning identifiers.
- Added duplicate-initialization protection to companion Astro component.

## [1.2.0] - 2026-10-13

### Added
- Updated widget interface with modern cards, rounded controls, and consistent styling.
- Coddle Blue gradient header with reset and close controls, and custom SVG emblem.
- Improved font-size controls with percentage indicator and segmented text-alignment.
- Enhanced language selector with updated dropdown styling.
- Standalone package documentation and distribution files.

### Improved
- Maintained existing accessibility features, event listeners, and state persistence.
- Improved responsive layouts for desktop, tablet, and mobile devices.
- Refined keyboard focus indicators and interactive states.

## [1.1.0] - 2026-10-12

### Added
- Introduced Coddle Access branding by Coddle Technologies.
- Bundled OpenDyslexic font assets locally with CDN fallback.

# Changelog

## [1.3.1] - 2026-10-14

### Added
- Exported standalone React Admin UI (`./admin`) in `package.json`.
- Added tests for settings persistence, fallback defaults, and update retention.

### Improved
- Aligned Registry Block Kit settings description and heading to exact reference specifications.
- Decoupled admin interface from host endpoints, using canonical EmDash settings namespaces.
- Allowed root-relative paths and secure absolute URLs for accessibility statements.

## [1.3.0] - 2026-10-14

### Added
- Block Kit admin interface at `/settings` with Coddle Access Suite branding and frontend preview.
- Controls for enable/disable, 12 languages, hex color, palette, 4 icons, 3 sizes, and positions.
- Admin route handler (`POST /admin`) supporting page load, form submit, and toast alerts.
- Setting schema (`admin.settingsSchema`) synchronizing settings with EmDash plugin manager.

### Improved
- Streamlined backend bundle for fast Workerd execution.
- Added backward-compatibility mapping for legacy icon and positioning identifiers.
- Added duplicate-initialization protection to companion Astro component.

## [1.2.1] - 2026-10-14

### Changed
- Replaced public marketplace listing screenshot with a neutral demonstration showcase.

## [1.2.0] - 2026-10-13

### Added
- Modern cards, rounded controls, and consistent styling across the widget interface.
- Coddle Blue gradient header with reset and close controls, and custom emblem.
- Font-size controls with percentage indicator and segmented text-alignment.
- Enhanced language selector with updated dropdown styling.

### Improved
- Preserved existing accessibility features, event listeners, and state persistence.
- Improved responsive layouts for desktop, tablet, and mobile devices.
- Refined keyboard focus indicators and interactive states.

## [1.1.0] - 2026-10-12

### Added
- Introduced Coddle Access branding by Coddle Technologies.
- Bundled OpenDyslexic font assets locally with CDN fallback.

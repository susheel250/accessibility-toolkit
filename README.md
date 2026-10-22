# Accessibility Toolkit for EmDash CMS

> A modern, lightweight, fully customizable web accessibility toolkit designed to assist users with disabilities and enhance compliance with WCAG 2.2 Level AA and ADA standards across EmDash websites.

[![EmDash Plugin](https://img.shields.io/badge/EmDash-Plugin-blue.svg)](https://emdashcms.com)
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)
[![Version: 1.3.3](https://img.shields.io/badge/Version-1.3.4-indigo.svg)](CHANGELOG.md)

---

## Overview

The **Accessibility Toolkit** brings comprehensive digital accessibility capabilities to any EmDash CMS site. Built with a privacy-first, zero-privilege sandboxed architecture, it integrates seamlessly into the official EmDash Plugin Registry while guaranteeing zero interference with host layouts, forms, and administrative operations.

---

## Features

- **Accessibility Profiles**: One-click presets for Epilepsy Safe Mode, Seizure Safe, ADHD Friendly, Cognitive Disability, and Low Vision.
- **Text & Reading Controls**: Font size scaling (up to 200%), Dyslexic-friendly typeface (`OpenDyslexic3`), highlight titles, highlight links, letter spacing, line height, font weight adjustments, and multi-state text alignments.
- **Color & Contrast Filters**: Dark Contrast, Light Contrast, High Contrast, High & Low Saturation, and Monochrome visual modes.
- **Interaction & Navigation Tools**: Reading Guide focus bar, Large Cursor, Animation Pause, Screen Reader / Text-to-Speech (Page Read), and Sound Mute.
- **Isolated Shadow DOM**: Complete stylesheet and script encapsulation prevents CSS leaks or collisions with your theme.
- **Keyboard Navigation**: Fully accessible keyboard trap with global `Option+A` / `Alt+A` shortcut.
- **Persistent Preferences**: Visitor preferences are preserved automatically in browser local storage.

---

## Architecture: Registry Sandbox & Native Companion

EmDash uses an isolated `workerd` sandbox runtime for registry-published plugins. This package conforms strictly to the EmDash Plugin Registry trust contract:

| Capability / Concern | Sandboxed Registry Plugin (`packages/accessibility-toolkit`) | Native Integration (`src/plugins/accessibility`) |
| :--- | :--- | :--- |
| **Execution Environment** | Cloudflare `workerd` sandbox | Node.js host process |
| **Trust Contract** | `capabilities: []`, `allowedHosts: []` (zero-privilege) | Full host process access (`format: "native"`) |
| **Settings UI** | Custom Block Kit admin at `/settings` + `admin.settingsSchema` | Custom interactive React canvas with live preview |
| **Configuration API** | Public route `GET /api/plugins/accessibility-toolkit/config` | Direct SQLite queries on `options` table |
| **DOM Delivery** | Theme embed snippet (`GET /api/plugins/accessibility-toolkit/snippet`) | Direct Astro `<AccessibilityWidget />` layout injection |

### Why a Native Companion Exists

In EmDash, the `page:fragments` hook (which injects raw HTML fragments into visitor pages) is restricted to trusted host plugins to protect visitor DOM integrity. 

Therefore, sandboxed registry plugins provide:
1. **Administrative Configuration**: Managed directly in EmDash Settings through `admin.pages` (/settings) and `admin.settingsSchema`.
2. **Configuration API**: Accessible by client scripts via `/_emdash/api/plugins/$id/config`.
3. **Embed Options**: Either add the generated embed snippet to your theme layout, or use the optional native companion `<AccessibilityWidget />` (or `<CoddleAccessWidget />`) in Astro themes.

---

## Configuration Settings

The following settings are configurable from the EmDash Admin Settings page:

| Setting Key | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `enabled` | `boolean` | `true` | Toggle the public accessibility widget on or off. |
| `primaryColor` | `string` | `"#1863DC"` | Hex brand accent color for launcher and active highlights. |
| `iconId` | `select` | `"default"` | Launcher icon style (`default`, `accessibility`, `assist`, `wheel`). |
| `iconSize` | `number` | `48` | Diameter of the floating launcher button in pixels (40, 48, 56). |
| `positionDesktop` | `select` | `"bottom-right"` | Screen corner on desktop (`bottom-right`, `bottom-left`, `top-right`, `top-left`). |
| `positionMobile` | `select` | `"bottom-right"` | Screen corner on mobile devices (`bottom-right`, `bottom-left`, `top-right`, `top-left`). |
| `language` | `select` | `"en"` | Initial widget interface language code (12 supported languages). |
| `statementUrl` | `url` | `"/accessibility-statement"` | Organization accessibility statement link. |

---

## Public Routes

The sandboxed plugin exposes three unauthenticated endpoints:

- `GET /_emdash/api/plugins/accessibility-toolkit/config`: Returns active JSON settings for dynamic client-side widget consumption.
- `GET /_emdash/api/plugins/accessibility-toolkit/snippet`: Returns ready-to-use HTML `<script>` tags for your theme templates.
- `GET /_emdash/api/plugins/accessibility-toolkit/status`: Returns plugin health and version telemetry.

---



---

## Production CDN Hosting

The Accessibility Toolkit supports zero-copy frontend asset distribution via a production HTTPS CDN:

- **CDN Provider:** jsdelivr Global CDN (backed by immutable version tag `v1.3.4`)
- **Verified Base URL:** `https://cdn.jsdelivr.net/gh/susheel250/coddle-accessibility@v1.3.4/vendor/coddle-access`
- **Production Script:** `https://cdn.jsdelivr.net/gh/susheel250/coddle-accessibility@v1.3.4/vendor/coddle-access/js/widget.min.js`
  - **MIME Type:** `application/javascript; charset=utf-8`
  - **Subresource Integrity (SRI):** `integrity="sha384-PkHCo9yYYt43CM9mczXrTqkNN0ddgEpZos0hrTEP62/Iox7z6iWI3CfR06lzbWdK"`
  - **CORS:** `access-control-allow-origin: *`
  - **Cache Header:** `cache-control: public, max-age=31536000, s-maxage=31536000, immutable`
- **Production Fonts:**
  - WOFF: `https://cdn.jsdelivr.net/gh/susheel250/coddle-accessibility@v1.3.4/vendor/coddle-access/fonts/OpenDyslexic3-Regular.woff`
  - TTF: `https://cdn.jsdelivr.net/gh/susheel250/coddle-accessibility@v1.3.4/vendor/coddle-access/fonts/OpenDyslexic3-Regular.ttf`

### Zero-Copy Installation Flow
When `cdnBaseUrl` is configured in the plugin settings (or passed via `<AccessibilityWidget cdnSrc="..." />`), fresh EmDash projects do **not** need to manually copy assets into `public/vendor/`. The widget script and fonts are loaded dynamically from the CDN, while preserving an automatic fallback to local vendor assets in case of network unavailability.

## Installation & Theme Setup

### Option 1: Theme Script Embed (Any EmDash Theme)

#### Method A: Self-Hosted Vendor Embed (Recommended Default)
Add the local vendor script to your site layout before the closing `</body>` tag:

```html
<script src="/vendor/coddle-access/js/widget.min.js" async></script>
```

Or use dynamic configuration loaded from the plugin API:

```html
<script>
  fetch('/_emdash/api/plugins/accessibility-toolkit/config')
    .then(r => r.json())
    .then(cfg => {
      if (!cfg.enabled) return;
      window._cyA11yConfig = {
        primaryColor: cfg.primaryColor,
        iconId: cfg.iconId,
        iconSize: cfg.iconSize,
        position: { desktop: cfg.positionDesktop, mobile: cfg.positionMobile },
        statementUrl: cfg.statementUrl,
        language: { default: cfg.language }
      };
      window._cyA11yAssets = {
        fonts: '/vendor/coddle-access/fonts/'
      };
      const s = document.createElement('script');
      s.src = '/vendor/coddle-access/js/widget.min.js';
      s.async = true;
      document.body.appendChild(s);
    });
</script>
```

### Option 2: Native Companion (Astro Themes)

In Astro-based EmDash installations, import the companion component into your base layout:

```astro
---
import AccessibilityWidget from "@/plugins/accessibility/widget/AccessibilityWidget.astro";
---
<html>
  <head>...</head>
  <body>
    <slot />
    <AccessibilityWidget />
  </body>
</html>
```

---

## Security & Privacy

- **No Remote Telemetry**: The sandboxed plugin requests zero network capabilities (`allowedHosts: []`).
- **No Data Harvesting**: Zero visitor analytics or personal data are collected or transmitted.
- **Content Security Policy**: Compatible with strict CSP environments; all styles are scoped in Shadow DOM.

---

## Development & Publishing

```bash
# Validate manifest against schema
npx @emdash-cms/plugin-cli validate

# Run automated tests
npm run test

# Bundle plugin for registry release
npx @emdash-cms/plugin-cli bundle

# Publish to the registry (requires publisher session)
npx @emdash-cms/plugin-cli publish
```

---

## Support & Security Contact

- **Author**: Accessibility Toolkit Contributors
- **Email**: `a11y@emdashcms.com`
- **Security Contact**: `security@emdashcms.com`
- **License**: MIT License &copy; 2026


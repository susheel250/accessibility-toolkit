# Coddle Accessibility Toolkit for EmDash CMS

> A modern, lightweight, fully customizable web accessibility toolkit by **Coddle Technologies** designed to assist users with disabilities and enhance compliance with WCAG 2.2 Level AA and ADA standards across EmDash websites.

[![EmDash Plugin](https://img.shields.io/badge/EmDash-Plugin-blue.svg)](https://emdashcms.com)
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)
[![Version: 1.2.0](https://img.shields.io/badge/Version-1.2.0-indigo.svg)](CHANGELOG.md)

---

## Overview

The **Coddle Accessibility Toolkit** brings comprehensive digital accessibility capabilities to any EmDash CMS site. Built with a privacy-first, zero-privilege sandboxed architecture, it integrates seamlessly into the official EmDash Plugin Registry while guaranteeing zero interference with host layouts, forms, and administrative operations.

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

| Capability / Concern | Sandboxed Registry Plugin (`packages/coddle-access`) | Native Integration (`src/plugins/accessibility`) |
| :--- | :--- | :--- |
| **Execution Environment** | Cloudflare `workerd` sandbox | Node.js host process |
| **Trust Contract** | `capabilities: []`, `allowedHosts: []` (zero-privilege) | Full host process access (`format: "native"`) |
| **Settings UI** | Declarative `admin.settingsSchema` in EmDash Admin | Custom interactive React canvas with live preview |
| **Configuration API** | Public route `GET /api/plugins/coddle-access/config` | Direct SQLite queries on `options` table |
| **DOM Delivery** | Theme embed snippet (`GET /api/plugins/coddle-access/snippet`) | Direct Astro `<CoddleAccessWidget />` layout injection |

### Why a Native Companion Exists

In EmDash, the `page:fragments` hook (which injects raw HTML fragments into visitor pages) is restricted to trusted host plugins to protect visitor DOM integrity. 

Therefore, sandboxed registry plugins provide:
1. **Administrative Configuration**: Managed directly in EmDash Settings through `admin.settingsSchema`.
2. **Configuration API**: Accessible by client scripts via `/api/plugins/coddle-access/config`.
3. **Embed Options**: Either add the generated embed snippet to your theme layout, or use the optional native companion `<CoddleAccessWidget />` in Astro themes.

---

## Configuration Settings

The following settings are configurable from the EmDash Admin Settings page:

| Setting Key | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `enabled` | `boolean` | `true` | Toggle the public Coddle Access widget on or off. |
| `primaryColor` | `string` | `"#1976d2"` | Hex brand accent color for launcher and active highlights. |
| `iconId` | `select` | `"person"` | Launcher icon style (`person`, `wheelchair`, `universal-access`). |
| `iconSize` | `number` | `44` | Diameter of the floating launcher button in pixels (24–80 px). |
| `positionDesktop` | `select` | `"bottom-right"` | Screen corner on desktop (`bottom-right`, `bottom-left`, `top-right`, `top-left`). |
| `positionMobile` | `select` | `"bottom-right"` | Screen corner on mobile devices (`bottom-right`, `bottom-left`, `top-right`, `top-left`). |
| `language` | `string` | `"en"` | Initial widget interface language code (`en`, `es`, `fr`, etc.). |
| `statementUrl` | `url` | `"/accessibility-statement"` | Organization accessibility statement link. |

---

## Public Routes

The sandboxed plugin exposes three unauthenticated endpoints:

- `GET /api/plugins/coddle-access/config`: Returns active JSON settings for dynamic client-side widget consumption.
- `GET /api/plugins/coddle-access/snippet`: Returns ready-to-use HTML `<script>` tags for your theme templates.
- `GET /api/plugins/coddle-access/status`: Returns plugin health and version telemetry.

---

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
  fetch('/api/plugins/coddle-access/config')
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

#### Method B: Public CDN Embed (jsDelivr / npm)
When using the public CDN release of `@coddletech/access-widget`, include the script with an automatic local fallback:

```html
<script>
  window._cyA11yAssets = {
    fonts: 'https://cdn.jsdelivr.net/npm/@coddletech/access-widget@1.2.0/fonts/'
  };
</script>
<script 
  src="https://cdn.jsdelivr.net/npm/@coddletech/access-widget@1.2.0/js/widget.min.js" 
  onerror="this.onerror=null;this.src='/vendor/coddle-access/js/widget.min.js';" 
  async>
</script>
```

### Option 2: Native Companion (Astro Themes)

In Astro-based EmDash installations, import the companion component into your base layout:

```astro
---
import CoddleAccessWidget from "@/plugins/accessibility/widget/CoddleAccessWidget.astro";
---
<html>
  <head>...</head>
  <body>
    <slot />
    <CoddleAccessWidget />
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

- **Author**: Coddle Technologies ([https://coddletech.com](https://coddletech.com))
- **Email**: `info@coddletech.com`
- **Security Contact**: `security@coddletech.com`
- **License**: MIT License &copy; 2026 Coddle Technologies

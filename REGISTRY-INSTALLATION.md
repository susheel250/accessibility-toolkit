# Accessibility Toolkit: EmDash Plugin Registry Installation & Integration Guide

> A practical developer guide for installing the **Accessibility Toolkit** from the EmDash Plugin Registry, configuring administrative settings, and displaying the WCAG 2.2 Level AA accessibility widget on public website pages.

---

## Table of Contents

1. [Overview and Prerequisites](#1-overview-and-prerequisites)
2. [EmDash Registry Architecture & Sandbox Limitations](#2-emdash-registry-architecture--sandbox-limitations)
3. [Required Files and Asset Distribution](#3-required-files-and-asset-distribution)
4. [Registry Installation and Plugin Activation](#4-registry-installation-and-plugin-activation)
5. [Copying Vendor Assets to the Host `public/` Directory](#5-copying-vendor-assets-to-the-host-public-directory)
6. [Admin Configuration](#6-admin-configuration)
7. [Astro Layout Integration](#7-astro-layout-integration)
8. [Alternative HTML Integration](#8-alternative-html-integration)
9. [CDN Configuration](#9-cdn-configuration)
10. [Runtime Settings Flow and API Endpoints](#10-runtime-settings-flow-and-api-endpoints)
11. [Desktop and Mobile Verification](#11-desktop-and-mobile-verification)
12. [Troubleshooting](#12-troubleshooting)
13. [Clean Removal and Uninstallation](#13-clean-removal-and-uninstallation)
14. [Maintainer & Local Development Reference](#14-maintainer--local-development-reference)

---

## 1. Overview and Prerequisites

The **Accessibility Toolkit** is an EmDash Registry plugin that provides website visitors with an interactive accessibility toolbar designed to assist with **WCAG 2.2 Level AA** and **ADA Section 508** accessibility needs across websites.

> [!NOTE]
> **Accessibility Scope & Standards Notice:**  
> The Accessibility Toolkit offers user-driven client-side assistive adjustments (such as typography scaling, high-contrast modes, dyslexia-friendly fonts, and reading aids). While these tools assist individuals with disabilities and improve overall site accessibility, installing a widget does not automatically guarantee full legal or technical WCAG or ADA compliance for an entire website. Site owners remain responsible for underlying semantic HTML, ARIA landmarks, keyboard tab order, and content contrast.

### Key Capabilities
- **One-Click Accessibility Profiles**: Presets for Epilepsy Safe Mode, Visually Impaired, Cognitive Disability, and ADHD Friendly modes.
- **Content & Typography Controls**: Font scaling up to 200%, Dyslexia-friendly typeface (`OpenDyslexic3`), letter spacing, line height, font weight adjustments, title highlighting, link highlighting, and multi-state text alignment cyclers.
- **Color & Contrast Filters**: Dark Contrast, Light Contrast, High Contrast, High/Low Saturation, and Monochrome visual modes.
- **Navigation & Reading Aids**: Reading Guide ruler, Large Cursor, Animation Pause, Screen Reader / Text-to-Speech page reader, and Sound Muting.
- **Isolated Shadow DOM**: Complete stylesheet and script encapsulation prevents CSS leaks or collisions with your theme.
- **Keyboard Navigation**: Accessible keyboard navigation with global `Option+A` / `Alt+A` shortcut.
- **Persistent Preferences**: Visitor preferences are saved automatically in the visitor's browser `localStorage`.

### Package Registry Metadata
- **Package Slug**: `accessibility-toolkit`
- **Publisher Handle / DID**: `@susheel-k.bsky.social` (`did:plc:pcngdskjcwsettdojdho2dtr`)
- **Package Version**: `1.3.2`
- **Registry Publication Status**: Currently unpublished / unlisted from the public registry (available via private/local testing and tarball package archive)
- **Runtime Environment**: EmDash Sandboxed Plugin (`workerd` isolation) + Astro Theme Companion

### Prerequisites
Before installing the plugin, ensure your environment meets the following requirements:
- **Node.js**: Version `18.17.0` or higher (Node 20+ recommended).
- **EmDash Host Website**: An active EmDash CMS project configured with Astro (using `@astrojs/node`, `emdash/astro`, and `@astrojs/react` for admin previews).
- **Administrative Access**: Access to your website's EmDash Admin panel at `/_emdash/admin`.
- **Package Manager**: `npm`, `pnpm`, or `yarn`.

---

## 2. EmDash Registry Architecture & Sandbox Limitations

### Security Isolation in the `workerd` Sandbox
EmDash plugins installed from the Plugin Registry execute within a secure V8 isolate sandbox powered by Cloudflare's `workerd` runtime. By default, registry plugins operate with a zero-privilege security contract (`"capabilities": []` in [emdash-plugin.jsonc](emdash-plugin.jsonc)).

### Why Registry Installation Alone Does Not Display the Widget
While installing the plugin activates backend routes and registers the administrative settings panel, **the floating accessibility widget will not appear on public website pages automatically**.

> [!IMPORTANT]
> **Understanding the `page:fragments` Security Enforcement:**
> The Accessibility Toolkit defines a `page:fragments` hook in its sandboxed entrypoint ([src/plugin.ts](src/plugin.ts)). 
> 
> Under the EmDash Plugin Registry trust model, injecting arbitrary HTML fragments into visitor-facing pages requires the elevated `hooks.page-fragments:register` capability.
> 
> When running as a standard sandboxed registry plugin without this capability, the EmDash runtime intentionally skips automatic script injection:
> ```
> [hooks] Plugin "accessibility-toolkit" declares page:fragments hook without hooks.page-fragments:register capability — skipping
> ```
> This behavior protects host websites from unauthorized client-side script injection. Consequently, rendering the frontend toolbar requires either adding the companion Astro component (`<AccessibilityWidget />`) to your theme layout or including the HTML theme snippet.

---

## 3. Required Files and Asset Distribution

### Required Distribution Files
The frontend widget relies on production client-side bundles and font assets included with the package:

| Asset File Path | Approximate Size | Role & Purpose |
|---|---|---|
| `vendor/coddle-access/js/widget.min.js` | ~365 kB | Production compiled accessibility engine and Shadow DOM toolbar interface. |
| `vendor/coddle-access/js/widget.js` | ~1.1 MB | Unminified source bundle for local debugging and inspection. |
| `vendor/coddle-access/fonts/OpenDyslexic3-Regular.woff` | ~86 kB | Web Open Font Format (WOFF) typeface for dyslexia reading mode. |
| `vendor/coddle-access/fonts/OpenDyslexic3-Regular.ttf` | ~238 kB | TrueType font fallback for older browser environments. |

> [!NOTE]
> **Preserved Legacy Directory Path:**  
> The directory name `vendor/coddle-access/` is a legacy asset directory path preserved to ensure backwards compatibility with the underlying widget engine and existing deployments. Host websites must copy and maintain this directory structure under `public/vendor/coddle-access/`.

### Package Exports Mapping
The package exports defined in [package.json](package.json) provide multiple entrypoints for different integration contexts:

| Export Specifier | Resolved File | Integration Context |
|---|---|---|
| `accessibility-toolkit` | `./dist/index.mjs` | Plugin descriptor imported into `astro.config.mjs`. |
| `accessibility-toolkit/accessibility-widget` | `./components/AccessibilityWidget.astro` | Primary Astro companion component (recommended). |
| `accessibility-toolkit/widget` | `./components/AccessibilityWidget.astro` | Shorthand alias for the Astro companion component. |
| `accessibility-toolkit/coddle-access-widget` | `./components/CoddleAccessWidget.astro` | Legacy backward-compatibility alias wrapper. |
| `accessibility-toolkit/admin` | `./admin/admin.tsx` | React admin settings canvas with interactive preview. |
| `accessibility-toolkit/sandbox` | `./dist/plugin.mjs` | Sandboxed entrypoint for the EmDash plugin runtime. |

---

## 4. Registry Installation and Plugin Activation

### Registry Status Notice
The Accessibility Toolkit package identifier on the EmDash Plugin Registry is `@susheel-k.bsky.social/accessibility-toolkit` (publisher DID: `did:plc:pcngdskjcwsettdojdho2dtr`).

> [!IMPORTANT]
> **Publication & Installation Mode Notice:**  
> The Accessibility Toolkit is currently **unlisted / unpublished from the public registry**. Consequently, public registry resolution (`plugins.emdashcms.com`) is not active.
> 
> Use **Private / Local Testing Installation** (via a local checkout path or a packaged tarball archive `.tgz`) to install and evaluate the plugin in your development environment. Public registry installation commands are documented for reference when public registry distribution is re-enabled.

### Step 4.1: Install the Package
In your EmDash website root directory (`/path/to/your-emdash-site`), install the package:

```bash
# Method A: Local testing from a repository checkout (Private / Development)
npm install /path/to/accessibility-toolkit-repository

# Method B: Packaged tarball installation (Private / Staging)
npm install /path/to/accessibility-toolkit-1.3.2.tgz

# Method C: Standard registry installation (Reference only; active when published publicly)
npm install accessibility-toolkit
```

### Step 4.2: Register the Plugin in Astro Configuration
Add the plugin descriptor to the `plugins` array in your site's `astro.config.mjs`:

```javascript
// astro.config.mjs
import { defineConfig } from "astro/config";
import node from "@astrojs/node";
import react from "@astrojs/react";
import emdash from "emdash/astro";
import accessibilityToolkit from "accessibility-toolkit";

export default defineConfig({
  output: "server",
  adapter: node({ mode: "standalone" }),
  integrations: [
    react(),
    emdash({
      plugins: [
        accessibilityToolkit,
      ],
    }),
  ],
});
```

### Step 4.3: Activate the Plugin
1. Start your application (`npm run dev` or `npm run build && npm start`).
2. Log in to the EmDash Admin at `/_emdash/admin`.
3. Navigate to **Plugins** in the administrative sidebar.
4. Locate **Accessibility Toolkit** and verify that its status is **Active**. If deactivated, click **Activate**.

---

## 5. Copying Vendor Assets to the Host `public/` Directory

### Why Static Assets Must Be Copied to the Host
Astro web servers only serve static assets from the host application's `public/` folder. Files installed inside `node_modules/accessibility-toolkit/vendor/` are not accessible over HTTP.

If a browser requests `/vendor/coddle-access/js/widget.min.js` and the file is not in your host's `public/` directory, the server responds with **404 Not Found**.

### Step 5.1: Copy Vendor Assets
From your website root directory (`/path/to/your-emdash-site`), ensure the destination vendor directory exists and copy the bundled vendor assets into `public/vendor/`:

```bash
# Ensure target destination directory exists
mkdir -p public/vendor

# Copy the vendor assets directory (widget bundle and fonts) into public/vendor/
cp -R node_modules/accessibility-toolkit/vendor/coddle-access public/vendor/
```

### Step 5.2: Verify Destination Structure
Confirm the files exist at these exact paths in your host repository:

```
your-emdash-site/
└── public/
    └── vendor/
        └── coddle-access/
            ├── js/
            │   ├── widget.min.js   <-- Essential (365 kB minified accessibility widget bundle)
            │   └── widget.js       <-- Unminified source bundle for inspection
            └── fonts/
                ├── OpenDyslexic3-Regular.woff  <-- Essential (86 kB web font)
                └── OpenDyslexic3-Regular.ttf   <-- Essential (238 kB TrueType font)
```

### Recommended: Automate in `package.json` for Clean Builds & CI/CD
To ensure vendor assets are reliably populated across clean checkouts, `npm install` runs, dependency updates, and continuous integration (CI/CD) pipelines, configure a safe `postinstall` script in your host project's `package.json` that ensures parent directory creation before copying:

```json
{
  "scripts": {
    "postinstall": "mkdir -p public/vendor && cp -R node_modules/accessibility-toolkit/vendor/coddle-access public/vendor/"
  }
}
```

> [!TIP]
> **Cross-Platform / CI Note:** For Windows-compatible cross-platform environments where `cp -R` may not be present in cmd.exe, tools like `copyfiles` or `shx` can also be used (e.g. `"postinstall": "shx mkdir -p public/vendor && shx cp -r node_modules/accessibility-toolkit/vendor/coddle-access public/vendor/"`).

---

## 6. Admin Configuration

Once activated, configure the widget settings to match your brand and language preferences.

### Accessing Admin Settings
1. In the EmDash Admin, navigate to **Settings** > **Accessibility Toolkit** (URL: `/_emdash/admin/plugins/accessibility-toolkit/settings`).
2. The administration panel offers both a native **Block Kit** interface and an interactive **React canvas** with real-time live preview.

### Available Settings Reference

| Setting Key | Type | Default | Description |
|---|---|---|---|
| **Enable Accessibility Widget** (`enabled`) | `boolean` | `true` | Master switch to show or hide the widget on visitor pages. |
| **Widget Language** (`language`) | `select` | `"en"` | Default interface language across 12 supported locales (`en`, `es`, `fr`, `de`, `it`, `pt`, `nl`, `pl`, `da`, `sv`, `no`, `fi`). |
| **Widget Colour** (`primaryColor`) | `string` | `"#1863DC"` | Hex accent color for the floating launcher button and active toolbar states. Presets include Ocean Blue (`#1863DC`), Deep Ocean Blue (`#0369A1`), Teal (`#0D9488`), Indigo (`#4F46E5`), Emerald (`#16A34A`), and Slate Dark (`#0F172A`). |
| **Launcher Icon** (`iconId`) | `select` | `"default"` | Icon displayed inside the button: Default (`default`), Universal Access (`accessibility`), Assist / Help (`assist`), Wheelchair (`wheel`). |
| **Button Size** (`iconSize`) | `number` | `48` | Diameter of the floating launcher button in pixels: 40 (Small), 48 (Medium), 56 (Large). |
| **Desktop Screen Position** (`positionDesktop`) | `select` | `"bottom-right"` | Screen quadrant on desktop displays (`bottom-right`, `bottom-left`, `top-right`, `top-left`). |
| **Mobile Screen Position** (`positionMobile`) | `select` | `"bottom-right"` | Screen quadrant on mobile viewports (`bottom-right`, `bottom-left`, `top-right`, `top-left`). |
| **Accessibility Statement URL** (`statementUrl`) | `string` | `"/accessibility-statement"` | Link to your organization's formal accessibility compliance policy. |

3. Click **Save Settings**. Settings are saved to the EmDash database and immediately exposed through the public endpoint `GET /_emdash/api/plugins/accessibility-toolkit/config`.

---

## 7. Astro Layout Integration

### Step 7.1: Import the Component into Your Shared Layout
In Astro themes, open your primary layout component (e.g., `src/layouts/Layout.astro` or `src/layouts/BaseLayout.astro`) and add the companion widget before the closing `</body>` tag:

```astro
---
// src/layouts/Layout.astro (or BaseLayout.astro)
import AccessibilityWidget from "accessibility-toolkit/accessibility-widget";

interface Props {
  title?: string;
  description?: string;
}

const { title = "Website", description = "" } = Astro.props;
---

<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>{title}</title>
  </head>
  <body>
    <!-- Main page content -->
    <slot />

    <!-- 
      Accessibility Toolkit Floating Widget Companion:
      Automatically synchronizes with active settings saved in EmDash Admin.
    -->
    <AccessibilityWidget />
  </body>
</html>
```

### Supported Package Export Specifiers
The package provides multiple verified export aliases in [package.json](package.json):
- `import AccessibilityWidget from "accessibility-toolkit/accessibility-widget";` (Recommended)
- `import AccessibilityWidget from "accessibility-toolkit/widget";` (Shorthand alias)
- `import CoddleAccessWidget from "accessibility-toolkit/coddle-access-widget";` (Legacy backward-compatibility export retained for existing themes; aliases to `AccessibilityWidget`)

### Optional Component Props Reference
By default, `<AccessibilityWidget />` fetches active configuration from the EmDash API at runtime. You can also override any setting directly via component props:

| Prop | Type | Default | Purpose |
|---|---|---|---|
| `pluginId` | `string` | `""` | Explicit plugin ID if using a custom registry installation prefix. |
| `enabled` | `boolean` | `true` | Local enable/disable toggle. |
| `language` | `string` | `"en"` | Force interface language code (e.g. `"es"`, `"fr"`). |
| `primaryColor` | `string` | `"#1863DC"` | Force brand accent color (e.g. `"#0369A1"`). |
| `iconId` | `"default" | "accessibility" | "assist" | "wheel"` | `"default"` | Force launcher button icon. |
| `iconSize` | `number` | `48` | Force launcher diameter in pixels (`40`, `48`, `56`). |
| `positionDesktop` | `"bottom-right" | "bottom-left" | "top-right" | "top-left"` | `"bottom-right"` | Force desktop placement corner. |
| `positionMobile` | `"bottom-right" | "bottom-left" | "top-right" | "top-left"` | `"bottom-right"` | Force mobile placement corner. |
| `statementUrl` | `string` | `""` | Force custom accessibility statement URL. |
| `scriptSrc` | `string` | `"/vendor/coddle-access/js/widget.min.js"` | URL from which the browser loads the widget script. |
| `cdnSrc` | `string` | `""` | Remote fallback URL if local `scriptSrc` fails or 404s. |
| `fontsUrl` | `string` | `"/vendor/coddle-access/fonts/"` | Directory containing OpenDyslexic web fonts. |
| `companyName` | `string` | `""` | Optional organization name for the accessibility statement module. |
| `website` | `string` | `""` | Optional website URL for the accessibility statement module. |

---

## 8. Alternative HTML Integration

If your EmDash site uses plain HTML or custom non-Astro layouts, retrieve the ready-to-use embed snippet from the plugin API:

```
GET /_emdash/api/plugins/accessibility-toolkit/snippet
```

Add the returned dynamic loader script before the closing `</body>` tag:

```html
<script>
(function() {
  fetch('/_emdash/api/plugins/accessibility-toolkit/config')
    .then(function(r) { return r.json(); })
    .then(function(res) {
      var cfg = (res && res.data) || res;
      if (!cfg || !cfg.enabled) return;
      window._cyA11yConfig = {
        primaryColor: cfg.primaryColor || '#1863DC',
        iconId: cfg.iconId || 'default',
        iconSize: Number(cfg.iconSize) || 48,
        position: { desktop: cfg.positionDesktop || 'bottom-right', mobile: cfg.positionMobile || 'bottom-right' },
        statementUrl: cfg.statementUrl || '',
        language: { default: cfg.language || 'en' }
      };
      window._cyA11yAssets = { fonts: '/vendor/coddle-access/fonts/' };
      var s = document.createElement('script');
      s.id = 'accessibility-toolkit-script';
      s.src = '/vendor/coddle-access/js/widget.min.js';
      s.async = true;
      (document.body || document.head).appendChild(s);
    });
})();
</script>
```

---

## 9. CDN Configuration

### Remote CDN Hosting Architecture
If you prefer to host static assets on a remote Content Delivery Network (CDN) or external storage bucket (such as AWS CloudFront/S3, Cloudflare R2, or a dedicated asset domain) rather than copying them locally to `public/vendor/`, configure `<AccessibilityWidget />` using the `scriptSrc` and `fontsUrl` props.

> [!WARNING]
> **CDN Availability & Verification Notice:**  
> Public npm-mirrored CDN endpoints (such as `cdn.jsdelivr.net/npm/accessibility-toolkit@1.3.2/...`) are **unverified illustrative examples** and are **not currently active or supported** out of the box because `accessibility-toolkit@1.3.2` is not distributed on the public npm registry.  
> 
> Teams using remote CDN hosting must first upload the vendor files (`vendor/coddle-access/`) to their own verified CDN or object storage service before referencing those URLs.

### Custom CDN Configuration Example
To load assets from your team's verified custom CDN or asset storage:

```astro
<AccessibilityWidget
  scriptSrc="https://cdn.example.com/accessibility-toolkit/vendor/coddle-access/js/widget.min.js"
  fontsUrl="https://cdn.example.com/accessibility-toolkit/vendor/coddle-access/fonts/"
/>
```

*(Note: Replace `https://cdn.example.com/...` with your verified asset host domain.)*

### Automatic Fallback Mode (`cdnSrc`)
You can also provide a remote fallback URL using the `cdnSrc` prop:

```astro
<AccessibilityWidget
  cdnSrc="https://cdn.example.com/accessibility-toolkit/vendor/coddle-access/js/widget.min.js"
/>
```
When `cdnSrc` is provided, the component first attempts local loading from `scriptSrc` (defaulting to `/vendor/coddle-access/js/widget.min.js`) and automatically falls back to the specified remote `cdnSrc` URL if the local script fails to load or returns a 404.

---

## 10. Runtime Settings Flow and API Endpoints

### Data Flow Architecture
The plugin uses a clean decoupled architecture between settings persistence, API delivery, and frontend rendering:

1. **Administration**: Site administrator modifies settings in EmDash Admin (`/_emdash/admin/plugins/accessibility-toolkit/settings`).
2. **Persistence**: Submission posts to `POST /_emdash/api/plugins/accessibility-toolkit/admin`, which validates inputs and writes them to the EmDash database.
3. **API Delivery**: The plugin exposes active settings through the public JSON endpoint `GET /_emdash/api/plugins/accessibility-toolkit/config`.
4. **Widget Initialization**: On visitor pages, `<AccessibilityWidget />` fetches the configuration, sets `window._cyA11yConfig` and `window._cyA11yAssets`, and dynamically loads `widget.min.js`.
5. **Visitor Persistence**: Visitor-selected accessibility adjustments (such as font scaling or contrast filters) are saved in the visitor's browser `localStorage`.

### Available API Endpoints

| Method | Endpoint | Access | Response Format | Purpose |
|---|---|---|---|---|
| `GET` | `/_emdash/api/plugins/accessibility-toolkit/config` | Public | JSON (`Cache-Control: no-store, private`) | Returns current widget configuration. |
| `GET` | `/_emdash/api/plugins/accessibility-toolkit/snippet` | Public | JSON (`Cache-Control: no-store, private`) | Returns ready-to-use HTML and script embed snippets. |
| `GET` | `/_emdash/api/plugins/accessibility-toolkit/status` | Public | JSON (`Cache-Control: no-store, private`) | Health check returning plugin status, version, and metadata. |
| `POST` | `/_emdash/api/plugins/accessibility-toolkit/admin` | Admin | JSON | Validates and persists configuration updates from the admin form. |

### Example API Response (`config`)
```json
{
  "success": true,
  "data": {
    "enabled": true,
    "language": "en",
    "primaryColor": "#1863DC",
    "iconId": "default",
    "iconSize": 48,
    "positionDesktop": "bottom-right",
    "positionMobile": "bottom-right",
    "statementUrl": "/accessibility-statement",
    "version": "1.3.2",
    "toolkit": "Accessibility Toolkit",
    "publisher": "EmDash Community"
  }
}
```

---

## 11. Desktop and Mobile Verification

Perform these verification checks to confirm that the plugin is working correctly:

### Step 11.1: Command-Line HTTP Verification
Verify that your server delivers HTML, scripts, fonts, and API responses:

```bash
# 1. Verify frontend page renders HTML (HTTP 200)
curl -sI http://localhost:4321/ | grep -E "HTTP/|content-type:"

# 2. Verify widget JavaScript is served without 404 (HTTP 200, ~365 kB)
curl -sI http://localhost:4321/vendor/coddle-access/js/widget.min.js | grep -E "HTTP/|content-length:"

# 3. Verify OpenDyslexic font is served without 404 (HTTP 200, ~86 kB)
curl -sI http://localhost:4321/vendor/coddle-access/fonts/OpenDyslexic3-Regular.woff | grep -E "HTTP/|content-length:"

# 4. Verify settings API endpoint returns JSON
curl -s http://localhost:4321/_emdash/api/plugins/accessibility-toolkit/config
```

### Step 11.2: Desktop Browser Verification
1. Open your website in Chrome, Firefox, Safari, or Edge.
2. Verify that the floating circular launcher button appears in the configured screen quadrant (default: bottom-right).
3. Press **Alt + A** (or **Option + A** on macOS):
   - The accessibility menu modal should open centered on the screen.
4. Test functional controls:
   - **Font Size (+)**: Click to scale body text up to 200%.
   - **Dyslexia Font**: Click to toggle the `OpenDyslexic3` typeface.
   - **Color Modes**: Click **Dark Contrast**, **High Contrast**, or **Monochrome** to verify visual adjustments.
   - **Reading Guide**: Move cursor across the screen and verify the horizontal tracking focus bar.
   - **Reset**: Click **Reset all accessibility settings to default** to restore normal styles.

### Step 11.3: Mobile Device Verification
1. Open DevTools and switch to responsive device emulation (viewport width `< 480px`).
2. Verify:
   - The launcher button remains visible with a minimum `40px` touch target.
   - Opening the menu presents a responsive drawer without horizontal scroll leakage.
   - Pinch-zoom and touch interactions remain smooth.

---

## 12. Troubleshooting

### Problem 1: Floating launcher button does not appear on visitor pages
- **Check Master Toggle:** In EmDash Admin > **Settings** > **Accessibility Toolkit**, verify **Enable Accessibility Widget** is checked. If unchecked, the API returns `"enabled": false` and the loader halts immediately.
- **Check Layout Inclusion:** Confirm that `<AccessibilityWidget />` is imported and included inside the active layout file for that route.
- **Check DevTools Console:** Open browser console (F12) and inspect for network errors or unhandled script exceptions.

### Problem 2: Browser console shows `GET /vendor/coddle-access/js/widget.min.js 404 (Not Found)`
- **Cause:** Vendor assets have not been copied into your host site's `public/` folder.
- **Solution:** Run:
  ```bash
  mkdir -p public/vendor
  cp -R node_modules/accessibility-toolkit/vendor/coddle-access public/vendor/
  ```
  Ensure `public/vendor/coddle-access/js/widget.min.js` exists.

### Problem 3: Dyslexia font does not render or console shows font 404
- **Cause:** Font files are missing from `public/vendor/coddle-access/fonts/`.
- **Solution:** Verify the font assets exist in your host directory:
  ```bash
  ls -lh public/vendor/coddle-access/fonts/
  # Expected: OpenDyslexic3-Regular.woff (86 kB) and OpenDyslexic3-Regular.ttf (238 kB)
  ```

### Problem 4: Settings saved in Admin do not update on the frontend
- **Cause:** Browser caching or reverse-proxy caching of the configuration endpoint, or browser `localStorage` overriding defaults.
- **Solution:**
  1. The API endpoint returns `Cache-Control: no-store, private`. If using Cloudflare or Nginx, bypass caching for `/_emdash/api/*`.
  2. Clear browser `localStorage` for your site domain; the widget preserves visitor adjustments locally once selected.

### Problem 5: Server log: `[hooks] Plugin declares page:fragments hook without capability — skipping`
- **Explanation:** This is expected and normal for sandboxed registry plugins under EmDash security enforcement. It confirms that the Astro companion component (`<AccessibilityWidget />`) is required to render the frontend widget.

---

## 13. Clean Removal and Uninstallation

### Updating to Future Releases
When updating the package:
1. Update the dependency in `package.json`:
   ```bash
   npm update accessibility-toolkit
   ```
2. Re-synchronize static vendor assets:
   ```bash
   cp -R node_modules/accessibility-toolkit/vendor/coddle-access public/vendor/
   ```
3. Restart your server and verify changes in the admin panel.

### Clean Removal / Uninstallation
To completely remove the Accessibility Toolkit without leaving orphaned files:
1. **Remove Layout Component:** Remove `<AccessibilityWidget />` and its import statement from your layout files (`src/layouts/*.astro`).
2. **Remove Static Assets:**
   ```bash
   rm -rf public/vendor/coddle-access
   ```
3. **Remove from Astro Configuration:** Remove `accessibilityToolkit` from `plugins` in `astro.config.mjs`.
4. **Uninstall npm Package:**
   ```bash
   npm uninstall accessibility-toolkit
   ```
5. **Deactivate in EmDash Admin:** Navigate to **Plugins** in the EmDash Admin and click **Deactivate** / **Uninstall** to clean up database state.

---

## 14. Maintainer & Local Development Reference

This section is intended for contributors developing and validating the plugin repository itself.

### Maintainer Workspace Environment
- **Local Repository Path:** `/Applications/XAMPP/xamppfiles/htdocs/coddle-accessibility-plugin`
- **Node.js Environment:** Node 18+ / npm 11+

### Key Repository Files
- [package.json](package.json): Package exports, files array, dependencies, and build scripts.
- [emdash-plugin.jsonc](emdash-plugin.jsonc): Plugin manifest, settings schema, capabilities contract, and author metadata.
- [src/plugin.ts](src/plugin.ts): Sandboxed plugin implementation, lifecycle hooks, API routes, and Block Kit admin builder.
- [admin/admin.tsx](admin/admin.tsx): React administrative settings component with live preview canvas.
- [components/AccessibilityWidget.astro](components/AccessibilityWidget.astro): Primary Astro companion component.
- [components/CoddleAccessWidget.astro](components/CoddleAccessWidget.astro): Legacy backward-compatibility wrapper.
- [tests/plugin.test.mjs](tests/plugin.test.mjs): Test suite verifying manifests, schemas, routes, Block Kit, hooks, and Astro props.

### Maintainer Build & Validation Commands
Run these commands from the repository root:

```bash
# 1. Typecheck TypeScript sources
npm run typecheck

# 2. Run automated test suite (15 unit tests)
npm test

# 3. Validate plugin manifest against EmDash schema
npm run validate

# 4. Build distribution artifacts into dist/
npm run build

# 5. Verify packaging contents and exclusions
npm pack --dry-run
```

### Testing with the Isolated Test Instance
The repository contains a minimal Astro + EmDash test instance in `test-instance/`:

```bash
# Build the test instance
npx astro build --root test-instance

# Run the test instance server on port 4322
PORT=4322 node test-instance/dist/server/entry.mjs
```

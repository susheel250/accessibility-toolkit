# Accessibility Toolkit — Complete Installation & Enablement Guide

The **Accessibility Toolkit** (`v1.3.6`) provides an accessible, responsive, and lightweight accessibility toolbar for EmDash CMS websites, designed to support **WCAG 2.2 Level AA** and **ADA Section 508** compliance.

---

## 1. Prerequisites

Before installing the Accessibility Toolkit, ensure your environment meets the following requirements:
- **EmDash CMS**: An existing EmDash website (Astro 5.x / `@emdash-cms/*`).
- **Node.js**: Version 18.0.0 or higher.
- **Admin Access**: Administrative credentials to your site's EmDash Admin panel (`/_emdash/admin`).
- **Layout Access**: Ability to edit your project's base Astro layout file (`src/layouts/Base.astro` or equivalent).

---

## 2. Registry Installation

Install the package directly into your EmDash instance:

### Option A: Via EmDash Admin UI (Recommended)
1. Log in to your EmDash Admin panel (`/_emdash/admin`).
2. In the navigation sidebar, click **Plugins** > **Registry** (`/_emdash/admin/plugins/registry`).
3. In the search bar, type **Accessibility Toolkit**.
4. On the Accessibility Toolkit card, click **Install**.
5. Confirm the installation modal. EmDash downloads the signed package blob and registers the plugin.

### Option B: Via EmDash CLI
If you manage your project from the terminal, install the plugin using the EmDash CLI:
```bash
npx emdash plugins add accessibility-toolkit
```

---

## 3. Plugin Activation

1. Once installed, navigate to **Plugins** > **Plugins Manager** (`/_emdash/admin/plugins-manager`).
2. Verify that **Accessibility Toolkit** displays an **Active** badge.
3. The plugin is now provisioned inside EmDash's secure `workerd` isolate sandbox (`"capabilities": []`).

> [!IMPORTANT]
> **Why activation alone does not display the frontend widget:**  
> In EmDash CMS, plugins installed from the Registry run inside a sandboxed worker isolate with no direct DOM write access. The `page:fragments` hook is strictly restricted to trusted host plugins (`node_modules/emdash/src/plugins/sandbox/proxy.ts:70`). This prevents untrusted third-party code from altering visitor HTML. Therefore, a simple one-time theme layout integration is required (see [Section 5](#5-frontend-integration)).

---

## 4. Configuration (Admin Settings)

You can customize the widget's appearance directly in EmDash Admin:

1. In EmDash Admin, navigate to **Plugins** (`/_emdash/admin/plugins-manager`).
2. Click **Settings** on the Accessibility Toolkit card, or navigate directly to:  
   `/_emdash/admin/plugins/{pluginId}/settings`  
   *(The `{pluginId}` is assigned at install time, e.g. `r_rznxjv6huupd4i7d`)*.
3. The following settings are available:

| Setting Field | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| **Enable Accessibility Widget** | Boolean | `true` | Master toggle to enable or disable the widget. |
| **Widget Language** | Select | `English (en)` | Default interface language (12 supported languages). |
| **Widget Colour** | String | `#1863DC` | Brand accent color for launcher button and active focus outlines. |
| **Launcher Icon** | Select | `Default` | Icon graphic (`default`, `accessibility`, `assist`, `wheel`). |
| **Button Size (px)** | Number | `48` | Launcher button diameter (40 = Small, 48 = Medium, 56 = Large). |
| **Desktop Position** | Select | `bottom-right` | Corner placement on desktop (`bottom-right`, `bottom-left`, `top-right`, `top-left`). |
| **Mobile Position** | Select | `bottom-right` | Corner placement on mobile devices. |
| **Accessibility Statement URL** | URL | `/accessibility-statement` | Path or URL to your site's accessibility statement. |
| **CDN Base URL** | URL | `https://cdn.jsdelivr.net/...` | Asset delivery base URL. Set to `local` for self-hosted assets. |

4. Click **Save Changes**.

### Standalone Mode vs. Admin Settings Synchronization

| Feature / Behavior | Standalone Mode (Zero Config) | Admin Settings Synchronization (`pluginId`) |
| :--- | :--- | :--- |
| **Prerequisites** | None (zero configuration, zero IDs) | Assigned Registry ID (e.g. `r_rznxjv6huupd4i7d`) |
| **Configuration Source** | Client-side defaults or layout props | Dynamic SQLite settings stored via EmDash Admin |
| **Network Requests** | **0 requests** to EmDash backend API | **1 lightweight `fetch()`** on initial page load |
| **Admin Enable/Disable Toggle** | **No effect** (browser never queries database) | **Respected immediately** (`enabled: false` halts loader) |
| **Colors, Position & Statement** | Static defaults or layout props | Synced live from Admin settings form |
| **Offline / API Downtime** | **100% immune** (no API dependency) | Gracefully falls back to standalone CDN defaults |
| **How to Disable Widget** | Set `<AccessibilityWidget enabled={false} />` or remove snippet | Set toggle in Admin (`/_emdash/admin/plugins/{id}/settings`) |

> [!NOTE]
> In standalone mode, toggling **Enable Accessibility Widget** to `false` in EmDash Admin will NOT hide the widget from frontend visitors because the browser never queries the database. If you want the admin toggle to control the frontend, you must pass your `pluginId`.

---

## 5. Frontend Integration

Add the widget to your base layout file (`src/layouts/Base.astro` or equivalent) immediately before the closing `</body>` tag:

### Option A: Standalone Inline Snippet (Zero Dependencies, Recommended)
Copy and paste this snippet directly into `src/layouts/Base.astro`:

```html
<!-- Accessibility Toolkit v1.3.6 — Standalone Loader -->
<script is:inline id="accessibility-toolkit-loader">
(function() {
  if (window.__accessibility_toolkit_initialized) return;
  window.__accessibility_toolkit_initialized = true;

  var cdn = 'https://cdn.jsdelivr.net/gh/susheel250/accessibility-toolkit@v1.3.6/vendor/accessibility-toolkit';
  window._cyA11yConfig = {
    primaryColor: '#1863DC',
    position: { desktop: 'bottom-right', mobile: 'bottom-right' },
    label: 'Accessibility menu'
  };
  window._cyA11yAssets = { fonts: cdn + '/fonts/' };

  var s = document.createElement('script');
  s.id = 'accessibility-toolkit-script';
  s.src = cdn + '/js/widget.min.js';
  s.integrity = 'sha384-PkHCo9yYYt43CM9mczXrTqkNN0ddgEpZos0hrTEP62/Iox7z6iWI3CfR06lzbWdK';
  s.crossOrigin = 'anonymous';
  s.async = true;
  s.onerror = function() {
    var fb = document.createElement('script');
    fb.src = '/vendor/accessibility-toolkit/js/widget.min.js';
    fb.async = true;
    (document.body || document.head).appendChild(fb);
  };
  (document.body || document.head).appendChild(s);
})();
</script>
```

### Option B: Native Astro Companion Component
If you have the package installed in your project repository (`npm install accessibility-toolkit`):

```astro
---
// src/layouts/Base.astro
import AccessibilityWidget from "accessibility-toolkit/accessibility-widget";
---
<html>
  <body>
    <slot />
    <!-- Standalone zero-config mode: loads from canonical CDN -->
    <AccessibilityWidget />

    <!-- Or provide optional pluginId to sync settings from EmDash Admin -->
    <!-- <AccessibilityWidget pluginId="r_rznxjv6huupd4i7d" /> -->
  </body>
</html>
```

### Companion Component Props Reference
All props are completely optional:

| Prop | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `pluginId` | `string` | `""` | Optional Registry ID (e.g. `r_...`) to sync admin settings. |
| `enabled` | `boolean` | `true` | Master toggle to enable or disable the widget directly in code. |
| `primaryColor` | `string` | `"#1863DC"` | Primary accent hex color for launcher button and active rings. |
| `iconId` | `"default" \| "accessibility" \| "assist" \| "wheel"` | `"default"` | Launcher button icon graphic. |
| `iconSize` | `number` | `48` | Launcher button diameter in pixels. |
| `positionDesktop` | `"bottom-right" \| "bottom-left" \| "top-right" \| "top-left"` | `"bottom-right"` | Screen position on desktop. |
| `positionMobile` | `"bottom-right" \| "bottom-left" \| "top-right" \| "top-left"` | `"bottom-right"` | Screen position on mobile. |
| `statementUrl` | `string` | `""` | Accessibility statement page link. |
| `cdnBaseUrl` | `string` | `https://cdn.jsdelivr.net/...` | Base URL for CDN asset loading. |
| `scriptSrc` | `string` | `"/vendor/accessibility-toolkit/js/widget.min.js"` | Fallback JavaScript path. |
| `fontsUrl` | `string` | `""` | Directory URL for Dyslexia font assets. |
| `integrity` | `string` | `sha384-PkHCo9yYYt43...` | Cryptographic Subresource Integrity hash. |

---

## 6. Asset Setup (CDN vs. Offline Environments)

### Default Delivery: High-Performance Zero-Copy CDN
By default, the Accessibility Toolkit requires **zero file copying**. All scripts and fonts are served from the production jsDelivr CDN backed by immutable tag `v1.3.6`:

| Asset | Production CDN URL | Local Fallback Path |
| :--- | :--- | :--- |
| **Widget JavaScript** | `https://cdn.jsdelivr.net/gh/susheel250/accessibility-toolkit@v1.3.6/vendor/accessibility-toolkit/js/widget.min.js` | `/vendor/accessibility-toolkit/js/widget.min.js` |
| **Dyslexia Font (WOFF)** | `https://cdn.jsdelivr.net/gh/susheel250/accessibility-toolkit@v1.3.6/vendor/accessibility-toolkit/fonts/OpenDyslexic3-Regular.woff` | `/vendor/accessibility-toolkit/fonts/OpenDyslexic3-Regular.woff` |
| **Dyslexia Font (TTF)** | `https://cdn.jsdelivr.net/gh/susheel250/accessibility-toolkit@v1.3.6/vendor/accessibility-toolkit/fonts/OpenDyslexic3-Regular.ttf` | `/vendor/accessibility-toolkit/fonts/OpenDyslexic3-Regular.ttf` |
| **SRI Hash** | `sha384-PkHCo9yYYt43CM9mczXrTqkNN0ddgEpZos0hrTEP62/Iox7z6iWI3CfR06lzbWdK` | *(Not applied in local mode)* |

### Offline / Intranet / Firewall Environments
If your website operates in an offline, air-gapped, or firewall-restricted environment where `cdn.jsdelivr.net` is unreachable, copy the vendor assets into your project's `public/` directory:

1. Install the package locally:
   ```bash
   npm install accessibility-toolkit
   ```
2. Copy the vendor folder to your site's `public/` directory:
   ```bash
   mkdir -p public/vendor
   cp -R node_modules/accessibility-toolkit/vendor/accessibility-toolkit public/vendor/
   ```
3. Verify that the files exist:
   - `public/vendor/accessibility-toolkit/js/widget.min.js`
   - `public/vendor/accessibility-toolkit/fonts/OpenDyslexic3-Regular.woff`
   - `public/vendor/accessibility-toolkit/fonts/OpenDyslexic3-Regular.ttf`
4. Test by opening `http://localhost:4321/vendor/accessibility-toolkit/js/widget.min.js` in your browser to verify it returns HTTP 200.

---

## 7. Verification Checklist

After adding the widget to your layout, verify the installation with this 5-point checklist:

1. [ ] **Floating Launcher Visible**: Open `http://localhost:4321/` in your browser. A circular blue button with an accessibility icon appears in the bottom-right corner.
2. [ ] **Panel Opens on Click**: Click the launcher button. The accessibility dialog opens smoothly, displaying 35 accessibility tools and presets.
3. [ ] **Tools Apply Immediately**: Click **Dark Contrast** or **Dyslexia Font**. The page appearance changes immediately.
4. [ ] **Console Clean**: Open DevTools Console (`F12` or `Cmd+Option+I`). Confirm there are zero unhandled exceptions or error messages.
5. [ ] **Preferences Persist**: Reload the page. Preferences remain active, and the launcher remains responsive.

---

## 8. Troubleshooting

For in-depth diagnostics, see the dedicated [Troubleshooting Guide](TROUBLESHOOTING.md).

### Issue 1: Floating button does not appear on public pages
- **Cause**: The snippet or `<AccessibilityWidget />` was not added to your shared layout.
- **Fix**: Open `src/layouts/Base.astro` and verify the script snippet is pasted immediately before `</body>`.

### Issue 2: "Plugin endpoint unreachable" warning in console
- **Cause**: A custom `pluginId` was specified, but that ID is not installed on the current EmDash database.
- **Fix**: Either remove `pluginId` to run in standalone mode, or verify your assigned ID in `/_emdash/admin/plugins-manager`. The widget automatically falls back to standalone mode regardless.

### Issue 3: Content Security Policy (CSP) blocks CDN script or inline loader
- **Cause**: Strict `script-src` or `font-src` CSP header blocking `cdn.jsdelivr.net` or inline scripts.
- **Fix**:
  1. Add `https://cdn.jsdelivr.net` to your `script-src` and `font-src` directives.
  2. For the inline loader script, authorize its exact SHA-256 hash (`'sha256-71Kaxjn+TeHAcKrwm3BhOCgydP+xypwygjM7fAHHheI='`) or use a per-request nonce (`nonce="..."`). Avoid using `'unsafe-inline'` in production CSP headers.
  3. Alternatively, use local vendor assets: copy the files to `public/vendor/accessibility-toolkit/` and pass `cdnBaseUrl="local"`. See the [Troubleshooting Guide](TROUBLESHOOTING.md#2-cdn-javascript-fails-to-load) for complete CSP examples.

### Issue 4: Dyslexia font not loading
- **Cause**: Font asset path blocked or not configured.
- **Fix**: Ensure `https://cdn.jsdelivr.net` is allowed for font loading, or ensure `OpenDyslexic3-Regular.woff` exists in `public/vendor/accessibility-toolkit/fonts/`.

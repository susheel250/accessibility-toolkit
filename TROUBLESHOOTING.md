# Accessibility Toolkit — Troubleshooting Guide

This guide covers common integration, loading, and runtime issues encountered when installing and running the **Accessibility Toolkit** (`v1.3.6`) in EmDash CMS.

---

## Table of Contents

1. [Widget Not Visible After Registry Installation](#1-widget-not-visible-after-registry-installation)
2. [CDN JavaScript Fails to Load](#2-cdn-javascript-fails-to-load)
3. [Subresource Integrity (SRI) Hash Verification Failure](#3-subresource-integrity-sri-hash-verification-failure)
4. [Dyslexia Fonts or Icons Do Not Load](#4-dyslexia-fonts-or-icons-do-not-load)
5. [Widget Appears Twice on the Page](#5-widget-appears-twice-on-the-page)
6. [Browser Console Errors on Visitor Pages](#6-browser-console-errors-on-visitor-pages)
7. [Optional Settings Synchronization Unavailable](#7-optional-settings-synchronization-unavailable)
8. [Local Fallback Assets Missing in Clean Projects](#8-local-fallback-assets-missing-in-clean-projects)
9. [Widget Remains Visible After Being Disabled in Admin](#9-widget-remains-visible-after-being-disabled-in-admin)

---

## 1. Widget Not Visible After Registry Installation

### Symptoms
You installed and activated **Accessibility Toolkit** from **EmDash Admin** > **Plugins** > **Registry**, but visiting your public homepage shows no floating accessibility button.

### Likely Cause
EmDash executes registry-installed plugins in an isolated Cloudflare `workerd` isolate sandbox (`"capabilities": []`). By design, EmDash **strictly restricts the `page:fragments` hook to trusted host plugins** and prevents sandboxed plugins from directly injecting scripts into visitor HTML (`node_modules/emdash/src/plugins/sandbox/proxy.ts:70`).

### Resolution
A one-time theme layout integration is required:
1. Open your site's base layout file (`src/layouts/Base.astro` or `src/layouts/Layout.astro`).
2. Paste the standalone loader snippet immediately before the closing `</body>` tag:

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
3. Refresh your website in the browser.

---

## 2. CDN JavaScript Fails to Load

### Symptoms
DevTools Network tab shows a failed request or `net::ERR_BLOCKED_BY_CLIENT` / `net::ERR_CONNECTION_REFUSED` for `https://cdn.jsdelivr.net/.../widget.min.js`.

### Likely Cause
- An ad-blocker or privacy extension is blocking third-party CDN scripts.
- A strict Content Security Policy (`Content-Security-Policy: script-src ...`) does not whitelist `cdn.jsdelivr.net`.
- The browser is operating in an offline or intranet environment.

### Resolution

#### If using Content Security Policy (CSP)
A common mistake is adding `'unsafe-inline'` to resolve script loading issues. Recommending or using `'unsafe-inline'` in production is strongly discouraged because it disables the browser's defense against Cross-Site Scripting (XSS) by allowing any arbitrary inline script or event handler attribute to execute.

Instead, configure a modern, safe CSP policy using one of these options:

**Option A (Recommended: Strict CSP with SHA-256 Script Hash)**:
Authorize the jsDelivr CDN domain and whitelist the exact cryptographic SHA-256 hash of the inline loader snippet:
```http
Content-Security-Policy: default-src 'self'; script-src 'self' 'sha256-71Kaxjn+TeHAcKrwm3BhOCgydP+xypwygjM7fAHHheI=' https://cdn.jsdelivr.net; font-src 'self' https://cdn.jsdelivr.net data:;
```

**Option B (Dynamic Nonce-based CSP)**:
If your web server or hosting middleware generates unique per-request nonces:
1. Add `nonce={cspNonce}` to your script tag:
   ```html
   <script is:inline nonce={cspNonce} id="accessibility-toolkit-loader">
   ```
2. Whitelist the dynamic nonce in your HTTP header:
   ```http
   Content-Security-Policy: default-src 'self'; script-src 'self' 'nonce-<YOUR_NONCE>' https://cdn.jsdelivr.net; font-src 'self' https://cdn.jsdelivr.net data:;
   ```

**Option C (Component / External Script — Zero Inline Code)**:
When using the native Astro companion component (`<AccessibilityWidget />`) or placing the loader into a bundled external JavaScript file, no inline script execution is needed at all:
```http
Content-Security-Policy: default-src 'self'; script-src 'self' https://cdn.jsdelivr.net; font-src 'self' https://cdn.jsdelivr.net data:;
```

> [!WARNING]
> Avoid adding `'unsafe-inline'` to your production `script-src` directive. Doing so undermines Content Security Policy protections against XSS. Always prefer exact script hashes (`'sha256-...'`), per-request nonces (`'nonce-...'`), or external bundled scripts.

#### If operating offline or behind a strict firewall
Copy the vendor assets into your project's `public/` directory so they are served directly by your host web server:
```bash
mkdir -p public/vendor
cp -R node_modules/accessibility-toolkit/vendor/accessibility-toolkit public/vendor/
```
The loader's `s.onerror` handler will automatically fall back to `/vendor/accessibility-toolkit/js/widget.min.js`.

---

## 3. Subresource Integrity (SRI) Hash Verification Failure

### Symptoms
Browser console displays:
> `Failed to find a valid digest in the 'integrity' attribute for resource 'https://cdn.jsdelivr.net/gh/susheel250/accessibility-toolkit@v1.3.6/vendor/accessibility-toolkit/js/widget.min.js' with computed SHA-384 integrity ... The resource has been blocked.`

### Likely Cause
The SRI hash in your snippet does not match the exact cryptographic digest of the file delivered over HTTP (often caused by a modified URL, query parameter, or proxy).

### Resolution
1. Confirm you are requesting the canonical `v1.3.6` URL without extra query strings:  
   `https://cdn.jsdelivr.net/gh/susheel250/accessibility-toolkit@v1.3.6/vendor/accessibility-toolkit/js/widget.min.js`
2. Ensure the integrity attribute is set to:  
   `sha384-PkHCo9yYYt43CM9mczXrTqkNN0ddgEpZos0hrTEP62/Iox7z6iWI3CfR06lzbWdK`
3. You can verify the live digest at any time via terminal:
   ```bash
   curl -sL "https://cdn.jsdelivr.net/gh/susheel250/accessibility-toolkit@v1.3.6/vendor/accessibility-toolkit/js/widget.min.js" \
     | openssl dgst -sha384 -binary | openssl base64 -A
   ```

---

## 4. Dyslexia Fonts or Icons Do Not Load

### Symptoms
When toggling **Dyslexia Font**, text does not change to OpenDyslexic, or icons appear as empty boxes.

### Likely Cause
- `window._cyA11yAssets.fonts` was not configured before the widget script loaded.
- Font files (`.woff` / `.ttf`) are blocked by CSP `font-src`.

### Resolution
1. Verify `window._cyA11yAssets = { fonts: 'https://cdn.jsdelivr.net/gh/susheel250/accessibility-toolkit@v1.3.6/vendor/accessibility-toolkit/fonts/' }` is set prior to script injection.
2. If hosting locally, ensure `public/vendor/accessibility-toolkit/fonts/OpenDyslexic3-Regular.woff` exists and returns HTTP 200.

---

## 5. Widget Appears Twice on the Page

### Symptoms
Two floating buttons overlay each other, or clicking opens two dialog panels.

### Likely Cause
- Both the inline snippet AND `<AccessibilityWidget />` companion component were included in the layout.
- The layout is rendered inside another layout that also includes the widget.

### Resolution
1. Search your repository for `accessibility-toolkit-loader` and `AccessibilityWidget`.
2. Keep only **one** instance in your top-level layout (e.g. `src/layouts/Base.astro`).
3. Ensure the script begins with the duplicate prevention guard:
   ```javascript
   if (window.__accessibility_toolkit_initialized) return;
   window.__accessibility_toolkit_initialized = true;
   ```

---

## 6. Browser Console Errors on Visitor Pages

### Symptoms
Console displays `Uncaught ReferenceError` or `TypeError` during page load.

### Likely Cause
In Astro, inline scripts without the `is:inline` directive are processed and bundled by Vite, which can alter variable scopes or hoist scripts unexpectedly.

### Resolution
Always add `is:inline` to the script tag in Astro layouts:
```astro
<script is:inline id="accessibility-toolkit-loader">
  // Loader code
</script>
```

---

## 7. Optional Settings Synchronization Unavailable

### Symptoms
Changes made in **EmDash Admin** (`/_emdash/admin/plugins/{pluginId}/settings`) — such as primary color or button position — do not reflect on public visitor pages.

### Likely Cause
The widget is operating in standalone mode with hardcoded defaults, or the loader cannot discover your runtime `pluginId`. EmDash does not expose plugin registry IDs automatically to anonymous frontend visitors.

### Resolution
1. In EmDash Admin, navigate to **Plugins** (`/_emdash/admin/plugins-manager`).
2. Find **Accessibility Toolkit** and note the assigned runtime ID in the URL (e.g. `r_rznxjv6huupd4i7d`).
3. Pass the ID to the Astro companion component or loader script:
   - **Component**: `<AccessibilityWidget pluginId="r_rznxjv6huupd4i7d" />`
   - **Snippet**: Add `data-plugin-id="r_rznxjv6huupd4i7d"` to the loader script tag.

---

## 8. Local Fallback Assets Missing in Clean Projects

### Symptoms
When the CDN is blocked, the console displays:
> `[Accessibility Toolkit] Both CDN (...) and local fallback (/vendor/accessibility-toolkit/js/widget.min.js) failed to load.`

### Likely Cause
In a fresh EmDash project, the Plugin Registry installer operates inside a sandboxed worker isolate (`workerd`) and cannot copy files to the host project's `public/` directory. By default, the widget runs zero-copy from the CDN. Local fallback assets are not present in `public/` unless copied manually.

### Resolution
If your website must support offline, intranet, or air-gapped environments:

1. Ensure the package is installed in your project:
   ```bash
   npm install accessibility-toolkit
   ```
2. Copy the entire vendor tree into your site's `public/vendor/` directory:
   ```bash
   mkdir -p public/vendor
   cp -R node_modules/accessibility-toolkit/vendor/accessibility-toolkit public/vendor/
   ```
3. Verify that all required assets exist at their expected local paths:
   - **JavaScript bundle**: `public/vendor/accessibility-toolkit/js/widget.min.js`
   - **Dyslexia WOFF font**: `public/vendor/accessibility-toolkit/fonts/OpenDyslexic3-Regular.woff`
   - **Dyslexia TTF font**: `public/vendor/accessibility-toolkit/fonts/OpenDyslexic3-Regular.ttf`
4. Test by opening the local URLs directly in your browser:
   - `http://localhost:4321/vendor/accessibility-toolkit/js/widget.min.js` (returns HTTP 200)
   - `http://localhost:4321/vendor/accessibility-toolkit/fonts/OpenDyslexic3-Regular.woff` (returns HTTP 200)

---

## 9. Widget Remains Visible After Being Disabled in Admin

### Symptoms
You switched **Enable Accessibility Widget** to `false` in **EmDash Admin** (`/_emdash/admin/plugins/{pluginId}/settings`), but the floating launcher button still renders on the public site.

### Likely Cause
The frontend loader is running in **standalone CDN mode** without a `pluginId`.
- **In standalone mode**, the loader relies exclusively on hardcoded CDN defaults or component props. It makes **zero network requests** to the EmDash database API. As a result, changes made in EmDash Admin (including the master enable/disable toggle) have no way of reaching the frontend browser.
- **With settings synchronization enabled (`pluginId` provided)**, the loader queries `GET /_emdash/api/plugins/{pluginId}/config` on page load. If the admin toggles the widget off, the endpoint returns `{ "enabled": false }`, and the loader immediately halts without injecting the script or mounting any DOM elements.

### Resolution

#### Option A: Pass your Plugin ID to Enable Admin Sync
1. In EmDash Admin, navigate to **Plugins** (`/_emdash/admin/plugins-manager`).
2. Find **Accessibility Toolkit** and note the assigned runtime ID in the URL (e.g. `r_rznxjv6huupd4i7d`).
3. Pass the ID to your layout:
   - **In Astro Companion Component**:
     ```astro
     <AccessibilityWidget pluginId="r_rznxjv6huupd4i7d" />
     ```
   - **In Inline Snippet**:
     Add `data-plugin-id="r_rznxjv6huupd4i7d"` to the loader script tag.

#### Option B: Disable Directly in Astro Layout (Standalone Mode)
If you prefer running in standalone mode without database roundtrips, you can disable the widget directly in code:
- **Using Astro Component**:
  ```astro
  <AccessibilityWidget enabled={false} />
  ```
- **Using Inline Snippet**:
  Simply remove or comment out the `<script is:inline id="accessibility-toolkit-loader">` block in `src/layouts/Base.astro`.

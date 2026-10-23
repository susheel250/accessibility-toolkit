# Accessibility Toolkit for EmDash CMS

A comprehensive, zero-dependency accessibility toolbar plugin for [EmDash CMS](https://emdashcms.com) websites. Helps site owners comply with **WCAG 2.2 Level AA** and **ADA Section 508** standards through an accessible, visitor-driven assistive toolbar rendered in an isolated Shadow DOM.

Package identifier: `@susheel-k.bsky.social/accessibility-toolkit` (version `1.3.6`)

---

## Key Capabilities

- **One-Click Accessibility Profiles**: Presets for Epilepsy Safe Mode, Visually Impaired, Cognitive Disability, and ADHD Friendly modes.
- **Text & Reading Controls**: Font size scaling (up to 200%), Dyslexic-friendly typeface (`OpenDyslexic3`), highlight titles, highlight links, letter spacing, line height, font weight adjustments, and multi-state text alignments.
- **Color & Contrast Filters**: Dark Contrast, Light Contrast, High Contrast, High & Low Saturation, and Monochrome visual modes.
- **Interaction & Navigation Tools**: Reading Guide focus bar, Large Cursor, Animation Pause, Screen Reader / Text-to-Speech (Page Read), and Sound Mute.
- **Isolated Shadow DOM**: Complete stylesheet and script encapsulation prevents CSS leaks or collisions with your theme.
- **Keyboard Navigation**: Fully accessible keyboard trap with global `Option+A` / `Alt+A` shortcut.
- **Persistent Preferences**: Visitor preferences are preserved automatically in browser local storage.
- **Branding Freedom**: Clean, neutral user interface without third-party vendor watermarks or footer branding.

---

## Architecture: Registry Sandbox & Frontend Theme Integration

EmDash uses an isolated `workerd` sandbox runtime for registry-published plugins. This package conforms strictly to the EmDash Plugin Registry trust contract:

| Capability / Concern | Sandboxed Registry Plugin (`accessibility-toolkit`) | Native Astro Companion (`AccessibilityWidget.astro`) |
| :--- | :--- | :--- |
| **Execution Environment** | Cloudflare `workerd` sandbox isolate | Node.js host server process |
| **Trust Contract** | `capabilities: []`, `allowedHosts: []` (zero-privilege) | Host application access |
| **Settings UI** | Native Block Kit admin at `/settings` | React canvas with real-time live preview |
| **Configuration API** | Public route `GET /_emdash/api/plugins/{id}/config` | Props or direct SQLite option queries |
| **DOM Delivery** | Theme embed snippet (`GET /_emdash/api/plugins/{id}/snippet`) | Astro `<AccessibilityWidget />` layout tag |

### Why Registry Installation Requires Frontend Integration

In EmDash CMS, the `page:fragments` hook (which injects raw HTML fragments into visitor pages) is restricted to trusted host plugins to protect visitor DOM integrity. 

**Sandboxed plugins are never invoked for `page:fragments`**. Therefore:
1. **Registry Installation**: Provisions the plugin inside the sandbox and exposes the admin settings and public REST API (`/config`, `/snippet`, `/status`).
2. **Frontend Theme Integration**: Adds the lightweight dynamic loader snippet (retrieved from `GET /_emdash/api/plugins/{id}/snippet`) into your theme layout (e.g. `src/layouts/Base.astro`).

---

## Production CDN Hosting

The Accessibility Toolkit supports zero-copy frontend asset distribution via a production HTTPS CDN:

- **CDN Provider:** jsdelivr Global CDN (backed by immutable version tag `v1.3.6`)
- **Verified Base URL:** `https://cdn.jsdelivr.net/gh/susheel250/accessibility-toolkit@v1.3.6/vendor/accessibility-toolkit`
- **Production Script:** `https://cdn.jsdelivr.net/gh/susheel250/accessibility-toolkit@v1.3.6/vendor/accessibility-toolkit/js/widget.min.js`
  - **Subresource Integrity (SRI):** `integrity="sha384-PkHCo9yYYt43CM9mczXrTqkNN0ddgEpZos0hrTEP62/Iox7z6iWI3CfR06lzbWdK"`
  - **CORS:** `access-control-allow-origin: *`
  - **Cache Header:** `cache-control: public, max-age=31536000, s-maxage=31536000, immutable`
- **Production Fonts:**
  - WOFF: `https://cdn.jsdelivr.net/gh/susheel250/accessibility-toolkit@v1.3.6/vendor/accessibility-toolkit/fonts/OpenDyslexic3-Regular.woff`
  - TTF: `https://cdn.jsdelivr.net/gh/susheel250/accessibility-toolkit@v1.3.6/vendor/accessibility-toolkit/fonts/OpenDyslexic3-Regular.ttf`

### Zero-Copy Installation Flow
When using the dynamic snippet, fresh EmDash projects do **not** need to manually copy assets into `public/vendor/`. The widget script and fonts are loaded dynamically from the CDN with cryptographic SRI verification.

---

## Recommended Integration: Snippet Embed (Any Theme)

Because EmDash executes plugins in a secure worker sandbox, plugins cannot directly inject scripts into visitor HTML. Adding the widget is a simple one-time theme edit:

1. **Install from EmDash Registry**:
   Navigate to **Plugins** > **Registry** in EmDash Admin (`/_emdash/admin/plugins/registry`) and click **Install**.
2. **Add to Theme Layout**:
   Paste the standalone snippet below into your base theme layout (e.g. `src/layouts/Base.astro`) immediately before `</body>`:

```html
<!-- Standalone Accessibility Toolkit Loader (Zero Config, CDN with SRI) -->
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

*(Note: The widget works immediately without any environment variables or plugin IDs. If you want to dynamically sync settings from EmDash Admin, see the [Full Installation Guide](REGISTRY-INSTALLATION.md)).*

---

### Dynamic Snippet with Optional Admin Sync

If you want live settings customized in **EmDash Admin** (`/_emdash/admin/plugins/{pluginId}/settings`) to sync dynamically to the frontend, you can query your installation config:

```html
<script is:inline>
(function() {
  if (window.__accessibility_toolkit_initialized) return;
  if (document.getElementById('accessibility-toolkit-script')) return;
  window.__accessibility_toolkit_initialized = true;
  fetch('/_emdash/api/plugins/{pluginId}/config')
    .then(function(r) { return r.ok ? r.json() : null; })
    .then(function(res) {
      var cfg = (res && res.data) || res;
      if (!cfg) {
        window.__accessibility_toolkit_initialized = false;
        return;
      }
      if (cfg.enabled === false) return;
      window._cyA11yConfig = {
        primaryColor: cfg.primaryColor,
        iconId: cfg.iconId,
        iconSize: cfg.iconSize,
        position: { desktop: cfg.positionDesktop, mobile: cfg.positionMobile },
        statementUrl: cfg.statementUrl,
        language: { default: cfg.language },
        label: "Accessibility menu"
      };
      var cdnConfigured = Boolean(cfg.cdnConfigured);
      var primarySrc = cfg.scriptUrl || (cdnConfigured && cfg.cdnBaseUrl ? cfg.cdnBaseUrl.replace(/[/]+$/, '') + '/js/widget.min.js' : '/vendor/accessibility-toolkit/js/widget.min.js');
      var fontsSrc = cfg.fontsUrl || (cdnConfigured && cfg.cdnBaseUrl ? cfg.cdnBaseUrl.replace(/[/]+$/, '') + '/fonts/' : '/vendor/accessibility-toolkit/fonts/');
      var fallbackSrc = cdnConfigured ? '/vendor/accessibility-toolkit/js/widget.min.js' : '';

      window._cyA11yAssets = {
        fonts: fontsSrc
      };
      var s = document.createElement('script');
      s.id = 'accessibility-toolkit-script';
      s.src = primarySrc;
      s.async = true;
      if (cdnConfigured) {
        s.integrity = 'sha384-PkHCo9yYYt43CM9mczXrTqkNN0ddgEpZos0hrTEP62/Iox7z6iWI3CfR06lzbWdK';
        s.crossOrigin = 'anonymous';
      }
      s.onerror = function() {
        if (fallbackSrc && fallbackSrc !== primarySrc) {
          if (document.getElementById('accessibility-toolkit-script-fallback')) return;
          console.warn('[Accessibility Toolkit] Primary CDN script failed to load from ' + primarySrc + ', attempting local fallback: ' + fallbackSrc);
          var fb = document.createElement('script');
          fb.id = 'accessibility-toolkit-script-fallback';
          fb.src = fallbackSrc;
          fb.async = true;
          fb.onerror = function() {
            window.__accessibility_toolkit_initialized = false;
            console.warn('[Accessibility Toolkit] Both CDN (' + primarySrc + ') and local fallback (' + fallbackSrc + ') failed to load.');
          };
          (document.body || document.head).appendChild(fb);
        } else {
          window.__accessibility_toolkit_initialized = false;
          console.warn('[Accessibility Toolkit] Widget script failed to load from ' + primarySrc + '.');
        }
      };

      function applyShadowOverrides() {
        var container = document.getElementById("cya11y-container");
        if (!container || !container.shadowRoot) return false;
        var sr = container.shadowRoot;
        if (!sr.getElementById("a11y-toolkit-overrides")) {
          var style = document.createElement("style");
          style.id = "a11y-toolkit-overrides";
          style.textContent = [
            ".cya11y-footer-brand { display: none !important; }",
            ".cya11y-footer:not(:has(.cya11y-footer-statement-link:not([style*='display: none']):not([style*='display:none']))) { display: none !important; }"
          ].join(" ");
          sr.appendChild(style);

          var btn = sr.querySelector(".cya11y-menu-btn");
          if (btn) {
            btn.setAttribute("aria-label", "Accessibility menu");
            btn.setAttribute("title", "Accessibility menu");
          }
        }
        return true;
      }

      if (!applyShadowOverrides()) {
        var obs = new MutationObserver(function() {
          if (applyShadowOverrides()) obs.disconnect();
        });
        obs.observe(document.body || document.documentElement, { childList: true, subtree: true });
        setTimeout(function() { obs.disconnect(); }, 10000);
      }

      (document.body || document.head).appendChild(s);
    })
    .catch(function(err) {
      window.__accessibility_toolkit_initialized = false;
      console.warn('[Accessibility Toolkit] Failed to load configuration:', err);
    });
})();
</script>
```

*(Replace `{pluginId}` with your assigned runtime ID, e.g. `r_rznxjv6huupd4i7d`)*.

---

## Alternative: Native Companion (Astro Themes)

In Astro-based EmDash installations with the package installed:

```astro
---
import AccessibilityWidget from "accessibility-toolkit/accessibility-widget";
---
<html>
  <head>...</head>
  <body>
    <slot />
    <!-- Standalone mode (zero configuration required, loads from canonical CDN) -->
    <AccessibilityWidget />

    <!-- Or provide optional pluginId to sync settings from EmDash Admin -->
    <!-- <AccessibilityWidget pluginId="r_rznxjv6huupd4i7d" /> -->
  </body>
</html>
```

---

## Configuration Settings

The following settings are configurable from **EmDash Admin** > **Settings** > **Accessibility Toolkit** (`/_emdash/admin/plugins/{pluginId}/settings`):

| Setting Key | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `enabled` | `boolean` | `true` | Master toggle to enable or disable the widget. (Requires `pluginId` to sync to frontend; in standalone mode, use layout props). |
| `primaryColor` | `string` | `"#1863DC"` | Hex brand accent color for launcher and active highlights. |
| `iconId` | `select` | `"default"` | Launcher icon style (`default`, `accessibility`, `assist`, `wheel`). |
| `iconSize` | `number` | `48` | Diameter of the floating launcher button in pixels (40, 48, 56). |
| `positionDesktop` | `select` | `"bottom-right"` | Screen corner on desktop (`bottom-right`, `bottom-left`, `top-right`, `top-left`). |
| `positionMobile` | `select` | `"bottom-right"` | Screen corner on mobile devices (`bottom-right`, `bottom-left`, `top-right`, `top-left`). |
| `language` | `select` | `"en"` | Initial widget interface language code (12 supported languages). |
| `statementUrl` | `url` | `"/accessibility-statement"` | Organization accessibility statement link. |
| `cdnBaseUrl` | `url` | `""` | Custom HTTPS asset CDN base URL (defaults to production jsdelivr). |

---

## Public REST Endpoints

The sandboxed plugin exposes three unauthenticated endpoints:

- `GET /_emdash/api/plugins/{id}/config`: Returns active JSON settings for dynamic client-side widget consumption.
- `GET /_emdash/api/plugins/{id}/snippet`: Returns ready-to-use HTML `<script>` tags for your theme templates.
- `GET /_emdash/api/plugins/{id}/status`: Returns plugin health and version telemetry.

---

## Documentation & Troubleshooting

- **[Registry Installation Guide](REGISTRY-INSTALLATION.md)**: Full step-by-step instructions for installing and integrating the Accessibility Toolkit in EmDash CMS.
- **[Troubleshooting Guide](TROUBLESHOOTING.md)**: Diagnoses and resolutions for common issues (missing button, CDN blocks, SRI verification, and offline fallback).

---

## Security & Privacy

- **No Remote Telemetry**: The sandboxed plugin requests zero network capabilities (`allowedHosts: []`).
- **No Data Harvesting**: Zero visitor analytics or personal data are collected or transmitted.
- **Content Security Policy**: Compatible with strict CSP environments (supports exact SHA-256 script hashing `'sha256-71Kaxjn+TeHAcKrwm3BhOCgydP+xypwygjM7fAHHheI='` or per-request nonces, avoiding `'unsafe-inline'`); all styles are scoped in Shadow DOM.
- **Subresource Integrity (SRI)**: CDN scripts are verified with cryptographic SHA-384 hashes.

---

## Development & Testing

```bash
# Validate manifest against schema
npx emdash-plugin validate

# Run automated tests
npm test

# Type check
npm run typecheck

# Bundle plugin for registry release
npx emdash-plugin bundle
```

---

## License

MIT License &copy; 2026 Accessibility Toolkit Contributors.

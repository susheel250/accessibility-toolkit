# Accessibility Toolkit — EmDash Registry Installation & Integration Guide

The **Accessibility Toolkit** (`v1.3.5`) provides an accessible, responsive, and lightweight accessibility toolbar for EmDash CMS websites, supporting **WCAG 2.2 Level AA** and **ADA Section 508** compliance.

---

## 1. Architecture & Platform Integration

### Sandboxed Registry Plugins & Page Fragments
EmDash CMS employs a secure architecture separating trusted plugins (defined in `astro.config.mjs`) from sandboxed Registry plugins (installed via the decentralized ATProto registry):

- **Isolate Sandbox**: Registry plugins execute inside a secure Cloudflare `workerd` isolate with restricted capabilities (`"capabilities": []`).
- **Security Boundary**: In EmDash core (`node_modules/emdash/src/plugins/sandbox/proxy.ts:70`), the `page:fragments` hook is strictly restricted to trusted host plugins:
  ```typescript
  // EmDash sandbox proxy
  if (hook.name === "page:fragments") continue;
  ```
  This intentional security boundary prevents untrusted third-party code from injecting arbitrary scripts or HTML into visitor pages.
- **Frontend Integration Model**: Because automatic script injection is excluded by platform design, Registry plugins integrate with the frontend via either:
  1. **Companion Astro Component** (`<AccessibilityWidget />`, recommended): Automatically discovers active plugin status and saved settings from the database during SSR.
  2. **Dynamic Loader Snippet**: A small inline script (accessible from the Admin Settings page or `GET /_emdash/api/plugins/:id/snippet`) that fetches configuration at runtime.

---

## 2. Step-by-Step Installation

### Step 1: Install from the EmDash Plugin Registry
1. Log in to your EmDash Admin panel (`/_emdash/admin`).
2. In the navigation sidebar, click **Plugins** > **Registry** (`/_emdash/admin/plugins/registry`).
3. Search for **Accessibility Toolkit**.
4. Click **Install**. EmDash downloads the signed package blob and provisions the plugin under a unique installation ID (e.g. `r_rznxjv6huupd4i7d`).

Alternatively, via EmDash CLI:
```bash
npx emdash plugins add accessibility-toolkit
```

### Step 2: Verify Plugin Activation
1. In EmDash Admin, navigate to **Plugins** > **Plugins Manager** (`/_emdash/admin/plugins-manager`).
2. Verify that **Accessibility Toolkit** displays an **Active** badge.

### Step 3: Configure Settings
1. Click **Settings** on the Accessibility Toolkit card, or navigate to:
   `/_emdash/admin/plugins/{pluginId}/settings`
2. Configure your desired options:
   - **Enable Accessibility Widget**: Master toggle (`true` / `false`).
   - **Widget Colour**: Brand accent color (default: `#1863DC`).
   - **Launcher Icon**: Choose from `default`, `accessibility`, `assist`, or `wheel`.
   - **Button Size**: 40px (Small), 48px (Medium), 56px (Large).
   - **Position**: Desktop and mobile placement corners.
   - **Accessibility Statement URL**: Link to your accessibility statement.
   - **CDN Base URL**: Production jsDelivr CDN (or `local` for self-hosted assets).
3. Click **Save Settings**.

---

## 3. Frontend Theme Integration

To display the widget on your site, perform this one-time integration in your site layout (e.g. `src/layouts/Base.astro`).

### Option A: Companion Component (Recommended)
Add the companion component before `</body>` in `src/layouts/Base.astro`:

```astro
---
// src/layouts/Base.astro
import AccessibilityWidget from "../components/AccessibilityWidget.astro";
---
<html>
  <body>
    <slot />
    <!-- Automatically detects the active registry plugin, queries settings, and handles enable/disable -->
    <AccessibilityWidget />
  </body>
</html>
```

**Why this is recommended:**
- **Zero Configuration**: No hardcoded IDs or environment variables required.
- **Dynamic ID Discovery**: Automatically discovers any newly assigned registry ID (`r_*`) via EmDash database state.
- **Clean SSR Gating**: If the plugin is uninstalled, disabled in settings, or deactivated, the component outputs **zero HTML/scripts** into the rendered page.
- **Duplicate Prevention**: Built-in guards prevent multiple script tags or initializations.

### Option B: Dynamic Loader Snippet
If you prefer not to use an Astro component, copy the dynamic loader snippet from **Plugins** > **Accessibility Toolkit** > **Settings** (or fetch it from `GET /_emdash/api/plugins/{id}/snippet`) and place it before `</body>` in your layout:

```html
<script is:inline>
(function() {
  if (window.__accessibility_toolkit_initialized) return;
  window.__accessibility_toolkit_initialized = true;

  fetch("/_emdash/api/plugins/r_rznxjv6huupd4i7d/config")
    .then(function(r) { return r.ok ? r.json() : null; })
    .then(function(res) {
      var cfg = (res && res.data) || res;
      if (!cfg || cfg.enabled === false) return;
      // Mounts widget with active settings from EmDash Admin
    });
})();
</script>
```

---

## 4. Lifecycle & State Management

| Action / State | Plugin Backend | Frontend Behavior |
| :--- | :--- | :--- |
| **Installed & Enabled** | Active in `_plugin_state`, `enabled: true` | Widget button appears at configured corner; accessibility toolbar functional. |
| **Disabled in Admin** | Active in `_plugin_state`, `enabled: false` | SSR omits loader. Client API returns `enabled: false` and aborts. No widget appears. |
| **Plugin Deactivated** | `status: "inactive"` in `_plugin_state` | SSR omits loader. Client API returns 404. No widget appears. |
| **Plugin Uninstalled** | Record deleted from `_plugin_state` | SSR omits loader. Client API returns 404. No orphan scripts or widgets remain. |
| **Plugin Reinstalled** | New registry ID assigned (e.g. `r_newid`) | Component dynamically detects new ID. Widget loads without duplicate scripts. |

---

## 5. Production CDN & Asset Delivery

The plugin ships with pre-configured, cryptographically verified asset delivery:
- **CDN Base URL**: `https://cdn.jsdelivr.net/gh/susheel250/accessibility-toolkit@v1.3.5/vendor/accessibility-toolkit/`
- **Widget Script**: `js/widget.min.js`
- **Subresource Integrity (SRI)**: `integrity="sha384-PkHCo9yYYt43CM9mczXrTqkNN0ddgEpZos0hrTEP62/Iox7z6iWI3CfR06lzbWdK"`
- **CORS Attribute**: `crossorigin="anonymous"`
- **Dyslexia Fonts**: `fonts/OpenDyslexic3-Regular.woff` and `fonts/OpenDyslexic3-Regular.ttf`
- **Local Fallback**: `/vendor/accessibility-toolkit/js/widget.min.js` (automatically loaded if CDN is unreachable).

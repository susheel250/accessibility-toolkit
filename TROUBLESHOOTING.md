# Accessibility Toolkit — Troubleshooting & Diagnostic Guide

This guide provides troubleshooting steps and solutions for common issues encountered when installing and running the **Accessibility Toolkit** (`v1.3.5`) in EmDash CMS.

---

## 1. Widget Not Visible After Registry Installation

### Symptoms
You installed and activated **Accessibility Toolkit** from **EmDash Admin** > **Plugins** > **Registry**, but visiting your public homepage shows no floating accessibility button.

### Root Cause
EmDash executes registry-installed plugins in an isolated Cloudflare `workerd` isolate sandbox. By platform design, EmDash **strictly restricts the `page:fragments` hook to trusted host plugins** and prevents sandboxed plugins from directly injecting scripts into visitor HTML (`node_modules/emdash/src/plugins/sandbox/proxy.ts:70`).

### Solution
Perform the one-time theme layout integration:
1. Ensure `<AccessibilityWidget />` is added to your layout (`src/layouts/Base.astro`) before `</body>`.
2. Or copy the dynamic loader snippet from **Plugins** > **Accessibility Toolkit** > **Settings** into your layout before `</body>`.

---

## 2. Widget Remains Visible After Being Disabled in Admin

### Symptoms
You unchecked "Enable Accessibility Widget" in **EmDash Admin** > **Plugins** > **Accessibility Toolkit** > **Settings**, but the widget is still visible to visitors.

### Root Cause
A static/hardcoded standalone snippet was added to the layout rather than the dynamic companion component or dynamic endpoint loader. A static script does not query the EmDash backend API and will always render regardless of admin settings.

### Solution
Replace any static snippet in `src/layouts/Base.astro` with:
```astro
<AccessibilityWidget />
```
The companion component checks `savedSettings.enabled` both during SSR and through the client-side configuration endpoint. When disabled, it immediately suppresses widget rendering.

---

## 3. Widget Disappears After Reinstallation

### Symptoms
You uninstalled and reinstalled the plugin from the Registry, and the widget no longer appears on the frontend.

### Root Cause
When reinstalled from the Registry, EmDash assigns a new randomized installation ID (e.g., `r_newrandomid`). If your theme had a hardcoded installation ID, requests to the old ID return HTTP 404.

### Solution
Use the companion component without a hardcoded `pluginId`:
```astro
<AccessibilityWidget />
```
The component dynamically queries `_plugin_state` in SQLite during SSR and discovers whatever active registry ID is assigned to the Accessibility Toolkit, eliminating broken ID references.

---

## 4. Subresource Integrity (SRI) Hash Failure

### Symptoms
Browser console displays:
`Failed to find a valid digest in the 'integrity' attribute for resource '.../widget.min.js' with computed SHA-384 integrity...`

### Solution
Ensure the SRI hash matches the exact published `v1.3.5` JavaScript file on jsDelivr:
```html
integrity="sha384-PkHCo9yYYt43CM9mczXrTqkNN0ddgEpZos0hrTEP62/Iox7z6iWI3CfR06lzbWdK"
```
Do not use hashes computed from other versions (e.g. `v1.3.4` or unpublished `v1.3.6`).

---

## 5. Primary CDN Script Fails to Load

### Symptoms
Browser console logs:
`[Accessibility Toolkit] Primary script failed to load from https://cdn.jsdelivr.net/..., attempting local fallback: /vendor/accessibility-toolkit/js/widget.min.js`

### Expected Behavior & Solution
This is expected behavior when a network blocker or CDN outage prevents loading remote scripts.
The Accessibility Toolkit automatically activates its dual-tier fallback and loads the local script from `/vendor/accessibility-toolkit/js/widget.min.js`.
Ensure your project contains local vendor assets at:
`public/vendor/accessibility-toolkit/js/widget.min.js`
`public/vendor/accessibility-toolkit/fonts/`

---

## 6. Verifying API Endpoint Health

To check whether the plugin is responding correctly, open your browser or run curl against the public endpoints:

```bash
# 1. Health status
curl -s http://localhost:4321/_emdash/api/plugins/{pluginId}/status

# 2. Dynamic configuration
curl -s http://localhost:4321/_emdash/api/plugins/{pluginId}/config

# 3. Dynamic loader snippet
curl -s http://localhost:4321/_emdash/api/plugins/{pluginId}/snippet
```

Expected `/status` response:
```json
{
  "success": true,
  "plugin": "accessibility-toolkit",
  "status": "active",
  "version": "1.3.5"
}
```

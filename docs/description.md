**Accessibility Toolkit** provides a web accessibility toolbar for EmDash CMS (WCAG 2.2 AA / ADA 508).

### Features
- **Profiles**: Epilepsy Safe, ADHD Friendly, Low Vision presets.
- **Tools**: Text scaling, Dyslexia font, contrast modes, Reading Guide, Text-to-Speech.
- **Privacy**: Zero tracking, isolated Shadow DOM.

### Quick Start
EmDash sandboxed plugins cannot inject visitor scripts. Add to `src/layouts/Base.astro` before `</body>`:

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

3. **Verify**: Refresh your homepage to see the launcher.

### Documentation
Runs standalone with **zero IDs required**. For companion props and admin sync, see the [Accessibility Toolkit Repository](https://github.com/susheel250/accessibility-toolkit).

# Coddle Access Accessibility Widget

> A modern, lightweight, fully customizable web accessibility toolkit by **Coddle Technologies** designed to assist users with disabilities and enhance compliance with WCAG 2.2 Level AA and ADA standards.

---

## Features

- **Accessibility Profiles**: Quick one-click setups for Epilepsy Safe Mode, Seizure Safe, ADHD, and Low Vision.
- **Text & Reading**: Font size scaling (up to 200%), dyslexic-friendly font (`OpenDyslexic3`), highlight titles, highlight links, letter spacing, line height, font weight, and multi-state text alignment (left, center, right).
- **Color & Contrast**: Dark Contrast, Light Contrast, High Contrast, High/Low Saturation, and Monochrome filters.
- **Interaction & Navigation**: Reading Guide focus bar, Big Cursor, Pause Animations, Page Read (Text-to-Speech), and Mute Sounds.
- **Zero Host Interference**: Encapsulated in the Shadow DOM to eliminate host CSS and script collisions. Does not interfere with forms or native navigation.
- **Keyboard Friendly**: Accessible with keyboard navigation and global shortcut (`Option+A` / `Alt+A`).
- **Settings Persistence**: User preferences are automatically remembered via local storage.

---

## Standalone Installation

To add Coddle Access to any website or web application, include the following snippet before the closing `</body>` tag:

```html
<!-- Coddle Access Accessibility Widget Configuration -->
<script>
  window._cyA11yConfig = {
    primaryColor: '#1863DC',
    heading: 'Coddle Access',
    label: 'Coddle Accessibility widget',
    position: {
      desktop: 'bottom-right', // 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left'
      mobile: 'bottom-right'
    },
    keyboard: {
      enabled: true,
      shortcut: 'alt+a'
    }
  };

  window._cyA11yAssets = {
    fonts: '/vendor/coddle-access/fonts/'
  };
</script>

<!-- Coddle Access Bundle -->
<script async src="/vendor/coddle-access/js/widget.min.js"></script>
```

---

## Configuration Options

| Option | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `primaryColor` | `string` | `'#1863DC'` | Primary brand color used for accents and active states. |
| `heading` | `string` | `'Coddle Access'` | Title displayed in the widget menu header. |
| `label` | `string` | `'Coddle Accessibility widget'` | Accessible label for screen readers on the floating launcher. |
| `iconId` | `string` | `'default'` | Launcher icon style (`'default'`, `'assist'`, `'wheel'`, `'accessibility'`). |
| `iconSize` | `number` | `48` | Launcher icon dimensions in pixels. |
| `position.desktop` | `string` | `'bottom-right'` | Launcher placement on desktop screens. |
| `position.mobile` | `string` | `'bottom-right'` | Launcher placement on mobile devices. |
| `keyboard.enabled` | `boolean` | `true` | Enables keyboard shortcut listening. |
| `keyboard.shortcut` | `string` | `'alt+a'` | Global keyboard combination to open/close menu (`Option+A` on macOS). |
| `statementUrl` | `string` | `''` | Link to the organization's accessibility statement. |

---

## Browser Support

- Chrome, Edge, Safari, Firefox, Opera (latest 2 versions).
- iOS Safari and Android Chrome.

---

## License

- Code: [MIT License](LICENSE) &copy; 2026 Coddle Technologies.
- Bundled Fonts (`OpenDyslexic`): SIL Open Font License (OFL 1.1).

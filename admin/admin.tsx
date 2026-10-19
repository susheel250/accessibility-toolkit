// Accessibility Toolkit Admin Interface for EmDash CMS
import React, { useState, useEffect, useRef } from "react";

export interface AccessibilityToolkitSettings {
  enabled: boolean;
  language: string;
  primaryColor: string;
  iconId: 'default' | 'accessibility' | 'assist' | 'wheel';
  iconSize: number;
  positionDesktop: 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left';
  positionMobile: 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left';
  statementUrl: string;
}

export type CoddleAccessSettings = AccessibilityToolkitSettings;
export type AccessiYesSettings = AccessibilityToolkitSettings;

export const DEFAULT_SETTINGS: AccessibilityToolkitSettings = {
  enabled: true,
  language: 'en',
  primaryColor: '#1863DC',
  iconId: 'default',
  iconSize: 48,
  positionDesktop: 'bottom-right',
  positionMobile: 'bottom-right',
  statementUrl: '/accessibility-statement',
};

export function getPluginCandidateIds(): string[] {
  const ids: string[] = ["accessibility-toolkit", "coddle-access", "accessibility"];
  if (typeof window !== "undefined" && window.location?.pathname) {
    const match = window.location.pathname.match(/(?:plugins|plugins-manager)\/([^/?#]+)/);
    if (match && match[1] && !["marketplace", "registry"].includes(match[1])) {
      ids.unshift(match[1]);
    }
  }
  return Array.from(new Set(ids));
}

export const SUPPORTED_LANGUAGES = [
  { code: 'en', name: 'English' },
  { code: 'es', name: 'Spanish (Español)' },
  { code: 'fr', name: 'French (Français)' },
  { code: 'de', name: 'German (Deutsch)' },
  { code: 'it', name: 'Italian (Italiano)' },
  { code: 'pt', name: 'Portuguese (Português)' },
  { code: 'nl', name: 'Dutch (Nederlands)' },
  { code: 'pl', name: 'Polish (Polski)' },
  { code: 'da', name: 'Danish (Dansk)' },
  { code: 'sv', name: 'Swedish (Svenska)' },
  { code: 'no', name: 'Norwegian (Norsk)' },
  { code: 'fi', name: 'Finnish (Suomi)' },
];

export const PRESET_COLORS = [
  { hex: '#1863DC', label: 'Ocean Blue (Default)' },
  { hex: '#0369A1', label: 'Deep Ocean Blue' },
  { hex: '#0D9488', label: 'Teal' },
  { hex: '#4F46E5', label: 'Indigo' },
  { hex: '#16A34A', label: 'Emerald' },
  { hex: '#0F172A', label: 'Slate Dark' },
];

export function toValid7CharHex(val: string): string {
  if (!val) return '#1863DC';
  const clean = val.trim();
  if (/^#[0-9A-Fa-f]{6}$/.test(clean)) return clean.toUpperCase();
  if (/^#[0-9A-Fa-f]{3}$/.test(clean)) {
    const r = clean[1], g = clean[2], b = clean[3];
    return `#${r}${r}${g}${g}${b}${b}`.toUpperCase();
  }
  return '#1863DC';
}

export function RenderIconSvg({ iconId, size = 28, color = 'currentColor' }: { iconId: string; size?: number; color?: string }) {
  if (iconId === 'accessibility') {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <circle cx="12" cy="12" r="10" />
        <circle cx="12" cy="6.5" r="1.8" fill={color} />
        <path d="M12 8.3v6.7" />
        <path d="M7.5 10.5h9" />
        <path d="M9.5 18.5l2.5-3.5 2.5 3.5" />
      </svg>
    );
  }
  if (iconId === 'assist') {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
        <path d="M12 8v8" />
        <path d="M8 12h8" />
      </svg>
    );
  }
  if (iconId === 'wheel') {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <circle cx="12" cy="4" r="2" fill={color} />
        <path d="M12 6v6l4 2" />
        <circle cx="9" cy="16" r="5" />
        <path d="M9 11h4l3 7h3" />
      </svg>
    );
  }
  // Default figure icon
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="12" cy="4.5" r="2.5" fill={color} />
      <path d="M12 7v10" />
      <path d="M5 9.5l7 1.5 7-1.5" />
      <path d="M8 21l4-4 4 4" />
    </svg>
  );
}

export function AccessibilityToolkitAdminPage() {
  const [enabled, setEnabled] = useState<boolean>(DEFAULT_SETTINGS.enabled);
  const [language, setLanguage] = useState<string>(DEFAULT_SETTINGS.language);
  const [primaryColor, setPrimaryColor] = useState<string>(DEFAULT_SETTINGS.primaryColor);
  const [iconId, setIconId] = useState<'default' | 'accessibility' | 'assist' | 'wheel'>(DEFAULT_SETTINGS.iconId);
  const [iconSize, setIconSize] = useState<number>(DEFAULT_SETTINGS.iconSize);
  const [positionDesktop, setPositionDesktop] = useState<'bottom-right' | 'bottom-left' | 'top-right' | 'top-left'>(DEFAULT_SETTINGS.positionDesktop);
  const [positionMobile, setPositionMobile] = useState<'bottom-right' | 'bottom-left' | 'top-right' | 'top-left'>(DEFAULT_SETTINGS.positionMobile);
  const [statementUrl, setStatementUrl] = useState<string>(DEFAULT_SETTINGS.statementUrl);

  const [loading, setLoading] = useState<boolean>(true);
  const [saving, setSaving] = useState<boolean>(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [activePositionTab, setActivePositionTab] = useState<'desktop' | 'mobile'>('desktop');

  async function loadSettings() {
    try {
      setLoading(true);
      setError(null);
      
      let data: any = null;
      const candidateIds = getPluginCandidateIds();

      // 1. Try official EmDash plugin settings API
      for (const id of candidateIds) {
        try {
          const res = await fetch(`/_emdash/api/admin/plugins/${id}/settings`, {
            cache: "no-store",
            headers: {
              "Accept": "application/json",
              "X-EmDash-Request": "1",
            },
          });
          if (res.ok) {
            const json = await res.json();
            const values = json.data?.values || json.values;
            if (values && typeof values === 'object' && Object.keys(values).length > 0) {
              data = values;
              break;
            }
          }
        } catch {
          // try next
        }
      }

      // 2. Try plugin config route if settings store endpoint not found
      if (!data) {
        for (const id of candidateIds) {
          try {
            const res = await fetch(`/_emdash/api/plugins/${id}/config`, {
              cache: "no-store",
              headers: { "Accept": "application/json" },
            });
            if (res.ok) {
              const json = await res.json();
              const cfg = json.data || json;
              if (cfg && typeof cfg === 'object' && Object.keys(cfg).length > 0) {
                data = cfg;
                break;
              }
            }
          } catch {
            // try next
          }
        }
      }

      // 3. Fallback to legacy custom route (e.g. host-level /api/admin/accessibility)
      if (!data) {
        try {
          const res = await fetch("/api/admin/accessibility", { cache: "no-store" });
          if (res.ok) {
            const json = await res.json();
            data = json.settings || json.data || json;
          }
        } catch {
          // fallback ignore
        }
      }

      if (data) {
        if (typeof data.enabled === 'boolean') setEnabled(data.enabled);
        if (typeof data.language === 'string' && data.language) setLanguage(data.language);
        if (typeof data.primaryColor === 'string' && data.primaryColor) setPrimaryColor(toValid7CharHex(data.primaryColor));
        if (typeof data.iconId === 'string' && ['default', 'accessibility', 'assist', 'wheel'].includes(data.iconId)) {
          setIconId(data.iconId as any);
        }
        if (data.iconSize !== undefined && data.iconSize !== null) {
          const sz = Number(data.iconSize);
          if ([40, 48, 56].includes(sz)) setIconSize(sz);
        }
        if (typeof data.positionDesktop === 'string' && ['bottom-right', 'bottom-left', 'top-right', 'top-left'].includes(data.positionDesktop)) {
          setPositionDesktop(data.positionDesktop as any);
        }
        if (typeof data.positionMobile === 'string' && ['bottom-right', 'bottom-left', 'top-right', 'top-left'].includes(data.positionMobile)) {
          setPositionMobile(data.positionMobile as any);
        }
        if (typeof data.statementUrl === 'string') setStatementUrl(data.statementUrl);
      }
    } catch (err: any) {
      setError(err?.message || "Failed to load Accessibility settings.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadSettings();
  }, []);

  // Auto-dismiss success notification after 3 seconds
  useEffect(() => {
    if (!message) return;
    const timer = setTimeout(() => {
      setMessage(null);
    }, 3000);
    return () => clearTimeout(timer);
  }, [message]);

  async function handleSave(e?: React.FormEvent) {
    if (e) e.preventDefault();
    try {
      setSaving(true);
      setMessage(null);
      setError(null);

      // Validate URL if present (supports relative paths like /accessibility-statement and absolute URLs)
      if (statementUrl && statementUrl.trim()) {
        const cleanUrl = statementUrl.trim();
        const isRelative = cleanUrl.startsWith("/");
        const isAbsolute = /^https?:\/\//i.test(cleanUrl);
        if (!isRelative && !isAbsolute) {
          setError("Accessibility Statement URL must be a valid URL or path (e.g. /accessibility-statement or https://example.com/accessibility-statement).");
          setSaving(false);
          return;
        }
      }

      // Validate hex color
      const cleanColor = primaryColor.trim();
      if (!/^#([0-9A-Fa-f]{3}|[0-9A-Fa-f]{6})$/.test(cleanColor)) {
        setError("Widget Colour must be a valid hex color code (e.g. #1863DC).");
        setSaving(false);
        return;
      }
      const normalizedColor = toValid7CharHex(cleanColor);

      const payload = {
        enabled,
        language,
        primaryColor: normalizedColor,
        iconId,
        iconSize: Number(iconSize),
        positionDesktop,
        positionMobile,
        statementUrl: statementUrl.trim(),
      };

      let success = false;
      let errorMsg = "Unable to save settings. Please try again.";
      const candidateIds = getPluginCandidateIds();

      // 1. Save to official EmDash plugin settings endpoint (PUT /_emdash/api/admin/plugins/:id/settings)
      for (const id of candidateIds) {
        try {
          const res = await fetch(`/_emdash/api/admin/plugins/${id}/settings`, {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              "Accept": "application/json",
              "X-EmDash-Request": "1",
            },
            body: JSON.stringify({ values: payload }),
          });
          if (res.ok) {
            const data = await res.json().catch(() => ({}));
            if (data.success !== false) {
              success = true;
              break;
            }
          }
        } catch {
          // try next candidate
        }
      }

      // 2. Also sync to legacy custom endpoint if present on server (e.g. host-level /api/admin/accessibility)
      try {
        const res = await fetch("/api/admin/accessibility", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Accept": "application/json",
            "X-EmDash-Request": "1",
          },
          body: JSON.stringify(payload),
        });
        if (res.ok) {
          const data = await res.json().catch(() => ({}));
          if (data.success) {
            success = true;
          }
        }
      } catch {
        // Non-blocking fallback
      }

      if (!success) {
        throw new Error(errorMsg);
      }

      setPrimaryColor(normalizedColor);
      setMessage("✓ Settings saved successfully");
    } catch (err: any) {
      setError(err?.message || "Unable to save settings. Please try again.");
    } finally {
      setSaving(false);
    }
  }

  const icons: Array<{ id: 'default' | 'accessibility' | 'assist' | 'wheel'; label: string; name: string }> = [
    { id: 'default', label: 'Default icon', name: 'Accessibility Figure' },
    { id: 'accessibility', label: 'Accessibility icon', name: 'Universal Access' },
    { id: 'assist', label: 'Assist icon', name: 'Assist / Help' },
    { id: 'wheel', label: 'Wheelchair icon', name: 'Wheelchair' },
  ];

  const sizes: Array<{ value: number; label: string; px: string }> = [
    { value: 40, label: 'Small', px: '40px' },
    { value: 48, label: 'Medium', px: '48px' },
    { value: 56, label: 'Large', px: '56px' },
  ];

  const positions: Array<{ value: 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left'; label: string }> = [
    { value: 'bottom-right', label: 'Bottom Right' },
    { value: 'bottom-left', label: 'Bottom Left' },
    { value: 'top-right', label: 'Top Right' },
    { value: 'top-left', label: 'Top Left' },
  ];

  return (
    <div className="accessibility-toolkit-admin-page coddle-access-admin-page accessiyes-admin-page" style={{ padding: "2rem 2.5rem", maxWidth: "880px", margin: "0 auto", fontFamily: "inherit" }}>
      <style>{`
        .accessibility-toolkit-admin-page,
        .coddle-access-admin-page,
        .accessiyes-admin-page {
          --ay-heading: var(--color-kumo-text, var(--text-color-kumo-heading, var(--foreground, #0f172a)));
          --ay-description: var(--text-color-kumo-subtle, var(--muted-foreground, #475569));
          --ay-breadcrumb: var(--text-color-kumo-subtle, var(--muted-foreground, #64748b));
          --ay-breadcrumb-active: var(--color-kumo-text, var(--foreground, #0f172a));
          --ay-btn-bg: var(--color-kumo-surface, #ffffff);
          --ay-btn-border: var(--color-kumo-line, #cbd5e1);
          --ay-btn-text: var(--color-kumo-text, #0f172a);
          --ay-btn-hover-bg: var(--color-kumo-surface-hover, #f8fafc);
        }

        @media (prefers-color-scheme: dark) {
          :root:not([data-mode="light"]):not([data-theme="light"]):not(.light) .accessibility-toolkit-admin-page,
          :root:not([data-mode="light"]):not([data-theme="light"]):not(.light) .coddle-access-admin-page,
          :root:not([data-mode="light"]):not([data-theme="light"]):not(.light) .accessiyes-admin-page {
            --ay-heading: var(--color-kumo-text, #f8fafc);
            --ay-description: var(--text-color-kumo-subtle, #cbd5e1);
            --ay-breadcrumb: var(--text-color-kumo-subtle, #94a3b8);
            --ay-breadcrumb-active: var(--color-kumo-text, #f8fafc);
            --ay-btn-bg: var(--color-kumo-surface, #1e293b);
            --ay-btn-border: var(--color-kumo-line, #334155);
            --ay-btn-text: var(--color-kumo-text, #f8fafc);
            --ay-btn-hover-bg: var(--color-kumo-surface-hover, #334155);
          }
        }

        [data-mode="dark"] .accessibility-toolkit-admin-page,
        [data-theme="dark"] .accessibility-toolkit-admin-page,
        .dark .accessibility-toolkit-admin-page,
        :root.dark .accessibility-toolkit-admin-page,
        html[data-mode="dark"] .accessibility-toolkit-admin-page,
        body[data-mode="dark"] .accessibility-toolkit-admin-page,
        [data-mode="dark"] .coddle-access-admin-page,
        [data-theme="dark"] .coddle-access-admin-page,
        .dark .coddle-access-admin-page,
        :root.dark .coddle-access-admin-page,
        html[data-mode="dark"] .coddle-access-admin-page,
        body[data-mode="dark"] .coddle-access-admin-page,
        [data-mode="dark"] .accessiyes-admin-page,
        [data-theme="dark"] .accessiyes-admin-page,
        .dark .accessiyes-admin-page,
        :root.dark .accessiyes-admin-page,
        html[data-mode="dark"] .accessiyes-admin-page,
        body[data-mode="dark"] .accessiyes-admin-page {
          --ay-heading: var(--color-kumo-text, #f8fafc);
          --ay-description: var(--text-color-kumo-subtle, #cbd5e1);
          --ay-breadcrumb: var(--text-color-kumo-subtle, #94a3b8);
          --ay-breadcrumb-active: var(--color-kumo-text, #f8fafc);
          --ay-btn-bg: var(--color-kumo-surface, #1e293b);
          --ay-btn-border: var(--color-kumo-line, #334155);
          --ay-btn-text: var(--color-kumo-text, #f8fafc);
          --ay-btn-hover-bg: var(--color-kumo-surface-hover, #334155);
        }

        .accessibility-toolkit-admin-page .accessiyes-page-title,
        .coddle-access-admin-page .accessiyes-page-title,
        .accessiyes-admin-page .accessiyes-page-title {
          color: var(--ay-heading);
        }

        .accessibility-toolkit-admin-page .accessiyes-page-description,
        .coddle-access-admin-page .accessiyes-page-description,
        .accessiyes-admin-page .accessiyes-page-description {
          color: var(--ay-description);
        }

        .accessibility-toolkit-admin-page .accessiyes-breadcrumb,
        .coddle-access-admin-page .accessiyes-breadcrumb,
        .accessiyes-admin-page .accessiyes-breadcrumb {
          color: var(--ay-breadcrumb);
        }

        .accessibility-toolkit-admin-page .accessiyes-breadcrumb .accessiyes-breadcrumb-active,
        .coddle-access-admin-page .accessiyes-breadcrumb .accessiyes-breadcrumb-active,
        .accessiyes-admin-page .accessiyes-breadcrumb .accessiyes-breadcrumb-active {
          color: var(--ay-breadcrumb-active);
        }

        .accessibility-toolkit-admin-page .accessiyes-btn-preview,
        .coddle-access-admin-page .accessiyes-btn-preview,
        .accessiyes-admin-page .accessiyes-btn-preview {
          background: var(--ay-btn-bg);
          border: 1px solid var(--ay-btn-border);
          color: var(--ay-btn-text);
        }

        .accessibility-toolkit-admin-page .accessiyes-btn-preview:hover,
        .coddle-access-admin-page .accessiyes-btn-preview:hover,
        .accessiyes-admin-page .accessiyes-btn-preview:hover {
          background: var(--ay-btn-hover-bg);
        }
      `}</style>

      {/* Top Breadcrumb & Title */}
      <div className="accessiyes-header-section accessibility-toolkit-header-section coddle-header-section" style={{ marginBottom: "1.5rem", display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "1rem" }}>
        <div>
          <div className="accessiyes-breadcrumb" style={{ fontSize: "0.85rem", color: "var(--ay-breadcrumb, #64748b)", marginBottom: "0.45rem", display: "flex", gap: "0.4rem" }}>
            <span>Admin</span> / <span>Plugins</span> / <span className="accessiyes-breadcrumb-active" style={{ fontWeight: 600, color: "var(--ay-breadcrumb-active, #0f172a)" }}>Accessibility Toolkit</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "0.35rem" }}>
            <div
              style={{
                width: "36px",
                height: "36px",
                borderRadius: "9px",
                background: "linear-gradient(135deg, #1863DC 0%, #0D47A1 100%)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#ffffff",
                boxShadow: "0 2px 8px rgba(24, 99, 220, 0.25)",
                flexShrink: 0,
              }}
              aria-hidden="true"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" />
                <path d="m4.93 4.93 4.24 4.24" />
                <path d="m14.83 9.17 4.24-4.24" />
                <path d="m14.83 14.83 4.24 4.24" />
              </svg>
            </div>
            <h1 className="accessiyes-page-title" style={{ fontSize: "1.9rem", fontWeight: 800, color: "var(--ay-heading, #0f172a)", margin: 0, letterSpacing: "-0.02em" }}>
              Accessibility Toolkit
            </h1>
          </div>
          <p className="accessiyes-page-description" style={{ color: "var(--ay-description, #64748b)", fontSize: "0.95rem", margin: "0.2rem 0 0 0", maxWidth: "800px" }}>
            Customize the language, colour, icon, dimensions, and positioning of the official Accessibility Toolkit.
          </p>
        </div>

        <div style={{ display: "flex", gap: "0.75rem", alignItems: "center" }}>
          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="accessiyes-btn-preview"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "0.4rem",
              padding: "0.65rem 1.25rem",
              background: "var(--ay-btn-bg, #ffffff)",
              border: "1px solid var(--ay-btn-border, #cbd5e1)",
              borderRadius: "8px",
              color: "var(--ay-btn-text, #0f172a)",
              fontWeight: 600,
              fontSize: "0.9rem",
              textDecoration: "none",
              boxShadow: "0 1px 2px rgba(0,0,0,0.05)",
              transition: "all 0.15s ease",
            }}
          >
            <span>Preview Frontend ↗</span>
          </a>
        </div>
      </div>

      {/* Brand Identity Panel */}
      <div
        style={{
          background: "linear-gradient(135deg, #f0f7ff 0%, #ffffff 100%)",
          border: "1.5px solid #bfdbfe",
          borderRadius: "12px",
          padding: "1.1rem 1.5rem",
          marginBottom: "1.75rem",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: "1rem",
          boxShadow: "0 1px 3px rgba(24, 99, 220, 0.04)",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "0.85rem" }}>
          <div
            style={{
              width: "32px",
              height: "32px",
              borderRadius: "8px",
              background: "#1863DC",
              color: "#ffffff",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
            }}
            aria-hidden="true"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10" />
              <path d="m4.93 4.93 4.24 4.24" />
              <path d="m14.83 9.17 4.24-4.24" />
              <path d="m14.83 14.83 4.24 4.24" />
            </svg>
          </div>
          <div>
            <div style={{ fontSize: "0.95rem", fontWeight: 700, color: "#1e3a8a", display: "flex", alignItems: "center", gap: "0.5rem" }}>
              <span>Accessibility Suite</span>
              <span style={{ fontSize: "0.7rem", color: "#16a34a", fontWeight: 700, background: "#dcfce7", padding: "0.1rem 0.45rem", borderRadius: "4px" }}>
                WCAG 2.2 Level AA
              </span>
            </div>
            <div style={{ fontSize: "0.82rem", color: "#475569" }}>
              Web & Municipal Accessibility Suite • Standard Edition
            </div>
          </div>
        </div>

        <div
          style={{
            fontSize: "0.82rem",
            fontWeight: 600,
            color: "#1863DC",
            display: "inline-flex",
            alignItems: "center",
            gap: "0.3rem",
            padding: "0.35rem 0.75rem",
            borderRadius: "6px",
            background: "#ffffff",
            border: "1px solid #bfdbfe",
          }}
        >
          <span>WCAG 2.2 AA / ADA 508</span>
        </div>
      </div>

      {loading ? (
        <div style={{ padding: "4rem", textAlign: "center", color: "#64748b", background: "#ffffff", borderRadius: "12px", border: "1px solid #e2e8f0" }}>
          Loading Accessibility settings...
        </div>
      ) : (
        <form onSubmit={handleSave} noValidate style={{ display: "flex", flexDirection: "column", gap: "1.75rem" }}>
          {/* 1. Master Enable/Disable Card */}
            <div
              style={{
                background: "#ffffff",
                border: "1px solid #e2e8f0",
                borderRadius: "12px",
                padding: "1.5rem 1.75rem",
                boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <div>
                <h3 style={{ fontSize: "1.15rem", fontWeight: 700, margin: "0 0 0.35rem 0", color: "#0f172a" }}>
                  Enable Accessibility Widget
                </h3>
                <p style={{ margin: 0, fontSize: "0.9rem", color: "#64748b" }}>
                  When enabled, the accessibility widget and its standalone tools are rendered on all live public pages.
                </p>
              </div>

              <button
                type="button"
                id="accessiyes-enabled-toggle"
                role="switch"
                aria-checked={enabled}
                aria-label="Enable Accessibility Widget"
                onClick={() => setEnabled(!enabled)}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "0.6rem",
                  padding: "0.55rem 1rem",
                  borderRadius: "9999px",
                  border: enabled ? "1.5px solid #16a34a" : "1.5px solid #cbd5e1",
                  background: enabled ? "#dcfce7" : "#f1f5f9",
                  color: enabled ? "#15803d" : "#64748b",
                  fontWeight: 700,
                  fontSize: "0.9rem",
                  cursor: "pointer",
                  transition: "all 0.15s ease",
                }}
              >
                <span
                  style={{
                    width: "12px",
                    height: "12px",
                    borderRadius: "50%",
                    background: enabled ? "#16a34a" : "#94a3b8",
                  }}
                />
                <span>{enabled ? "ON" : "OFF"}</span>
              </button>
            </div>

            {/* 2. Widget Language Card */}
            <div
              style={{
                background: "#ffffff",
                border: "1px solid #e2e8f0",
                borderRadius: "12px",
                padding: "1.75rem",
                boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
              }}
            >
              <label htmlFor="accessiyes-language" style={{ display: "block", fontSize: "1.1rem", fontWeight: 700, color: "#0f172a", marginBottom: "0.4rem" }}>
                Widget Language
              </label>
              <p style={{ fontSize: "0.9rem", color: "#64748b", margin: "0 0 1rem 0" }}>
                Default interface language for the accessibility menu.
              </p>

              <select
                id="accessiyes-language"
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                style={{
                  width: "100%",
                  maxWidth: "400px",
                  padding: "0.75rem 1rem",
                  fontSize: "0.95rem",
                  borderRadius: "8px",
                  border: "1.5px solid #cbd5e1",
                  background: "#ffffff",
                  color: "#0f172a",
                  fontWeight: 600,
                  outline: "none",
                  cursor: "pointer",
                }}
              >
                {SUPPORTED_LANGUAGES.map((lang) => (
                  <option key={lang.code} value={lang.code}>
                    {lang.name}
                  </option>
                ))}
              </select>
            </div>

            {/* 3. Widget Colour Card */}
            <div
              style={{
                background: "#ffffff",
                border: "1px solid #e2e8f0",
                borderRadius: "12px",
                padding: "1.75rem",
                boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
              }}
            >
              <label htmlFor="accessiyes-color-input" style={{ display: "block", fontSize: "1.1rem", fontWeight: 700, color: "#0f172a", marginBottom: "0.4rem" }}>
                Widget Colour
              </label>
              <p style={{ fontSize: "0.9rem", color: "#64748b", margin: "0 0 1.25rem 0" }}>
                Primary accent color used for the floating launcher button and active control highlights.
              </p>

              <div style={{ display: "flex", alignItems: "center", gap: "1rem", flexWrap: "wrap", marginBottom: "1.25rem" }}>
                {/* Native HTML Color Picker + Hex Input */}
                <div
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "0.75rem",
                    padding: "0.4rem 0.85rem",
                    background: "#f8fafc",
                    border: "1.5px solid #cbd5e1",
                    borderRadius: "8px",
                  }}
                >
                  <input
                    type="color"
                    id="accessiyes-color-picker"
                    aria-label="Choose widget color visually"
                    value={toValid7CharHex(primaryColor)}
                    onChange={(e) => setPrimaryColor(e.target.value.toUpperCase())}
                    style={{
                      width: "36px",
                      height: "36px",
                      border: "none",
                      borderRadius: "6px",
                      cursor: "pointer",
                      background: "transparent",
                      padding: 0,
                    }}
                  />
                  <input
                    type="text"
                    id="accessiyes-color-input"
                    aria-label="Widget Colour Hex code"
                    value={primaryColor}
                    onChange={(e) => setPrimaryColor(e.target.value)}
                    placeholder="#1863DC"
                    maxLength={7}
                    style={{
                      fontFamily: "monospace",
                      fontSize: "1.05rem",
                      fontWeight: 700,
                      color: "#0f172a",
                      background: "transparent",
                      border: "none",
                      outline: "none",
                      width: "100px",
                    }}
                  />
                </div>

                <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                  <span
                    style={{
                      display: "inline-block",
                      width: "18px",
                      height: "18px",
                      borderRadius: "50%",
                      backgroundColor: toValid7CharHex(primaryColor),
                      border: "1.5px solid rgba(0,0,0,0.15)",
                    }}
                  />
                  <span style={{ fontSize: "0.85rem", color: "#64748b", fontWeight: 600 }}>Live Swatch</span>
                </div>
              </div>

              {/* Preset Color Swatches */}
              <div>
                <div style={{ fontSize: "0.8rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em", color: "#64748b", marginBottom: "0.5rem" }}>
                  Quick Palette Suggestions
                </div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
                  {PRESET_COLORS.map((preset) => {
                    const isSelected = toValid7CharHex(primaryColor) === preset.hex.toUpperCase();
                    return (
                      <button
                        key={preset.hex}
                        type="button"
                        onClick={() => setPrimaryColor(preset.hex)}
                        title={preset.label}
                        aria-label={`Select color ${preset.label} (${preset.hex})`}
                        style={{
                          display: "inline-flex",
                          alignItems: "center",
                          gap: "0.45rem",
                          padding: "0.4rem 0.75rem",
                          background: isSelected ? "#e0f2fe" : "#f8fafc",
                          border: isSelected ? "1.5px solid #0284c7" : "1px solid #cbd5e1",
                          borderRadius: "6px",
                          fontSize: "0.82rem",
                          fontWeight: 600,
                          color: "#1e293b",
                          cursor: "pointer",
                          transition: "all 0.15s ease",
                        }}
                      >
                        <span style={{ width: "12px", height: "12px", borderRadius: "50%", background: preset.hex, display: "inline-block" }} />
                        <span>{preset.hex}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* 4. Widget Icon (Shape) Card */}
            <div
              style={{
                background: "#ffffff",
                border: "1px solid #e2e8f0",
                borderRadius: "12px",
                padding: "1.75rem",
                boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
              }}
            >
              <div style={{ fontSize: "1.1rem", fontWeight: 700, color: "#0f172a", marginBottom: "0.2rem" }}>
                Widget Icon
              </div>
              <div style={{ fontSize: "0.85rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em", color: "#64748b", marginBottom: "0.75rem" }}>
                Shape
              </div>

              <div
                role="radiogroup"
                aria-label="Widget Icon Shape"
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(130px, 1fr))",
                  gap: "1rem",
                  marginBottom: "1.75rem",
                }}
              >
                {icons.map((item) => {
                  const isSelected = iconId === item.id;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      role="radio"
                      aria-checked={isSelected}
                      aria-label={item.label}
                      onClick={() => setIconId(item.id)}
                      style={{
                        padding: "1.25rem 0.75rem",
                        borderRadius: "10px",
                        border: isSelected ? "2px solid #0284c7" : "1.5px solid #cbd5e1",
                        background: isSelected ? "#e0f2fe" : "#f8fafc",
                        color: isSelected ? "#0369a1" : "#334155",
                        cursor: "pointer",
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        gap: "0.6rem",
                        textAlign: "center",
                        transition: "all 0.15s ease",
                        boxShadow: isSelected ? "0 0 0 1px #0284c7, 0 4px 12px rgba(2, 132, 199, 0.12)" : "none",
                      }}
                    >
                      <div
                        style={{
                          width: "48px",
                          height: "48px",
                          borderRadius: "50%",
                          background: isSelected ? toValid7CharHex(primaryColor) : "#e2e8f0",
                          color: isSelected ? "#ffffff" : "#475569",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          transition: "background 0.15s ease",
                        }}
                      >
                        <RenderIconSvg iconId={item.id} size={26} color={isSelected ? "#ffffff" : "#475569"} />
                      </div>
                      <span style={{ fontSize: "0.85rem", fontWeight: 700 }}>{item.name}</span>
                      {isSelected && (
                        <span
                          style={{
                            fontSize: "0.72rem",
                            background: "#0284c7",
                            color: "#ffffff",
                            padding: "0.15rem 0.5rem",
                            borderRadius: "9999px",
                            fontWeight: 700,
                          }}
                        >
                          Selected
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Size Selector Section */}
              <div style={{ borderTop: "1px solid #e2e8f0", paddingTop: "1.5rem" }}>
                <div style={{ fontSize: "0.85rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em", color: "#64748b", marginBottom: "0.75rem" }}>
                  Size
                </div>

                <div
                  role="radiogroup"
                  aria-label="Widget Size"
                  style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap" }}
                >
                  {sizes.map((s) => {
                    const isSelected = Number(iconSize) === s.value;
                    return (
                      <button
                        key={s.value}
                        type="button"
                        role="radio"
                        aria-checked={isSelected}
                        aria-label={`Widget Size ${s.label} (${s.px})`}
                        onClick={() => setIconSize(s.value)}
                        style={{
                          padding: "0.65rem 1.4rem",
                          borderRadius: "8px",
                          border: isSelected ? "2px solid #0284c7" : "1.5px solid #cbd5e1",
                          background: isSelected ? "#0284c7" : "#ffffff",
                          color: isSelected ? "#ffffff" : "#334155",
                          fontWeight: 700,
                          fontSize: "0.95rem",
                          cursor: "pointer",
                          display: "inline-flex",
                          alignItems: "center",
                          gap: "0.4rem",
                          transition: "all 0.15s ease",
                          boxShadow: isSelected ? "0 2px 6px rgba(2, 132, 199, 0.3)" : "none",
                        }}
                      >
                        <span>{s.label}</span>
                        <span style={{ fontSize: "0.75rem", opacity: isSelected ? 0.9 : 0.6 }}>({s.px})</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* 5. Widget Position Card */}
            <div
              style={{
                background: "#ffffff",
                border: "1px solid #e2e8f0",
                borderRadius: "12px",
                padding: "1.75rem",
                boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
              }}
            >
              <div style={{ fontSize: "1.1rem", fontWeight: 700, color: "#0f172a", marginBottom: "0.4rem" }}>
                Widget Position
              </div>
              <p style={{ fontSize: "0.9rem", color: "#64748b", margin: "0 0 1.25rem 0" }}>
                Configure distinct launcher positions for desktop computers and mobile devices.
              </p>

              {/* Desktop / Mobile Tabs */}
              <div
                role="tablist"
                aria-label="Device position selector"
                style={{
                  display: "inline-flex",
                  padding: "0.25rem",
                  background: "#f1f5f9",
                  borderRadius: "8px",
                  marginBottom: "1.5rem",
                }}
              >
                <button
                  type="button"
                  role="tab"
                  aria-selected={activePositionTab === 'desktop'}
                  onClick={() => setActivePositionTab('desktop')}
                  style={{
                    padding: "0.55rem 1.4rem",
                    borderRadius: "6px",
                    border: "none",
                    background: activePositionTab === 'desktop' ? "#ffffff" : "transparent",
                    color: activePositionTab === 'desktop' ? "#0f172a" : "#64748b",
                    fontWeight: 700,
                    fontSize: "0.95rem",
                    cursor: "pointer",
                    boxShadow: activePositionTab === 'desktop' ? "0 1px 3px rgba(0,0,0,0.1)" : "none",
                    transition: "all 0.15s ease",
                  }}
                >
                  Desktop
                </button>
                <button
                  type="button"
                  role="tab"
                  aria-selected={activePositionTab === 'mobile'}
                  onClick={() => setActivePositionTab('mobile')}
                  style={{
                    padding: "0.55rem 1.4rem",
                    borderRadius: "6px",
                    border: "none",
                    background: activePositionTab === 'mobile' ? "#ffffff" : "transparent",
                    color: activePositionTab === 'mobile' ? "#0f172a" : "#64748b",
                    fontWeight: 700,
                    fontSize: "0.95rem",
                    cursor: "pointer",
                    boxShadow: activePositionTab === 'mobile' ? "0 1px 3px rgba(0,0,0,0.1)" : "none",
                    transition: "all 0.15s ease",
                  }}
                >
                  Mobile
                </button>
              </div>

              {/* Tab Content: Desktop */}
              {activePositionTab === 'desktop' && (
                <div>
                  <label htmlFor="accessiyes-pos-desktop" style={{ display: "block", fontSize: "0.95rem", fontWeight: 700, color: "#0f172a", marginBottom: "0.4rem" }}>
                    Desktop Position
                  </label>
                  <select
                    id="accessiyes-pos-desktop"
                    value={positionDesktop}
                    onChange={(e) => setPositionDesktop(e.target.value as any)}
                    style={{
                      width: "100%",
                      maxWidth: "380px",
                      padding: "0.75rem 1rem",
                      fontSize: "0.95rem",
                      borderRadius: "8px",
                      border: "1.5px solid #cbd5e1",
                      background: "#ffffff",
                      color: "#0f172a",
                      fontWeight: 600,
                      outline: "none",
                      cursor: "pointer",
                      marginBottom: "1.25rem",
                    }}
                  >
                    {positions.map((p) => (
                      <option key={p.value} value={p.value}>
                        {p.label}
                      </option>
                    ))}
                  </select>

                  {/* 2x2 Interactive Visual Placement Grid */}
                  <div style={{ maxWidth: "380px", background: "#f8fafc", border: "1.5px dashed #cbd5e1", borderRadius: "10px", padding: "1rem" }}>
                    <div style={{ fontSize: "0.75rem", fontWeight: 700, color: "#64748b", textTransform: "uppercase", marginBottom: "0.75rem", textAlign: "center" }}>
                      Desktop Screen Placement Preview
                    </div>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem", height: "130px" }}>
                      {[
                        { pos: 'top-left', label: 'Top Left' },
                        { pos: 'top-right', label: 'Top Right' },
                        { pos: 'bottom-left', label: 'Bottom Left' },
                        { pos: 'bottom-right', label: 'Bottom Right' },
                      ].map((cell) => {
                        const isSelected = positionDesktop === cell.pos;
                        return (
                          <button
                            key={cell.pos}
                            type="button"
                            onClick={() => setPositionDesktop(cell.pos as any)}
                            style={{
                              borderRadius: "6px",
                              border: isSelected ? "2px solid #0284c7" : "1px solid #e2e8f0",
                              background: isSelected ? "#e0f2fe" : "#ffffff",
                              color: isSelected ? "#0369a1" : "#64748b",
                              fontWeight: 700,
                              fontSize: "0.8rem",
                              cursor: "pointer",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              gap: "0.35rem",
                              transition: "all 0.15s ease",
                            }}
                          >
                            {isSelected && <span style={{ width: "8px", height: "8px", borderRadius: "50%", background: toValid7CharHex(primaryColor) }} />}
                            <span>{cell.label}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}

              {/* Tab Content: Mobile */}
              {activePositionTab === 'mobile' && (
                <div>
                  <label htmlFor="accessiyes-pos-mobile" style={{ display: "block", fontSize: "0.95rem", fontWeight: 700, color: "#0f172a", marginBottom: "0.4rem" }}>
                    Mobile Position
                  </label>
                  <select
                    id="accessiyes-pos-mobile"
                    value={positionMobile}
                    onChange={(e) => setPositionMobile(e.target.value as any)}
                    style={{
                      width: "100%",
                      maxWidth: "380px",
                      padding: "0.75rem 1rem",
                      fontSize: "0.95rem",
                      borderRadius: "8px",
                      border: "1.5px solid #cbd5e1",
                      background: "#ffffff",
                      color: "#0f172a",
                      fontWeight: 600,
                      outline: "none",
                      cursor: "pointer",
                      marginBottom: "1.25rem",
                    }}
                  >
                    {positions.map((p) => (
                      <option key={p.value} value={p.value}>
                        {p.label}
                      </option>
                    ))}
                  </select>

                  {/* 2x2 Interactive Visual Placement Grid */}
                  <div style={{ maxWidth: "380px", background: "#f8fafc", border: "1.5px dashed #cbd5e1", borderRadius: "10px", padding: "1rem" }}>
                    <div style={{ fontSize: "0.75rem", fontWeight: 700, color: "#64748b", textTransform: "uppercase", marginBottom: "0.75rem", textAlign: "center" }}>
                      Mobile Screen Placement Preview
                    </div>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem", height: "130px" }}>
                      {[
                        { pos: 'top-left', label: 'Top Left' },
                        { pos: 'top-right', label: 'Top Right' },
                        { pos: 'bottom-left', label: 'Bottom Left' },
                        { pos: 'bottom-right', label: 'Bottom Right' },
                      ].map((cell) => {
                        const isSelected = positionMobile === cell.pos;
                        return (
                          <button
                            key={cell.pos}
                            type="button"
                            onClick={() => setPositionMobile(cell.pos as any)}
                            style={{
                              borderRadius: "6px",
                              border: isSelected ? "2px solid #0284c7" : "1px solid #e2e8f0",
                              background: isSelected ? "#e0f2fe" : "#ffffff",
                              color: isSelected ? "#0369a1" : "#64748b",
                              fontWeight: 700,
                              fontSize: "0.8rem",
                              cursor: "pointer",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              gap: "0.35rem",
                              transition: "all 0.15s ease",
                            }}
                          >
                            {isSelected && <span style={{ width: "8px", height: "8px", borderRadius: "50%", background: toValid7CharHex(primaryColor) }} />}
                            <span>{cell.label}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* 6. Accessibility Statement URL Card */}
            <div
              style={{
                background: "#ffffff",
                border: "1px solid #e2e8f0",
                borderRadius: "12px",
                padding: "1.75rem",
                boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
              }}
            >
              <label htmlFor="accessiyes-statement-url" style={{ display: "block", fontSize: "1.1rem", fontWeight: 700, color: "#0f172a", marginBottom: "0.4rem" }}>
                Accessibility Statement URL
              </label>
              <p style={{ fontSize: "0.9rem", color: "#64748b", margin: "0 0 1rem 0" }}>
                Optional URL to your website's official accessibility statement or compliance page.
              </p>

              <input
                type="text"
                id="accessiyes-statement-url"
                placeholder="/accessibility-statement or https://example.com/accessibility-statement"
                value={statementUrl}
                onChange={(e) => setStatementUrl(e.target.value)}
                style={{
                  width: "100%",
                  padding: "0.75rem 1rem",
                  fontSize: "0.95rem",
                  borderRadius: "8px",
                  border: "1.5px solid #cbd5e1",
                  background: "#ffffff",
                  color: "#0f172a",
                  outline: "none",
                  boxSizing: "border-box",
                }}
              />
            </div>

            {/* Notifications */}
            {message && (
              <div
                role="status"
                style={{
                  padding: "1rem 1.25rem",
                  borderRadius: "8px",
                  background: "#dcfce7",
                  border: "1px solid #86efac",
                  color: "#14532d",
                  display: "flex",
                  alignItems: "center",
                  gap: "0.6rem",
                  fontWeight: 600,
                  fontSize: "0.95rem",
                }}
              >
                <span style={{ fontWeight: "bold", fontSize: "1.1rem" }}>✓</span>
                <span>{message}</span>
              </div>
            )}

            {error && (
              <div
                role="alert"
                style={{
                  padding: "1rem 1.25rem",
                  borderRadius: "8px",
                  background: "#fee2e2",
                  border: "1px solid #fca5a5",
                  color: "#7f1d1d",
                  display: "flex",
                  alignItems: "center",
                  gap: "0.6rem",
                  fontWeight: 600,
                  fontSize: "0.95rem",
                }}
              >
                <span style={{ fontSize: "1.1rem" }}>⚠️</span>
                <span>{error}</span>
              </div>
            )}

            {/* Save Button Row */}
            <div style={{ display: "flex", justifyContent: "flex-end", paddingTop: "0.5rem" }}>
              <button
                type="submit"
                id="accessiyes-save-btn"
                disabled={saving || loading}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "0.5rem",
                  padding: "0.85rem 2.25rem",
                  background: saving ? "#94a3b8" : "#0284c7",
                  color: "#ffffff",
                  border: "none",
                  borderRadius: "8px",
                  fontWeight: 800,
                  fontSize: "1rem",
                  cursor: saving || loading ? "not-allowed" : "pointer",
                  boxShadow: "0 4px 14px rgba(2, 132, 199, 0.35)",
                  transition: "background 0.15s ease",
                }}
              >
                {saving ? "Saving Changes..." : "Save Settings"}
              </button>
            </div>
        </form>
      )}
    </div>
  );
}

// EmDash Plugin Admin Registry Exports
export const CoddleAccessAdminPage = AccessibilityToolkitAdminPage;
export const AccessiYesAdminPage = AccessibilityToolkitAdminPage;

export const pages: Record<string, React.ComponentType> = {
  "/settings": AccessibilityToolkitAdminPage,
  "/": AccessibilityToolkitAdminPage,
};

export default {
  pages,
};

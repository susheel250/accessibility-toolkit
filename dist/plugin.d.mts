import { SandboxedPlugin } from "emdash/plugin";

//#region src/plugin.d.ts
declare const WIDGET_SRI_HASH = "sha384-PkHCo9yYYt43CM9mczXrTqkNN0ddgEpZos0hrTEP62/Iox7z6iWI3CfR06lzbWdK";
declare const CANONICAL_CDN_BASE_URL = "https://cdn.jsdelivr.net/gh/susheel250/accessibility-toolkit@v1.3.5/vendor/accessibility-toolkit/";
declare const DEFAULT_CDN_BASE_URL = "https://cdn.jsdelivr.net/gh/susheel250/accessibility-toolkit@v1.3.5/vendor/accessibility-toolkit/";
declare const LOCAL_WIDGET_SCRIPT_PATH = "/vendor/accessibility-toolkit/js/widget.min.js";
declare const LOCAL_FONTS_PATH = "/vendor/accessibility-toolkit/fonts/";
declare const LEGACY_LOCAL_WIDGET_SCRIPT_PATH = "/vendor/coddle-access/js/widget.min.js";
/**
 * Sanitizes and normalizes a CDN base URL.
 * - Strips tracking query parameters (e.g. ?utm_source=chatgpt.com) and hash fragments.
 * - Strips accidental file suffixes (/js/widget.min.js, /js/widget.js, /js, /fonts, /fonts/).
 * - Strips trailing slashes.
 * - Migrates obsolete repository URLs (coddle-accessibility, coddle-access, @v1.3.4, @v1.3.5) to the canonical CDN base URL.
 * - Resolves "default" to CANONICAL_CDN_BASE_URL.
 * - Resolves "local" or "none" to empty string (local mode).
 * - Rejects non-HTTPS or malformed URLs, returning empty string.
 */
declare function sanitizeCdnBaseUrl(val: unknown): string;
interface EffectiveCdnConfig {
  cdnConfigured: boolean;
  mode: "cdn" | "local";
  cdnBaseUrl: string;
  scriptUrl: string;
  fontsUrl: string;
  sri: string;
}
/**
 * Resolves effective CDN configuration from saved cdnBaseUrl setting.
 * When cdnBaseUrl resolves to an HTTPS URL, returns mode: "cdn" with canonical asset paths.
 * When cdnBaseUrl is empty, "local", or invalid, returns mode: "local" with local vendor asset paths.
 */
declare function resolveCdnConfig(cdnBaseUrlSetting: unknown): EffectiveCdnConfig;
interface AccessibilityToolkitSettings {
  enabled: boolean;
  language: string;
  primaryColor: string;
  iconId: "default" | "accessibility" | "assist" | "wheel";
  iconSize: number;
  positionDesktop: "bottom-right" | "bottom-left" | "top-right" | "top-left";
  positionMobile: "bottom-right" | "bottom-left" | "top-right" | "top-left";
  statementUrl: string;
  cdnBaseUrl?: string;
}
/** @deprecated Use AccessibilityToolkitSettings instead. Retained for backwards compatibility. */
type CoddleAccessSettings = AccessibilityToolkitSettings;
declare const DEFAULT_SETTINGS: AccessibilityToolkitSettings;
declare const SUPPORTED_LANGUAGES: {
  value: string;
  label: string;
}[];
declare const ICONS: {
  value: string;
  label: string;
}[];
declare const SIZES: {
  value: string;
  label: string;
}[];
declare const POSITIONS: {
  value: string;
  label: string;
}[];
declare const PRESET_COLORS: {
  hex: string;
  label: string;
}[];
declare function normalizeBoolean(val: unknown, fallback?: boolean): boolean;
declare function toValid7CharHex(val: string): string;
declare function normalizeIconId(val: unknown): "default" | "accessibility" | "assist" | "wheel";
declare function normalizePosition(val: unknown): "bottom-right" | "bottom-left" | "top-right" | "top-left";
declare const blocks: {
  header: (text: string) => {
    type: "header";
    text: string;
  };
  context: (text: string) => {
    type: "context";
    text: string;
  };
  banner: (opts: {
    title?: string;
    description?: string;
    variant?: "default" | "alert" | "error";
  }) => {
    type: "banner";
    title: string | undefined;
    description: string | undefined;
    variant: "default" | "alert" | "error";
  };
  actions: (elementsList: any[]) => {
    type: "actions";
    elements: any[];
  };
  form: (opts: {
    fields: any[];
    submit: {
      label: string;
      action_id: string;
    };
  }) => {
    type: "form";
    fields: any[];
    submit: {
      label: string;
      action_id: string;
    };
  };
  fields: (fieldsList: Array<{
    label: string;
    value: string;
  }>) => {
    type: "fields";
    fields: {
      label: string;
      value: string;
    }[];
  };
  divider: () => {
    type: "divider";
  };
};
declare const elements: {
  link: (label: string, target: {
    kind: "external";
    url: string;
  } | {
    kind: "plugin-page";
    path: string;
  } | {
    kind: "plugin-settings";
  }, opts?: {
    appearance?: "inline" | "primary" | "secondary";
  }) => {
    type: "link";
    label: string;
    target: {
      kind: "external";
      url: string;
    } | {
      kind: "plugin-page";
      path: string;
    } | {
      kind: "plugin-settings";
    };
    appearance: "inline" | "primary" | "secondary";
  };
  toggle: (action_id: string, label: string, opts?: {
    description?: string;
    initialValue?: boolean;
  }) => {
    type: "toggle";
    action_id: string;
    label: string;
    description: string | undefined;
    initial_value: boolean | undefined;
  };
  select: (action_id: string, label: string, options: Array<{
    label: string;
    value: string;
  }>, opts?: {
    initialValue?: string;
  }) => {
    type: "select";
    action_id: string;
    label: string;
    options: {
      label: string;
      value: string;
    }[];
    initial_value: string | undefined;
  };
  textInput: (action_id: string, label: string, opts?: {
    placeholder?: string;
    initialValue?: string;
    multiline?: boolean;
  }) => {
    type: "text_input";
    action_id: string;
    label: string;
    placeholder: string | undefined;
    initial_value: string | undefined;
    multiline: boolean | undefined;
  };
};
declare function renderAdminBlocks(settings: AccessibilityToolkitSettings, previewUrl?: string): ({
  type: "header";
  text: string;
} | {
  type: "context";
  text: string;
} | {
  type: "banner";
  title: string | undefined;
  description: string | undefined;
  variant: "default" | "alert" | "error";
} | {
  type: "actions";
  elements: any[];
} | {
  type: "form";
  fields: any[];
  submit: {
    label: string;
    action_id: string;
  };
} | {
  type: "fields";
  fields: {
    label: string;
    value: string;
  }[];
} | {
  type: "divider";
})[];
/**
 * Accessibility Toolkit - Sandboxed EmDash Plugin Entrypoint
 *
 * Runs securely inside EmDash workerd sandbox.
 * Provides custom Block Kit admin interface at /_emdash/admin/plugins/$id/settings,
 * declarative settings schema for the plugin manager,
 * and public HTTP endpoints for widget configuration and embedding.
 */
declare const plugin: SandboxedPlugin;
//#endregion
export { AccessibilityToolkitSettings, CANONICAL_CDN_BASE_URL, CoddleAccessSettings, DEFAULT_CDN_BASE_URL, DEFAULT_SETTINGS, EffectiveCdnConfig, ICONS, LEGACY_LOCAL_WIDGET_SCRIPT_PATH, LOCAL_FONTS_PATH, LOCAL_WIDGET_SCRIPT_PATH, POSITIONS, PRESET_COLORS, SIZES, SUPPORTED_LANGUAGES, WIDGET_SRI_HASH, blocks, plugin as default, elements, normalizeBoolean, normalizeIconId, normalizePosition, renderAdminBlocks, resolveCdnConfig, sanitizeCdnBaseUrl, toValid7CharHex };
import type { SandboxedPlugin } from "emdash/plugin";

export const WIDGET_SRI_HASH = "sha384-PkHCo9yYYt43CM9mczXrTqkNN0ddgEpZos0hrTEP62/Iox7z6iWI3CfR06lzbWdK";

export const CANONICAL_CDN_BASE_URL =
	"https://cdn.jsdelivr.net/gh/susheel250/accessibility-toolkit@v1.3.6/vendor/accessibility-toolkit/";

export const DEFAULT_CDN_BASE_URL = CANONICAL_CDN_BASE_URL;

export const LOCAL_WIDGET_SCRIPT_PATH = "/vendor/accessibility-toolkit/js/widget.min.js";
export const LOCAL_FONTS_PATH = "/vendor/accessibility-toolkit/fonts/";
export const LEGACY_LOCAL_WIDGET_SCRIPT_PATH = "/vendor/coddle-access/js/widget.min.js";

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
export function sanitizeCdnBaseUrl(val: unknown): string {
	if (typeof val !== "string") return "";
	const trimmed = val.trim();
	if (!trimmed) return "";

	if (trimmed.toLowerCase() === "default") {
		return CANONICAL_CDN_BASE_URL;
	}
	if (trimmed.toLowerCase() === "local" || trimmed.toLowerCase() === "none") {
		return "";
	}

	try {
		const parsed = new URL(trimmed);
		if (parsed.protocol !== "https:") return "";

		// Remove search params and hash
		parsed.search = "";
		parsed.hash = "";

		// Migrate obsolete repository and legacy release paths
		const lowerHref = parsed.href.toLowerCase();
		if (
			lowerHref.includes("coddle-accessibility") ||
			lowerHref.includes("coddle-access")
		) {
			return CANONICAL_CDN_BASE_URL;
		}

		// Strip accidental file/subpath suffixes
		let pathname = parsed.pathname
			.replace(/[/]+(js([/]widget([.]min)?[.]js)?|fonts)[/]?$/, "")
			.replace(/[/]+$/, "");

		return `${parsed.origin}${pathname}`;
	} catch {
		return "";
	}
}

export interface EffectiveCdnConfig {
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
export function resolveCdnConfig(cdnBaseUrlSetting: unknown): EffectiveCdnConfig {
	const sanitized = sanitizeCdnBaseUrl(cdnBaseUrlSetting);
	const hasCdn = Boolean(sanitized);

	if (hasCdn) {
		const cleanBase = sanitized.replace(/[/]+$/, "");
		return {
			cdnConfigured: true,
			mode: "cdn",
			cdnBaseUrl: `${cleanBase}/`,
			scriptUrl: `${cleanBase}/js/widget.min.js`,
			fontsUrl: `${cleanBase}/fonts/`,
			sri: WIDGET_SRI_HASH,
		};
	}

	return {
		cdnConfigured: false,
		mode: "local",
		cdnBaseUrl: "",
		scriptUrl: LOCAL_WIDGET_SCRIPT_PATH,
		fontsUrl: LOCAL_FONTS_PATH,
		sri: WIDGET_SRI_HASH,
	};
}

export interface AccessibilityToolkitSettings {
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
export type CoddleAccessSettings = AccessibilityToolkitSettings;

export const DEFAULT_SETTINGS: AccessibilityToolkitSettings = {
	enabled: true,
	language: "en",
	primaryColor: "#1863DC",
	iconId: "default",
	iconSize: 48,
	positionDesktop: "bottom-right",
	positionMobile: "bottom-right",
	statementUrl: "/accessibility-statement",
	cdnBaseUrl: CANONICAL_CDN_BASE_URL,
};

export const SUPPORTED_LANGUAGES = [
	{ value: "en", label: "English" },
	{ value: "es", label: "Spanish (Español)" },
	{ value: "fr", label: "French (Français)" },
	{ value: "de", label: "German (Deutsch)" },
	{ value: "it", label: "Italian (Italiano)" },
	{ value: "pt", label: "Portuguese (Português)" },
	{ value: "nl", label: "Dutch (Nederlands)" },
	{ value: "pl", label: "Polish (Polski)" },
	{ value: "da", label: "Danish (Dansk)" },
	{ value: "sv", label: "Swedish (Svenska)" },
	{ value: "no", label: "Norwegian (Norsk)" },
	{ value: "fi", label: "Finnish (Suomi)" },
];

export const ICONS = [
	{ value: "default", label: "Default (Accessibility Figure)" },
	{ value: "accessibility", label: "Universal Access" },
	{ value: "assist", label: "Assist / Help" },
	{ value: "wheel", label: "Wheelchair" },
];

export const SIZES = [
	{ value: "40", label: "Small (40px)" },
	{ value: "48", label: "Medium (48px)" },
	{ value: "56", label: "Large (56px)" },
];

export const POSITIONS = [
	{ value: "bottom-right", label: "Bottom Right" },
	{ value: "bottom-left", label: "Bottom Left" },
	{ value: "top-right", label: "Top Right" },
	{ value: "top-left", label: "Top Left" },
];

export const PRESET_COLORS = [
	{ hex: "#1863DC", label: "Ocean Blue (Default)" },
	{ hex: "#0369A1", label: "Deep Ocean Blue" },
	{ hex: "#0D9488", label: "Teal" },
	{ hex: "#4F46E5", label: "Indigo" },
	{ hex: "#16A34A", label: "Emerald" },
	{ hex: "#0F172A", label: "Slate Dark" },
];

export function normalizeBoolean(val: unknown, fallback: boolean = true): boolean {
	if (val === undefined || val === null) return fallback;
	if (typeof val === "boolean") return val;
	if (typeof val === "string") {
		const s = val.trim().toLowerCase();
		if (s === "false" || s === "0" || s === "off" || s === "no") return false;
		if (s === "true" || s === "1" || s === "on" || s === "yes") return true;
	}
	if (typeof val === "number") return val !== 0;
	return fallback;
}

export function toValid7CharHex(val: string): string {
	if (!val) return "#1863DC";
	const clean = val.trim();
	if (/^#[0-9A-Fa-f]{6}$/.test(clean)) return clean.toUpperCase();
	if (/^#[0-9A-Fa-f]{3}$/.test(clean)) {
		const r = clean[1],
			g = clean[2],
			b = clean[3];
		return `#${r}${r}${g}${g}${b}${b}`.toUpperCase();
	}
	return "#1863DC";
}

export function normalizeIconId(val: unknown): "default" | "accessibility" | "assist" | "wheel" {
	const str = String(val || "").trim();
	if (str === "person") return "default";
	if (str === "universal-access") return "accessibility";
	if (str === "wheelchair") return "wheel";
	if (["default", "accessibility", "assist", "wheel"].includes(str)) {
		return str as "default" | "accessibility" | "assist" | "wheel";
	}
	return "default";
}

export function normalizePosition(
	val: unknown,
): "bottom-right" | "bottom-left" | "top-right" | "top-left" {
	const str = String(val || "").trim();
	if (["bottom-right", "bottom-left", "top-right", "top-left"].includes(str)) {
		return str as "bottom-right" | "bottom-left" | "top-right" | "top-left";
	}
	return "bottom-right";
}

// Lightweight, zero-dependency Block Kit builders for fast execution and minimal bundle size
export const blocks = {
	header: (text: string) => ({ type: "header" as const, text }),
	context: (text: string) => ({ type: "context" as const, text }),
	banner: (opts: { title?: string; description?: string; variant?: "default" | "alert" | "error" }) => ({
		type: "banner" as const,
		title: opts.title,
		description: opts.description,
		variant: opts.variant || "default",
	}),
	actions: (elementsList: any[]) => ({ type: "actions" as const, elements: elementsList }),
	form: (opts: { fields: any[]; submit: { label: string; action_id: string } }) => ({
		type: "form" as const,
		fields: opts.fields,
		submit: opts.submit,
	}),
	fields: (fieldsList: Array<{ label: string; value: string }>) => ({
		type: "fields" as const,
		fields: fieldsList,
	}),
	divider: () => ({ type: "divider" as const }),
};

export const elements = {
	link: (
		label: string,
		target: { kind: "external"; url: string } | { kind: "plugin-page"; path: string } | { kind: "plugin-settings" },
		opts?: { appearance?: "inline" | "primary" | "secondary" },
	) => ({
		type: "link" as const,
		label,
		target,
		appearance: opts?.appearance || "secondary",
	}),
	toggle: (
		action_id: string,
		label: string,
		opts?: { description?: string; initialValue?: boolean },
	) => ({
		type: "toggle" as const,
		action_id,
		label,
		description: opts?.description,
		initial_value: opts?.initialValue,
	}),
	select: (
		action_id: string,
		label: string,
		options: Array<{ label: string; value: string }>,
		opts?: { initialValue?: string },
	) => ({
		type: "select" as const,
		action_id,
		label,
		options,
		initial_value: opts?.initialValue,
	}),
	textInput: (
		action_id: string,
		label: string,
		opts?: { placeholder?: string; initialValue?: string; multiline?: boolean },
	) => ({
		type: "text_input" as const,
		action_id,
		label,
		placeholder: opts?.placeholder,
		initial_value: opts?.initialValue,
		multiline: opts?.multiline,
	}),
};

export function renderAdminBlocks(
	settings: AccessibilityToolkitSettings,
	previewUrl: string = "http://localhost:4321/",
) {
	const validPreviewUrl =
		previewUrl.startsWith("http://") || previewUrl.startsWith("https://")
			? previewUrl
			: "http://localhost:4321/";

	return [
		blocks.header("Accessibility Toolkit"),
		blocks.context(
			"Customize the language, colour, icon, dimensions, and positioning of the official Accessibility Toolkit.",
		),
		blocks.actions([
			elements.link(
				"Preview Frontend ↗",
				{ kind: "external", url: validPreviewUrl },
				{ appearance: "secondary" },
			),
		]),
		blocks.banner({
			title: "Accessibility Suite — WCAG 2.2 Level AA",
			description:
				"Municipal & Web Accessibility Suite • Standard Edition",
			variant: "default",
		}),
		blocks.form({
			fields: [
				elements.toggle("enabled", "Enable Accessibility Widget", {
					description:
						"When enabled, the accessibility widget launcher and toolbar tools are rendered on all public website pages.",
					initialValue: settings.enabled,
				}),
				elements.select("language", "Widget Language (12 Locales)", SUPPORTED_LANGUAGES, {
					initialValue: settings.language,
				}),
				elements.textInput("primaryColor", `Widget Colour (Current: ${settings.primaryColor})`, {
					placeholder: "#1863DC",
					initialValue: settings.primaryColor,
				}),
				elements.select("iconId", "Launcher Icon (Shape)", ICONS, {
					initialValue: settings.iconId,
				}),
				elements.select("iconSize", "Button Size (Diameter)", SIZES, {
					initialValue: String(settings.iconSize),
				}),
				elements.select("positionDesktop", "Desktop Screen Position", POSITIONS, {
					initialValue: settings.positionDesktop,
				}),
				elements.select("positionMobile", "Mobile Screen Position", POSITIONS, {
					initialValue: settings.positionMobile,
				}),
				elements.textInput("cdnBaseUrl", "CDN Base URL (Optional)", {
					placeholder: CANONICAL_CDN_BASE_URL,
					initialValue: settings.cdnBaseUrl || "",
				}),
				elements.textInput("statementUrl", "Accessibility Statement URL", {
					placeholder: "/accessibility-statement or https://example.com/accessibility-statement",
					initialValue: settings.statementUrl,
				}),
			],
			submit: {
				label: "Save Settings",
				action_id: "save_settings",
			},
		}),
		blocks.divider(),
		blocks.fields([
			{
				label: "Active Settings Summary",
				value: `Status: ${settings.enabled ? "Active (Enabled)" : "Disabled"} • Color: ${settings.primaryColor} • Icon: ${settings.iconId} (${settings.iconSize}px) • Desktop: ${settings.positionDesktop} • Mobile: ${settings.positionMobile} • CDN: ${settings.cdnBaseUrl ? "Configured" : "Local Assets"}`,
			},
			{
				label: "Quick Palette Suggestions",
				value:
					"Ocean Blue: #1863DC | Deep Blue: #0369A1 | Teal: #0D9488 | Indigo: #4F46E5 | Emerald: #16A34A | Slate Dark: #0F172A",
			},
			{
				label: "Frontend Integration",
				value:
					"In EmDash, sandboxed registry plugins require theme integration. Add the dynamic loader snippet (from the snippet endpoint) or companion <AccessibilityWidget /> to your layout (e.g. src/layouts/Base.astro).",
			},
			{
				label: "Compliance Standards",
				value:
					"WCAG 2.2 Level AA & ADA Section 508 Compliant • Municipal & Enterprise Accessibility Suite",
			},
		]),
	];
}

async function loadSavedSettings(settingsAccess: any): Promise<AccessibilityToolkitSettings> {
	const enabledRaw = await settingsAccess.get("enabled");
	const enabled = normalizeBoolean(enabledRaw, DEFAULT_SETTINGS.enabled);
	const language = (await settingsAccess.get("language")) ?? DEFAULT_SETTINGS.language;
	const primaryColor = (await settingsAccess.get("primaryColor")) ?? DEFAULT_SETTINGS.primaryColor;
	const iconIdRaw = await settingsAccess.get("iconId");
	const iconId = normalizeIconId(iconIdRaw ?? DEFAULT_SETTINGS.iconId);
	const iconSizeRaw = await settingsAccess.get("iconSize");
	const iconSize = Number(iconSizeRaw ?? DEFAULT_SETTINGS.iconSize);
	const positionDesktop = normalizePosition(
		(await settingsAccess.get("positionDesktop")) ?? DEFAULT_SETTINGS.positionDesktop,
	);
	const positionMobile = normalizePosition(
		(await settingsAccess.get("positionMobile")) ?? DEFAULT_SETTINGS.positionMobile,
	);
	const statementUrl =
		(await settingsAccess.get("statementUrl")) ?? DEFAULT_SETTINGS.statementUrl;
	const cdnBaseUrlRaw = await settingsAccess.get("cdnBaseUrl");
	let cdnBaseUrl: string;
	if (cdnBaseUrlRaw === undefined || cdnBaseUrlRaw === null) {
		cdnBaseUrl = DEFAULT_SETTINGS.cdnBaseUrl || "";
	} else {
		cdnBaseUrl = sanitizeCdnBaseUrl(cdnBaseUrlRaw);
	}

	return {
		enabled: Boolean(enabled),
		language: String(language || "en"),
		primaryColor: toValid7CharHex(String(primaryColor || "#1863DC")),
		iconId,
		iconSize: [40, 48, 56].includes(iconSize) ? iconSize : 48,
		positionDesktop,
		positionMobile,
		statementUrl: String(statementUrl || ""),
		cdnBaseUrl,
	};
}

/**
 * Accessibility Toolkit - Sandboxed EmDash Plugin Entrypoint
 *
 * Runs securely inside EmDash workerd sandbox.
 * Provides custom Block Kit admin interface at /_emdash/admin/plugins/$id/settings,
 * declarative settings schema for the plugin manager,
 * and public HTTP endpoints for widget configuration and embedding.
 */
const plugin: SandboxedPlugin = {
	hooks: {
		"plugin:install": async (event, ctx) => {
			ctx.log.info("Accessibility Toolkit installed", {
				pluginId: ctx.plugin.id,
				event,
			});
		},
		"plugin:activate": async (event, ctx) => {
			ctx.log.info("Accessibility Toolkit activated", {
				pluginId: ctx.plugin.id,
				event,
			});
		},
		"plugin:deactivate": async (event, ctx) => {
			ctx.log.info("Accessibility Toolkit deactivated", {
				pluginId: ctx.plugin.id,
				event,
			});
		},
		"page:fragments": async (_event, ctx) => {
			const settings = await loadSavedSettings(ctx.settings);
			if (!settings.enabled) return [];

			const cdnConfig = resolveCdnConfig(settings.cdnBaseUrl);
			const primarySrc = cdnConfig.scriptUrl;
			const fallbackSrc = cdnConfig.cdnConfigured ? LOCAL_WIDGET_SCRIPT_PATH : "";
			const fontsSrc = cdnConfig.fontsUrl;

			const config = {
				status: { mobile: true, desktop: true },
				iconId: settings.iconId,
				iconSize: settings.iconSize,
				label: "Accessibility menu",
				heading: "Accessibility Toolkit",
				position: {
					mobile: settings.positionMobile,
					desktop: settings.positionDesktop,
				},
				language: {
					default: settings.language,
					selected: [],
				},
				margins: {
					desktop: { top: 20, bottom: 20, left: 20, right: 20 },
					mobile: { top: 20, bottom: 20, left: 20, right: 20 },
				},
				primaryColor: settings.primaryColor,
				keyboard: {
					enabled: true,
					shortcut: "alt+a",
				},
				modules: {
					color: {
						darkContrast: { enabled: true },
						lightContrast: { enabled: true },
						highContrast: { enabled: true },
						highSaturation: { enabled: true },
						lowSaturation: { enabled: true },
						monochrome: { enabled: true },
					},
					content: {
						adjustFontSizing: { enabled: true },
						highlightTitle: { enabled: true },
						highlightLinks: { enabled: true },
						dyslexicFont: { enabled: true },
						letterSpacing: { enabled: true },
						lineHeight: { enabled: true },
						fontWeight: { enabled: true },
						textAlign: { enabled: true },
					},
					navigation: {
						readingGuide: { enabled: true },
						pauseAnimations: { enabled: true },
						bigCursor: { enabled: true },
					},
					statement: {
						enabled: Boolean(settings.statementUrl),
						url: settings.statementUrl,
						displayInWidget: false,
						generatedDate: "",
						formData: {
							companyName: "",
							businessEmail: "",
							website: "",
							wcagStandard: "WCAG 2.2 Level AA",
							conformanceStatus: "fully-conformant",
						},
					},
					profiles: { enabled: true },
					pageRead: { enabled: true },
					muteSounds: { enabled: true },
				},
			};

			const initScript = `(function() {
  if (window.__accessibility_toolkit_initialized) return;
  if (document.getElementById('accessibility-toolkit-script')) return;
  window.__accessibility_toolkit_initialized = true;
  window._cyA11yConfig = ${JSON.stringify(config)};
  window._cyA11yAssets = {
    fonts: '${fontsSrc}'
  };
  var s = document.createElement('script');
  s.id = 'accessibility-toolkit-script';
  s.src = '${primarySrc}';
  s.async = true;
  ${cdnConfig.cdnConfigured ? "s.integrity = '" + WIDGET_SRI_HASH + "'; s.crossOrigin = 'anonymous';" : ""}
  ${fallbackSrc ? "s.onerror = function() { var fb = document.createElement('script'); fb.id = 'accessibility-toolkit-script-fallback'; fb.src = '" + fallbackSrc + "'; fb.async = true; (document.body || document.head).appendChild(fb); };" : ""}

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

      var syncFooter = function() {
        var footer = sr.querySelector(".cya11y-footer");
        if (!footer) return;
        var statement = footer.querySelector(".cya11y-footer-statement-link");
        var hasStatement = statement && window.getComputedStyle(statement).display !== "none";
        if (!hasStatement) {
          footer.style.display = "none";
        }
      };

      var footerObserver = new MutationObserver(syncFooter);
      footerObserver.observe(sr, { childList: true, subtree: true });
    }
    return true;
  }

  if (!applyShadowOverrides()) {
    var obs = new MutationObserver(function() {
      if (applyShadowOverrides()) {
        obs.disconnect();
      }
    });
    obs.observe(document.body || document.documentElement, { childList: true, subtree: true });
    setTimeout(function() { obs.disconnect(); }, 30000);
  }

  (document.body || document.head).appendChild(s);
})();`;

			return [
				{
					kind: "inline-script",
					placement: "body:end",
					code: initScript,
					key: "accessibility-toolkit-widget",
				},
			];
		},
	},
	routes: {
		admin: {
			public: false,
			methods: ["POST"],
			handler: async (routeCtx, ctx) => {
				const input = (routeCtx.input as any) || {};
				const currentSettings = await loadSavedSettings(ctx.settings);

				let previewUrl = "http://localhost:4321/";
				try {
					const rawUrl = (routeCtx as any)?.url;
					if (rawUrl) {
						const parsed = new URL(rawUrl);
						if (parsed.origin && (parsed.protocol === "http:" || parsed.protocol === "https:")) {
							previewUrl = parsed.origin + "/";
						}
					}
				} catch {
					// Fallback
				}

				// 1. Initial page load
				if (input.type === "page_load") {
					return {
						blocks: renderAdminBlocks(currentSettings, previewUrl),
					};
				}

				// 2. Form submission
				if (input.type === "form_submit") {
					const values = input.values || {};
					const validationErrors: string[] = [];

					// Validate Color
					const rawColor = String(values.primaryColor || "").trim();
					if (rawColor && !/^#([0-9A-Fa-f]{3}|[0-9A-Fa-f]{6})$/.test(rawColor)) {
						validationErrors.push("Widget Colour must be a valid hex color (e.g. #1863DC)");
					}
					const cleanColor = toValid7CharHex(rawColor || currentSettings.primaryColor);

					// Validate Language
					const rawLang = String(values.language || "").trim();
					if (rawLang && !SUPPORTED_LANGUAGES.some((l) => l.value === rawLang)) {
						validationErrors.push(`Unsupported language code "${rawLang}"`);
					}
					const cleanLang = rawLang || currentSettings.language;

					// Validate Statement URL
					const rawUrl = String(values.statementUrl || "").trim();
					if (rawUrl && !rawUrl.startsWith("/") && !rawUrl.startsWith("http://") && !rawUrl.startsWith("https://")) {
						validationErrors.push("Accessibility statement must be a valid URL or path (e.g. /accessibility-statement)");
					}

					// Validate CDN Base URL
					let cleanCdnUrl = "";
					const rawCdnUrl = values.cdnBaseUrl !== undefined ? String(values.cdnBaseUrl).trim() : undefined;
					if (rawCdnUrl !== undefined) {
						if (rawCdnUrl === "" || rawCdnUrl.toLowerCase() === "local" || rawCdnUrl.toLowerCase() === "none") {
							cleanCdnUrl = "";
						} else if (rawCdnUrl.toLowerCase() === "default") {
							cleanCdnUrl = CANONICAL_CDN_BASE_URL;
						} else if (!rawCdnUrl.startsWith("https://")) {
							validationErrors.push("Custom CDN Base URL must be a valid HTTPS URL (e.g. https://your-cdn.example.com/assets) or 'default'");
						} else {
							try {
								const p = new URL(rawCdnUrl);
								if (p.protocol !== "https:") throw new Error();
								cleanCdnUrl = rawCdnUrl;
							} catch {
								validationErrors.push("Custom CDN Base URL is not a valid HTTPS URL");
							}
						}
					} else {
						cleanCdnUrl = currentSettings.cdnBaseUrl || "";
					}

					if (validationErrors.length > 0) {
						return {
							blocks: [
								blocks.banner({
									title: "Validation Error",
									description: validationErrors.join("; "),
									variant: "error",
								}),
								...renderAdminBlocks(currentSettings, previewUrl),
							],
							toast: {
								message: validationErrors[0],
								type: "error",
							},
						};
					}

					// Prepare updated settings
					const updatedSettings: AccessibilityToolkitSettings = {
						enabled: values.enabled !== undefined ? Boolean(values.enabled) : currentSettings.enabled,
						language: cleanLang,
						primaryColor: cleanColor,
						iconId: normalizeIconId(values.iconId ?? currentSettings.iconId),
						iconSize: Number(values.iconSize ?? currentSettings.iconSize),
						positionDesktop: normalizePosition(values.positionDesktop ?? currentSettings.positionDesktop),
						positionMobile: normalizePosition(values.positionMobile ?? currentSettings.positionMobile),
						statementUrl: rawUrl,
						cdnBaseUrl: cleanCdnUrl,
					};

					// Persist to EmDash settings store
					await ctx.settings.set("enabled", updatedSettings.enabled);
					await ctx.settings.set("language", updatedSettings.language);
					await ctx.settings.set("primaryColor", updatedSettings.primaryColor);
					await ctx.settings.set("iconId", updatedSettings.iconId);
					await ctx.settings.set("iconSize", updatedSettings.iconSize);
					await ctx.settings.set("positionDesktop", updatedSettings.positionDesktop);
					await ctx.settings.set("positionMobile", updatedSettings.positionMobile);
					await ctx.settings.set("statementUrl", updatedSettings.statementUrl);
					await ctx.settings.set("cdnBaseUrl", updatedSettings.cdnBaseUrl);

					ctx.log.info("Accessibility settings updated", {
						pluginId: ctx.plugin.id,
						settings: updatedSettings,
					});

					return {
						blocks: renderAdminBlocks(updatedSettings, previewUrl),
						toast: {
							message: "✓ Settings saved successfully",
							type: "success",
						},
					};
				}

				// 3. Fallback for other block actions
				return {
					blocks: renderAdminBlocks(currentSettings, previewUrl),
				};
			},
		},
		config: {
			public: true,
			methods: ["GET"],
			handler: async (routeCtx: any, ctx) => {
				const settings = await loadSavedSettings(ctx.settings);
				const cdnConfig = resolveCdnConfig(settings.cdnBaseUrl);

				const requestedPluginId =
					(routeCtx?.request?.url &&
						routeCtx.request.url.match(/_emdash\/api\/plugins\/([^/?#]+)/)?.[1]) ||
					ctx.plugin.id;

				return {
					...settings,
					cdnBaseUrl: settings.cdnBaseUrl,
					cdnConfigured: cdnConfig.cdnConfigured,
					mode: cdnConfig.mode,
					scriptUrl: cdnConfig.scriptUrl,
					fontsUrl: cdnConfig.fontsUrl,
					version: "1.3.6",
					toolkit: "Accessibility Toolkit",
					publisher: "EmDash Community",
					sri: WIDGET_SRI_HASH,
				};
			},
		},
		snippet: {
			public: true,
			methods: ["GET"],
			handler: async (routeCtx: any, ctx) => {
				const settings = await loadSavedSettings(ctx.settings);
				const cdnConfig = resolveCdnConfig(settings.cdnBaseUrl);

				const requestedPluginId =
					(routeCtx?.request?.url &&
						routeCtx.request.url.match(/_emdash\/api\/plugins\/([^/?#]+)/)?.[1]) ||
					ctx.plugin.id;

				const html = cdnConfig.cdnConfigured
					? `<script src="${cdnConfig.scriptUrl}" integrity="${WIDGET_SRI_HASH}" crossorigin="anonymous" data-color="${settings.primaryColor}" data-position="${settings.positionDesktop}" data-lang="${settings.language}" async></script>`
					: `<script src="${cdnConfig.scriptUrl}" data-color="${settings.primaryColor}" data-position="${settings.positionDesktop}" data-lang="${settings.language}" async></script>`;

				const cdnHtml = cdnConfig.cdnConfigured ? html : null;

				const dynamicLoader = `<script>
(function() {
  if (window.__accessibility_toolkit_initialized) return;
  if (document.getElementById('accessibility-toolkit-script')) return;
  window.__accessibility_toolkit_initialized = true;
  var endpoints = [
    '/_emdash/api/plugins/${requestedPluginId}/config'
  ];
  if ('${requestedPluginId}' !== 'accessibility-toolkit') {
    endpoints.push('/_emdash/api/plugins/accessibility-toolkit/config');
  }
  endpoints.push('/_emdash/api/plugins/accessibility/config');

  function tryFetchConfig(idx) {
    if (idx >= endpoints.length) {
      window.__accessibility_toolkit_initialized = false;
      console.warn('[Accessibility Toolkit] All candidate configuration endpoints failed.');
      return;
    }
    fetch(endpoints[idx])
      .then(function(r) { return r.ok ? r.json() : null; })
      .then(function(res) {
        var cfg = (res && res.data) || res;
        if (!cfg) {
          tryFetchConfig(idx + 1);
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

      if (document.getElementById('accessibility-toolkit-script')) return;
      var s = document.createElement('script');
      s.id = 'accessibility-toolkit-script';
      s.src = primarySrc;
      s.async = true;
      if (cdnConfigured) {
        s.integrity = '${WIDGET_SRI_HASH}';
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
            console.warn('[Accessibility Toolkit] Both CDN (' + primarySrc + ') and local fallback (' + fallbackSrc + ') failed to load. Ensure assets exist in public/vendor/accessibility-toolkit/ or check CDN availability.');
          };
          (document.body || document.head).appendChild(fb);
        } else {
          window.__accessibility_toolkit_initialized = false;
          console.warn('[Accessibility Toolkit] Widget script failed to load from ' + primarySrc + '. Ensure vendor assets exist in public/vendor/accessibility-toolkit/ or configure a valid CDN URL.');
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
            ".cya11y-footer:not(:has(.cya11y-footer-statement-link:not([style*=\\'display: none\\']):not([style*=\\'display:none\\']))) { display: none !important; }"
          ].join(" ");
          sr.appendChild(style);

          var syncFooter = function() {
            var footer = sr.querySelector(".cya11y-footer");
            if (!footer) return;
            var statement = footer.querySelector(".cya11y-footer-statement-link");
            var hasStatement = statement && window.getComputedStyle(statement).display !== "none";
            if (!hasStatement) {
              footer.style.display = "none";
            }
          };

          var footerObserver = new MutationObserver(syncFooter);
          footerObserver.observe(sr, { childList: true, subtree: true });
        }
        return true;
      }

      if (!applyShadowOverrides()) {
        var obs = new MutationObserver(function() {
          if (applyShadowOverrides()) {
            obs.disconnect();
          }
        });
        obs.observe(document.body || document.documentElement, { childList: true, subtree: true });
        setTimeout(function() { obs.disconnect(); }, 10000);
      }

      (document.body || document.head).appendChild(s);
    })
      .catch(function(err) {
        tryFetchConfig(idx + 1);
      });
  }

  tryFetchConfig(0);
})();
</script>`;

				return {
					enabled: settings.enabled,
					mode: cdnConfig.mode,
					cdnConfigured: cdnConfig.cdnConfigured,
					cdnBaseUrl: cdnConfig.cdnBaseUrl,
					scriptUrl: cdnConfig.scriptUrl,
					fontsUrl: cdnConfig.fontsUrl,
					sri: WIDGET_SRI_HASH,
					html,
					cdnHtml,
					dynamicLoader,
					companion: "In Astro layouts, you can also render the native companion <AccessibilityWidget />.",
				};
			},
		},
		status: {
			public: true,
			methods: ["GET"],
			handler: async (_routeCtx, ctx) => {
				return {
					status: "active",
					pluginId: ctx.plugin.id,
					version: "1.3.6",
					brand: "Accessibility Toolkit",
					vendor: "EmDash Community",
					website: "https://emdashcms.com",
				};
			},
		},
	},
};

export default plugin;

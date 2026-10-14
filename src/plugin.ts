import type { SandboxedPlugin } from "emdash/plugin";

export interface CoddleAccessSettings {
	enabled: boolean;
	language: string;
	primaryColor: string;
	iconId: "default" | "accessibility" | "assist" | "wheel";
	iconSize: number;
	positionDesktop: "bottom-right" | "bottom-left" | "top-right" | "top-left";
	positionMobile: "bottom-right" | "bottom-left" | "top-right" | "top-left";
	statementUrl: string;
}

export const DEFAULT_SETTINGS: CoddleAccessSettings = {
	enabled: true,
	language: "en",
	primaryColor: "#1863DC",
	iconId: "default",
	iconSize: 48,
	positionDesktop: "bottom-right",
	positionMobile: "bottom-right",
	statementUrl: "/accessibility-statement",
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
	{ value: "default", label: "Default (Coddle Access Figure)" },
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
	{ hex: "#1863DC", label: "Coddle Blue (Default)" },
	{ hex: "#0369A1", label: "Ishpeming Township Blue" },
	{ hex: "#0D9488", label: "Teal" },
	{ hex: "#4F46E5", label: "Indigo" },
	{ hex: "#16A34A", label: "Emerald" },
	{ hex: "#0F172A", label: "Slate Dark" },
];

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
	settings: CoddleAccessSettings,
	previewUrl: string = "https://coddletech.com",
) {
	const validPreviewUrl =
		previewUrl.startsWith("http://") || previewUrl.startsWith("https://")
			? previewUrl
			: "https://coddletech.com";

	return [
		blocks.header("Coddle Accessibility Toolkit"),
		blocks.context(
			"Customize the language, colour, icon, dimensions, and positioning of the official Coddle Accessibility Toolkit.",
		),
		blocks.actions([
			elements.link(
				"Preview Frontend ↗",
				{ kind: "external", url: validPreviewUrl },
				{ appearance: "secondary" },
			),
		]),
		blocks.banner({
			title: "Coddle Access Suite — WCAG 2.2 Level AA",
			description:
				"Municipal Accessibility Suite • Powered by Coddle Technologies (https://coddletech.com)",
			variant: "default",
		}),
		blocks.form({
			fields: [
				elements.toggle("enabled", "Enable Coddle Accessibility Widget", {
					description:
						"When enabled, the Coddle Accessibility widget and its standalone tools are rendered on all live public pages.",
					initialValue: settings.enabled,
				}),
				elements.select("language", "Widget Language", SUPPORTED_LANGUAGES, {
					initialValue: settings.language,
				}),
				elements.textInput("primaryColor", "Widget Colour (Hex)", {
					placeholder: "#1863DC",
					initialValue: settings.primaryColor,
				}),
				elements.select("iconId", "Widget Icon (Shape)", ICONS, {
					initialValue: settings.iconId,
				}),
				elements.select("iconSize", "Button Size", SIZES, {
					initialValue: String(settings.iconSize),
				}),
				elements.select("positionDesktop", "Desktop Screen Position", POSITIONS, {
					initialValue: settings.positionDesktop,
				}),
				elements.select("positionMobile", "Mobile Screen Position", POSITIONS, {
					initialValue: settings.positionMobile,
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
				label: "Quick Palette Suggestions",
				value:
					"Default: #1863DC | Ishpeming: #0369A1 | Teal: #0D9488 | Indigo: #4F46E5 | Emerald: #16A34A | Slate: #0F172A",
			},
			{
				label: "Compliance & Integration",
				value:
					"WCAG 2.2 AA / ADA Section 508 • Coddle Access Suite for EmDash CMS websites",
			},
		]),
	];
}

async function loadSavedSettings(settingsAccess: any): Promise<CoddleAccessSettings> {
	const enabled = (await settingsAccess.get("enabled")) ?? DEFAULT_SETTINGS.enabled;
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

	return {
		enabled: Boolean(enabled),
		language: String(language || "en"),
		primaryColor: toValid7CharHex(String(primaryColor || "#1863DC")),
		iconId,
		iconSize: [40, 48, 56].includes(iconSize) ? iconSize : 48,
		positionDesktop,
		positionMobile,
		statementUrl: String(statementUrl || ""),
	};
}

/**
 * Coddle Accessibility Toolkit - Sandboxed EmDash Plugin Entrypoint
 *
 * Runs securely inside EmDash's workerd sandbox.
 * Provides custom Block Kit admin interface at /_emdash/admin/plugins/$id/settings,
 * declarative settings schema for the plugin manager,
 * and public HTTP endpoints for widget configuration and embedding.
 */
const plugin: SandboxedPlugin = {
	hooks: {
		"plugin:install": async (event, ctx) => {
			ctx.log.info("Coddle Accessibility Toolkit installed", {
				pluginId: ctx.plugin.id,
				event,
			});
		},
		"plugin:activate": async (event, ctx) => {
			ctx.log.info("Coddle Accessibility Toolkit activated", {
				pluginId: ctx.plugin.id,
				event,
			});
		},
		"plugin:deactivate": async (event, ctx) => {
			ctx.log.info("Coddle Accessibility Toolkit deactivated", {
				pluginId: ctx.plugin.id,
				event,
			});
		},
	},
	routes: {
		admin: {
			public: false,
			methods: ["POST"],
			handler: async (routeCtx, ctx) => {
				const input = (routeCtx.input as any) || {};
				const currentSettings = await loadSavedSettings(ctx.settings);

				let previewUrl = "https://coddletech.com";
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
					const updatedSettings: CoddleAccessSettings = {
						enabled: values.enabled !== undefined ? Boolean(values.enabled) : currentSettings.enabled,
						language: cleanLang,
						primaryColor: cleanColor,
						iconId: normalizeIconId(values.iconId ?? currentSettings.iconId),
						iconSize: Number(values.iconSize ?? currentSettings.iconSize),
						positionDesktop: normalizePosition(values.positionDesktop ?? currentSettings.positionDesktop),
						positionMobile: normalizePosition(values.positionMobile ?? currentSettings.positionMobile),
						statementUrl: rawUrl,
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

					ctx.log.info("Coddle Accessibility settings updated", {
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
			handler: async (_routeCtx, ctx) => {
				const settings = await loadSavedSettings(ctx.settings);

				return {
					...settings,
					version: "1.3.1",
					toolkit: "Coddle Accessibility Toolkit",
					publisher: "Coddle Technologies",
				};
			},
		},
		snippet: {
			public: true,
			methods: ["GET"],
			handler: async (_routeCtx, ctx) => {
				const settings = await loadSavedSettings(ctx.settings);

				return {
					enabled: settings.enabled,
					html: `<script src="/vendor/coddle-access/js/widget.min.js" data-color="${settings.primaryColor}" data-position="${settings.positionDesktop}" data-lang="${settings.language}" async></script>`,
					cdnHtml: `<script src="https://cdn.jsdelivr.net/npm/@coddletech/access-widget@1.2.0/js/widget.min.js" onerror="this.onerror=null;this.src='/vendor/coddle-access/js/widget.min.js';" data-color="${settings.primaryColor}" data-position="${settings.positionDesktop}" data-lang="${settings.language}" async></script>`,
					dynamicLoader: `<script>
(function() {
  fetch('/_emdash/api/plugins/${ctx.plugin.id}/config')
    .then(function(r) { return r.json(); })
    .then(function(res) {
      var cfg = (res && res.data) || res;
      if (!cfg || !cfg.enabled) return;
      window._cyA11yConfig = {
        primaryColor: cfg.primaryColor,
        iconId: cfg.iconId,
        iconSize: cfg.iconSize,
        position: { desktop: cfg.positionDesktop, mobile: cfg.positionMobile },
        statementUrl: cfg.statementUrl,
        language: { default: cfg.language }
      };
      window._cyA11yAssets = {
        fonts: '/vendor/coddle-access/fonts/'
      };
      var s = document.createElement('script');
      s.src = '/vendor/coddle-access/js/widget.min.js';
      s.async = true;
      (document.body || document.head).appendChild(s);
    });
})();
</script>`,
					companion: "In Astro layouts, you can also render the native companion <CoddleAccessWidget />.",
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
					version: "1.3.1",
					brand: "Coddle Access",
					vendor: "Coddle Technologies",
					website: "https://coddletech.com",
				};
			},
		},
	},
};

export default plugin;

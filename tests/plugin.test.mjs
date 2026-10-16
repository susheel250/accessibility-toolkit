import { test, describe } from "node:test";
import assert from "node:assert/strict";
import { validateBlockResponse } from "@emdash-cms/blocks/server";
import fs from "node:fs";
import path from "node:path";
import plugin, {
	DEFAULT_SETTINGS,
	SUPPORTED_LANGUAGES,
	ICONS,
	SIZES,
	POSITIONS,
	toValid7CharHex,
	normalizeIconId,
	normalizePosition,
	renderAdminBlocks,
} from "../src/plugin.ts";

describe("Accessibility Toolkit - Comprehensive Test Suite", () => {
	function createMockSettings(initial = {}) {
		const store = new Map(Object.entries(initial));
		return {
			store,
			get: async (key) => store.get(key),
			set: async (key, val) => {
				store.set(key, val);
			},
			list: async () => Array.from(store.entries()).map(([key, value]) => ({ key, value })),
		};
	}

	function createMockCtx(savedSettings = {}) {
		return {
			plugin: { id: "coddle-access" },
			log: {
				info: () => {},
				warn: () => {},
				error: () => {},
				debug: () => {},
			},
			settings: createMockSettings(savedSettings),
		};
	}

	test("plugin manifest matches required registry specification", () => {
		const manifestRaw = fs.readFileSync(
			fs.existsSync(path.resolve(import.meta.dirname, "../emdash-plugin.jsonc"))
				? path.resolve(import.meta.dirname, "../emdash-plugin.jsonc")
				: path.resolve("emdash-plugin.jsonc"),
			"utf-8"
		);
		const jsonClean = manifestRaw.replace(/^\s*\/\/.*$/gm, "").replace(/\/\*[\s\S]*?\*\//g, "");
		const manifest = JSON.parse(jsonClean);

		assert.equal(manifest.slug, "accessibility-toolkit");
		assert.equal(manifest.version, "1.3.2");
		assert.equal(manifest.license, "MIT");
		assert.equal(manifest.name, "Accessibility Toolkit");
		assert.ok(manifest.publisher.startsWith("did:plc:"));
		assert.equal(manifest.author.name, "Accessibility Toolkit Contributors");
		assert.equal(manifest.security.email, "security@emdashcms.com");
		assert.deepEqual(manifest.capabilities, []);
		assert.deepEqual(manifest.allowedHosts, []);

		// Verify admin.pages declared
		assert.ok(Array.isArray(manifest.admin.pages));
		assert.equal(manifest.admin.pages.length, 1);
		assert.equal(manifest.admin.pages[0].path, "/settings");
		assert.equal(manifest.admin.pages[0].label, "Accessibility Toolkit");
		assert.equal(manifest.admin.pages[0].icon, "accessibility");

		// Verify 8 settings in admin.settingsSchema
		const schema = manifest.admin.settingsSchema;
		const expectedKeys = [
			"enabled",
			"language",
			"primaryColor",
			"iconId",
			"iconSize",
			"positionDesktop",
			"positionMobile",
			"statementUrl",
		];
		for (const key of expectedKeys) {
			assert.ok(schema[key], `Missing setting schema: ${key}`);
		}

		// Verify language options include all 12 supported languages
		assert.equal(schema.language.type, "select");
		assert.equal(schema.language.options.length, 12);

		// Verify icon options include reference shapes
		assert.equal(schema.iconId.type, "select");
		assert.ok(schema.iconId.options.some((o) => o.value === "default"));
		assert.ok(schema.iconId.options.some((o) => o.value === "accessibility"));
		assert.ok(schema.iconId.options.some((o) => o.value === "assist"));
		assert.ok(schema.iconId.options.some((o) => o.value === "wheel"));
	});

	test("settings defaults and normalization helpers work reliably", () => {
		// Color normalization
		assert.equal(toValid7CharHex("#1863dc"), "#1863DC");
		assert.equal(toValid7CharHex("#fff"), "#FFFFFF");
		assert.equal(toValid7CharHex("invalid"), "#1863DC");
		assert.equal(toValid7CharHex(""), "#1863DC");

		// Icon normalization & backward-compatibility mapping
		assert.equal(normalizeIconId("person"), "default");
		assert.equal(normalizeIconId("universal-access"), "accessibility");
		assert.equal(normalizeIconId("wheelchair"), "wheel");
		assert.equal(normalizeIconId("assist"), "assist");
		assert.equal(normalizeIconId("wheel"), "wheel");
		assert.equal(normalizeIconId("unknown"), "default");

		// Position normalization
		assert.equal(normalizePosition("top-left"), "top-left");
		assert.equal(normalizePosition("top-right"), "top-right");
		assert.equal(normalizePosition("bottom-left"), "bottom-left");
		assert.equal(normalizePosition("bottom-right"), "bottom-right");
		assert.equal(normalizePosition("center"), "bottom-right");
	});

	test("admin route handles page_load and renders complete Block Kit UI", async () => {
		assert.ok(plugin.routes.admin, "admin route must exist");
		assert.equal(plugin.routes.admin.public, false);
		assert.deepEqual(plugin.routes.admin.methods, ["POST"]);

		const mockCtx = createMockCtx();
		const result = await plugin.routes.admin.handler({ input: { type: "page_load", page: "/settings" } }, mockCtx);

		assert.ok(result.blocks, "Result must contain blocks array");
		assert.ok(result.blocks.length >= 5, "Should return header, context, actions, banner, form, fields");

		// Header & Context description
		const header = result.blocks.find((b) => b.type === "header");
		assert.ok(header);
		assert.equal(header.text, "Accessibility Toolkit");

		const context = result.blocks.find((b) => b.type === "context");
		assert.ok(context);
		assert.equal(
			context.text,
			"Customize the language, colour, icon, dimensions, and positioning of the official Accessibility Toolkit.",
		);

		// Action button
		const actions = result.blocks.find((b) => b.type === "actions");
		assert.ok(actions);
		assert.ok(actions.elements.some((e) => e.label.includes("Preview Frontend")));

		// Banner
		const banner = result.blocks.find((b) => b.type === "banner");
		assert.ok(banner);
		assert.ok(banner.title.includes("Accessibility Suite"));

		// Form with controls
		const form = result.blocks.find((b) => b.type === "form");
		assert.ok(form);
		assert.equal(form.submit.action_id, "save_settings");
		assert.equal(form.fields.length, 8);

		// Schema validation against EmDash Block Kit policy
		const validation = validateBlockResponse(result);
		assert.equal(validation.valid, true, `Block validation failed: ${JSON.stringify(validation.errors)}`);
	});

	test("admin route handles form_submit, validates input, and persists settings", async () => {
		const mockCtx = createMockCtx();

		// Submit valid updated settings
		const updatePayload = {
			type: "form_submit",
			action_id: "save_settings",
			values: {
				enabled: false,
				language: "es",
				primaryColor: "#0369a1",
				iconId: "wheel",
				iconSize: "56",
				positionDesktop: "bottom-left",
				positionMobile: "top-left",
				statementUrl: "https://example.com/accessibility",
			},
		};

		const result = await plugin.routes.admin.handler({ input: updatePayload }, mockCtx);
		assert.ok(result.toast);
		assert.equal(result.toast.type, "success");

		const submitValidation = validateBlockResponse(result);
		assert.equal(submitValidation.valid, true, `Block submit validation failed: ${JSON.stringify(submitValidation.errors)}`);
		assert.ok(result.toast.message.includes("Settings saved successfully"));

		// Verify stored values in ctx.settings
		assert.equal(await mockCtx.settings.get("enabled"), false);
		assert.equal(await mockCtx.settings.get("language"), "es");
		assert.equal(await mockCtx.settings.get("primaryColor"), "#0369A1");
		assert.equal(await mockCtx.settings.get("iconId"), "wheel");
		assert.equal(await mockCtx.settings.get("iconSize"), 56);
		assert.equal(await mockCtx.settings.get("positionDesktop"), "bottom-left");
		assert.equal(await mockCtx.settings.get("positionMobile"), "top-left");
		assert.equal(await mockCtx.settings.get("statementUrl"), "https://example.com/accessibility");

		// Now verify config route returns updated settings
		const config = await plugin.routes.config.handler({}, mockCtx);
		assert.equal(config.enabled, false);
		assert.equal(config.language, "es");
		assert.equal(config.primaryColor, "#0369A1");
		assert.equal(config.iconId, "wheel");
		assert.equal(config.iconSize, 56);
		assert.equal(config.positionDesktop, "bottom-left");
	});

	test("admin route rejects invalid settings safely without breaking state", async () => {
		const mockCtx = createMockCtx({
			primaryColor: "#1863DC",
			language: "en",
		});

		// Submit invalid color and language
		const invalidPayload = {
			type: "form_submit",
			action_id: "save_settings",
			values: {
				primaryColor: "not-a-color",
				language: "invalid-lang",
			},
		};

		const result = await plugin.routes.admin.handler({ input: invalidPayload }, mockCtx);
		assert.ok(result.toast);
		assert.equal(result.toast.type, "error");
		assert.ok(result.blocks.some((b) => b.type === "banner" && b.variant === "error"));

		// Original settings must remain intact
		assert.equal(await mockCtx.settings.get("primaryColor"), "#1863DC");
		assert.equal(await mockCtx.settings.get("language"), "en");
	});

	test("config route returns complete widget configuration with defaults", async () => {
		assert.ok(plugin.routes.config);
		assert.equal(plugin.routes.config.public, true);
		assert.deepEqual(plugin.routes.config.methods, ["GET"]);

		const mockCtx = createMockCtx();
		const result = await plugin.routes.config.handler({}, mockCtx);
		assert.equal(result.enabled, true);
		assert.equal(result.primaryColor, "#1863DC");
		assert.equal(result.iconId, "default");
		assert.equal(result.iconSize, 48);
		assert.equal(result.positionDesktop, "bottom-right");
		assert.equal(result.positionMobile, "bottom-right");
		assert.equal(result.language, "en");
		assert.equal(result.version, "1.3.2");
		assert.equal(result.toolkit, "Accessibility Toolkit");
	});

	test("snippet route returns HTML embed tags reflecting saved settings", async () => {
		assert.ok(plugin.routes.snippet);
		assert.equal(plugin.routes.snippet.public, true);

		const mockCtx = createMockCtx({
			primaryColor: "#0D9488",
			positionDesktop: "bottom-left",
			language: "fr",
		});

		const result = await plugin.routes.snippet.handler({}, mockCtx);
		assert.equal(result.enabled, true);
		assert.ok(result.html.includes("data-color=\"#0D9488\""));
		assert.ok(result.html.includes("data-position=\"bottom-left\""));
		assert.ok(result.html.includes("data-lang=\"fr\""));
		assert.ok(result.dynamicLoader.includes(`fetch('/_emdash/api/plugins/${mockCtx.plugin.id}/config')`));
	});

	test("status route returns active plugin health telemetry", async () => {
		assert.ok(plugin.routes.status);
		const result = await plugin.routes.status.handler({}, createMockCtx());
		assert.equal(result.status, "active");
		assert.equal(result.version, "1.3.2");
		assert.equal(result.brand, "Accessibility Toolkit");
		assert.equal(result.vendor, "EmDash Community");
	});

	test("settings persistence: fresh install defaults, update retention, partial updates, and enable/disable toggle", async () => {
		// 1. Fresh installation uses appropriate default settings
		const freshCtx = createMockCtx();
		assert.equal(freshCtx.plugin.id, "coddle-access", "Plugin namespace must be coddle-access");
		const freshConfig = await plugin.routes.config.handler({}, freshCtx);
		assert.equal(freshConfig.enabled, true);
		assert.equal(freshConfig.language, "en");
		assert.equal(freshConfig.primaryColor, "#1863DC");
		assert.equal(freshConfig.iconId, "default");
		assert.equal(freshConfig.iconSize, 48);
		assert.equal(freshConfig.positionDesktop, "bottom-right");
		assert.equal(freshConfig.positionMobile, "bottom-right");
		assert.equal(freshConfig.statementUrl, "/accessibility-statement");

		// 2. Existing installations preserve their saved settings during an update
		const existingCtx = createMockCtx({
			enabled: true,
			language: "de",
			primaryColor: "#0D9488",
			iconId: "accessibility",
			iconSize: 56,
			positionDesktop: "top-right",
			positionMobile: "bottom-left",
			statementUrl: "/custom-a11y",
		});
		const existingConfig = await plugin.routes.config.handler({}, existingCtx);
		assert.equal(existingConfig.language, "de");
		assert.equal(existingConfig.primaryColor, "#0D9488");
		assert.equal(existingConfig.iconId, "accessibility");
		assert.equal(existingConfig.iconSize, 56);
		assert.equal(existingConfig.positionDesktop, "top-right");
		assert.equal(existingConfig.positionMobile, "bottom-left");
		assert.equal(existingConfig.statementUrl, "/custom-a11y");

		// 3. Missing settings receive defaults without overwriting existing values
		const partialCtx = createMockCtx({
			primaryColor: "#4F46E5", // custom color set
			// all other fields undefined/missing
		});
		const partialConfig = await plugin.routes.config.handler({}, partialCtx);
		assert.equal(partialConfig.primaryColor, "#4F46E5", "Existing setting retained");
		assert.equal(partialConfig.language, "en", "Missing setting receives default");
		assert.equal(partialConfig.iconId, "default", "Missing setting receives default");
		assert.equal(partialConfig.iconSize, 48, "Missing setting receives default");

		// 4. Save and reload preserve the selected configuration
		const saveRes = await plugin.routes.admin.handler(
			{
				input: {
					type: "form_submit",
					action_id: "save_settings",
					values: {
						enabled: false,
						language: "it",
						primaryColor: "#16A34A",
						iconId: "assist",
						iconSize: "40",
						positionDesktop: "bottom-left",
						positionMobile: "top-right",
						statementUrl: "/statement-it",
					},
				},
			},
			partialCtx,
		);
		assert.equal(saveRes.toast.type, "success");

		// Reload configuration
		const reloadedConfig = await plugin.routes.config.handler({}, partialCtx);
		assert.equal(reloadedConfig.enabled, false);
		assert.equal(reloadedConfig.language, "it");
		assert.equal(reloadedConfig.primaryColor, "#16A34A");
		assert.equal(reloadedConfig.iconId, "assist");
		assert.equal(reloadedConfig.iconSize, 40);
		assert.equal(reloadedConfig.positionDesktop, "bottom-left");
		assert.equal(reloadedConfig.positionMobile, "top-right");
		assert.equal(reloadedConfig.statementUrl, "/statement-it");

		// 5. The frontend widget reflects the saved settings
		const snippet = await plugin.routes.snippet.handler({}, partialCtx);
		assert.equal(snippet.enabled, false);
		assert.ok(snippet.html.includes("data-color=\"#16A34A\""));
		assert.ok(snippet.html.includes("data-position=\"bottom-left\""));
		assert.ok(snippet.html.includes("data-lang=\"it\""));

		// 6. Enabling and disabling the widget works correctly
		await plugin.routes.admin.handler(
			{
				input: {
					type: "form_submit",
					action_id: "save_settings",
					values: { enabled: true },
				},
			},
			partialCtx,
		);
		const reEnabledSnippet = await plugin.routes.snippet.handler({}, partialCtx);
		assert.equal(reEnabledSnippet.enabled, true);
	});

	test("lifecycle hooks execute without exception", async () => {
		const mockCtx = createMockCtx();
		assert.ok(plugin.hooks["plugin:install"]);
		assert.ok(plugin.hooks["plugin:activate"]);
		assert.ok(plugin.hooks["plugin:deactivate"]);

		await assert.doesNotReject(async () => {
			await plugin.hooks["plugin:install"]({ reason: "install" }, mockCtx);
			await plugin.hooks["plugin:activate"]({ reason: "activate" }, mockCtx);
			await plugin.hooks["plugin:deactivate"]({ reason: "deactivate" }, mockCtx);
		});
	});

	test("page:fragments hook injects frontend script when enabled and returns empty array when disabled", async () => {
		const enabledCtx = createMockCtx({
			enabled: true,
			primaryColor: "#0369A1",
			positionDesktop: "bottom-left",
			language: "en",
		});
		const fragments = await plugin.hooks["page:fragments"]({ page: {} }, enabledCtx);
		assert.ok(Array.isArray(fragments));
		assert.equal(fragments.length, 1);
		assert.equal(fragments[0].kind, "inline-script");
		assert.equal(fragments[0].placement, "body:end");
		assert.ok(fragments[0].code.includes("#0369A1"));
		assert.ok(fragments[0].code.includes("bottom-left"));

		const disabledCtx = createMockCtx({
			enabled: false,
		});
		const disabledFragments = await plugin.hooks["page:fragments"]({ page: {} }, disabledCtx);
		assert.deepEqual(disabledFragments, []);
	});

	test("listing assets and bundled files exist and respect size constraints", () => {
		const rootDir = fs.existsSync(path.resolve(import.meta.dirname, "../icon.png"))
			? path.resolve(import.meta.dirname, "..")
			: path.resolve(".");
		const iconPath = path.resolve(rootDir, "icon.png");
		const screenshotPath = path.resolve(rootDir, "screenshots/accessibility-menu.jpg");
		const widgetJsPath = path.resolve(rootDir, "vendor/coddle-access/js/widget.min.js");
		const fontWoffPath = path.resolve(rootDir, "vendor/coddle-access/fonts/OpenDyslexic3-Regular.woff");
		const fontTtfPath = path.resolve(rootDir, "vendor/coddle-access/fonts/OpenDyslexic3-Regular.ttf");

		assert.ok(fs.existsSync(iconPath), "icon.png must exist");
		assert.ok(fs.existsSync(screenshotPath), "screenshot must exist");
		assert.ok(fs.existsSync(widgetJsPath), "widget.min.js must exist");
		assert.ok(fs.existsSync(fontWoffPath), "OpenDyslexic3-Regular.woff must exist");
		assert.ok(fs.existsSync(fontTtfPath), "OpenDyslexic3-Regular.ttf must exist");

		// Per-file limit: 128 KiB = 131072 bytes for icons and screenshots
		assert.ok(fs.statSync(iconPath).size < 131072, "icon.png size limit");
		assert.ok(fs.statSync(screenshotPath).size < 131072, "screenshot size limit");
	});

	test("admin UI package export and component source integrity", () => {
		const rootDir = fs.existsSync(path.resolve(import.meta.dirname, "../package.json"))
			? path.resolve(import.meta.dirname, "..")
			: path.resolve(".");
		const pkg = JSON.parse(fs.readFileSync(path.resolve(rootDir, "package.json"), "utf-8"));
		assert.equal(pkg.exports["./admin"], "./admin/admin.tsx", "package.json must export ./admin");
		assert.ok(pkg.files.includes("admin"), "package.json files array must include admin");

		const adminPath = path.resolve(rootDir, "admin/admin.tsx");
		assert.ok(fs.existsSync(adminPath), "admin/admin.tsx must exist");
		const adminContent = fs.readFileSync(adminPath, "utf-8");

		// Branding & Heading
		assert.ok(adminContent.includes("Accessibility Toolkit"), "Title present in admin UI");
		assert.ok(adminContent.includes("Accessibility Suite"), "Brand panel present in admin UI");
		assert.ok(adminContent.includes("WCAG 2.2 Level AA"), "WCAG AA badge present in admin UI");
		assert.ok(adminContent.includes("Preview Frontend ↗"), "Preview Frontend button present in admin UI");

		// Core controls
		assert.ok(adminContent.includes("Enable Accessibility Widget"), "Master toggle present");
		assert.ok(adminContent.includes("Widget Language"), "Language selector present");
		assert.ok(adminContent.includes("Widget Colour"), "Color picker present");
		assert.ok(adminContent.includes("Live Swatch"), "Live swatch present");
		assert.ok(adminContent.includes("Quick Palette Suggestions"), "Quick palette suggestions present");
		assert.ok(adminContent.includes("Widget Icon"), "Icon selector present");
		assert.ok(adminContent.includes("Desktop Screen Placement Preview"), "Desktop placement grid present");
		assert.ok(adminContent.includes("Mobile Screen Placement Preview"), "Mobile placement grid present");
		assert.ok(adminContent.includes("Accessibility Statement URL"), "Statement URL present");
		assert.ok(adminContent.includes("Save Settings"), "Save button present");

		// Namespace & Endpoint decoupling
		assert.ok(adminContent.includes("/_emdash/api/admin/plugins/"), "Uses EmDash admin plugin settings API");
		assert.ok(adminContent.includes("/_emdash/api/plugins/"), "Uses EmDash plugin config API");
		assert.ok(adminContent.includes("accessibility-toolkit"), "Supports accessibility-toolkit namespace");
		assert.ok(adminContent.includes("coddle-access"), "Defaults/fallbacks to coddle-access namespace");

		// All 12 languages supported
		for (const lang of SUPPORTED_LANGUAGES) {
			assert.ok(adminContent.includes(`code: '${lang.value}'`) || adminContent.includes(`code: "${lang.value}"`), `Admin UI includes language ${lang.value}`);
		}
	});

	test("operations under registry installation ID (r_*) behave correctly", async () => {
		const registryId = "r_rznxjv6huupd4i7d";
		const registryCtx = {
			plugin: { id: registryId },
			log: {
				info: () => {},
				warn: () => {},
				error: () => {},
				debug: () => {},
			},
			settings: createMockSettings({
				enabled: true,
				primaryColor: "#0D9488",
				language: "es",
				iconId: "wheel",
				iconSize: 56,
				positionDesktop: "bottom-left",
				positionMobile: "bottom-left",
				statementUrl: "/declaracion-accesibilidad",
			}),
		};

		// 1. Config route
		const configRes = await plugin.routes.config.handler({}, registryCtx);
		assert.equal(configRes.enabled, true);
		assert.equal(configRes.primaryColor, "#0D9488");
		assert.equal(configRes.language, "es");
		assert.equal(configRes.iconId, "wheel");
		assert.equal(configRes.iconSize, 56);
		assert.equal(configRes.positionDesktop, "bottom-left");
		assert.equal(configRes.positionMobile, "bottom-left");
		assert.equal(configRes.statementUrl, "/declaracion-accesibilidad");

		// 2. Snippet route targets registry ID
		const snippetRes = await plugin.routes.snippet.handler({}, registryCtx);
		assert.ok(snippetRes.dynamicLoader.includes(`/_emdash/api/plugins/${registryId}/config`));
		assert.ok(snippetRes.html.includes("#0D9488"));
		assert.ok(snippetRes.html.includes("bottom-left"));

		// 3. Status route reflects registry ID
		const statusRes = await plugin.routes.status.handler({}, registryCtx);
		assert.equal(statusRes.status, "active");
		assert.equal(statusRes.pluginId, registryId);

		// 4. Admin page_load renders Block Kit with active settings
		const adminLoad = await plugin.routes.admin.handler({ input: { type: "page_load" } }, registryCtx);
		validateBlockResponse(adminLoad);
		assert.ok(Array.isArray(adminLoad.blocks));

		// 5. Admin form_submit persists updated settings under registry ID
		const adminSubmit = await plugin.routes.admin.handler(
			{
				input: {
					type: "form_submit",
					values: {
						enabled: false,
						primaryColor: "#16A34A",
						language: "fr",
						iconId: "assist",
						iconSize: "40",
						positionDesktop: "top-right",
						positionMobile: "top-right",
						statementUrl: "/accessibilite",
					},
				},
			},
			registryCtx
		);
		validateBlockResponse(adminSubmit);
		assert.equal(adminSubmit.toast?.type, "success");
		assert.equal(await registryCtx.settings.get("enabled"), false);
		assert.equal(await registryCtx.settings.get("primaryColor"), "#16A34A");
		assert.equal(await registryCtx.settings.get("language"), "fr");
		assert.equal(await registryCtx.settings.get("iconId"), "assist");
		assert.equal(await registryCtx.settings.get("iconSize"), 40);
		assert.equal(await registryCtx.settings.get("positionDesktop"), "top-right");
		assert.equal(await registryCtx.settings.get("positionMobile"), "top-right");
		assert.equal(await registryCtx.settings.get("statementUrl"), "/accessibilite");

		// 6. Lifecycle hooks handle registry context without throwing
		await assert.doesNotReject(async () => {
			await plugin.hooks["plugin:install"]({ reason: "install" }, registryCtx);
			await plugin.hooks["plugin:activate"]({ reason: "activate" }, registryCtx);
			await plugin.hooks["plugin:deactivate"]({ reason: "deactivate" }, registryCtx);
		});
	});

	test("companion Astro components support registry installation ID and asset fallback", () => {
		const rootDir = fs.existsSync(path.resolve(import.meta.dirname, "../components"))
			? path.resolve(import.meta.dirname, "..")
			: path.resolve(".");

		const coddleWidgetPath = path.resolve(rootDir, "components/CoddleAccessWidget.astro");
		const a11yWidgetPath = path.resolve(rootDir, "components/AccessibilityWidget.astro");

		assert.ok(fs.existsSync(coddleWidgetPath), "CoddleAccessWidget.astro must exist");
		assert.ok(fs.existsSync(a11yWidgetPath), "AccessibilityWidget.astro must exist");

		const coddleContent = fs.readFileSync(coddleWidgetPath, "utf-8");
		const a11yContent = fs.readFileSync(a11yWidgetPath, "utf-8");

		// Props include pluginId and cdnSrc
		assert.ok(a11yContent.includes("pluginId?: string;"), "AccessibilityWidget declares pluginId prop");
		assert.ok(a11yContent.includes("cdnSrc?: string;"), "AccessibilityWidget declares cdnSrc prop");
		assert.ok(coddleContent.includes("pluginId?: string;"), "CoddleAccessWidget declares pluginId prop");
		assert.ok(coddleContent.includes("cdnSrc?: string;"), "CoddleAccessWidget declares cdnSrc prop");

		// Dynamic candidate endpoints prioritize pluginId in AccessibilityWidget
		assert.ok(a11yContent.includes("/_emdash/api/plugins/\" + encodeURIComponent(pluginId) + \"/config"), "Prioritizes explicit pluginId endpoint");
		assert.ok(a11yContent.includes("onerror"), "Handles script load failure with fallback/warning");
		assert.ok(coddleContent.includes("<AccessibilityWidget {...Astro.props} />"), "CoddleAccessWidget wraps AccessibilityWidget for backward compatibility");
	});
});


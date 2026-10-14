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

describe("Coddle Accessibility Toolkit - Comprehensive Test Suite", () => {
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

		assert.equal(manifest.slug, "coddle-access");
		assert.equal(manifest.version, "1.3.0");
		assert.equal(manifest.license, "MIT");
		assert.equal(manifest.name, "Coddle Accessibility Toolkit");
		assert.ok(manifest.publisher.startsWith("did:plc:"));
		assert.equal(manifest.author.name, "Coddle Technologies");
		assert.equal(manifest.security.email, "security@coddletech.com");
		assert.deepEqual(manifest.capabilities, []);
		assert.deepEqual(manifest.allowedHosts, []);

		// Verify admin.pages declared
		assert.ok(Array.isArray(manifest.admin.pages));
		assert.equal(manifest.admin.pages.length, 1);
		assert.equal(manifest.admin.pages[0].path, "/settings");
		assert.equal(manifest.admin.pages[0].label, "Coddle Accessibility");
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

		// Header
		const header = result.blocks.find((b) => b.type === "header");
		assert.ok(header);
		assert.equal(header.text, "Coddle Accessibility Toolkit");

		// Action button
		const actions = result.blocks.find((b) => b.type === "actions");
		assert.ok(actions);
		assert.ok(actions.elements.some((e) => e.label.includes("Preview Frontend")));

		// Banner
		const banner = result.blocks.find((b) => b.type === "banner");
		assert.ok(banner);
		assert.ok(banner.title.includes("Coddle Access Suite"));

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
		assert.equal(result.version, "1.3.0");
		assert.equal(result.toolkit, "Coddle Accessibility Toolkit");
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
		assert.equal(result.version, "1.3.0");
		assert.equal(result.brand, "Coddle Access");
		assert.equal(result.vendor, "Coddle Technologies");
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

	test("listing assets and bundled files exist and respect size constraints", () => {
		const rootDir = fs.existsSync(path.resolve(import.meta.dirname, "../icon.png"))
			? path.resolve(import.meta.dirname, "..")
			: path.resolve(".");
		const iconPath = path.resolve(rootDir, "icon.png");
		const screenshotPath = path.resolve(rootDir, "screenshots/coddle-access-menu.jpg");
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
});

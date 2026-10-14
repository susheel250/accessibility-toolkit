import { test, describe } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import plugin from "../src/plugin.ts";

describe("Coddle Accessibility Toolkit - Sandboxed Plugin", () => {
	const mockCtx = {
		plugin: { id: "coddle-access" },
		log: {
			info: () => {},
			warn: () => {},
			error: () => {},
			debug: () => {},
		},
		settings: {
			get: async (key) => {
				const defaults = {
					enabled: true,
					primaryColor: "#1863DC",
					iconId: "person",
					iconSize: 48,
					positionDesktop: "bottom-right",
					positionMobile: "bottom-right",
					language: "en",
					statementUrl: "/accessibility-statement",
				};
				return defaults[key];
			},
		},
	};

	test("plugin manifest matches required registry specification", () => {
		const manifestRaw = fs.readFileSync(
			fs.existsSync(path.resolve(import.meta.dirname, "../emdash-plugin.jsonc")) ? path.resolve(import.meta.dirname, "../emdash-plugin.jsonc") : path.resolve("packages/coddle-access/emdash-plugin.jsonc"),
			"utf-8"
		);
		// Strip jsonc comments for parsing (lines starting with //)
		const jsonClean = manifestRaw.replace(/^\s*\/\/.*$/gm, "").replace(/\/\*[\s\S]*?\*\//g, "");
		const manifest = JSON.parse(jsonClean);

		assert.equal(manifest.slug, "coddle-access");
		assert.equal(manifest.version, "1.2.0");
		assert.equal(manifest.license, "MIT");
		assert.equal(manifest.name, "Coddle Accessibility Toolkit");
		assert.ok(manifest.publisher.startsWith("did:plc:"));
		assert.equal(manifest.author.name, "Coddle Technologies");
		assert.equal(manifest.security.email, "security@coddletech.com");
		assert.deepEqual(manifest.capabilities, []);
		assert.deepEqual(manifest.allowedHosts, []);

		// Verify 8 settings defined in admin.settingsSchema
		const schema = manifest.admin.settingsSchema;
		const expectedKeys = [
			"enabled",
			"primaryColor",
			"iconId",
			"iconSize",
			"positionDesktop",
			"positionMobile",
			"language",
			"statementUrl",
		];
		for (const key of expectedKeys) {
			assert.ok(schema[key], `Missing setting schema: ${key}`);
		}
	});

	test("config route returns complete widget configuration", async () => {
		assert.ok(plugin.routes.config, "config route must exist");
		assert.equal(plugin.routes.config.public, true);
		assert.deepEqual(plugin.routes.config.methods, ["GET"]);

		const result = await plugin.routes.config.handler({}, mockCtx);
		assert.equal(result.enabled, true);
		assert.equal(result.primaryColor, "#1863DC");
		assert.equal(result.iconId, "person");
		assert.equal(result.iconSize, 48);
		assert.equal(result.positionDesktop, "bottom-right");
		assert.equal(result.positionMobile, "bottom-right");
		assert.equal(result.language, "en");
		assert.equal(result.statementUrl, "/accessibility-statement");
		assert.equal(result.version, "1.2.0");
		assert.equal(result.toolkit, "Coddle Accessibility Toolkit");
	});

	test("snippet route returns HTML embed tags", async () => {
		assert.ok(plugin.routes.snippet, "snippet route must exist");
		assert.equal(plugin.routes.snippet.public, true);
		const result = await plugin.routes.snippet.handler({}, mockCtx);
		assert.equal(result.enabled, true);
		assert.ok(result.html.includes("<script"));
		assert.ok(result.html.includes("data-color=\"#1863DC\""));
		assert.ok(result.html.includes("data-position=\"bottom-right\""));
		assert.ok(result.cdnHtml.includes("cdn.jsdelivr.net"));
		assert.ok(result.dynamicLoader.includes("fetch('/api/plugins/coddle-access/config')"));
	});

	test("status route returns active plugin health telemetry", async () => {
		assert.ok(plugin.routes.status, "status route must exist");
		const result = await plugin.routes.status.handler({}, mockCtx);
		assert.equal(result.status, "active");
		assert.equal(result.version, "1.2.0");
		assert.equal(result.brand, "Coddle Access");
		assert.equal(result.vendor, "Coddle Technologies");
	});

	test("lifecycle hooks execute without exception", async () => {
		assert.ok(plugin.hooks["plugin:install"]);
		assert.ok(plugin.hooks["plugin:activate"]);
		assert.ok(plugin.hooks["plugin:deactivate"]);

		await assert.doesNotReject(async () => {
			await plugin.hooks["plugin:install"]({ reason: "install" }, mockCtx);
			await plugin.hooks["plugin:activate"]({ reason: "activate" }, mockCtx);
			await plugin.hooks["plugin:deactivate"]({ reason: "deactivate" }, mockCtx);
		});
	});

	test("listing assets exist and respect size constraints", () => {
		const rootDir = fs.existsSync(path.resolve(import.meta.dirname, "../icon.png")) ? path.resolve(import.meta.dirname, "..") : path.resolve("packages/coddle-access");
		const iconPath = path.resolve(rootDir, "icon.png");
		const screenshotPath = path.resolve(rootDir, "screenshots/coddle-access-menu.jpg");
		assert.ok(fs.existsSync(iconPath), "icon.png must exist");
		assert.ok(fs.existsSync(screenshotPath), "screenshot must exist");

		const iconStat = fs.statSync(iconPath);
		const screenshotStat = fs.statSync(screenshotPath);

		// Per-file limit: 128 KiB = 131072 bytes
		assert.ok(iconStat.size < 131072, `icon.png too large: ${iconStat.size}`);
		assert.ok(screenshotStat.size < 131072, `screenshot too large: ${screenshotStat.size}`);
	});
});

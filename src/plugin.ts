import type { SandboxedPlugin } from "emdash/plugin";

/**
 * Coddle Accessibility Toolkit - Sandboxed EmDash Plugin Entrypoint
 *
 * This plugin runs inside EmDash's secure workerd sandbox.
 * It provides declarative settings through admin.settingsSchema,
 * serves widget configuration over public HTTP routes,
 * and handles plugin lifecycle events.
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
		config: {
			public: true,
			methods: ["GET"],
			handler: async (_routeCtx, ctx) => {
				const enabled = (await ctx.settings.get<boolean>("enabled")) ?? true;
				const primaryColor = (await ctx.settings.get<string>("primaryColor")) ?? "#1863DC";
				const iconId = (await ctx.settings.get<string>("iconId")) ?? "person";
				const iconSize = (await ctx.settings.get<number>("iconSize")) ?? 48;
				const positionDesktop = (await ctx.settings.get<string>("positionDesktop")) ?? "bottom-right";
				const positionMobile = (await ctx.settings.get<string>("positionMobile")) ?? "bottom-right";
				const language = (await ctx.settings.get<string>("language")) ?? "en";
				const statementUrl = (await ctx.settings.get<string>("statementUrl")) ?? "/accessibility-statement";

				return {
					enabled,
					primaryColor,
					iconId,
					iconSize,
					positionDesktop,
					positionMobile,
					language,
					statementUrl,
					version: "1.2.0",
					toolkit: "Coddle Accessibility Toolkit",
					publisher: "Coddle Technologies",
				};
			},
		},
		snippet: {
			public: true,
			methods: ["GET"],
			handler: async (_routeCtx, ctx) => {
				const enabled = (await ctx.settings.get<boolean>("enabled")) ?? true;
				const primaryColor = (await ctx.settings.get<string>("primaryColor")) ?? "#1863DC";
				const positionDesktop = (await ctx.settings.get<string>("positionDesktop")) ?? "bottom-right";
				const language = (await ctx.settings.get<string>("language")) ?? "en";

				return {
					enabled,
					html: `<script src="/vendor/coddle-access/js/widget.min.js" data-color="${primaryColor}" data-position="${positionDesktop}" data-lang="${language}" async></script>`,
					cdnHtml: `<script src="https://cdn.jsdelivr.net/npm/@coddletech/access-widget@1.2.0/js/widget.min.js" onerror="this.onerror=null;this.src='/vendor/coddle-access/js/widget.min.js';" data-color="${primaryColor}" data-position="${positionDesktop}" data-lang="${language}" async></script>`,
					dynamicLoader: `<script>
(function() {
  fetch('/api/plugins/coddle-access/config')
    .then(function(r) { return r.json(); })
    .then(function(cfg) {
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
      document.body ? document.body.appendChild(s) : document.head.appendChild(s);
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
					version: "1.2.0",
					brand: "Coddle Access",
					vendor: "Coddle Technologies",
					website: "https://coddletech.com",
				};
			},
		},
	},
};

export default plugin;

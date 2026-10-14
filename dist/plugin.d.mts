import { SandboxedPlugin } from "emdash/plugin";

//#region src/plugin.d.ts
/**
 * Coddle Accessibility Toolkit - Sandboxed EmDash Plugin Entrypoint
 *
 * This plugin runs inside EmDash's secure workerd sandbox.
 * It provides declarative settings through admin.settingsSchema,
 * serves widget configuration over public HTTP routes,
 * and handles plugin lifecycle events.
 */
declare const plugin: SandboxedPlugin;
//#endregion
export { plugin as default };
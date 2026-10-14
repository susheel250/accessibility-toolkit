import { SandboxedPlugin } from "emdash/plugin";

//#region src/plugin.d.ts
interface CoddleAccessSettings {
  enabled: boolean;
  language: string;
  primaryColor: string;
  iconId: "default" | "accessibility" | "assist" | "wheel";
  iconSize: number;
  positionDesktop: "bottom-right" | "bottom-left" | "top-right" | "top-left";
  positionMobile: "bottom-right" | "bottom-left" | "top-right" | "top-left";
  statementUrl: string;
}
declare const DEFAULT_SETTINGS: CoddleAccessSettings;
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
declare function renderAdminBlocks(settings: CoddleAccessSettings, previewUrl?: string): ({
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
 * Coddle Accessibility Toolkit - Sandboxed EmDash Plugin Entrypoint
 *
 * Runs securely inside EmDash's workerd sandbox.
 * Provides custom Block Kit admin interface at /_emdash/admin/plugins/$id/settings,
 * declarative settings schema for the plugin manager,
 * and public HTTP endpoints for widget configuration and embedding.
 */
declare const plugin: SandboxedPlugin;
//#endregion
export { CoddleAccessSettings, DEFAULT_SETTINGS, ICONS, POSITIONS, PRESET_COLORS, SIZES, SUPPORTED_LANGUAGES, blocks, plugin as default, elements, normalizeIconId, normalizePosition, renderAdminBlocks, toValid7CharHex };
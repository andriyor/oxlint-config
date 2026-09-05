import { defineConfig } from "oxlint";
import eslintRecommended from "oxlint-config-presets/@eslint/recommended.json" with { type: "json" };
import tsRecommended from "oxlint-config-presets/@typescript-eslint/recommended.json" with { type: "json" };
import e18e from "@e18e/eslint-plugin";
import { preset } from "../preset.js";

// This package must ship .js, not .ts: Node refuses to strip types for files
// under node_modules (ERR_UNSUPPORTED_NODE_MODULES_TYPE_STRIPPING), so a
// consumer importing a .ts config from here fails to load.
//
// TODO: oxlint is adding opt-in `recommended` presets (exported config objects
// importable from "oxlint"). Once shipped, the oxlint-config-presets dependency
// can be dropped in favour of the built-in ones.
// Watch https://github.com/oxc-project/oxc/issues/20758
//
// TODO: oxlint only lints JS/TS today. Once JSON and YAML files are supported,
// they can be linted here too instead of needing a separate tool.
// Watch https://github.com/oxc-project/oxc/issues/18656

/**
 * TypeScript + general JS rules. No React, no test runner. This is the default
 * export of the package.
 *
 * `env` and `ignorePatterns` only take effect when this config is spread
 * (`defineConfig(base)`) — oxlint does not inherit either one through
 * `extends`, so anything composing fragments declares them itself.
 *
 * TODO: once oxlint inherits them, composing consumers can drop their own
 * copies of both fields.
 * Watch https://github.com/oxc-project/oxc/issues/20087 (env)
 * and https://github.com/oxc-project/oxc/issues/16079 (ignorePatterns)
 */
export default defineConfig({
  plugins: ["typescript", "import", "oxc"],
  // TODO: jsPlugins can only be named by import specifier, so this package
  // cannot hand oxlint the plugin object it already imported. Once plugins can
  // be passed by reference, these strings can go.
  // Watch https://github.com/oxc-project/oxc/issues/23944
  //
  // Every jsPlugin dependency here and in react.js declares a non-optional
  // peer dependency on eslint, so installing this config installs eslint too —
  // even though oxlint runs the plugins and eslint is never invoked. For the
  // ones that only pull it in through @typescript-eslint/utils, the peer is
  // needed for five files most plugins never touch.
  // Watch https://github.com/typescript-eslint/typescript-eslint/issues/11939
  jsPlugins: ["@e18e/eslint-plugin"],
  // Ports of the ESLint recommended presets, whose rules oxlint files under
  // categories other than `correctness`.
  extends: [eslintRecommended, tsRecommended],
  categories: { correctness: "error" },
  env: { builtin: true, es2020: true },
  ignorePatterns: ["dist"],
  rules: {
    // not covered by any preset above
    "import/no-relative-parent-imports": "error",
    "oxc/no-barrel-file": "error",
    ...preset(e18e.configs.recommended),
  },
  overrides: [
    {
      // @typescript-eslint/recommended disables this for TS files (tsc catches
      // it); an override is the only way to win against the extended one.
      //
      // TODO: once an extending config's own `rules` beat an extended config's
      // `overrides`, this moves back up into `rules` above.
      // Watch https://github.com/oxc-project/oxc/issues/20067
      files: ["**/*.{ts,tsx}"],
      rules: { "no-redeclare": "error" },
    },
  ],
});

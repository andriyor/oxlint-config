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
 */
export default defineConfig({
  plugins: ["typescript", "import", "oxc"],
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
      files: ["**/*.{ts,tsx}"],
      rules: { "no-redeclare": "error" },
    },
  ],
});

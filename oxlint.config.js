import { defineConfig } from "oxlint";
import eslintRecommended from "oxlint-config-presets/@eslint/recommended.json" with { type: "json" };
import tsRecommended from "oxlint-config-presets/@typescript-eslint/recommended.json" with { type: "json" };
import reactHooks from "oxlint-config-presets/react-hooks/recommended.json" with { type: "json" };
import reactRefresh from "oxlint-config-presets/react-refresh/vite.json" with { type: "json" };
import vitestRecommended from "oxlint-config-presets/@vitest/recommended.json" with { type: "json" };
import pluginQuery from "@tanstack/eslint-plugin-query";
import e18e from "@e18e/eslint-plugin";
import youMightNotNeedAnEffect from "eslint-plugin-react-you-might-not-need-an-effect";

/**
 * ESLint shareable configs are either one config object or an array of them.
 * @param {{ rules?: Record<string, unknown> } | { rules?: Record<string, unknown> }[] | undefined} config
 * @returns {Record<string, unknown>}
 */
const preset = (config) =>
  Object.assign({}, ...[config ?? []].flat().map((c) => c.rules ?? {}));

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
export default defineConfig({
  plugins: ["typescript", "react", "import", "vitest", "oxc"],
  jsPlugins: [
    "@tanstack/eslint-plugin-query",
    "@e18e/eslint-plugin",
    "eslint-plugin-react-you-might-not-need-an-effect",
  ],
  // Ports of the ESLint recommended presets, whose rules oxlint files under
  // categories other than `correctness`.
  extends: [eslintRecommended, tsRecommended, reactHooks, reactRefresh],
  categories: { correctness: "error" },
  env: { builtin: true, browser: true, es2020: true },
  ignorePatterns: ["dist"],
  rules: {
    // not covered by any preset above
    "react/unsupported-syntax": "warn",
    "react/incompatible-library": "warn",
    "import/no-relative-parent-imports": "error",
    "oxc/no-barrel-file": "error",

    // plugin presets, read straight from each plugin
    ...preset(e18e.configs.recommended),
    ...preset(pluginQuery.configs["flat/recommended"]),
    ...preset(youMightNotNeedAnEffect.configs.recommended),
  },
  overrides: [
    {
      // @typescript-eslint/recommended disables this for TS files (tsc catches
      // it); an override is the only way to win against the extended one.
      files: ["**/*.{ts,tsx}"],
      rules: { "no-redeclare": "error" },
    },
    {
      files: ["**/*.{spec,test}.{ts,tsx}"],
      rules: vitestRecommended.rules,
    },
    {
      files: ["**/*.tsx"],
      rules: {
        "max-lines-per-function": [
          "warn",
          { max: 150, skipBlankLines: true, skipComments: true, IIFEs: true },
        ],
      },
    },
  ],
});

import { defineConfig } from "oxlint";
import eslintRecommended from "oxlint-config-presets/@eslint/recommended.json" with { type: "json" };
import tsRecommended from "oxlint-config-presets/@typescript-eslint/recommended.json" with { type: "json" };
import e18e from "@e18e/eslint-plugin";
import { preset } from "../preset.js";

/** TypeScript + general JS rules. No React, no test runner. */
export default defineConfig({
  plugins: ["typescript", "import", "oxc"],
  jsPlugins: ["@e18e/eslint-plugin"],
  // Ports of the ESLint recommended presets, whose rules oxlint files under
  // categories other than `correctness`.
  extends: [eslintRecommended, tsRecommended],
  categories: { correctness: "error" },
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

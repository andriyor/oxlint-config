import { defineConfig } from "oxlint";
import vitestRecommended from "oxlint-config-presets/@vitest/recommended.json" with { type: "json" };

/** Vitest rules, scoped to test files. Layer on top of ./base.js. */
export default defineConfig({
  plugins: ["vitest"],
  overrides: [
    {
      files: ["**/*.{spec,test}.{ts,tsx}"],
      rules: vitestRecommended.rules,
    },
  ],
});

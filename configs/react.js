import { defineConfig } from "oxlint";
import reactHooks from "oxlint-config-presets/react-hooks/recommended.json" with { type: "json" };
import reactRefresh from "oxlint-config-presets/react-refresh/vite.json" with { type: "json" };
import pluginQuery from "@tanstack/eslint-plugin-query";
import youMightNotNeedAnEffect from "eslint-plugin-react-you-might-not-need-an-effect";
import { preset } from "../preset.js";

/** React rules. Layer on top of ./base.js. */
export default defineConfig({
  plugins: ["react"],
  jsPlugins: [
    "@tanstack/eslint-plugin-query",
    "eslint-plugin-react-you-might-not-need-an-effect",
  ],
  extends: [reactHooks, reactRefresh],
  rules: {
    // not covered by any preset above
    "react/unsupported-syntax": "warn",
    "react/incompatible-library": "warn",
    ...preset(pluginQuery.configs["flat/recommended"]),
    ...preset(youMightNotNeedAnEffect.configs.recommended),
  },
  overrides: [
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

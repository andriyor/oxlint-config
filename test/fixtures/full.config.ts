// Everything, the way a React + Vitest project composes it.
import base from "../../configs/base.js";
import react from "../../configs/react.js";
import vitest from "../../configs/vitest.js";
import { defineConfig } from "oxlint";

export default defineConfig({
  extends: [base, react, vitest],
  // inherit exactly the fragments' plugins instead of adding oxlint's defaults
  plugins: [],
  // neither `env` nor `ignorePatterns` is inherited through `extends`
  env: { builtin: true, browser: true, es2020: true },
  ignorePatterns: ["dist"],
});

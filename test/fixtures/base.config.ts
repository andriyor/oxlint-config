// Base only: no React, no Vitest.
import base from "../../configs/base.js";
import { defineConfig } from "oxlint";

export default defineConfig({
  extends: [base],
  // inherit exactly the fragments' plugins instead of adding oxlint's defaults
  plugins: [],
  env: { builtin: true, es2020: true },
});

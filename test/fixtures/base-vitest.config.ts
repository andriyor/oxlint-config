// A non-React project that still uses Vitest.
import base from "../../configs/base.js";
import vitest from "../../configs/vitest.js";
import { defineConfig } from "oxlint";

export default defineConfig({
  extends: [base, vitest],
  plugins: [],
  env: { builtin: true, es2020: true },
});

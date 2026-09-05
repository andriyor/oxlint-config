import { defineConfig } from "oxlint";
import base from "./configs/base.js";
import react from "./configs/react.js";
import vitest from "./configs/vitest.js";

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
  extends: [base, react, vitest],
  // `plugins: []` inherits exactly what the fragments declare. Omitting it
  // would add oxlint's default plugins on top.
  plugins: [],
  // `env` and `ignorePatterns` are NOT inherited through `extends`, so they
  // live here rather than in the fragments.
  env: { builtin: true, browser: true, es2020: true },
  ignorePatterns: ["dist"],
});

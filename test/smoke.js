// Lints the fixtures with this config and asserts that one rule from every
// source still fires. Catches a broken preset import, a renamed rule, or a
// jsPlugin that stopped resolving.
import { execFileSync } from "node:child_process";
import assert from "node:assert/strict";

const EXPECTED = [
  "eslint(no-debugger)", // @eslint/recommended
  "typescript(no-explicit-any)", // @typescript-eslint/recommended
  "eslint(no-redeclare)", // our **/*.{ts,tsx} override, re-enabled on purpose
  "vitest(no-disabled-tests)", // *.test.ts override
  "e18e(prefer-spread-syntax)", // @e18e/eslint-plugin
  "@tanstack/query(exhaustive-deps)", // @tanstack/eslint-plugin-query
  "react-you-might-not-need-an-effect(no-derived-state)",
];

const args = ["-c", "test/fixtures/oxlint.config.ts", "test/fixtures"];
let out;
try {
  out = execFileSync("./node_modules/.bin/oxlint", args, { encoding: "utf8" });
} catch (error) {
  // oxlint exits non-zero when it reports anything, which is the point here.
  out = `${error.stdout ?? ""}${error.stderr ?? ""}`;
}

const missing = EXPECTED.filter((rule) => !out.includes(rule));
assert.deepEqual(missing, [], `these rules did not fire:\n  ${missing.join("\n  ")}\n\noxlint said:\n${out}`);
console.log(`ok - ${EXPECTED.length} rules fired`);

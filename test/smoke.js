// Lints the fixtures with each entry point and asserts that the right rules
// fire — and, for the fragments, that the wrong ones stay quiet. Catches a
// broken preset import, a renamed rule, a jsPlugin that stopped resolving, or
// a fragment that leaked rules it should not own.
import { execFileSync } from "node:child_process";
import assert from "node:assert/strict";

const BASE = [
  "eslint(no-debugger)", // @eslint/recommended
  "typescript(no-explicit-any)", // @typescript-eslint/recommended
  "eslint(no-redeclare)", // our **/*.{ts,tsx} override, re-enabled on purpose
  "e18e(prefer-spread-syntax)", // @e18e/eslint-plugin
];
const REACT = [
  "@tanstack/query(exhaustive-deps)",
  "react-you-might-not-need-an-effect(no-derived-state)",
];
const VITEST = ["vitest(no-disabled-tests)"];

const SCENARIOS = [
  { config: "oxlint.config.ts", present: [...BASE, ...REACT, ...VITEST], absent: [] },
  { config: "base.config.ts", present: BASE, absent: [...REACT, ...VITEST] },
  { config: "base-vitest.config.ts", present: [...BASE, ...VITEST], absent: REACT },
];

const lint = (config) => {
  const args = ["-c", `test/fixtures/${config}`, "test/fixtures"];
  try {
    return execFileSync("./node_modules/.bin/oxlint", args, { encoding: "utf8" });
  } catch (error) {
    // oxlint exits non-zero when it reports anything, which is the point here.
    return `${error.stdout ?? ""}${error.stderr ?? ""}`;
  }
};

for (const { config, present, absent } of SCENARIOS) {
  const out = lint(config);
  const missing = present.filter((rule) => !out.includes(rule));
  const leaked = absent.filter((rule) => out.includes(rule));
  assert.deepEqual(missing, [], `${config}: these rules did not fire:\n  ${missing.join("\n  ")}\n\n${out}`);
  assert.deepEqual(leaked, [], `${config}: these rules should not have fired:\n  ${leaked.join("\n  ")}\n\n${out}`);
  console.log(`ok - ${config}: ${present.length} fired, ${absent.length} correctly absent`);
}

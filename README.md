# @andriyor/oxlint-config

Shared [oxlint](https://oxc.rs) config for React + TypeScript + Vitest projects.

## Install

```sh
pnpm add -D github:andriyor/oxlint-config oxlint
```

The linter plugins (`@e18e/eslint-plugin`, `@tanstack/eslint-plugin-query`,
`eslint-plugin-react-you-might-not-need-an-effect`) are dependencies of this
package — you do **not** need to install them yourself, even under pnpm's
non-hoisted layout.

## Use

```ts
// oxlint.config.ts
import shared from "@andriyor/oxlint-config";
import { defineConfig } from "oxlint";

export default defineConfig(shared);
```

To adjust a rule, spread and override:

```ts
export default defineConfig({
  ...shared,
  rules: { ...shared.rules, "oxc/no-barrel-file": "off" },
});
```

Use `extends: [shared]` only if you want *just* the rules, plugins and
overrides — `extends` does not carry `categories`, `env`, `jsPlugins` or
`ignorePatterns`, and a consumer that omits `plugins` silently gets oxlint's
defaults added on top.

## What it turns on

- oxlint's whole `correctness` category
- ESLint parity via [`oxlint-config-presets`](https://github.com/popup-plus/oxlint-config-presets):
  `@eslint/recommended`, `@typescript-eslint/recommended`, `react-hooks/recommended`,
  `react-refresh/vite`, and `@vitest/recommended` (scoped to `*.{spec,test}.{ts,tsx}`)
- `@e18e`, `@tanstack/query` and `react-you-might-not-need-an-effect` recommended rules
- A few extras no preset carries: `react/unsupported-syntax`, `react/incompatible-library`,
  `import/no-relative-parent-imports`, `oxc/no-barrel-file`

`no-redeclare` is re-enabled for `.ts`/`.tsx` through an override, since
`@typescript-eslint/recommended` disables it there. Note that any preset rule
disabled inside an extended config's `overrides` can only be turned back on
from another `overrides` entry — a top-level `rules` entry loses.

## Why `.js` and not `.ts`

Node refuses to strip types for files under `node_modules`
(`ERR_UNSUPPORTED_NODE_MODULES_TYPE_STRIPPING`), so a consumer importing a
`.ts` config from here fails to load. The config ships as plain `.js` with
JSDoc types — no build step.

## Test

```sh
pnpm test
```

Lints `test/fixtures/` and asserts one rule from every source still fires.

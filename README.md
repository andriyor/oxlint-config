# @andriyor/oxlint-config

Shared [oxlint](https://oxc.rs) config for TypeScript projects, in composable pieces.

## Install

```sh
pnpm add -D github:andriyor/oxlint-config oxlint
```

The linter plugins (`@e18e/eslint-plugin`, `@tanstack/eslint-plugin-query`,
`eslint-plugin-react-you-might-not-need-an-effect`) and `oxlint-config-presets`
are dependencies of this package — you do **not** need to install them
yourself, even under pnpm's non-hoisted layout.

## Use

For a React + Vitest project, take the whole thing:

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

## Composing pieces

| entry point | contents |
| --- | --- |
| `@andriyor/oxlint-config` | `base` + `react` + `vitest`, plus `env` and `ignorePatterns` |
| `@andriyor/oxlint-config/base` | `@eslint/recommended`, `@typescript-eslint/recommended`, `@e18e`, `import/no-relative-parent-imports`, `oxc/no-barrel-file`, the `no-redeclare` override |
| `@andriyor/oxlint-config/react` | `react-hooks`, `react-refresh/vite`, `@tanstack/query`, `react-you-might-not-need-an-effect`, `react/*` rules, the `.tsx` `max-lines-per-function` override |
| `@andriyor/oxlint-config/vitest` | `@vitest/recommended`, scoped to `**/*.{spec,test}.{ts,tsx}` |

A Node project with tests but no React:

```ts
import base from "@andriyor/oxlint-config/base";
import vitest from "@andriyor/oxlint-config/vitest";
import { defineConfig } from "oxlint";

export default defineConfig({
  extends: [base, vitest],
  plugins: [],
  env: { builtin: true, es2020: true },
});
```

Two things that bite when composing:

- **`env` is not inherited through `extends`.** Declare it yourself. (`rules`,
  `plugins`, `overrides`, `jsPlugins` and `categories` *are* inherited, despite
  the docs listing only the first three.)
- **Omitting `plugins` adds oxlint's default plugins on top** of whatever the
  fragments declare. Write `plugins: []` to inherit exactly what you extended.

Also note that any preset rule disabled inside an extended config's `overrides`
can only be turned back on from another `overrides` entry — a top-level `rules`
entry loses. That is why `no-redeclare`, which
`@typescript-eslint/recommended` disables for TS files, is re-enabled through
an override in `base`.

## Why `.js` and not `.ts`

Node refuses to strip types for files under `node_modules`
(`ERR_UNSUPPORTED_NODE_MODULES_TYPE_STRIPPING`), so a consumer importing a
`.ts` config from here fails to load. The configs ship as plain `.js` with a
hand-written `config.d.ts` — no build step.

## Test

```sh
pnpm test
```

Lints `test/fixtures/` through each entry point and asserts both that the
expected rules fire and that the fragments do not leak rules they should not
own.

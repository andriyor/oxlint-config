/**
 * ESLint shareable configs are either one config object or an array of them.
 * Flattens either shape down to a plain rules record.
 * @param {{ rules?: Record<string, unknown> } | { rules?: Record<string, unknown> }[] | undefined} config
 * @returns {Record<string, unknown>}
 */
export const preset = (config) =>
  Object.assign({}, ...[config ?? []].flat().map((c) => c.rules ?? {}));

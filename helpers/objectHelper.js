/**
 * Helper for checking equality between two objects
 * @param {object} x
 * @param {object} y
 * @param {boolean} deepCompare pass to recursively check deep equality
 * @returns {boolean}
 */

export function isObjectEqual(x, y, deepCompare = false) {
  const ok = Object.keys,
    tx = typeof x,
    ty = typeof y;
  return x && y && tx === 'object' && tx === ty
    ? ok(x).length === ok(y).length &&
        ok(x).every((key) =>
          deepCompare ? deepEqual(x[key], y[key]) : x[key] === y[key],
        )
    : x === y;
}

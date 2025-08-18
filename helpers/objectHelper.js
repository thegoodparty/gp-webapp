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
    ty = typeof y
  return x && y && tx === 'object' && tx === ty
    ? ok(x).length === ok(y).length &&
        ok(x).every((key) =>
          deepCompare ? isObjectEqual(x[key], y[key], true) : x[key] === y[key],
        )
    : x === y
}

/**
 * helper to get an object from a subset of another object's keys
 * @param {object} obj Source object
 * @param {string[]} keys Array of keys to pick
 * @returns {object}
 */
export function pick(obj, keys) {
  if (typeof obj !== 'object' || obj === null || !Array.isArray(keys)) {
    throw new Error('invalid args')
  }

  return keys
    .filter((key) => key in obj)
    .reduce((obj2, key) => ((obj2[key] = obj[key]), obj2), {})
}

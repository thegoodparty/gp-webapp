/**
 * Resolves Figma design token references ({token.path}) to hex values.
 * The reference map is built dynamically from the JSON token files,
 * so updating a root color scale automatically updates all theme tokens.
 */

import tailwindJson from './Tailwind.json'
import colorsJson from './Colors.json'

/**
 * Builds a flat reference map of { 'token.path': '#hexvalue' }
 * from the Tailwind and Colors JSON exports.
 */
function buildRefMap() {
  const map = {}

  // Tailwind colors — reference format: "tailwind colors.{scale}.{step}"
  // e.g. {tailwind colors.blue.600} → #2563eb
  const twColors = tailwindJson['tailwind colors']
  for (const [scale, steps] of Object.entries(twColors)) {
    for (const [step, token] of Object.entries(steps)) {
      map[`tailwind colors.${scale}.${step}`] = token.value
    }
  }

  // Brand + semantic colors — strip the top-level group wrapper
  // ("branding colors", "semantic colors") so references like
  // {midnight.900}, {error.500}, {goodparty.cream} resolve correctly.
  for (const group of Object.values(colorsJson)) {
    for (const [scale, steps] of Object.entries(group)) {
      for (const [step, token] of Object.entries(steps)) {
        map[`${scale}.${step}`] = token.value
      }
    }
  }

  return map
}

const TOKEN_REFS = buildRefMap()

/**
 * Reverse map: 6-digit uppercase hex (no #) → token path.
 * Used to identify the root color behind 8-digit hex opacity variants.
 */
function buildReverseMap() {
  const reverse = {}
  for (const [path, hex] of Object.entries(TOKEN_REFS)) {
    if (typeof hex === 'string' && hex.startsWith('#')) {
      const normalized = hex.replace('#', '').toUpperCase()
      if (!reverse[normalized]) {
        reverse[normalized] = path
      }
    }
  }
  return reverse
}

const TOKEN_REVERSE = buildReverseMap()

/**
 * Resolves a single token value — either a reference like `{token.path}`
 * or a raw hex/rgba string.
 */
function resolveValue(value) {
  if (typeof value === 'string' && value.startsWith('{') && value.endsWith('}')) {
    const ref = value.slice(1, -1)
    return TOKEN_REFS[ref] ?? value
  }
  return value
}

/**
 * Resolves all values in a flat token group object (one level deep).
 * Returns { tokenName: { hex, ref, description }, ... }
 * `ref` is the source alias when the token points to another token,
 * or a derived "base @ N%" string for 8-digit hex opacity variants,
 * or null for plain raw hex values.
 */
export function resolveTokenGroup(group) {
  return Object.fromEntries(
    Object.entries(group).map(([key, token]) => {
      const value = token.value

      // Named token reference: {token.path}
      if (typeof value === 'string' && value.startsWith('{') && value.endsWith('}')) {
        return [key, {
          hex: resolveValue(value),
          ref: value.slice(1, -1),
          description: token.description ?? '',
        }]
      }

      // 8-digit hex opacity variant: try to find the root color
      if (typeof value === 'string' && /^#[0-9a-fA-F]{8}$/.test(value)) {
        const baseHex = value.slice(0, 7).toUpperCase()
        const alphaHex = value.slice(7, 9)
        const alphaPercent = Math.round((parseInt(alphaHex, 16) / 255) * 100)
        const rootPath = TOKEN_REVERSE[baseHex.replace('#', '')]
        return [key, {
          hex: value,
          ref: rootPath ? `${rootPath} @ ${alphaPercent}%` : null,
          description: token.description ?? '',
        }]
      }

      // Plain raw value
      return [key, {
        hex: resolveValue(value),
        ref: null,
        description: token.description ?? '',
      }]
    }),
  )
}

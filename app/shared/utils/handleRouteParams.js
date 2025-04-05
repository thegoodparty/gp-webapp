import { compile, parse } from 'path-to-regexp'

/**
 * Replaces route tokens in the URL's pathname using corresponding data values.
 *
 * @param {string} path - The URL containing route tokens.
 * @param {Object|FormData} data - Key-value pairs for token replacement.
 * @returns {string} The URL with tokens replaced.
 */
export function handleRouteParams(path, data) {
  const { tokens } = parse(path)
  const hasRouteParams = tokens.some((token) => typeof token !== 'string')

  if (!data || (data && !Object.keys(data).length))
    return stripPathTokens(path)
  if (!hasRouteParams) return path

  // Find tokens that are parameters (objects with name property)
  const paramTokens = {}
  tokens.forEach((token) => {
    if (typeof token === 'object' && token.name) {
      const paramName = token.name
      if (data instanceof FormData) {
        if (data.has(paramName)) {
          // Retrieve the param value from FormData.
          paramTokens[paramName] = String(data.get(paramName))
          // Remove the used parameter.
          data.delete(paramName)
        }
      } else {
        // Plain object lookup.
        if (Object.prototype.hasOwnProperty.call(data, paramName)) {
          paramTokens[paramName] = String(data[paramName])
          delete data[paramName]
        }
      }
    }
  })

  // Compile the path with the coerced values
  return Object.keys(paramTokens).length
    ? compile(path)(paramTokens)
    : stripPathTokens(path)
}

const stripPathTokens = (path) => path.replace(/\/:[^/]+/g, '')

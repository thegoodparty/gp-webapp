import { compile, parse } from 'path-to-regexp'

/**
 * Replaces route tokens in the URL's pathname using corresponding data values.
 */
export const handleRouteParams = (
  path: string,
  data: Record<string, unknown> | FormData,
): string => {
  const { tokens } = parse(path)
  const hasRouteParams = tokens.some((token) => typeof token !== 'string')

  if (!data || (data && !Object.keys(data).length)) return stripPathTokens(path)
  if (!hasRouteParams) return path

  const paramTokens: Record<string, string> = {}
  tokens.forEach((token) => {
    if (typeof token === 'object' && 'name' in token && token.name) {
      const paramName = String(token.name)
      if (data instanceof FormData) {
        if (data.has(paramName)) {
          paramTokens[paramName] = String(data.get(paramName))
          data.delete(paramName)
        }
      } else {
        if (Object.prototype.hasOwnProperty.call(data, paramName)) {
          paramTokens[paramName] = String(data[paramName])
          delete data[paramName]
        }
      }
    }
  })

  return Object.keys(paramTokens).length
    ? compile(path)(paramTokens)
    : stripPathTokens(path)
}

const stripPathTokens = (path: string): string => path.replace(/\/:[^/]+/g, '')

export const URLSearchParamsToObject = (
  params: URLSearchParams,
): Record<string, string | string[]> => {
  const obj: Record<string, string | string[]> = {}
  for (const [key, value] of params) {
    obj[key] = Object.hasOwn(obj, key)
      ? Array.isArray(obj[key])
        ? [...(obj[key] as string[]), value]
        : [obj[key] as string, value]
      : value
  }
  return obj
}

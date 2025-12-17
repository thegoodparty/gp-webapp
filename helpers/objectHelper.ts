export const isObjectEqual = <T>(x: T, y: T, deepCompare: boolean = false): boolean => {
  const ok = Object.keys
  const tx = typeof x
  const ty = typeof y
  return x && y && tx === 'object' && tx === ty
    ? (ok(x as object).length === ok(y as object).length &&
        ok(x as object).every((key) =>
          deepCompare 
            ? isObjectEqual((x as Record<string, T>)[key], (y as Record<string, T>)[key], true) 
            : (x as Record<string, T>)[key] === (y as Record<string, T>)[key],
        ))
    : x === y
}

export const pick = <T extends Record<string, V>, V, K extends keyof T>(obj: T, keys: K[]): Pick<T, K> => {
  if (typeof obj !== 'object' || obj === null || !Array.isArray(keys)) {
    throw new Error('invalid args')
  }

  return keys
    .filter((key) => key in obj)
    .reduce((obj2, key) => {
      obj2[key] = obj[key]
      return obj2
    }, {} as Pick<T, K>)
}


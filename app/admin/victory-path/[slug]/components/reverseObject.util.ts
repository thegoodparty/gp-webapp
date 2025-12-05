export const reverseObject = (obj: Record<string, string>): Record<string, string> =>
  Object.entries(obj).reduce((acc, [key, value]) => {
    acc[value] = key
    return acc
  }, {} as Record<string, string>)



export const reverseObject = (obj) =>
  Object.entries(obj).reduce((acc, [key, value]) => {
    acc[value] = key
    return acc
  }, {})

export const URLSearchParamsToObject = (params) => {
  const obj = {};
  for (const [key, value] of params) {
    obj[key] = Object.hasOwn(obj, key)
      ? Array.isArray(obj[key])
        ? [...obj[key], value]
        : [obj[key], value]
      : value;
  }
  return obj;
};

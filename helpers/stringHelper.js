export const upperFirst = (str) => {
  if (!str) return str;
  return str.charAt(0).toUpperCase() + str.slice(1);
};

export const trimObject = (obj) => {
  Object.keys(obj).forEach((key) => {
    if (typeof obj[key] === 'string') {
      obj[key] = obj[key].trim();
    }
  });
};

export const removeWhiteSpaces = (str) => {
  if (!str) {
    return '';
  }
  return str.replace(/\s/g, '');
};

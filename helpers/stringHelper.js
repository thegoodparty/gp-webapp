export const upperFirst = (str) => {
  if (!str) return str;
  return str.charAt(0).toUpperCase() + str.slice(1);
};

export const trimObject = (obj) => {
  const newObj = JSON.parse(JSON.stringify(obj));
  Object.keys(newObj).forEach((key) => {
    if (typeof obj[key] === 'string') {
      obj[key] = obj[key].trim();
    }
  });
  return newObj;
};

export const removeWhiteSpaces = (str) => {
  if (!str) {
    return '';
  }
  return str.replace(/\s/g, '');
};

export const camelToSentence = (text) => {
  const result = text.replace(/([A-Z])/g, ' $1');
  return result.charAt(0).toUpperCase() + result.slice(1);
};

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

export function kebabToCamel(kebabCase) {
  if (!kebabCase || kebabCase == '') {
    return '';
  }
  return kebabCase.replace(/-([a-z])/g, (match, letter) =>
    letter.toUpperCase(),
  );
}

export function camelToKebab(camelCase) {
  if (!camelCase || camelCase == '') {
    return '';
  }
  return camelCase.replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase();
}

export function toTitleCase(str) {
  return str.replace(/\w\S*/g, function (txt) {
    return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
  });
}

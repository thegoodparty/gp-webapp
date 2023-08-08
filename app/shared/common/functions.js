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
  return camelCase.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase();
}

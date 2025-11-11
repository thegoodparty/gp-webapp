export const camelToSentence = (text: string): string => {
  const result = text.replace(/([A-Z])/g, ' $1')
  return result.charAt(0).toUpperCase() + result.slice(1)
}

export const kebabToCamel = (kebabCase: string | null | undefined): string => {
  if (!kebabCase || kebabCase === '') {
    return ''
  }
  return kebabCase.replace(/-([a-z])/g, (_match: string, letter: string) =>
    letter.toUpperCase(),
  )
}

export const camelToKebab = (camelCase: string | null | undefined): string => {
  if (!camelCase || camelCase === '') {
    return ''
  }
  return camelCase.replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase()
}

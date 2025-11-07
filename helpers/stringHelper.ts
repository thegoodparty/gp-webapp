export const upperFirst = (str: string | null | undefined): string | null | undefined => {
  if (!str) return str
  return str.charAt(0).toUpperCase() + str.slice(1)
}

export const trimObject = <T extends Record<string, string | number | boolean>>(obj: T): T => {
  const newObj = JSON.parse(JSON.stringify(obj)) as T
  Object.keys(newObj).forEach((key) => {
    const value = obj[key]
    if (typeof value === 'string') {
      (newObj as Record<string, string | number | boolean>)[key] = value.trim()
    }
  })
  return newObj
}

export const removeWhiteSpaces = (str: string | null | undefined): string => {
  if (!str) {
    return ''
  }
  return str.replace(/\s/g, '')
}

export const camelToSentence = (text: string): string => {
  const result = text.replace(/([A-Z])/g, ' $1')
  return result.charAt(0).toUpperCase() + result.slice(1)
}

export const kebabToCamel = (kebabCase: string | null | undefined): string => {
  if (!kebabCase || kebabCase === '') {
    return ''
  }
  return kebabCase.replace(/-([a-z])/g, (match: string, letter: string) => letter.toUpperCase())
}

export const camelToKebab = (camelCase: string | null | undefined): string => {
  if (!camelCase || camelCase === '') {
    return ''
  }
  return camelCase.replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase()
}

export const toTitleCase = (str: string): string => {
  return str.replace(/\w\S*/g, (txt: string) => {
    return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()
  })
}


export function grammarizeOfficeName(officeName) {
  if (!officeName) {
    return officeName
  }

  let result = officeName

  const dashIndex = result.indexOf(' - ')
  if (dashIndex !== -1) {
    result = result.substring(0, dashIndex)
  }

  if (result.endsWith('Board of Directors')) {
    return `${result} Member`
  }

  if (result.endsWith('Board')) {
    return `${result} Member`
  }

  if (result.endsWith('Council')) {
    return `${result} Member`
  }

  if (result.endsWith('Committee')) {
    return `${result} Member`
  }

  if (result.endsWith('Commission')) {
    return `${result}er`
  }

  return result
}

export const packageFormData = (data, file = null) => {
  const formData = new FormData()
  for (const key in data) {
    const value = data[key]
    const coerced =
      value instanceof Date
        ? value.toISOString()
        : typeof value === 'object'
        ? JSON.stringify(value)
        : value

    if (coerced === undefined) continue

    formData.append(key, coerced)
  }
  if (file) {
    formData.append('file', file)
  }
  return formData
}

type FormDataValue =
  | string
  | number
  | boolean
  | Date
  | object
  | null
  | undefined

export const packageFormData = (
  data: Record<string, FormDataValue>,
  file: File | null = null,
): FormData => {
  const formData = new FormData()
  for (const key in data) {
    const value = data[key] as FormDataValue
    const coerced =
      value instanceof Date
        ? value.toISOString()
        : typeof value === 'object' && value !== null
        ? JSON.stringify(value)
        : value

    if (coerced === undefined) continue

    formData.append(key, String(coerced))
  }
  if (file) {
    formData.append('file', file)
  }
  return formData
}

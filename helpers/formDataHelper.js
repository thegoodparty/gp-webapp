export function objectToFormData(payload, filesKey = 'files') {
  const formData = new FormData()

  // Flatten nested objects first
  const flattened = flattenObject(payload, filesKey)

  // Add all non-file fields
  for (const key in flattened) {
    let value = flattened[key]
    if (key === filesKey || value == undefined) continue
    formData.append(key, value)
  }

  // Add files last
  if (payload[filesKey]) {
    if (Array.isArray(payload[filesKey])) {
      payload[filesKey].forEach((file) => {
        formData.append(filesKey, file, file.name)
      })
    } else if (payload[filesKey] instanceof FileList) {
      Array.from(payload[filesKey]).forEach((file) => {
        formData.append(filesKey, file, file.name)
      })
    } else {
      formData.append(filesKey, payload[filesKey], payload[filesKey].name)
    }
  }

  return formData
}

function flattenObject(obj, filesKey, prefix = '') {
  const flattened = {}

  for (const key in obj) {
    if (key === filesKey) continue

    const value = obj[key]
    const newKey = prefix ? `${prefix}[${key}]` : key

    if (value && typeof value === 'object' && !Array.isArray(value)) {
      Object.assign(flattened, flattenObject(value, filesKey, newKey))
    } else {
      flattened[newKey] = value
    }
  }

  return flattened
}

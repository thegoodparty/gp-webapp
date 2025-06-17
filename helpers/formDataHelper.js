export function objectToFormData(payload, fileKeys = ['files']) {
  const formData = new FormData()

  // Ensure fileKeys is always an array
  const fileKeysArray = Array.isArray(fileKeys) ? fileKeys : [fileKeys]

  // Flatten nested objects first - exclude all file keys
  const flattened = flattenObject(payload, fileKeysArray)

  // Add all non-file fields
  for (const key in flattened) {
    const value = flattened[key]
    if (fileKeysArray.includes(key) || value == undefined) continue

    // Skip empty arrays as they get converted to empty strings
    if (Array.isArray(value) && value.length === 0) continue

    formData.append(key, value)
  }

  // Add files last
  fileKeysArray.forEach((fileKey) => {
    addFilesToFormData(formData, payload[fileKey], fileKey)
  })

  return formData
}

function addFilesToFormData(formData, files, fileKey) {
  if (!files) return

  if (Array.isArray(files)) {
    files.forEach((file) => {
      formData.append(fileKey, file, file.name)
    })
  } else if (files instanceof FileList) {
    Array.from(files).forEach((file) => {
      formData.append(fileKey, file, file.name)
    })
  } else {
    formData.append(fileKey, files, files.name)
  }
}

function flattenObject(obj, fileKeys, prefix = '') {
  const flattened = {}

  for (const key in obj) {
    if (fileKeys.includes(key)) continue

    const value = obj[key]
    const newKey = prefix ? `${prefix}[${key}]` : key

    if (value && typeof value === 'object' && !Array.isArray(value)) {
      Object.assign(flattened, flattenObject(value, fileKeys, newKey))
    } else {
      flattened[newKey] = value
    }
  }

  return flattened
}

export const EIN_PATTERN_PARTIAL = /^\d{1,2}-\d{0,7}$|^\d{2}$|^\d$/
export const EIN_PATTERN_FULL = /^\d{2}-\d{7}$/
export const isValidEIN = (value) => EIN_PATTERN_FULL.test(value) || null

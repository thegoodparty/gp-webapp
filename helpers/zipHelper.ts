export const validateZip = (zip: string): boolean => {
  const validZip = /(^\d{5}$)|(^\d{5}-\d{4}$)/
  return validZip.test(zip)
}

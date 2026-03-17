import { MARKETING_SITE_DOMAIN } from 'appEnv'

export const getMarketingUrl = (path: string): string =>
  `https://${MARKETING_SITE_DOMAIN}${path}`

export const isValidUrl = (str: string): boolean => {
  const pattern = new RegExp(
    '^(https?:\\/\\/)' +
      '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|' +
      '((\\d{1,3}\\.){3}\\d{1,3}))' +
      '(\\:\\d+)?(\\/[-a-z\\d%_.~+@]*)*' +
      '(\\?[;&a-z\\d%_.~+=-]*)?' +
      '(\\#[-a-z\\d_]*)?$',
    'i',
  )
  return !!pattern.test(str)
}

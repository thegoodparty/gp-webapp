import { AnalyticsBrowser } from '@segment/analytics-next'
import { NEXT_PUBLIC_SEGMENT_WRITE_KEY } from 'appEnv'

export const analytics = AnalyticsBrowser.load({
  writeKey: NEXT_PUBLIC_SEGMENT_WRITE_KEY,
}).then((result) => {
  return Array.isArray(result) ? result[0] : result
})

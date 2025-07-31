import { AnalyticsBrowser } from '@segment/analytics-next'
import { NEXT_PUBLIC_SEGMENT_WRITE_KEY } from 'appEnv'

export const analytics = NEXT_PUBLIC_SEGMENT_WRITE_KEY
  ? AnalyticsBrowser.load({
      writeKey: NEXT_PUBLIC_SEGMENT_WRITE_KEY,
    })
  : null

if (!NEXT_PUBLIC_SEGMENT_WRITE_KEY) {
  console.warn('Segment write key not found. Analytics will not be initialized')
}

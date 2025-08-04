import { getReadyAnalytics } from 'app/shared/utils/analytics'

export const segmentTrackEvent = async (eventName, properties) => {
  try {
    const analyticsInstance = await getReadyAnalytics()
    if (!analyticsInstance || typeof analyticsInstance.track !== 'function') {
      return
    }
    analyticsInstance.track(eventName, properties)
  } catch (error) {
    console.error('Error tracking Segment event:', error)
  }
}

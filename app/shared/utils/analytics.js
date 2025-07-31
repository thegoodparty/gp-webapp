import { AnalyticsBrowser } from '@segment/analytics-next'
import { NEXT_PUBLIC_SEGMENT_WRITE_KEY } from 'appEnv'

let analyticsInstance = null
let analyticsPromise = null

const createAnalytics = () => {
  if (!NEXT_PUBLIC_SEGMENT_WRITE_KEY) {
    console.warn(
      'Segment write key not found. Analytics will not be initialized',
    )
    return null
  }

  if (analyticsInstance) {
    return analyticsInstance
  }

  if (!analyticsPromise) {
    analyticsPromise = AnalyticsBrowser.load({
      writeKey: NEXT_PUBLIC_SEGMENT_WRITE_KEY,
    })
      .then((instance) => {
        analyticsInstance = instance
        return instance
      })
      .catch((error) => {
        console.error('Failed to load Segment analytics:', error)
        analyticsPromise = null
        return null
      })
  }

  return analyticsPromise
}

export const analytics = createAnalytics()

export const getAnalytics = async () => {
  if (!NEXT_PUBLIC_SEGMENT_WRITE_KEY) {
    return null
  }

  try {
    const instance = await analytics
    return instance
  } catch (error) {
    console.error('Error getting analytics instance:', error)
    return null
  }
}

export const identifyUser = async (userId, traits = {}) => {
  try {
    const analytics = await getAnalytics()
    if (!analytics) return false

    await analytics.ready()

    if (userId) {
      analytics.identify(userId, traits)
    } else {
      analytics.identify(traits)
    }

    return true
  } catch (error) {
    console.error('Error identifying user:', error)
    return false
  }
}

export const trackPage = async (name, properties = {}) => {
  try {
    const analytics = await getAnalytics()
    if (!analytics) return false

    await analytics.ready()
    analytics.page(name, properties)
    return true
  } catch (error) {
    console.error('Error tracking page:', error)
    return false
  }
}

export const trackEvent = async (eventName, properties = {}) => {
  try {
    const analytics = await getAnalytics()
    if (!analytics) return false

    await analytics.ready()
    analytics.track(eventName, properties)
    return true
  } catch (error) {
    console.error('Error tracking event:', error)
    return false
  }
}

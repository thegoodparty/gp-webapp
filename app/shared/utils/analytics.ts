import { AnalyticsBrowser, Analytics } from '@segment/analytics-next'
import { NEXT_PUBLIC_SEGMENT_WRITE_KEY } from 'appEnv'

export const analytics: Promise<Analytics | null> =
  typeof window !== 'undefined' && NEXT_PUBLIC_SEGMENT_WRITE_KEY
    ? AnalyticsBrowser.load({
        writeKey: NEXT_PUBLIC_SEGMENT_WRITE_KEY,
      })
        .then((result) => (Array.isArray(result) ? result[0] : result))
        .catch((error) => {
          console.error('Segment analytics failed to load:', error)
          return null
        })
    : Promise.resolve(null)

export const getReadyAnalytics = async (): Promise<Analytics | null> => {
  if (typeof window === 'undefined') return null

  try {
    const analyticsInstance = await analytics
    if (!analyticsInstance) return null

    if (typeof analyticsInstance.ready === 'function') {
      await analyticsInstance.ready()
    }

    return analyticsInstance
  } catch (error) {
    console.error('Error getting ready analytics:', error)
    return null
  }
}

export const identifyUser = async (
  userId?: string | number,
  traits: Record<string, unknown> = {},
): Promise<boolean> => {
  try {
    const analyticsInstance = await getReadyAnalytics()
    if (
      !analyticsInstance ||
      typeof analyticsInstance.identify !== 'function'
    ) {
      return false
    }

    if (userId) {
      analyticsInstance.identify(String(userId), traits)
    } else {
      analyticsInstance.identify(traits)
    }
    return true
  } catch (error) {
    console.error('Error identifying user:', error)
    return false
  }
}

export const trackPage = async (
  name?: string,
  properties: Record<string, unknown> = {},
): Promise<boolean> => {
  try {
    const analyticsInstance = await getReadyAnalytics()
    if (!analyticsInstance || typeof analyticsInstance.page !== 'function') {
      return false
    }

    analyticsInstance.page(name, properties)
    return true
  } catch (error) {
    console.error('Error tracking page:', error)
    return false
  }
}


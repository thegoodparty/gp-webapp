import { clientFetch } from 'gpApi/clientFetch'
import { apiRoutes } from 'gpApi/routes'

export const getVisitorId = () => {
  let visitorId = localStorage.getItem('visitor_id')
  if (!visitorId) {
    visitorId = crypto.randomUUID()
    localStorage.setItem('visitor_id', visitorId)
  }
  return visitorId
}

export const trackWebsiteView = async (vanityPath) => {
  const sessionKey = `viewed_${vanityPath}`
  const hasViewed = sessionStorage.getItem(sessionKey)

  if (!hasViewed) {
    try {
      await clientFetch(apiRoutes.website.trackView, {
        vanityPath,
        visitorId: getVisitorId(),
      })
      sessionStorage.setItem(sessionKey, 'true')
    } catch (error) {
      console.warn('Failed to track view:', error)
    }
  }
}

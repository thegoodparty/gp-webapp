export const segmentTrackEvent = (eventName, properties) => {
  if (typeof window === 'undefined' || !window.analytics) return
  if (typeof window.analytics.track === 'function') {
    window.analytics.track(eventName, properties)
  }
}

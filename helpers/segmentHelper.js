export const segmentTrackEvent = (eventName, properties) => {
  if (typeof window === 'undefined' || !window.analytics) return
  window.analytics.track(eventName, properties)
}
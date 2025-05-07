export const segmentTrackEvent = (eventName, properties) => {
  if (typeof window === 'undefined' || !window.analytics) return
  console.log('running analytics.track()')
  window.analytics.track(eventName, properties)
}
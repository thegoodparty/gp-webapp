export const segmentTrackEvent = (eventName, properties) => {
  console.log('segmentTrackEvent entered')
  if (typeof window === 'undefined' || !window.analytics) return
  console.log('segmentTrackEvent did not return early')
  window.analytics.track(eventName, properties)
}
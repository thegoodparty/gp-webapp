export const useAnalytics = () => 
  useSyncExternalStore(
    (notify) => {
      const id = setInterval(() => {
        if (typeof window !== 'undefined' && window.analytics) notify()
      }, 100)
    return () => clearInterval(id)
    },
    () => (typeof window !== 'undefined' ? window.analytics : undefined)
  )
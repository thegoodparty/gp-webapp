'use client'
import { useEffect, useState } from 'react'

const onHubspotWidgetLoaded = (onLoaded) => () => onLoaded(true)

const registerWidgetLoadedCallback = (onLoaded) => () => {
  const callback = onHubspotWidgetLoaded(onLoaded)
  window.HubSpotConversations?.on('widgetLoaded', callback)
  return callback
}

const deregisterHubspotWidgetLoaded = (registerdCallback) => () =>
  window.HubSpotConversations?.off('widgetLoaded', registerdCallback)

export const useHubSpotConversations = () => {
  const [widgetLoaded, setWidgetLoaded] = useState(false)

  const widgetLoadedCallback = registerWidgetLoadedCallback(setWidgetLoaded)
  useEffect(() => {
    if (!window.HubSpotConversations) {
      window.hsConversationsOnReady = [
        ...(window.hsConversationsOnReady || []),
        widgetLoadedCallback,
      ]
    } else {
      window.HubSpotConversations.resetAndReloadWidget()
      widgetLoadedCallback()
    }
    return deregisterHubspotWidgetLoaded(widgetLoadedCallback)
  }, [])

  return { widgetLoaded, setWidgetLoaded }
}

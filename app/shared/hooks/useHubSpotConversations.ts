'use client'
import { useEffect, useState } from 'react'

const onHubspotWidgetLoaded = (onLoaded: (loaded: boolean) => void) => () => onLoaded(true)

const registerWidgetLoadedCallback = (onLoaded: (loaded: boolean) => void) => () => {
  const callback = onHubspotWidgetLoaded(onLoaded)
  const hubspot = (window as { HubSpotConversations?: { on: (event: string, cb: () => void) => void } }).HubSpotConversations
  hubspot?.on('widgetLoaded', callback)
  return callback
}

const deregisterHubspotWidgetLoaded = (registerdCallback: () => void) => () => {
  const hubspot = (window as { HubSpotConversations?: { off: (event: string, cb: () => void) => void } }).HubSpotConversations
  hubspot?.off('widgetLoaded', registerdCallback)
}

export const useHubSpotConversations = () => {
  const [widgetLoaded, setWidgetLoaded] = useState(false)

  const widgetLoadedCallback = registerWidgetLoadedCallback(setWidgetLoaded)
  useEffect(() => {
    const hubspot = (window as { HubSpotConversations?: { resetAndReloadWidget: () => void } }).HubSpotConversations
    if (!hubspot) {
      const w = window as { hsConversationsOnReady?: (() => void)[] }
      const callback = widgetLoadedCallback as () => void
      w.hsConversationsOnReady = [
        ...(w.hsConversationsOnReady || []),
        callback,
      ]
    } else {
      hubspot.resetAndReloadWidget()
      widgetLoadedCallback()
    }
    return deregisterHubspotWidgetLoaded(widgetLoadedCallback)
  }, [widgetLoadedCallback])

  return { widgetLoaded, setWidgetLoaded }
}


'use client'
import { useEffect } from 'react'
import { trackWebsiteView } from '../util/websiteTracking'

export default function WebsiteViewTracker({ vanityPath }) {
  useEffect(() => {
    if (vanityPath) {
      trackWebsiteView(vanityPath)
    }
  }, [vanityPath])

  return null
}

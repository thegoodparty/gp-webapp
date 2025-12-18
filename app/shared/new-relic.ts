'use client'
import { BrowserAgent } from '@newrelic/browser-agent/loaders/browser-agent'
import { useUser } from './hooks/useUser'
import { useEffect } from 'react'
import { useCampaign } from './hooks/useCampaign'
import { usePathname } from 'next/navigation'
import { isProductRoute } from './utils/isProductRoute'

export const newrelic = new BrowserAgent({
  info: {
    licenseKey: 'NRJS-f5250be4de5180494b6',
    applicationID: '1120481134',
  },
})

let started = false

if (typeof window !== 'undefined' && isProductRoute(window.location.pathname)) {
  void newrelic.start()
  started = true
}

export const NewRelicIdentifier: React.FC = () => {
  const pathname = usePathname()
  const [user] = useUser()
  const [campaign] = useCampaign()

  useEffect(() => {
    if (isProductRoute(pathname) && !started) {
      void newrelic.start()
      started = true
    }
    if (user) {
      newrelic.setUserId(user.id.toString())
      newrelic.setCustomAttribute('email', user.email)
    }

    if (campaign) {
      newrelic.setCustomAttribute('campaignSlug', campaign.slug)
    }
  }, [pathname, user, campaign])

  return null
}

'use client'
import type { BrowserAgent } from '@newrelic/browser-agent'
import { useUser } from './hooks/useUser'
import { useCampaign } from './hooks/useCampaign'
import { usePathname } from 'next/navigation'
import { useEffect } from 'react'
import { isProductRoute } from './utils/isProductRoute'
import type { Init } from '@newrelic/browser-agent/src/common/config/init-types.js'
import { IS_LOCAL } from 'appEnv'

declare global {
  interface Window {
    newrelic?: BrowserAgent
  }
}

const DISABLED_FEATURES: (keyof Init)[] = [
  'ajax',
  'jserrors',
  'metrics',
  'generic_events',
  'page_view_event',
  'page_view_timing',
  'session_replay',
  'session_trace',
  'spa',
  'logging',
]

let agent: BrowserAgent | undefined = undefined
let started = false

const getNewRelic = async () => {
  if (agent) {
    return agent
  }
  const { BrowserAgent: Agent } = await import('@newrelic/browser-agent')

  agent = new Agent({
    info: {
      licenseKey: 'NRJS-f5250be4de5180494b6',
      applicationID: '1120481134',
    },
    init: Object.fromEntries(
      DISABLED_FEATURES.map((feature) => [feature, { autoStart: false }]),
    ),
  })

  return agent
}

export const reportErrorToNewRelic = (
  error: Error | string,
  customAttributes?: Record<string, any>,
): void => {
  void getNewRelic().then((newrelic) => {
    newrelic.noticeError(error, customAttributes)
  })
}

export const NewRelicIdentifier: React.FC = () => {
  const pathname = usePathname()
  const [user] = useUser()
  const [campaign] = useCampaign()

  useEffect(() => {
    void getNewRelic().then((newrelic) => {
      if (!IS_LOCAL && isProductRoute(pathname) && !started) {
        void newrelic.start()
        started = true
      }
      const VERSION = process.env.NEXT_PUBLIC_VERCEL_GIT_COMMIT_SHA || 'local'
      newrelic.setApplicationVersion(VERSION)
      if (user?.id) {
        newrelic.setUserId(user.id.toString())
      }
      if (user?.email) {
        newrelic.setCustomAttribute('email', user.email)
      }
      if (campaign) {
        newrelic.setCustomAttribute('campaignSlug', campaign.slug)
      }
    })
  }, [pathname, user, campaign])

  return null
}

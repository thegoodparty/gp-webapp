'use client'
import type { BrowserAgent } from '@newrelic/browser-agent'
import { useUser } from './hooks/useUser'
import { useCampaign } from './hooks/useCampaign'
import { usePathname } from 'next/navigation'
import { useEffect } from 'react'
import { isProductRoute } from './utils/isProductRoute'
import type { AgentOptions } from '@newrelic/browser-agent/src/loaders/agent.js'
import { IS_LOCAL } from 'appEnv'

let agent: BrowserAgent | undefined = undefined
let started = false

/**
 * This object is copied from the newrelic Application Settings screen.
 */
const options: AgentOptions = {
  info: {
    beacon: 'bam.nr-data.net',
    errorBeacon: 'bam.nr-data.net',
    licenseKey: 'NRJS-f5250be4de5180494b6',
    applicationID: '1120481134',
    sa: 1,
  },
  loader_config: {
    accountID: '7128335',
    trustKey: '7128335',
    agentID: '1120481134',
    licenseKey: 'NRJS-f5250be4de5180494b6',
    applicationID: '1120481134',
  },
  init: {
    session_replay: {
      enabled: true,
      block_selector: '',
      mask_text_selector: '*',
      sampling_rate: 100.0,
      error_sampling_rate: 100.0,
      mask_all_inputs: true,
      collect_fonts: true,
      inline_images: false,
      fix_stylesheets: true,
      preload: false,
      mask_input_options: {},
    },
    distributed_tracing: { enabled: true },
    performance: { capture_measures: true },
    browser_consent_mode: { enabled: false },
    privacy: { cookies_enabled: true },
    ajax: { deny_list: ['bam.nr-data.net'] },
  },
} satisfies AgentOptions

const DISABLED_FEATURES = [
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
] as const

for (const feature of DISABLED_FEATURES) {
  if (options.init![feature]) {
    options.init![feature].autoStart = false
  } else {
    options.init![feature] = { autoStart: false }
  }
}

const getNewRelic = async () => {
  if (agent) {
    return agent
  }
  const { BrowserAgent: Agent } = await import('@newrelic/browser-agent')

  agent = new Agent(options)

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

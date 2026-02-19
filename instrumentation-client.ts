'use client'
import * as Sentry from '@sentry/nextjs'
import { isProductRoute } from 'app/shared/utils/isProductRoute'

Sentry.init({
  dsn: 'https://6a3734c28a66ca850443447cd6d1f691@o4510915540025344.ingest.us.sentry.io/4510915613884416',
  enabled: !process.env.NEXT_PUBLIC_API_BASE?.includes('localhost'),

  tracesSampleRate: 1.0,

  integrations: [
    Sentry.replayIntegration({
      maskAllText: false,
      maskAllInputs: true,
      blockAllMedia: false,
    }),
  ],

  // We explicitly enable replays programmatically in the SentryIdentifier component
  replaysSessionSampleRate: 0,
  replaysOnErrorSampleRate: 0,
  // Don't send events from non-product routes
  beforeSend: (event) => {
    if (!isProductRoute(window.location.pathname)) {
      return null
    }
    return event
  },
  beforeSendTransaction: (event) => {
    if (!isProductRoute(window.location.pathname)) {
      return null
    }
    return event
  },
})

export const onRouterTransitionStart = Sentry.captureRouterTransitionStart

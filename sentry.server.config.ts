import * as Sentry from '@sentry/nextjs'
import { isProductRoute } from 'app/shared/utils/isProductRoute'

function getRouteFromEvent(
  event: Sentry.ErrorEvent | Sentry.TransactionEvent,
): string | undefined {
  return (
    event.transaction ??
    event.request?.url ??
    event.tags?.['http.route'] ??
    undefined
  )
}

Sentry.init({
  dsn: 'https://6a3734c28a66ca850443447cd6d1f691@o4510915540025344.ingest.us.sentry.io/4510915613884416',

  tracesSampler: ({ attributes, parentSampled }) => {
    if (parentSampled !== undefined) return parentSampled
    const route =
      attributes?.['http.target'] ??
      attributes?.['url.path'] ??
      attributes?.['http.route']
    if (typeof route === 'string' && !isProductRoute(route)) return 0
    return 0.1
  },

  beforeSend: (event) => {
    const route = getRouteFromEvent(event)
    if (route && !isProductRoute(route)) return null
    return event
  },

  beforeSendTransaction: (event) => {
    const route = getRouteFromEvent(event)
    if (route && !isProductRoute(route)) return null
    return event
  },
})

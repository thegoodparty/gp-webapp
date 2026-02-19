import * as Sentry from '@sentry/nextjs'

Sentry.init({
  dsn: 'https://6a3734c28a66ca850443447cd6d1f691@o4510915540025344.ingest.us.sentry.io/4510915613884416',
  tracesSampleRate: 1.0,
})

import * as Sentry from '@sentry/react'

const SENTRY_DSN = import.meta.env.VITE_SENTRY_DSN ?? ''

export function initSentry() {
  if (!SENTRY_DSN) return

  Sentry.init({
    dsn: SENTRY_DSN,
    environment: import.meta.env.MODE,
    tracesSampleRate: import.meta.env.PROD ? 0.1 : 0,
    integrations: [Sentry.browserTracingIntegration(), Sentry.replayIntegration()],
    beforeSend(event) {
      // Never forward errors captured from local development.
      return import.meta.env.PROD ? event : null
    },
  })
}

/** Reports an error to Sentry, falling back to console output when disabled. */
export function captureError(error: unknown, context?: Record<string, unknown>) {
  if (!SENTRY_DSN) {
    console.error('[Sentry disabled]', error, context)
    return
  }
  Sentry.captureException(error, { extra: context })
}

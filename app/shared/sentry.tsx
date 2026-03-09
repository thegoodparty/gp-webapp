'use client'

import * as Sentry from '@sentry/nextjs'
import { useUser } from './hooks/useUser'
import { useCampaign } from './hooks/useCampaign'
import { useEffect } from 'react'
import { isTestUser } from 'helpers/test-users'

export const reportErrorToSentry = (
  error: Error,
  customAttributes?: Partial<Record<string, unknown>>,
) => {
  Sentry.captureException(error, {
    extra: customAttributes,
  })
}

export const SentryIdentifier: React.FC = () => {
  const [user] = useUser()
  const [campaign] = useCampaign()

  const userId = user?.id
  const email = user?.email

  useEffect(() => {
    if (userId) {
      Sentry.setUser({
        id: userId.toString(),
        email: email || undefined,
      })
    }

    if (campaign) {
      Sentry.setTag('campaignSlug', campaign.slug)
    }

    // Always record sessions for logged-in users (but not test users)
    if (email && !isTestUser({ email })) {
      const replay = Sentry.getReplay()
      replay?.start()
    }
  }, [userId, email, campaign])

  return null
}

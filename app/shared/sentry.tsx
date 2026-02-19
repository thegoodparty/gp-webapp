'use client'

import * as Sentry from '@sentry/nextjs'
import { useUser } from './hooks/useUser'
import { useCampaign } from './hooks/useCampaign'
import { useEffect } from 'react'
import { getUserCookie } from 'helpers/cookieHelper'
import { isTestUser } from 'helpers/test-users'

export const reportErrorToSentry = (
  error: Error,
  customAttributes?: Record<string, any>,
) => {
  Sentry.captureException(error, {
    extra: customAttributes,
  })
}

export const SentryIdentifier: React.FC = () => {
  const [user] = useUser()
  const [campaign] = useCampaign()

  const cookieUser = getUserCookie(true)
  const userId = user?.id ?? (cookieUser ? cookieUser?.id : undefined)
  const email = user?.email ?? (cookieUser ? cookieUser?.email : undefined)

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

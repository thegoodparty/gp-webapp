'use client'
import { FocusedExperienceWrapper } from 'app/(candidate)/dashboard/shared/FocusedExperienceWrapper'
import H1 from '@shared/typography/H1'
import Body2 from '@shared/typography/Body2'
import { AlreadyProUserPrompt } from 'app/(candidate)/dashboard/shared/AlreadyProUserPrompt'
import Image from 'next/image'
import { useEffect, useState } from 'react'
import { updateUser } from 'helpers/userHelper'
import PrimaryButton from '@shared/buttons/PrimaryButton'
import { clientFetch } from 'gpApi/clientFetch'
import { apiRoutes } from 'gpApi/routes'
import { EVENTS, trackEvent } from 'helpers/fullStoryHelper'

const doRedirect = async (currentTimeoutId) => {
  clearTimeout(currentTimeoutId)
  try {
    const resp = await clientFetch(apiRoutes.payments.createCheckoutSession)
    const { redirectUrl } = resp.data || {}
    await updateUser()
    if (redirectUrl) {
      window.location.href = redirectUrl
    } else {
      throw new Error('No redirect url found')
    }
  } catch (e) {
    console.error('error when creating checkout session.', e)
  }
}

const PurchaseRedirectPage = ({ campaign, redirectDelaySecs }) => {
  const [countdown, setCountdown] = useState(redirectDelaySecs)
  const [currentTimeoutId, setCurrentTimeoutId] = useState(null)

  useEffect(() => {
    if (countdown === 0) {
      doRedirect(currentTimeoutId)
    } else {
      clearTimeout(currentTimeoutId)
      setCurrentTimeoutId(setTimeout(() => setCountdown(countdown - 1), 1000))
    }
  }, [countdown])

  return (
    <FocusedExperienceWrapper>
      {campaign?.isPro ? (
        <AlreadyProUserPrompt />
      ) : (
        <div className="text-center">
          <Image
            className="mx-auto mb-8"
            src="/images/emojis/clockwise-vertical-arrows.svg"
            width={80}
            height={80}
            alt="clap"
          />
          <H1 className="mb-4">
            You&apos;re about to be redirected to Stripe to confirm your payment
            details
          </H1>
          <Body2 className="mb-8">
            Once finished, you will be brought back to Good Party.
          </Body2>
          <p className="text-sm font-semibold mb-6">
            Redirecting in {countdown} seconds...
          </p>
          <PrimaryButton
            className="w-full md:w-auto"
            onClick={() => {
              trackEvent(EVENTS.ProUpgrade.ClickGoToStripe)
              doRedirect(currentTimeoutId)
            }}
          >
            Go to Stripe
          </PrimaryButton>
        </div>
      )}
    </FocusedExperienceWrapper>
  )
}

export default PurchaseRedirectPage

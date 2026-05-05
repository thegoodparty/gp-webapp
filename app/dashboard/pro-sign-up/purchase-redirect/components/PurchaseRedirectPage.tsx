'use client'
import { FocusedExperienceWrapper } from 'app/dashboard/shared/FocusedExperienceWrapper'
import H1 from '@shared/typography/H1'
import Body2 from '@shared/typography/Body2'
import { AlreadyProUserPrompt } from 'app/dashboard/shared/AlreadyProUserPrompt'
import Image from 'next/image'
import { useEffect, useState } from 'react'
import { updateUser } from 'helpers/userHelper'
import PrimaryButton from '@shared/buttons/PrimaryButton'
import { clientFetch } from 'gpApi/clientFetch'
import { apiRoutes } from 'gpApi/routes'
import { EVENTS, trackEvent } from 'helpers/analyticsHelper'

type CheckoutErrorBody = { errorCode?: string; message?: string }

const ELECTION_DATE_ERROR_CODE = 'CAMPAIGN_ELECTION_DATE_INVALID'

const doRedirect = async (
  currentTimeoutId: NodeJS.Timeout | null,
  setElectionDateError: (message: string) => void,
) => {
  if (currentTimeoutId) {
    clearTimeout(currentTimeoutId)
  }
  try {
    const resp = await clientFetch<{ redirectUrl?: string }>(
      apiRoutes.payments.createCheckoutSession,
    )
    if (!resp.ok) {
      const body = (resp.data as CheckoutErrorBody | undefined) ?? {}
      if (body.errorCode === ELECTION_DATE_ERROR_CODE) {
        setElectionDateError(
          body.message ??
            'Your campaign election date is missing or in the past.',
        )
      }
      return
    }
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

interface PurchaseRedirectPageProps {
  campaign: { isPro?: boolean }
  redirectDelaySecs: string | number
}

const PurchaseRedirectPage = ({
  campaign,
  redirectDelaySecs,
}: PurchaseRedirectPageProps): React.JSX.Element => {
  const [countdown, setCountdown] = useState(Number(redirectDelaySecs))
  const [electionDateError, setElectionDateError] = useState<string | null>(
    null,
  )
  const [currentTimeoutId, setCurrentTimeoutId] =
    useState<NodeJS.Timeout | null>(null)

  const killTimeout = () => {
    if (currentTimeoutId) {
      clearTimeout(currentTimeoutId)
    }
  }

  useEffect(() => {
    if (electionDateError) return
    if (countdown === 0) {
      doRedirect(currentTimeoutId, setElectionDateError)
    } else {
      killTimeout()
      setCurrentTimeoutId(setTimeout(() => setCountdown(countdown - 1), 1000))
    }

    return () => killTimeout()
  }, [countdown, electionDateError])

  return (
    <FocusedExperienceWrapper>
      {campaign?.isPro ? (
        <AlreadyProUserPrompt />
      ) : electionDateError ? (
        <div className="text-center">
          <H1 className="mb-4">Update your election date to renew Pro</H1>
          <Body2 className="mb-8">{electionDateError}</Body2>
          <PrimaryButton
            className="w-full md:w-auto"
            onClick={() => {
              window.location.href = '/dashboard/campaign-details'
            }}
          >
            Update campaign details
          </PrimaryButton>
        </div>
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
              doRedirect(currentTimeoutId, setElectionDateError)
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

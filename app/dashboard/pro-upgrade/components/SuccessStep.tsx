'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button, ProBadge } from '@styleguide'
import H1 from '@shared/typography/H1'
import Body2 from '@shared/typography/Body2'
import Confetti from 'app/dashboard/questions/components/Confetti'
import { EVENTS, trackEvent } from 'helpers/analyticsHelper'

// The post-payment compliance surface (task 15) lives on the profile page in the
// `texting-compliance` card, which renders once `isPro` flips. We deep-link to it
// so the candidate lands on their live Pro status.
const COMPLIANCE_SURFACE_PATH = '/dashboard/profile#texting-compliance'

// Post-payment landing (Stripe embedded-checkout return_url + PaymentStep's
// on-confirm nav). Purely presentational: `isPro` flips asynchronously via the
// webhook, so this screen never gates on it — it celebrates and routes onward,
// and the compliance surface reflects live state once the candidate arrives.
const SuccessStep = (): React.JSX.Element => {
  const router = useRouter()

  useEffect(() => {
    trackEvent(EVENTS.ProUpgrade.Compliance.SuccessViewed)
  }, [])

  const handleContinue = (): void => {
    trackEvent(EVENTS.ProUpgrade.Compliance.SuccessContinue)
    router.push(COMPLIANCE_SURFACE_PATH)
  }

  return (
    <>
      <Confetti />
      <div className="mx-auto flex max-w-[448px] flex-col items-center gap-6 text-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-xl bg-blue-100">
          <ProBadge size="large" />
        </div>

        <div className="flex flex-col gap-1.5">
          <H1>Welcome to Pro!</H1>
          <Body2 className="text-secondary">
            You can now access voter data, build lists and schedule robocalls!
            Your PIN will be sent to your email, phone or address within 7
            business days.
          </Body2>
        </div>

        <Button size="large" className="w-full" onClick={handleContinue}>
          Continue
        </Button>
      </div>
    </>
  )
}

export default SuccessStep

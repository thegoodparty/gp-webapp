'use client'

import { useEffect } from 'react'
import { Button } from '@styleguide'
import H2 from '@shared/typography/H2'
import Body2 from '@shared/typography/Body2'
import { EVENTS, trackEvent } from 'helpers/analyticsHelper'
import { PRO_UPGRADE_STEP } from '../proUpgradeStep'
import { useProUpgradeWizard } from './ProUpgradeWizard'

// The four things the rest of the wizard collects, in the order the candidate
// encounters them (EIN → filing details → candidate profile → payment). Per
// the Figma "guidance" frame these are plain labels — the filing window dates
// live on the not-yet-filed filing-instructions screen, not here. This screen
// is presentational only: it sets expectations and neither reads nor writes
// any of these.
const GATHER_STEPS = [
  'Your campaign EIN',
  'Your campaign filing details',
  'Your candidate profile',
  'Payment',
]

const GuidanceStep = (): React.JSX.Element => {
  const { goToStep } = useProUpgradeWizard()

  useEffect(() => {
    trackEvent(EVENTS.ProUpgrade.Compliance.GuidanceViewed)
  }, [])

  const handleContinue = (): void => {
    trackEvent(EVENTS.ProUpgrade.Compliance.GuidanceContinue)
    // GUIDANCE is off the linear step order (the router can't derive an
    // interstitial with no persisted "seen" state), so advance explicitly to
    // the EIN step rather than via goToNextStep.
    goToStep(PRO_UPGRADE_STEP.EIN)
  }

  return (
    <div>
      <H2 className="mb-2">
        Great! We&apos;ll need to gather a few things to get you set up for
        texting
      </H2>
      <Body2 className="text-secondary mb-8">
        This is required to access voter data and send texts.
      </Body2>

      <ol className="rounded-xl border border-gray-200">
        {GATHER_STEPS.map((label, index) => (
          <li
            key={label}
            className="flex items-center gap-3 border-t border-gray-200 p-4 first:border-t-0"
          >
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-blue-50 font-medium text-primary">
              {index + 1}
            </span>
            <span>{label}</span>
          </li>
        ))}
      </ol>

      <div className="mt-8 flex justify-end">
        <Button size="large" onClick={handleContinue}>
          Let&apos;s go!
        </Button>
      </div>
    </div>
  )
}

export default GuidanceStep

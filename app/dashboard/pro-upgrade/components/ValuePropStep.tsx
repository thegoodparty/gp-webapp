'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button, ProBadge } from '@styleguide'
import { CheckIcon, XMarkIcon } from '@styleguide/components/ui/icons'
import H1 from '@shared/typography/H1'
import Body2 from '@shared/typography/Body2'
import { EVENTS, trackEvent } from 'helpers/analyticsHelper'
import { useProUpgradeWizard } from './ProUpgradeWizard'

interface ComparisonRow {
  label: string
  free: boolean
}
// Free-vs-Pro comparison from the Figma. Every row is included in Pro, so only
// the Free column varies.
const COMPARISON_ROWS: ComparisonRow[] = [
  { label: 'Campaign plan', free: true },
  { label: 'Campaign advising', free: false },
  { label: 'Voter data & list building', free: false },
  { label: '10DLC compliance', free: false },
  { label: 'Texts and robocalls', free: false },
  { label: 'Up to 5,000 free texts', free: false },
]

const ROW_GRID = 'grid grid-cols-[1fr_64px_64px] items-center'

const ValuePropStep = (): React.JSX.Element => {
  const router = useRouter()
  const { goToNextStep } = useProUpgradeWizard()

  useEffect(() => {
    trackEvent(EVENTS.ProUpgrade.Compliance.ValuePropViewed)
  }, [])

  const handleGetPro = () => {
    trackEvent(EVENTS.ProUpgrade.Compliance.ValuePropGetPro)
    goToNextStep()
  }

  const handleMaybeLater = () => {
    trackEvent(EVENTS.ProUpgrade.Compliance.ValuePropMaybeLater)
    router.push('/dashboard')
  }

  return (
    <div>
      <H1 className="text-center mb-2">76% of candidates who use Pro win</H1>
      <Body2 className="text-center text-secondary mb-8">
        Get $300 of value for $10/mo.
      </Body2>

      <div className="mb-10">
        <div className={`${ROW_GRID} mb-2`}>
          <span />
          <span className="text-center text-secondary">Free</span>
          <span className="flex justify-center">
            <ProBadge />
          </span>
        </div>

        {COMPARISON_ROWS.map(({ label, free }) => (
          <div
            key={label}
            className={`${ROW_GRID} border-t border-gray-200 py-3`}
          >
            <span className="font-medium">{label}</span>
            <span className="flex justify-center">
              {free ? (
                <CheckIcon className="h-5 w-5 text-primary" />
              ) : (
                <XMarkIcon className="h-5 w-5 text-destructive" />
              )}
            </span>
            <span className="flex justify-center">
              <CheckIcon className="h-5 w-5 text-primary" />
            </span>
          </div>
        ))}
      </div>

      <div className="flex flex-col items-center gap-3">
        <Button
          size="large"
          className="w-full sm:w-auto"
          onClick={handleGetPro}
        >
          Get Pro for $10/mo
        </Button>
        <Button variant="ghost" size="large" onClick={handleMaybeLater}>
          Maybe later
        </Button>
      </div>
    </div>
  )
}

export default ValuePropStep

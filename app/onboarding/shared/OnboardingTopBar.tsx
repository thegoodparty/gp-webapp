'use client'

import { useEffect, useState } from 'react'
import { GoodPartyOrgLogo, Stepper } from '@styleguide'

interface OnboardingTopBarProps {
  currentStep: number
  totalSteps: number
}

const OnboardingTopBar = ({
  currentStep,
  totalSteps,
}: OnboardingTopBarProps): React.JSX.Element => {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 0)
    handleScroll()
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <div className="fixed top-0 inset-x-0 z-10 bg-base-surface">
      <div
        className={`mx-auto w-full max-w-4xl px-4 py-4 sm:px-8 sm:py-5 border-b transition-colors ${
          scrolled ? 'border-base-border' : 'border-transparent'
        }`}
      >
        <div className="flex items-end justify-between">
          <GoodPartyOrgLogo />
          <span className="text-sm font-medium text-muted-foreground">
            Step {currentStep} of {totalSteps}
          </span>
        </div>
        <Stepper
          variant="bar"
          showLabel={false}
          currentStep={currentStep}
          totalSteps={totalSteps}
          className="mt-4"
        />
      </div>
    </div>
  )
}

export default OnboardingTopBar

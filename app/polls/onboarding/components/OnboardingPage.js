'use client'
import { useEffect, useRef, useState, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { StepFooter } from '@shared/stepper'
import InsightsStep from './steps/InsightsStep'
import OutreachStep from './steps/OutreachStep'
import StrategyStep from './steps/StrategyStep'
import AddImageStep from './steps/AddImageStep'
import PreviewStep from './steps/PreviewStep'
import SwornInStep from './steps/SwornInStep'
import { ErrorMessage } from './ErrorMessage'
import { useOnboardingContext } from '../../contexts/OnboardingContext'
import { EVENTS, trackEvent } from 'helpers/analyticsHelper'
import { identifyUser } from '@shared/utils/analytics'

const steps = [
  {
    name: 'Insights',
    nextLabel: 'Gather Feedback',
    nextStep: 'Sworn In',
    allowBack: false,
    backLabel: 'Back',
    backStep: null,
    stepperStepIndex: 1,
  },
  {
    name: 'Sworn In',
    nextLabel: 'Next',
    nextStep: 'Outreach Prelude',
    allowBack: true,
    backLabel: 'Back',
    backStep: 'Insights',
    stepperStepIndex: 2,
  },
  {
    name: 'Outreach Prelude',
    nextLabel: 'Create poll',
    nextStep: 'Strategy',
    allowBack: true,
    backLabel: 'Back',
    backStep: 'Sworn In',
    stepperStepIndex: 3,
  },
  {
    name: 'Strategy',
    nextLabel: 'Add Image',
    nextStep: 'Add Image',
    allowBack: true,
    backLabel: 'Back',
    backStep: 'Outreach Prelude',
    stepperStepIndex: 4,
  },
  {
    name: 'Add Image',
    nextLabel: 'See Preview',
    nextStep: 'Preview',
    allowBack: true,
    backLabel: 'Back',
    backStep: 'Strategy',
    stepperStepIndex: 5,
  },
  {
    name: 'Preview',
    nextLabel: 'Send SMS poll',
    nextStep: null,
    allowBack: true,
    backLabel: 'Back',
    backStep: 'Add Image',
    stepperStepIndex: 6,
  },
]

const maxStepIndex = steps.length
const maxStepperStepIndex = steps.reduce(
  (max, step) => Math.max(max, step.stepperStepIndex),
  0,
)

export default function OnboardingPage() {
  const router = useRouter()
  const {
    submitOnboarding,
    isSubmitting,
    submitError,
    user,
    formData,
    stepValidation,
  } = useOnboardingContext()

  const [currentStepIndex, setCurrentStepIndex] = useState(0)
  const [showError, setShowError] = useState(false)

  const hasFiredGettingStartedRef = useRef(false)
  useEffect(() => {
    if (currentStepIndex === 0 && !hasFiredGettingStartedRef.current) {
      trackEvent(EVENTS.ServeOnboarding.GettingStartedViewed)
      hasFiredGettingStartedRef.current = true
    }
  }, [currentStepIndex])

  const currentStep = useMemo(() => {
    return steps[currentStepIndex]
  }, [currentStepIndex])

  // Step validation
  const currentStepValidation = stepValidation[currentStep.name]
  const isStepValid = useMemo(() => {
    return currentStepValidation === undefined || currentStepValidation === true
  }, [currentStepValidation])

  const nextStepIndex = useMemo(() => {
    const nextStep = currentStep.nextStep
    if (!nextStep) {
      return -1
    }
    const idx = steps.findIndex((step) => step.name === nextStep)
    return idx
  }, [currentStep])

  const backStepIndex = useMemo(() => {
    const backStep = currentStep.backStep
    if (!backStep) {
      return -1
    }
    const idx = steps.findIndex((step) => step.name === backStep)
    return idx
  }, [currentStep])

  const submit = async () => {
    try {
      setShowError(false)
      await submitOnboarding()
      await identifyUser(user?.id, { 'Serve Activated': true })
      trackEvent(EVENTS.ServeOnboarding.SmsPollSent)
      router.push('/polls/onboarding/success')
    } catch (error) {
      console.error('Failed to submit onboarding:', error)
      setShowError(true)
    }
  }

  const isNextDisabled = useMemo(() => {
    return !isStepValid || isSubmitting
  }, [isStepValid, isSubmitting])

  const handleNext = async () => {
    if (currentStepIndex === maxStepIndex - 1) {
      await submit()
    } else {
      // tcrCompliant ? outreach : non-compliant
      if (nextStepIndex !== -1 && currentStepIndex < maxStepIndex) {
        setCurrentStepIndex(nextStepIndex)
      }
    }
  }

  const handleBack = () => {
    if (backStepIndex !== -1 && currentStepIndex > 0) {
      setCurrentStepIndex(backStepIndex)
    }
  }

  return (
    <div className="flex flex-col">
      <main className="flex-1 pb-140 md:pb-0">
        <section className="max-w-screen-md mx-auto bg-white md:border md:border-slate-200 md:rounded-xl md:mt-12 xs:pt-4 md:mb-16">
          <div className="p-4 sm:p-8 lg:p-16 lg:pb-4">
            {currentStep.name === 'Insights' && <InsightsStep />}
            {currentStep.name === 'Sworn In' && <SwornInStep />}
            {currentStep.name === 'Outreach Prelude' && <OutreachStep />}
            {currentStep.name === 'Strategy' && <StrategyStep />}
            {currentStep.name === 'Add Image' && <AddImageStep />}
            {currentStep.name === 'Preview' && <PreviewStep />}

            {/* Error message for failed submission */}
            <ErrorMessage
              title="Failed to send SMS poll"
              message={submitError}
              show={showError}
              onDismiss={() => setShowError(false)}
            />
          </div>

          <div className="hidden md:block w-full border-t border-slate-200 pt-4 pb-4 px-8 lg:px-16">
            <StepFooter
              numberOfSteps={maxStepperStepIndex}
              currentStep={currentStep.stepperStepIndex}
              onBack={currentStep.allowBack ? handleBack : null}
              onBackText={currentStep.backLabel}
              disabledNext={isNextDisabled}
              onNext={handleNext}
              onNextText={isSubmitting ? 'Sending...' : currentStep.nextLabel}
            />
          </div>
        </section>
      </main>
      <div className="block md:hidden w-full fixed bottom-0 inset-x-0 bg-white z-10 px-4 sm:px-8">
        <StepFooter
          numberOfSteps={maxStepperStepIndex}
          currentStep={currentStep.stepperStepIndex}
          onBack={currentStep.allowBack ? handleBack : null}
          onBackText={currentStep.backLabel}
          disabledNext={isNextDisabled}
          onNext={handleNext}
          onNextText={isSubmitting ? 'Sending...' : currentStep.nextLabel}
        />
      </div>
    </div>
  )
}

'use client'

import { StepFooter } from '@shared/stepper'

interface ExpandStepFooterProps {
  currentStep: number
  onNext: () => void
  onNextText: string
  disabledNext?: boolean
  onBack?: (() => void) | null
  onBackText?: string
  hideNext?: boolean
  hideBack?: boolean
}

/**
 * Shared footer component for expand poll flow with consistent divider and step configuration
 */
export default function ExpandStepFooter(
  props: ExpandStepFooterProps,
): React.JSX.Element {
  return (
    <>
      <div className="mt-8 pb-2 border-t border-slate-200" />
      <StepFooter {...props} numberOfSteps={3} />
    </>
  )
}

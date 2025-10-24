'use client'

import { StepFooter } from '@shared/stepper'

/**
 * Shared footer component for expand poll flow with consistent divider and step configuration
 */
export default function ExpandStepFooter(props) {
  return (
    <>
      <div className="mt-8 pb-2 border-t border-slate-200" />
      <StepFooter {...props} numberOfSteps={3} />
    </>
  )
}

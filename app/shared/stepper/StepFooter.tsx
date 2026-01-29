'use client'
import React from 'react'
import { StepIndicator } from '@shared/stepper/StepIndicator'
import { Button } from '@styleguide'

interface StepFooterProps {
  numberOfSteps: number
  currentStep: number
  onNext: () => void
  onNextText: string
  disabledNext?: boolean
  onBack?: (() => void) | null
  onBackText?: string | null
  hideNext?: boolean
  hideBack?: boolean
}

export const StepFooter = ({
  numberOfSteps,
  currentStep,
  onNext,
  onNextText,
  disabledNext = false,
  onBack = null,
  onBackText = null,
  hideNext = false,
  hideBack = false,
}: StepFooterProps): React.JSX.Element => {
  return (
    <div className="flex-col items-center justify-center mb-4 mt-6">
      <div className="w-full m-auto">
        <StepIndicator
          numberOfSteps={numberOfSteps}
          currentStep={currentStep}
        />
      </div>
      <div
        className={`w-full flex mt-6 ${
          onBack ? 'justify-between' : 'justify-end'
        }`}
      >
        {!hideBack && onBack && (
          <Button size="large" className="" variant="ghost" onClick={onBack}>
            {onBackText}
          </Button>
        )}
        {!hideNext && (
          <Button
            size="large"
            className=""
            variant="secondary"
            disabled={disabledNext}
            onClick={onNext}
          >
            {onNextText}
          </Button>
        )}
      </div>
    </div>
  )
}

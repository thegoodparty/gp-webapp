'use client'
import { StepIndicator } from '@shared/stepper/StepIndicator'
import { Button } from 'goodparty-styleguide'

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
}) => {
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

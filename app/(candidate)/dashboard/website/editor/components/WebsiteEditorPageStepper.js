'use client'

import Button from '@shared/buttons/Button'

export default function WebsiteEditorPageStepper({
  totalSteps,
  currentStep,
  onStepChange,
  onComplete,
  prevLabel = 'Back',
  nextLabel = 'Next',
  completeLabel = 'Complete',
  completeLoading = false,
}) {
  const hasNext = currentStep < totalSteps
  const hasPrev = currentStep > 1

  function handleNextStep() {
    if (hasNext) onStepChange(currentStep + 1)
  }

  function handlePrevStep() {
    if (hasPrev) onStepChange(currentStep - 1)
  }

  return (
    <div className="flex gap-4 md:gap-16 flex-wrap md:flex-nowrap w-full">
      <div className="md:order-2 flex grow items-center justify-between gap-x-2 w-full">
        {Array.from({ length: totalSteps }, (_, idx) => (
          <div
            key={idx}
            className={`
              h-2 flex-1 rounded-full
              ${idx <= currentStep - 1 ? 'bg-neutral-800' : 'bg-gray-300'}
              transition-colors
            `}
          />
        ))}
      </div>
      <Button
        className="md:order-1"
        size="large"
        variant="text"
        disabled={!hasPrev}
        onClick={handlePrevStep}
      >
        {prevLabel}
      </Button>
      {currentStep === totalSteps ? (
        <Button
          className="ml-auto md:ml-0 md:order-3 whitespace-nowrap"
          size="large"
          onClick={onComplete}
          loading={completeLoading}
          disabled={completeLoading}
        >
          {completeLabel}
        </Button>
      ) : (
        <Button
          className="ml-auto md:ml-0 md:order-3 whitespace-nowrap"
          size="large"
          disabled={!hasNext}
          onClick={handleNextStep}
        >
          {nextLabel}
        </Button>
      )}
    </div>
  )
}

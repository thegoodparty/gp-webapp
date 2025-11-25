import React from 'react'

interface StepIndicatorProps {
  numberOfSteps: number
  currentStep: number
  onClick?: ((step: number) => void) | null
}

export const StepIndicator = ({ numberOfSteps, currentStep, onClick = null }: StepIndicatorProps): React.JSX.Element => {
  const steps = Array.from({ length: numberOfSteps }, (_, index) => index + 1)
  return (
    <div className="flex items-center w-full gap-2 px-1">
      {steps.map((step) => (
        <div
          key={step}
          onClick={() => onClick && onClick(step)}
          className={`rounded-full h-2 min-h-[5px] flex-1 ${step === currentStep ? 'bg-blue-500' : 'bg-slate-300 hover:bg-slate-400 cursor-pointer '}`}
        />
      ))}
    </div>
  )
}

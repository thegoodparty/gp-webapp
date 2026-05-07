'use client'

import * as React from 'react'
import { cn } from '@styleguide/lib/utils'

type StepperVariant = 'bar'

interface StepperProps {
  currentStep: number
  totalSteps: number
  variant?: StepperVariant
  showLabel?: boolean
  className?: string
}

function Stepper({
  currentStep,
  totalSteps,
  variant = 'bar',
  showLabel = true,
  className,
}: StepperProps) {
  if (variant === 'bar') {
    return (
      <div
        className={cn('space-y-3', className)}
        role="progressbar"
        aria-label="Progress"
        aria-valuemin={1}
        aria-valuemax={totalSteps}
        aria-valuenow={currentStep}
      >
        {showLabel && (
          <div className="flex justify-end text-sm font-medium text-muted-foreground">
            Step {currentStep} of {totalSteps}
          </div>
        )}
        <div
          className="grid gap-3"
          style={{
            gridTemplateColumns: `repeat(${totalSteps}, minmax(0, 1fr))`,
          }}
        >
          {Array.from({ length: totalSteps }, (_, index) => (
            <div
              key={index}
              className={cn(
                'h-1.5 rounded-full',
                index < currentStep
                  ? 'bg-components-input-active'
                  : 'bg-slate-200',
              )}
            />
          ))}
        </div>
      </div>
    )
  }

  return null
}

export { Stepper, type StepperVariant }

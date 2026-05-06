'use client'

import { RadioGroup, RadioGroupItem } from '@styleguide'
import { CheckCircle2, Circle } from 'lucide-react'

export interface RadioCardOption<TValue extends string> {
  value: TValue
  title: string
  description: string
}

interface RadioCardGroupProps<TValue extends string> {
  name: string
  value: TValue | undefined
  onChange: (value: TValue) => void
  options: ReadonlyArray<RadioCardOption<TValue>>
}

export const RadioCardGroup = <TValue extends string>({
  name,
  value,
  onChange,
  options,
}: RadioCardGroupProps<TValue>): React.JSX.Element => (
  <RadioGroup
    value={value ?? ''}
    onValueChange={(next) => onChange(next as TValue)}
    className="grid gap-3"
  >
    {options.map((option) => {
      const isSelected = value === option.value
      const inputId = `${name}-${option.value}`
      return (
        <label
          key={option.value}
          htmlFor={inputId}
          className={`flex cursor-pointer items-start gap-4 rounded-lg border bg-white p-5 transition-colors hover:border-slate-300 ${
            isSelected
              ? 'border-blue-600 bg-blue-50 ring-1 ring-blue-600'
              : 'border-slate-200'
          }`}
        >
          <RadioGroupItem
            id={inputId}
            value={option.value}
            className="sr-only"
          />
          <span
            aria-hidden="true"
            className={`mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full ${
              isSelected ? 'text-blue-600' : 'text-slate-300'
            }`}
          >
            {isSelected ? (
              <CheckCircle2 className="size-5 fill-blue-600 text-white" />
            ) : (
              <Circle className="size-5" />
            )}
          </span>
          <span className="space-y-1 text-left">
            <span className="block text-base font-semibold text-slate-950">
              {option.title}
            </span>
            <span className="block text-sm leading-6 text-slate-500">
              {option.description}
            </span>
          </span>
        </label>
      )
    })}
  </RadioGroup>
)

'use client'

import { RadioGroup, RadioCardItem } from '@styleguide'

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
  >
    {options.map((option) => (
      <RadioCardItem
        key={option.value}
        value={option.value}
        id={`${name}-${option.value}`}
        title={option.title}
        description={option.description}
      />
    ))}
  </RadioGroup>
)

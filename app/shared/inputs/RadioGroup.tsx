'use client'

import React from 'react'
import {
  RadioGroup as StyleguideRadioGroup,
  RadioGroupItem,
} from '@styleguide/components/ui/radio-group'

interface RadioGroupProps {
  name?: string
  value?: string
  defaultValue?: string
  className?: string
  children?: React.ReactNode
  onValueChange?: (value: string) => void
}

const RadioGroup = ({
  name,
  value,
  defaultValue,
  className,
  children,
  onValueChange,
}: RadioGroupProps): React.JSX.Element => {
  return (
    <StyleguideRadioGroup
      name={name}
      value={value}
      defaultValue={defaultValue}
      className={className}
      onValueChange={onValueChange}
    >
      {children}
    </StyleguideRadioGroup>
  )
}

export { RadioGroupItem }
export default RadioGroup

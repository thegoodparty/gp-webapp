'use client'
import React from 'react'
import { Checkbox as StyleguideCheckbox } from '@styleguide/components/ui/checkbox'
import { Label } from '@styleguide/components/ui/label'

interface CheckboxChangeEvent {
  target: {
    checked: boolean
    name?: string
  }
}

interface CheckboxProps {
  label?: React.ReactNode
  name?: string
  checked?: boolean
  disabled?: boolean
  className?: string
  onChange?: (event: CheckboxChangeEvent) => void
}

const Checkbox = ({
  label,
  name,
  checked,
  disabled,
  className,
  onChange,
}: CheckboxProps): React.JSX.Element => {
  const control = (
    <StyleguideCheckbox
      name={name}
      checked={checked}
      disabled={disabled}
      className={className}
      onCheckedChange={(value) =>
        onChange?.({ target: { checked: value === true, name } })
      }
    />
  )

  return label ? (
    <Label className="cursor-pointer">
      {control}
      {label}
    </Label>
  ) : (
    control
  )
}

export default Checkbox

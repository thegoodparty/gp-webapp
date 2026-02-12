'use client'

import React, { useState, ChangeEvent, FocusEvent } from 'react'
import TextField, { TextFieldProps } from './TextField'
import { isValidEmail } from 'helpers/validations'

export { isValidEmail }

interface EmailInputProps
  extends Omit<
    TextFieldProps<'outlined'>,
    'value' | 'onChange' | 'onBlur' | 'error' | 'label' | 'name'
  > {
  value: string
  onChangeCallback:
    | ((value: string, isValid: boolean) => void)
    | ((e: ChangeEvent<HTMLInputElement>) => void)
  onBlurCallback?: (e: FocusEvent<HTMLInputElement>) => void
  shrink?: boolean
  className?: string
  placeholder?: string
  useLabel?: boolean
  required?: boolean
  newCallbackSignature?: boolean
  'data-testid'?: string
}

export default function EmailInput({
  value,
  onChangeCallback,
  onBlurCallback,
  shrink,
  className,
  placeholder,
  useLabel = true,
  required,
  newCallbackSignature = false,
  ...restProps
}: EmailInputProps): React.JSX.Element {
  const [isValid, setIsValid] = useState(true)

  const handleChange = (e: ChangeEvent<HTMLInputElement>): void => {
    const newValue = e.target.value
    const emailValid = isValidEmail(newValue)

    setIsValid(emailValid)

    if (newCallbackSignature) {
      ;(onChangeCallback as (value: string, isValid: boolean) => void)(
        newValue,
        emailValid,
      )
    } else {
      ;(onChangeCallback as (e: ChangeEvent<HTMLInputElement>) => void)(e)
    }
  }

  return (
    <TextField
      value={value}
      label={useLabel ? 'Email' : ''}
      required={required}
      size="medium"
      fullWidth
      name="email"
      error={value !== '' && !isValid}
      onChange={handleChange}
      onBlur={onBlurCallback}
      className={className}
      placeholder={placeholder || ''}
      InputLabelProps={
        shrink
          ? {
              shrink: true,
            }
          : {}
      }
      inputProps={{
        'data-testid': restProps['data-testid'],
      }}
      {...restProps}
    />
  )
}

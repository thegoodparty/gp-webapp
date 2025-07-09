'use client'

import { useState } from 'react'
import TextField from './TextField'
import { isValidEmail } from 'helpers/validations'

// NOTE: leaving export here for now to not break existing imports
export { isValidEmail }

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
}) {
  const [isValid, setIsValid] = useState(true)

  function handleChange(e) {
    const newValue = e.target.value
    const emailValid = isValidEmail(newValue)

    setIsValid(emailValid)

    if (newCallbackSignature) {
      onChangeCallback(newValue, emailValid)
    } else {
      onChangeCallback(e)
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

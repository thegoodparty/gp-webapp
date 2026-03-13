'use client'

import React, { useState, useEffect, ChangeEvent, FocusEvent } from 'react'
import { AsYouType } from 'libphonenumber-js'
import InputAdornment from '@mui/material/InputAdornment'
import IconButton from '@mui/material/IconButton'
import PhoneIcon from '@mui/icons-material/Phone'
import TextField, { TextFieldProps } from '@shared/inputs/TextField'
import styles from './PhoneInput.module.scss'

export const isValidPhone = (phone: string): boolean => {
  if (!phone) {
    return false
  }
  const formattedPhone = phone.replace(/\D/g, '')
  return (
    formattedPhone.length === 10 ||
    (formattedPhone.length === 11 && formattedPhone.charAt(0) === '1')
  )
}

interface PhoneInputProps
  extends Omit<
    TextFieldProps<'outlined'>,
    'value' | 'onChange' | 'onBlur' | 'name' | 'variant' | 'error'
  > {
  value: string
  onChangeCallback: (value: string, isValid: boolean) => void
  onBlurCallback?: (value: string) => void
  hideIcon?: boolean
  shrink?: boolean
  required?: boolean
  className?: string
  placeholder?: string
  useLabel?: boolean
}

const PhoneInput = ({
  value,
  onChangeCallback,
  onBlurCallback = () => {},
  hideIcon,
  shrink,
  required = false,
  className,
  placeholder,
  useLabel = true,
  ...restProps
}: PhoneInputProps): React.JSX.Element => {
  const [displayValue, setDisplayValue] = useState('')
  const [validPhone, setValidPhone] = useState(false)

  useEffect(() => {
    formatDisplay(value)
    const isValid = isValidPhone(value)
    setValidPhone(isValid)
  }, [value])

  const onChangeValue = (event: ChangeEvent<HTMLInputElement>): void => {
    if (event) {
      const val = event.target.value
      const isValid = isValidPhone(val)
      formatDisplay(val)
      onChangeCallback(val.replace(/\D/g, ''), isValid)
    }
  }

  const formatDisplay = (val: string): string => {
    if (!val) {
      setDisplayValue('')
      return ''
    }
    const formatted = new AsYouType('US').input(val)
    if (
      val.length === 4 &&
      formatted.length === 5 &&
      formatted.charAt(4) === ')'
    ) {
      setDisplayValue(val)
    } else {
      setDisplayValue(formatted)
    }
    return formatted
  }

  const onBlurChange = (event: FocusEvent<HTMLInputElement>): void => {
    if (event) {
      const val = event.target.value
      onBlurCallback(val.replace(/\D/g, ''))
    }
  }

  return (
    <TextField
      className={className ? className : styles.input}
      value={displayValue}
      label={useLabel ? 'Phone' : ''}
      size="medium"
      fullWidth
      name="phone"
      onChange={onChangeValue}
      onBlur={onBlurChange}
      variant="outlined"
      error={!validPhone && displayValue !== ''}
      required={required}
      placeholder={placeholder || ''}
      InputProps={
        !hideIcon
          ? {
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton>
                    <PhoneIcon />
                  </IconButton>
                </InputAdornment>
              ),
            }
          : {}
      }
      InputLabelProps={
        shrink
          ? {
              shrink: true,
            }
          : {}
      }
      {...restProps}
    />
  )
}

export default PhoneInput

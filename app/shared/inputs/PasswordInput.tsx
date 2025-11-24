'use client'
import React, { useState } from 'react'
import IconButton from '@mui/material/IconButton'
import TextField from './TextField'
import { RemoveRedEyeRounded, VisibilityOffRounded } from '@mui/icons-material'
import { isValidPassword } from './IsValidPassword'

interface PasswordInputProps {
  onChangeCallback: (password: string, isValid: boolean) => void
  label?: string
  helperText?: string
  autoFocus?: boolean
  className?: string
  InputLabelProps?: Record<string, never>
  placeholder?: string
  value?: string
  error?: boolean
  'data-testid'?: string
}

const PasswordInput = ({
  onChangeCallback,
  label = 'Password',
  helperText = 'Please ensure your password has at least 8 characters, including at least one letter and one number.',
  autoFocus = false,
  className = '',
  InputLabelProps = {},
  placeholder = '',
  value = '',
  error,
  ...restProps
}: PasswordInputProps): React.JSX.Element => {
  const [showPassword, setShowPassword] = useState(false)
  const [isValid, setIsValid] = useState(true)

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword)
  }

  const handleChangePassword = (event: React.ChangeEvent<HTMLInputElement>) => {
    const pwd = event.target.value
    const pwdValid = isValidPassword(pwd)

    setIsValid(pwdValid)
    onChangeCallback(pwd, pwdValid)
  }

  return (
    <TextField
      value={value}
      label={label}
      required
      size="medium"
      fullWidth
      type={showPassword ? 'text' : 'password'}
      helperText={helperText}
      name="password"
      onChange={handleChangePassword}
      placeholder={placeholder}
      data-cy="password"
      autoFocus={autoFocus}
      className={className}
      InputLabelProps={InputLabelProps}
      error={error ?? !isValid}
      endAdornments={[
        <IconButton
          key="pwd-btn"
          aria-label="toggle password visibility"
          onClick={handleClickShowPassword}
          type="button"
        >
          {showPassword ? <VisibilityOffRounded /> : <RemoveRedEyeRounded />}
        </IconButton>,
        ...(error ? ['error' as const] : []),
      ]}
      inputProps={{
        'data-testid': restProps['data-testid'],
      }}
      {...restProps}
    />
  )
}

export default PasswordInput


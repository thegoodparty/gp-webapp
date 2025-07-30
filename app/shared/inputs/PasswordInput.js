'use client'
import React, { useState } from 'react'
import IconButton from '@mui/material/IconButton'
import TextField from './TextField'
import { RemoveRedEyeRounded, VisibilityOffRounded } from '@mui/icons-material'
import { isValidPassword } from './IsValidPassword'

export default function PasswordInput({
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
}) {
  const [showPassword, setShowPassword] = useState(false)
  const [isValid, setIsValid] = useState(true)

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword)
  }

  const handleChangePassword = (event) => {
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
        error && 'error',
      ]}
      inputProps={{
        'data-testid': restProps['data-testid'],
      }}
      {...restProps}
    />
  )
}

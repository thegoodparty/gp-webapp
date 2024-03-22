'use client';
import React, { useState } from 'react';
import InputAdornment from '@mui/material/InputAdornment';
import IconButton from '@mui/material/IconButton';
import TextField from './TextField';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import {
  isValidPassword
} from './IsValidPassword';

export default function PasswordInput({
  onChangeCallback,
  variant = 'outlined',
  label = 'Password',
  helperText = 'Please ensure your password has at least 8 characters, including at least one letter and one number.',
  autoFocus = false,
  className = '',
  InputLabelProps = {},
}) {
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState(false);
  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  const onChangePassword = (event) => {
    if (event) {
      const pwd = event.target.value;
      const isValid = isValidPassword(pwd);
      if (!isValid) {
        setError(true);
      } else {
        setError(false);
      }
      setPassword(pwd);
      onChangeCallback(pwd);
    }
  };
  return (
    <TextField
      value={password}
      label={label}
      required
      size="medium"
      style={{ width: '100%' }}
      type={showPassword ? 'text' : 'password'}
      helperText={helperText}
      name="password"
      onChange={onChangePassword}
      data-cy="password"
      variant={variant}
      autoFocus={autoFocus}
      className={className}
      InputLabelProps={InputLabelProps}
      error={error}
      InputProps={{
        endAdornment: (
          <InputAdornment position="end">
            <IconButton
              aria-label="toggle password visibility"
              onClick={handleClickShowPassword}
              onMouseDown={handleMouseDownPassword}
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </IconButton>
          </InputAdornment>
        ),
      }}
    />
  );
}

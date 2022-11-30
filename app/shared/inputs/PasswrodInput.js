'use client';
import React, { useState } from 'react';

import InputAdornment from '@mui/material/InputAdornment';
import IconButton from '@mui/material/IconButton';
import TextField from './TextField';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
// import Visibility from '@material-ui/icons/Visibility';
// import VisibilityOff from '@material-ui/icons/VisibilityOff';

//  const Input = styled(TextField)`
//    && {
//      margin-bottom: 18px;

//      .MuiInputBase-input {
//        line-height: 22px;
//        font-size: 16px;
//        letter-spacing: 0.1px;
//        background-color: #fff;

//        @media only screen and (min-width: ${({ theme }) =>
//            theme.breakpointsPixels.md}) {
//          font-size: 20px;
//          line-height: 26px;
//        }
//      }
//    }
//  `;

export default function PasswordInput({
  onChangeCallback,
  variant = 'outlined',
  label = 'Password',
  helperText = '8 characters minimum',
  autoFocus = false,
  className = '',
  InputLabelProps = {},
}) {
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  const onChangePassword = (event) => {
    if (event) {
      setPassword(event.target.value);
      onChangeCallback(event.target.value);
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

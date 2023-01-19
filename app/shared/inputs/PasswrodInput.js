'use client';
import React, { useState } from 'react';
import passwordValidator from 'password-validator';

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

const schema = new passwordValidator();
schema
  .is()
  .min(8) // Minimum length 8
  .is()
  .max(40) // Maximum length 100
  .has()
  .uppercase() // Must have uppercase letters
  .has()
  .lowercase() // Must have lowercase letters
  .has()
  .digits(1) // Must have at least 1 digits
  .has()
  .not()
  .spaces(); // Should not have spaces

export const isValidPassword = (pwd) => {
  return schema.validate(pwd);
};

export const invalidPasswordReasons = (pwd) => {
  return schema.validate(pwd, { list: true });
};

export default function PasswordInput({
  onChangeCallback,
  variant = 'outlined',
  label = 'Password',
  helperText = 'For security, passwords must have at least 1 capital letter, 1 lowercase, 1 number, and 8 minimum characters.',
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

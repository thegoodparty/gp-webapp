'use client';
/**
 *
 * PhoneInput
 *
 */

import React, { useState, useEffect } from 'react';
import { AsYouType } from 'libphonenumber-js';
import InputAdornment from '@mui/material/InputAdornment';
import IconButton from '@mui/material/IconButton';
import PhoneIcon from '@mui/icons-material/Phone';
import TextField from '@shared/inputs/TextField';
import styles from './PhoneInput.module.scss';

export const isValidPhone = (phone) => {
  if (!phone) {
    return false;
  }
  const formattedPhone = phone.replace(/\D/g, '');
  return (
    formattedPhone.length === 10 ||
    (formattedPhone.length === 11 && formattedPhone.charAt(0) === '1')
  );
};

function PhoneInput({
  value,
  onChangeCallback,
  onBlurCallback = () => {},
  hideIcon,
  shrink,
}) {
  const [displayValue, setDisplayValue] = useState('');
  const [validPhone, setValidPhone] = useState(false);

  useEffect(() => {
    formatDisplay(value);
    setValidPhone(value);
  }, [value]);

  const onChangeValue = async (event) => {
    if (event) {
      const val = event.target.value;
      const isValid = isValidPhone(val);
      setValidPhone(isValid);
      formatDisplay(val);
      onChangeCallback(val.replace(/\D/g, ''), isValid);
    }
  };

  const formatDisplay = (val) => {
    if (!val) {
      setDisplayValue('');
      return '';
    }
    const formatted = new AsYouType('US').input(val);
    // issue that we can't delete (XXX)
    if (
      val.length === 4 &&
      formatted.length === 5 &&
      formatted.charAt(4) === ')'
    ) {
      setDisplayValue(val);
    } else {
      setDisplayValue(formatted);
    }
  };

  const onBlurChange = async (event) => {
    if (event) {
      const val = event.target.value;
      onBlurCallback(val.replace(/\D/g, ''));
    }
  };

  return (
    <TextField
      className={styles.input}
      value={displayValue}
      label="(555) 555-5555"
      size="medium"
      fullWidth
      name="phone"
      onChange={onChangeValue}
      onBlur={onBlurChange}
      variant="outlined"
      error={!validPhone && displayValue !== ''}
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
    />
  );
}

export default PhoneInput;

'use client';

import TextField from './TextField';
import { isValidEmail } from 'helpers/validations';

// NOTE: leaving export here for now to not break existing imports
export { isValidEmail };

export default function EmailInput({
  value,
  onChangeCallback,
  onBlurCallback,
  shrink,
  className,
  placeholder,
  useLabel = true,
  required,
}) {
  return (
    <TextField
      value={value}
      label={useLabel ? 'Email' : ''}
      required={required}
      size="medium"
      fullWidth
      name="email"
      error={value !== '' && !isValidEmail(value)}
      onChange={onChangeCallback}
      onBlur={onBlurCallback}
      variant="outlined"
      className={className}
      placeholder={placeholder || ''}
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

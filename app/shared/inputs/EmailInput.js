'use client';

import TextField from './TextField';

export const isValidEmail = (mail) => {
  const re =
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(String(mail).toLowerCase());
};

export default function EmailInput({
  value,
  onChangeCallback,
  onBlurCallback,
}) {
  return (
    <TextField
      value={value}
      label="Email"
      required
      size="medium"
      fullWidth
      name="email"
      error={value !== '' && !isValidEmail(value)}
      onChange={onChangeCallback}
      onBlur={onBlurCallback}
      variant="outlined"
    />
  );
}

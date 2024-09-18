'use client';

import { useState } from 'react';
import { InputAdornment, TextField as MuiTextField } from '@mui/material';
import {
  ErrorOutlineRounded,
  RemoveRedEyeRounded,
  VisibilityOffOutlined,
} from '@mui/icons-material';
import IconButton from '@shared/buttons/IconButton';

function ConcealButton({ concealed, onClick }) {
  return (
    <IconButton
      type="button"
      className="leading-[18px]"
      size="small"
      onClick={onClick}
    >
      {concealed ? <RemoveRedEyeRounded /> : <VisibilityOffOutlined />}
    </IconButton>
  );
}

export default function TextField({
  newStyle = false,
  error,
  type,
  ...restProps
}) {
  const shouldConcealValue = newStyle && type === 'password';
  const [concealed, setConcealed] = useState(shouldConcealValue);

  function handleConcealClick() {
    setConcealed((value) => !value);
  }

  return (
    <MuiTextField
      variant="outlined"
      sx={
        newStyle && {
          '& .MuiInputBase-formControl': {
            borderRadius: '8px',
            fontFamily: 'var(--outfit-font)',
          },
          '& .MuiFormLabel-root': {
            fontFamily: 'var(--outfit-font)',
          },
        }
      }
      error={error}
      type={shouldConcealValue && !concealed ? 'text' : type}
      InputProps={{
        endAdornment: newStyle && (
          <InputAdornment className="[&>*]:ml-2" position="end">
            {shouldConcealValue && (
              <ConcealButton
                concealed={concealed}
                onClick={handleConcealClick}
              />
            )}
            {error && <ErrorOutlineRounded className="text-red" />}
          </InputAdornment>
        ),
        ...restProps?.InputProps, // ensure adornment shorthand doesn't override any other InputProps
      }}
      {...restProps}
    />
  );
}

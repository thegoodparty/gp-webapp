'use client'

import { JSX } from 'react'
import {
  InputAdornment,
  TextField as MuiTextField,
  TextFieldProps as MuiTextFieldProps,
  TextFieldVariants,
} from '@mui/material'
import { ErrorOutlineRounded } from '@mui/icons-material'

const ADORNMENTS = {
  error: <ErrorOutlineRounded className="text-red" />,
}

export type TextFieldProps<Variant extends TextFieldVariants> =
  MuiTextFieldProps<Variant> & {
    endAdornments?: (keyof typeof ADORNMENTS | JSX.Element)[]
  }

export default function TextField<Variant extends TextFieldVariants>({
  endAdornments,
  ...restProps
}: TextFieldProps<Variant>) {
  return (
    <MuiTextField
      variant="outlined"
      {...restProps}
      slotProps={{
        ...restProps.slotProps,
        input: {
          sx: { fontFamily: 'var(--outfit-font)' },
          endAdornment: endAdornments?.length && (
            <InputAdornment position="end">
              {endAdornments.map(
                (adornment) =>
                  // @ts-expect-error
                  ADORNMENTS[adornment] ?? adornment,
              )}
            </InputAdornment>
          ),
          ...restProps.slotProps?.input,
        },
      }}
    />
  )
}

'use client'

import { JSX } from 'react'
import {
  InputAdornment,
  SxProps,
  TextField as MuiTextField,
  TextFieldProps as MuiTextFieldProps,
  TextFieldVariants,
  Theme,
} from '@mui/material'
import { ErrorOutlineRounded } from '@mui/icons-material'

const ADORNMENTS = {
  error: <ErrorOutlineRounded className="text-red" />,
}

const getInputPropsSx = (
  inputProps: { sx?: SxProps<Theme> } | undefined,
): SxProps<Theme>[] => {
  const { sx } = inputProps ?? {}
  // eslint-disable-next-line @typescript-eslint/no-unsafe-return -- MUI SxProps is a complex union type (object | array | function); narrowing further is impractical
  if (Array.isArray(sx)) return sx
  if (sx) return [sx]
  return []
}

export type TextFieldProps<Variant extends TextFieldVariants> =
  MuiTextFieldProps<Variant> & {
    endAdornments?: (keyof typeof ADORNMENTS | JSX.Element)[]
    maxLength?: number
  }

export default function TextField<Variant extends TextFieldVariants>({
  endAdornments,
  ...restProps
}: TextFieldProps<Variant>) {
  const mergedEndAdornment = endAdornments?.length ? (
    <InputAdornment position="end">
      {endAdornments.map((adornment) =>
        typeof adornment === 'string'
          ? ADORNMENTS[adornment as keyof typeof ADORNMENTS]
          : adornment,
      )}
    </InputAdornment>
  ) : undefined

  return (
    <MuiTextField
      variant="outlined"
      {...restProps}
      InputProps={{
        ...restProps.InputProps,
        // Preserve any existing endAdornment from callers (e.g., Autocomplete)
        endAdornment: mergedEndAdornment ?? restProps.InputProps?.endAdornment,
        // Ensure font family styling is applied while preserving caller styles
        sx: [
          { fontFamily: 'var(--outfit-font)' },
          ...getInputPropsSx(restProps.InputProps),
        ],
        style: restProps.InputProps?.style,
      }}
    />
  )
}

'use client';

import {
  InputAdornment,
  TextField as MuiTextField,
} from '@mui/material';
import { ErrorOutlineRounded } from '@mui/icons-material';

const ADORNMENTS = {
  error: <ErrorOutlineRounded className="text-red" />,
};

/**
 * @typedef {Object} TextFieldProps
 * @property {(keyof ADORNMENTS | JSX.Element)[]} endAdornments Shorthand prop for rendering adornments, pass array of icon elements or strings
 */

/**
 * Wrapper around MuiTextField component
 * @param {MuiTextFieldProps & TextFieldProps}} props
 * @example
 * <TextField value="something" endAdornments={[
 *    <CheckRounded className='text-green' />,
 *    'error'
 *   ]}
 * />
 */

export default function TextField({ endAdornments, ...restProps }) {
  return (
    <MuiTextField
      variant="outlined"
      InputProps={{
        endAdornment: endAdornments?.length > 0 && (
          <InputAdornment position="end">
            {endAdornments.map(
              (adornment) => ADORNMENTS[adornment] ?? adornment,
            )}
          </InputAdornment>
        ),
        ...restProps?.InputProps, // ensure adornment shorthand doesn't override any other InputProps
      }}
      {...restProps}
    />
  );
}

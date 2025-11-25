'use client'
import React from 'react'
import FormControlLabel from '@mui/material/FormControlLabel'
import MuiCheckbox, { CheckboxProps as MuiCheckboxProps } from '@mui/material/Checkbox'

interface CheckboxProps extends MuiCheckboxProps {
  label?: string
  name?: string
}

const Checkbox = ({ label, name, ...restProps }: CheckboxProps): React.JSX.Element => {
  return label ? (
    <FormControlLabel
      label={label}
      control={<MuiCheckbox name={name} {...restProps} />}
    />
  ) : (
    <MuiCheckbox name={name} {...restProps} />
  )
}

export default Checkbox


'use client'
import FormControlLabel from '@mui/material/FormControlLabel'
import MuiCheckbox from '@mui/material/Checkbox'

const Checkbox = (props) => {
  const { label, name, ...restProps } = props
  return label ? (
    <FormControlLabel
      label={label}
      control={<MuiCheckbox name={name} {...restProps} />}
    />
  ) : (
    <MuiCheckbox name={name} variant="outlined" {...props} />
  )
}

export default Checkbox

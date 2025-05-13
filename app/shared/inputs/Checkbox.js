'use client'
import FormControlLabel from '@mui/material/FormControlLabel'
import MuiCheckbox from '@mui/material/Checkbox'

const Checkbox = (props) => {
  const { label, ...restProps } = props
  return label ? (
    <FormControlLabel label={label} control={<MuiCheckbox {...restProps} />} />
  ) : (
    <MuiCheckbox variant="outlined" {...props} />
  )
}

export default Checkbox

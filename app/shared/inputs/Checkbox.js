'use client'
import ThemeProvider from '@mui/material/styles/ThemeProvider'
import FormControlLabel from '@mui/material/FormControlLabel'
import MuiCheckbox from '@mui/material/Checkbox'
import materialTheme from '@shared/materialTheme'

const Checkbox = (props) => {
  const { label, ...restProps } = props
  return (
    <ThemeProvider theme={materialTheme}>
      {label ? (
        <FormControlLabel
          label={label}
          control={<MuiCheckbox {...restProps} />}
        />
      ) : (
        <MuiCheckbox variant="outlined" {...props} />
      )}
    </ThemeProvider>
  )
}

export default Checkbox

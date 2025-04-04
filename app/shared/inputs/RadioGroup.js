'use client'

import { ThemeProvider } from '@mui/material'
import MuiRadioGroup from '@mui/material/RadioGroup'
import materialTheme from '@shared/materialTheme'

const RadioGroup = (props) => {
  return (
    <ThemeProvider theme={materialTheme}>
      <MuiRadioGroup {...props} />
    </ThemeProvider>
  )
}

export default RadioGroup

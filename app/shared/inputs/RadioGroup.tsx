'use client'

import { ThemeProvider } from '@mui/material'
import MuiRadioGroup, { RadioGroupProps } from '@mui/material/RadioGroup'
import materialTheme from '@shared/materialTheme'

const RadioGroup = (props: RadioGroupProps): React.JSX.Element => {
  return (
    <ThemeProvider theme={materialTheme}>
      <MuiRadioGroup {...props} />
    </ThemeProvider>
  )
}

export default RadioGroup


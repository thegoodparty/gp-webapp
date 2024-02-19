'use client';

import { ThemeProvider } from '@mui/material';
import MuiCheckbox from '@mui/material/Checkbox';
import materialTheme from '@shared/materialTheme';

const Checkbox = (props) => {
  return (
    <ThemeProvider theme={materialTheme}>
      <MuiCheckbox {...props} variant="outlined" />
    </ThemeProvider>
  );
};

export default Checkbox;

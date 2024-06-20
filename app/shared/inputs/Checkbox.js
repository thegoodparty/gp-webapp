'use client';

import { ThemeProvider } from '@mui/material';
import MuiCheckbox from '@mui/material/Checkbox';
import materialTheme from '@shared/materialTheme';

const Checkbox = (props) => {
  return (
    <ThemeProvider theme={materialTheme}>
      <MuiCheckbox variant="outlined" {...props} />
    </ThemeProvider>
  );
};

export default Checkbox;

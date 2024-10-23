'use client';
import { hookstate, useHookstate } from '@hookstate/core';
import MuiSnackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
import { forwardRef, useEffect } from 'react';
import { useSearchParams, usePathname } from 'next/navigation';

export const REDIRECT_MSG_PARAM = 'showRedirMsg';

export const globalSnackbarState = hookstate({
  isOpen: false,
  message: '',
  isError: false,
  autoHideDuration: 4000,
});

export function useSnackbarState() {
  return useHookstate(globalSnackbarState);
}

const Alert = forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

export default function Snackbar() {
  const state = useHookstate(globalSnackbarState);
  const snackbarState = state.get();
  const params = useSearchParams();
  const pathname = usePathname();

  useEffect(() => {
    const redirMsg = params.get(REDIRECT_MSG_PARAM);

    if (redirMsg) {
      // remove redirect message param
      const newParams = new URLSearchParams(params);
      newParams.delete(REDIRECT_MSG_PARAM);
      window.history.replaceState(
        null,
        undefined,
        pathname + '?' + newParams.toString(),
      );

      // Show message after user has been redirected
      state.set(() => ({
        isOpen: true,
        message: redirMsg,
        isError: false,
      }));
    }
  }, [params, pathname]);

  const { isOpen, message, isError, autoHideDuration } = snackbarState;
  const handleClose = (event, reason) => {
    console.log('reason', reason);
    if (reason === 'clickaway') {
      return;
    }

    state.set(() => {
      return {
        isOpen: false,
        message: '',
        isError: false,
      };
    });
  };

  return (
    <div>
      <MuiSnackbar
        open={isOpen}
        autoHideDuration={autoHideDuration || 4000}
        onClose={handleClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        style={{ zIndex: 5000 }}
      >
        <Alert
          onClose={handleClose}
          severity={isError ? 'error' : 'success'}
          data-cy="snackbar message"
        >
          {message}
        </Alert>
      </MuiSnackbar>
    </div>
  );
}

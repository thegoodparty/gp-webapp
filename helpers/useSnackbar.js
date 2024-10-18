import { useHookstate } from '@hookstate/core';
import { globalSnackbarState } from '@shared/utils/Snackbar';

export const useSnackbar = () => {
  const snackbarState = useHookstate(globalSnackbarState);
  const displaySnackbar = (message, isError = false) => {
    snackbarState.set(() => ({
      isOpen: true,
      message,
      isError,
    }));
  };
  const errorSnackbar = (message) => displaySnackbar(message, true);
  const successSnackbar = (message) => displaySnackbar(message, false);
  return {
    successSnackbar,
    errorSnackbar,
    displaySnackbar,
  };
};

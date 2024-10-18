import { useHookstate } from '@hookstate/core';
import { globalSnackbarState } from '@shared/utils/Snackbar';

export const useSnackbar = () => {
  const snackbarState = useHookstate(globalSnackbarState);
  const displaySnackbar = (message, isError = false, optionalProps = {}) => {
    snackbarState.set(() => ({
      isOpen: true,
      message,
      isError,
      ...optionalProps,
    }));
  };
  const errorSnackbar = (message, optionalProps) =>
    displaySnackbar(message, true, optionalProps);
  const successSnackbar = (message, optionalProps) =>
    displaySnackbar(message, false, optionalProps);
  return {
    successSnackbar,
    errorSnackbar,
    displaySnackbar,
  };
};

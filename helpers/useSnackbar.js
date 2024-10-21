import { useHookstate } from '@hookstate/core';
import { globalSnackbarState } from '@shared/utils/Snackbar';

export const useSnackbar = () => {
  const snackbarState = useHookstate(globalSnackbarState);
  // <<<<<<< HEAD
  const displaySnackbar = (message, isError = false, optionalProps = {}) => {
    // =======
    //   const displaySnackbar = (message, isError = false) => {
    // >>>>>>> origin/develop
    snackbarState.set(() => ({
      isOpen: true,
      message,
      isError,
      // <<<<<<< HEAD
      ...optionalProps,
    }));
  };
  const errorSnackbar = (message, optionalProps) =>
    displaySnackbar(message, true, optionalProps);
  const successSnackbar = (message, optionalProps) =>
    displaySnackbar(message, false, optionalProps);
  // =======
  //     }));
  //   };
  //   const errorSnackbar = (message) => displaySnackbar(message, true);
  //   const successSnackbar = (message) => displaySnackbar(message, false);
  // >>>>>>> origin/develop
  return {
    successSnackbar,
    errorSnackbar,
    displaySnackbar,
  };
};

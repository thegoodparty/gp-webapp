'use client'
import { createContext, useContext, useCallback, ReactNode } from 'react'
import { toast } from 'sonner'
import { Toaster } from '@styleguide'

interface SnackbarState {
  autoHideDuration?: number
}

interface SnackbarContextValue {
  displaySnackbar: (
    message: string,
    isError?: boolean,
    optionalProps?: SnackbarState,
  ) => void
  errorSnackbar: (message: string, optionalProps?: SnackbarState) => void
  successSnackbar: (message: string, optionalProps?: SnackbarState) => void
}

const SnackbarContext = createContext<SnackbarContextValue | null>(null)

export const SnackbarProvider = ({ children }: { children: ReactNode }) => {
  const displaySnackbar = useCallback(
    (message: string, isError = false, optionalProps: SnackbarState = {}) => {
      const options = { duration: optionalProps.autoHideDuration ?? 4000 }
      if (isError) {
        toast.error(message, options)
      } else {
        toast.success(message, options)
      }
    },
    [],
  )

  const value: SnackbarContextValue = {
    displaySnackbar,
    errorSnackbar: (message, optionalProps) =>
      displaySnackbar(message, true, optionalProps),
    successSnackbar: (message, optionalProps) =>
      displaySnackbar(message, false, optionalProps),
  }

  return (
    <SnackbarContext.Provider value={value}>
      {children}
      <Toaster position="bottom-center" richColors closeButton />
    </SnackbarContext.Provider>
  )
}

export const useSnackbar = (): SnackbarContextValue => {
  const context = useContext(SnackbarContext)
  if (!context) {
    throw new Error('useSnackbar must be used within a SnackbarProvider')
  }
  return context
}

const Snackbar = () => null
export default Snackbar

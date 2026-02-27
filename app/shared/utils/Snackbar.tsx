'use client'
import {
  createContext,
  useContext,
  useState,
  useCallback,
  ReactNode,
  forwardRef,
} from 'react'
import MuiSnackbar from '@mui/material/Snackbar'
import MuiAlert, { AlertProps } from '@mui/material/Alert'

interface SnackbarState {
  isOpen: boolean
  message: string
  isError: boolean
  autoHideDuration: number
}

interface SnackbarContextValue {
  displaySnackbar: (
    message: string,
    isError?: boolean,
    optionalProps?: Partial<SnackbarState>,
  ) => void
  errorSnackbar: (
    message: string,
    optionalProps?: Partial<SnackbarState>,
  ) => void
  successSnackbar: (
    message: string,
    optionalProps?: Partial<SnackbarState>,
  ) => void
}

const SnackbarContext = createContext<SnackbarContextValue | null>(null)

interface SnackbarProviderProps {
  children: ReactNode
}

export const SnackbarProvider = ({ children }: SnackbarProviderProps) => {
  const [snackbarState, setSnackbarState] = useState<SnackbarState>({
    isOpen: false,
    message: '',
    isError: false,
    autoHideDuration: 4000,
  })

  const displaySnackbar = useCallback(
    (
      message: string,
      isError: boolean = false,
      optionalProps: Partial<SnackbarState> = {},
    ): void => {
      setSnackbarState({
        isOpen: true,
        message,
        isError,
        autoHideDuration: 4000,
        ...optionalProps,
      })
    },
    [],
  )

  const handleClose = useCallback(
    (_event?: React.SyntheticEvent | Event, reason?: string): void => {
      if (reason === 'clickaway') {
        return
      }
      setSnackbarState((prev) => ({
        ...prev,
        isOpen: false,
      }))
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
      <SnackbarComponent
        open={snackbarState.isOpen}
        message={snackbarState.message}
        isError={snackbarState.isError}
        autoHideDuration={snackbarState.autoHideDuration}
        onClose={handleClose}
      />
    </SnackbarContext.Provider>
  )
}

const Alert = forwardRef<HTMLDivElement, AlertProps>((props, ref) => (
  <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />
))

Alert.displayName = 'Alert'

interface SnackbarComponentProps {
  open: boolean
  message: string
  isError: boolean
  autoHideDuration: number
  onClose: (_event?: React.SyntheticEvent | Event, reason?: string) => void
}

const SnackbarComponent = ({
  open,
  message,
  isError,
  autoHideDuration,
  onClose,
}: SnackbarComponentProps) => (
  <div>
    <MuiSnackbar
      open={open}
      autoHideDuration={autoHideDuration || 4000}
      onClose={onClose}
      anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      style={{ zIndex: 5000 }}
    >
      <Alert
        onClose={onClose}
        severity={isError ? 'error' : 'success'}
        data-cy="snackbar message"
      >
        {message}
      </Alert>
    </MuiSnackbar>
  </div>
)

export const useSnackbar = (): SnackbarContextValue => {
  const context = useContext(SnackbarContext)
  if (!context) {
    throw new Error('useSnackbar must be used within a SnackbarProvider')
  }
  return context
}

const Snackbar = () => null

export default Snackbar

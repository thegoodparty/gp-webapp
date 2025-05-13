'use client'
import { createContext, useContext, useState, useCallback } from 'react'
import MuiSnackbar from '@mui/material/Snackbar'
import MuiAlert from '@mui/material/Alert'
import { forwardRef } from 'react'

const SnackbarContext = createContext(null)

export function SnackbarProvider({ children }) {
  const [snackbarState, setSnackbarState] = useState({
    isOpen: false,
    message: '',
    isError: false,
    autoHideDuration: 4000,
  })

  const displaySnackbar = useCallback((message, isError = false, optionalProps = {}) => {
    setSnackbarState({
      isOpen: true,
      message,
      isError,
      ...optionalProps,
    })
  }, [])

  const handleClose = useCallback((event, reason) => {
    if (reason === 'clickaway') {
      return
    }
    setSnackbarState(prev => ({
      ...prev,
      isOpen: false,
    }))
  }, [])

  const value = {
    displaySnackbar,
    errorSnackbar: (message, optionalProps) => displaySnackbar(message, true, optionalProps),
    successSnackbar: (message, optionalProps) => displaySnackbar(message, false, optionalProps),
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

const Alert = forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />
})

function SnackbarComponent({ open, message, isError, autoHideDuration, onClose }) {
  return (
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
}

export function useSnackbar() {
  const context = useContext(SnackbarContext)
  if (!context) {
    throw new Error('useSnackbar must be used within a SnackbarProvider')
  }
  return context
}

export default function Snackbar() {
  return null // This component is now just a placeholder for backward compatibility
}

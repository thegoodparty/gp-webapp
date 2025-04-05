'use client'
import { hookstate, useHookstate } from '@hookstate/core'
import MuiSnackbar from '@mui/material/Snackbar'
import MuiAlert from '@mui/material/Alert'
import { forwardRef } from 'react'

export const globalSnackbarState = hookstate({
  isOpen: false,
  message: '',
  isError: false,
  autoHideDuration: 4000,
})

export function useSnackbarState() {
  return useHookstate(globalSnackbarState)
}

const Alert = forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />
})

export default function Snackbar() {
  const state = useHookstate(globalSnackbarState)
  const snackbarState = state.get()

  const { isOpen, message, isError, autoHideDuration } = snackbarState
  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return
    }

    state.set(() => {
      return {
        isOpen: false,
        message: '',
        isError: false,
      }
    })
  }

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
  )
}

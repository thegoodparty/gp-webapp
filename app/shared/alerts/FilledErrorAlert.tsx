import React, { ReactNode } from 'react'
import { Alert, AlertProps } from '@mui/material'
import { MdError } from 'react-icons/md'

interface FilledErrorAlertProps
  extends Omit<AlertProps, 'severity' | 'variant'> {
  children: ReactNode
  className?: string
}

export const FilledErrorAlert = ({
  children,
  className = '',
  ...restProps
}: FilledErrorAlertProps): React.JSX.Element => (
  <Alert
    severity="error"
    variant="filled"
    icon={<MdError className="text-white" />}
    className={`[&&]:rounded-lg [&&]:p-2 [&&]:bg-error-main [&&]:text-white [&>div.MuiAlert-icon]:py-2 [&>div.MuiAlert-icon]:ml-2 [&>div.MuiAlert-icon]:mr-4 [&>div.MuiAlert-message]:p-0 [&>div.MuiAlert-message]:flex-grow ${className}`}
    {...restProps}
  >
    {children}
  </Alert>
)

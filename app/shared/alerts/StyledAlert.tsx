import React, { ReactNode } from 'react'
import { Alert, AlertProps } from '@mui/material'
import { AlertIcon } from '@shared/alerts/AlertIcon'

type AlertSeverity = 'error' | 'info' | 'warning' | 'success'

const containerClasses: Array<Record<AlertSeverity, string>> = [
  {
    info: '[&&]:text-info-dark',
    warning: '[&&]:text-warning-dark',
    error: '[&&]:text-error-dark',
    success: '[&&]:text-success-dark',
  },
  {
    info: '[&&]:border-info-dark',
    warning: '[&&]:border-warning-dark',
    error: '[&&]:border-error-dark',
    success: '[&&]:border-success-dark',
  },
  {
    info: '[&&]:bg-info-background',
    warning: '[&&]:bg-warning-background',
    error: '[&&]:bg-error-background',
    success: '[&&]:bg-success-background',
  },
]

const iconClasses: Record<AlertSeverity, string> = {
  info: '[&&]:text-info-dark',
  warning: '[&&]:text-warning-dark',
  error: '[&&]:text-error-dark',
  success: '[&&]:text-success-dark',
}

interface StyledAlertProps extends Omit<AlertProps, 'severity'> {
  children: ReactNode
  severity: AlertSeverity
  className?: string
}

export const StyledAlert = ({
  children,
  severity,
  className = '',
  ...restProps
}: StyledAlertProps): React.JSX.Element => {
  const compiledContainerClasses = containerClasses
    .map((containerClass) => containerClass[severity])
    .join(' ')

  return (
    <Alert
      className={`
      ${compiledContainerClasses}  
      [&&]:rounded-lg 
      [&&]:p-2
      [&>div.MuiAlert-message]:p-0
      [&>div.MuiAlert-icon]:py-2
      [&>div.MuiAlert-icon]:ml-2
      [&>div.MuiAlert-icon]:mr-4
      [&>div.MuiAlert-icon]:block
      [&>div.MuiAlert-icon]:h-fit
      [&>div.MuiAlert-message]:flex-grow
      ${className}
    `}
      severity={severity}
      icon={
        <AlertIcon
          severity={severity}
          className={`${iconClasses[severity]} h-6 w-6`}
        />
      }
      {...restProps}
    >
      {children}
    </Alert>
  )
}

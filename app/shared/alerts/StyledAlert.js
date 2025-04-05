import { Alert } from '@mui/material'
import { AlertIcon } from '@shared/alerts/AlertIcon'

const containerClasses = [
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

const iconClasses = {
  info: '[&&]:text-info-dark',
  warning: '[&&]:text-warning-dark',
  error: '[&&]:text-error-dark',
  success: '[&&]:text-success-dark',
}

export const StyledAlert = ({
  children,
  severity,
  className = '',
  ...restProps
}) => {
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

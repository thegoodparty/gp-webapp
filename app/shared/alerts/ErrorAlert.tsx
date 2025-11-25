import React, { ReactNode } from 'react'
import { StyledAlert } from '@shared/alerts/StyledAlert'
import { AlertProps } from '@mui/material'
import { MdError } from 'react-icons/md'

interface ErrorAlertProps extends Omit<AlertProps, 'severity'> {
  children: ReactNode
  className?: string
}

export const ErrorAlert = ({ children, className = '', ...restProps }: ErrorAlertProps): React.JSX.Element => (
  <StyledAlert
    severity="error"
    icon={<MdError />}
    className={className}
    {...restProps}
  >
    {children}
  </StyledAlert>
)

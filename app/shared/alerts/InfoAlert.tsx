import React, { ReactNode } from 'react'
import { StyledAlert } from '@shared/alerts/StyledAlert'
import { AlertProps } from '@mui/material'

interface InfoAlertProps extends Omit<AlertProps, 'severity'> {
  children: ReactNode
  className?: string
}

export const InfoAlert = ({
  children,
  className = '',
  ...restProps
}: InfoAlertProps): React.JSX.Element => (
  <StyledAlert severity="info" className={className} {...restProps}>
    {children}
  </StyledAlert>
)

import React, { ReactNode } from 'react'
import { StyledAlert } from '@shared/alerts/StyledAlert'

interface InfoAlertProps {
  children: ReactNode
  className?: string
  variant?: string
  [key: string]: unknown
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

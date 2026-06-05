import React, { ReactNode } from 'react'
import { StyledAlert } from '@shared/alerts/StyledAlert'
import { CircleAlertIcon } from '@styleguide/components/ui/icons'

interface ErrorAlertProps {
  children: ReactNode
  className?: string
  [key: string]: unknown
}

export const ErrorAlert = ({
  children,
  className = '',
  ...restProps
}: ErrorAlertProps): React.JSX.Element => (
  <StyledAlert
    severity="error"
    icon={<CircleAlertIcon />}
    className={className}
    {...restProps}
  >
    {children}
  </StyledAlert>
)

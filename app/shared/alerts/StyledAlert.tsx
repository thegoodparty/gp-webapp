import React, { ReactNode } from 'react'
import { Alert, AlertDescription } from '@styleguide/components/ui/alert'
import { AlertIcon } from '@shared/alerts/AlertIcon'
import { cn } from '@styleguide/lib/utils'

type AlertSeverity = 'error' | 'info' | 'warning' | 'success'

const containerClasses: Array<Record<AlertSeverity, string>> = [
  {
    info: 'text-info-dark',
    warning: 'text-warning-dark',
    error: 'text-error-dark',
    success: 'text-success-dark',
  },
  {
    info: 'border-info-dark',
    warning: 'border-warning-dark',
    error: 'border-error-dark',
    success: 'border-success-dark',
  },
  {
    info: 'bg-info-background',
    warning: 'bg-warning-background',
    error: 'bg-error-background',
    success: 'bg-success-background',
  },
]

const iconClasses: Record<AlertSeverity, string> = {
  info: 'text-info-dark',
  warning: 'text-warning-dark',
  error: 'text-error-dark',
  success: 'text-success-dark',
}

interface StyledAlertProps {
  children: ReactNode
  severity: AlertSeverity
  className?: string
  icon?: ReactNode
  variant?: string
  [key: string]: unknown
}

export const StyledAlert = ({
  children,
  severity,
  className = '',
  icon,
  variant: _variant,
  ...restProps
}: StyledAlertProps): React.JSX.Element => {
  const compiledContainerClasses = containerClasses
    .map((containerClass) => containerClass[severity])
    .join(' ')

  const resolvedIcon = icon ?? (
    <AlertIcon
      severity={severity}
      className={cn('h-6 w-6', iconClasses[severity])}
    />
  )

  return (
    <Alert
      className={cn(compiledContainerClasses, 'rounded-lg p-2', className)}
      icon={resolvedIcon}
      {...(restProps as React.ComponentProps<'div'>)}
    >
      <AlertDescription>{children}</AlertDescription>
    </Alert>
  )
}

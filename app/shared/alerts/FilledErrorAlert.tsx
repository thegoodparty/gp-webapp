import React, { ReactNode } from 'react'
import { Alert, AlertDescription } from '@styleguide/components/ui/alert'
import { CircleAlertIcon } from '@styleguide/components/ui/icons'
import { cn } from '@styleguide/lib/utils'

interface FilledErrorAlertProps {
  children: ReactNode
  className?: string
}

export const FilledErrorAlert = ({
  children,
  className = '',
}: FilledErrorAlertProps): React.JSX.Element => (
  <Alert
    className={cn(
      'rounded-lg p-2 bg-error-main text-white border-error-main',
      '[&>svg]:text-white',
      className,
    )}
    icon={<CircleAlertIcon />}
  >
    <AlertDescription>{children}</AlertDescription>
  </Alert>
)

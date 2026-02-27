import React from 'react'
import { MdCheckCircle, MdError, MdInfo, MdWarning } from 'react-icons/md'

type AlertSeverity = 'error' | 'info' | 'warning' | 'success'

interface AlertIconProps {
  severity: AlertSeverity
  className?: string
}

export const AlertIcon = ({
  severity,
  className,
}: AlertIconProps): React.JSX.Element | null => {
  switch (severity) {
    case 'error':
      return <MdError className={className} />
    case 'info':
      return <MdInfo className={className} />
    case 'warning':
      return <MdWarning className={className} />
    case 'success':
      return <MdCheckCircle className={className} />
    default:
      return null
  }
}

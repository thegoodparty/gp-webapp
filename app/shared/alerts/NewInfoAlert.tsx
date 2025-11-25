import React, { ReactNode } from 'react'

interface NewInfoAlertProps {
  children: ReactNode
  className?: string
}

export default function NewInfoAlert({ children, className = '' }: NewInfoAlertProps): React.JSX.Element {
  return (
    <div
      className={`
        rounded-lg
        border
        border-info-light
        bg-info-background
        p-3
        text-info-dark
        ${className}
      `}
    >
      {children}
    </div>
  )
} 
'use client'

import React from 'react'

interface TextingComplianceFormProps
  extends React.FormHTMLAttributes<HTMLFormElement> {
  children: React.ReactNode
  className?: string
}

export default function TextingComplianceForm({
  children,
  className = '',
  ...props
}: TextingComplianceFormProps): React.JSX.Element {
  return (
    <form className={`space-y-4 pb-16 md:p-0 ${className}`} {...props}>
      {children}
    </form>
  )
}

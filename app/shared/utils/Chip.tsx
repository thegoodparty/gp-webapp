import React, { ReactNode } from 'react'

interface ChipProps {
  children?: ReactNode
  icon?: ReactNode
  label?: string
  className?: string
  [key: string]: unknown
}

const Chip = ({ children, icon, label, className = '', ...rest }: ChipProps) => (
  <div
    className={`p-2 rounded inline-flex items-center font-medium ${className}`}
    {...rest}
  >
    {icon ?? null}
    <div className="ml-1 text-xs">{label || children}</div>
  </div>
)

export default Chip


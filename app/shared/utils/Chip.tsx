import React, { ReactNode, HTMLAttributes } from 'react'

interface ChipProps extends Omit<HTMLAttributes<HTMLDivElement>, 'children' | 'className'> {
  children?: ReactNode
  icon?: ReactNode
  label?: string
  className?: string
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


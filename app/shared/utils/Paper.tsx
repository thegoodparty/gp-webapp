import clsx from 'clsx'
import React, { ReactNode, HTMLAttributes } from 'react'

interface PaperProps extends Omit<HTMLAttributes<HTMLDivElement>, 'children' | 'className'> {
  children?: ReactNode
  className?: string
}

const Paper = ({ children, className, ...rest }: PaperProps) => (
  <div
    className={clsx(
      'bg-white border border-black/[0.12] p-4 md:p-6 rounded-xl',
      className,
    )}
    {...rest}
  >
    {children}
  </div>
)

export default Paper


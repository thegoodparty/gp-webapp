import clsx from 'clsx'
import { ReactNode, HTMLAttributes } from 'react'

interface OverlineProps extends Omit<HTMLAttributes<HTMLDivElement>, 'children' | 'className'> {
  children?: ReactNode
  className?: string
}

const Overline = ({ children, className = '', ...rest }: OverlineProps) => (
  <div
    className={clsx(
      ' font-sfpro text-xs uppercase tracking-widest',
      className,
    )}
    {...rest}
  >
    {children}
  </div>
)

export default Overline


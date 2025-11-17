import { ReactNode, HTMLAttributes } from 'react'

interface Subtitle2Props extends Omit<HTMLAttributes<HTMLDivElement>, 'children' | 'className'> {
  children?: ReactNode
  className?: string
}

const Subtitle2 = ({ children, className = '', ...restProps }: Subtitle2Props) => (
  <div className={`font-normal text-sm ${className}`} {...restProps}>
    {children}
  </div>
)

export default Subtitle2


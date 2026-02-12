import { ReactNode, HTMLAttributes } from 'react'

interface H2Props
  extends Omit<HTMLAttributes<HTMLHeadingElement>, 'children' | 'className'> {
  children?: ReactNode
  className?: string
}

const H2 = ({ children, className = '', ...restProps }: H2Props) => (
  <h2 className={`font-semibold text-2xl ${className}`} {...restProps}>
    {children}
  </h2>
)

export default H2

import { ReactNode, HTMLAttributes } from 'react'

interface H4Props
  extends Omit<HTMLAttributes<HTMLHeadingElement>, 'children' | 'className'> {
  children?: ReactNode
  className?: string
}

const H4 = ({ children, className = '', ...props }: H4Props) => (
  <h4 className={`font-medium leading-normal text-lg ${className}`} {...props}>
    {children}
  </h4>
)

export default H4

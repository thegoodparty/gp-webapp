import { ReactNode } from 'react'

interface H6Props {
  children?: ReactNode
  className?: string
}

const H6 = ({ children, className = '' }: H6Props) => (
  <h6 className={`font-semibold text-sm ${className}`}>{children}</h6>
)

export default H6

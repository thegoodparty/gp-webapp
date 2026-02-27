import { ReactNode } from 'react'

interface H5Props {
  children?: ReactNode
  className?: string
}

const H5 = ({ children, className = '' }: H5Props) => (
  <h5 className={`font-medium text-base ${className}`}>{children}</h5>
)

export default H5

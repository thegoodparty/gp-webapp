import { ReactNode } from 'react'

interface H1Props {
  children?: ReactNode
  className?: string
}

const H1 = ({ children, className = '' }: H1Props) => (
  <h1 className={`font-medium text-[32px] md:text-4xl  ${className}`}>
    {children}
  </h1>
)

export default H1

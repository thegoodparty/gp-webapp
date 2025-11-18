import { ReactNode } from 'react'

interface Body2Props {
  children?: ReactNode
  className?: string
}

const Body2 = ({ children, className = '' }: Body2Props) => (
  <div className={`font-normal font-sfpro text-sm ${className}`}>
    {children}
  </div>
)

export default Body2


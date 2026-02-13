import { ReactNode } from 'react'

interface MarketingH5Props {
  children?: ReactNode
  className?: string
}

const MarketingH5 = ({ children, className = '' }: MarketingH5Props) => (
  <h5 className={`font-medium text-2xl ${className}`}>{children}</h5>
)

export default MarketingH5

import { ReactNode } from 'react'

interface MarketingH4Props {
  children?: ReactNode
  className?: string
}

const MarketingH4 = ({ children, className = '' }: MarketingH4Props) => (
  <h4 className={`font-medium text-3xl text-4xl ${className}`}>{children}</h4>
)

export default MarketingH4

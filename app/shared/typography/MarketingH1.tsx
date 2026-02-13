import { ReactNode } from 'react'

interface MarketingH1Props {
  children?: ReactNode
  className?: string
}

const MarketingH1 = ({ children, className = '' }: MarketingH1Props) => (
  <h1 className={`font-medium text-6xl md:text-7xl ${className}`}>
    {children}
  </h1>
)

export default MarketingH1

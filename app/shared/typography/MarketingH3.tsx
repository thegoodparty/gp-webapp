import { ReactNode } from 'react'

interface MarketingH3Props {
  children?: ReactNode
  className?: string
}

const MarketingH3 = ({ children, className = '' }: MarketingH3Props) => (
  <h3 className={`font-medium text-5xl leading-tight ${className}`}>
    {children}
  </h3>
)

export default MarketingH3


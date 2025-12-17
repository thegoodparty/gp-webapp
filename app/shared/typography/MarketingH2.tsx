import { ReactNode } from 'react'

interface MarketingH2Props {
  children?: ReactNode
  asH1?: boolean
  className?: string
}

const MarketingH2 = ({ children, asH1, className = '' }: MarketingH2Props) => {
  const Component = asH1 === true ? 'h1' : 'h2'

  return (
    <Component className={`font-medium text-4xl md:text-6xl ${className}`} data-testid="articleTitle">
      {children}
    </Component>
  )
}

export default MarketingH2


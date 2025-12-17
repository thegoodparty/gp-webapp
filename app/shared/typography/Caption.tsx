import { ReactNode } from 'react'

interface CaptionProps {
  children?: ReactNode
  className?: string
}

const Caption = ({ children, className = '' }: CaptionProps) => (
  <div className={`font-semibold font-sfpro text-xs ${className}`}>
    {children}
  </div>
)

export default Caption


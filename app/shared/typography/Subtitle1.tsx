import { ReactNode } from 'react'

interface Subtitle1Props {
  children?: ReactNode
  className?: string
}

const Subtitle1 = ({ children, className = '' }: Subtitle1Props) => (
  <div className={`font-normal font-sfpro text-base ${className}`}>
    {children}
  </div>
)

export default Subtitle1


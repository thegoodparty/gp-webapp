import { ReactNode, CSSProperties } from 'react'

interface Body1Props {
  children?: ReactNode
  className?: string
  style?: CSSProperties
}

const Body1 = ({ children, className = '', style = {} }: Body1Props) => (
  <div
    className={`font-normal font-sfpro text-base ${className}`}
    style={style}
  >
    {children}
  </div>
)

export default Body1

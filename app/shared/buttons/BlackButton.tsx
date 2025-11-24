import { ReactNode, CSSProperties } from 'react'
import BaseButton from './BaseButton'

interface BlackButtonProps {
  children?: ReactNode
  style?: CSSProperties
}

const BlackButton = ({ children, style = {} }: BlackButtonProps) => (
  <BaseButton style={{ backgroundColor: '#000', color: '#FFF', ...style }}>
    {children}
  </BaseButton>
)

export default BlackButton


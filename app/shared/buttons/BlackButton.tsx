import { ReactNode, CSSProperties } from 'react'
import BaseButton from './BaseButton'

interface BlackButtonProps {
  children?: ReactNode
  style?: CSSProperties
  className?: string
}

export type { BlackButtonProps }

const BlackButton = ({ children, style = {}, className }: BlackButtonProps) => (
  <BaseButton
    style={{ backgroundColor: '#000', color: '#FFF', ...style }}
    className={className}
  >
    {children}
  </BaseButton>
)

export default BlackButton

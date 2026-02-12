import { ReactNode, CSSProperties, ButtonHTMLAttributes } from 'react'
import BaseButton from './BaseButton'

interface PurpleButtonProps
  extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'children' | 'style'> {
  children?: ReactNode
  style?: CSSProperties
}

const PurpleButton = ({
  children,
  style = {},
  ...props
}: PurpleButtonProps) => (
  <BaseButton
    style={{
      backgroundColor: '#46002E',
      color: '#FFF',
      borderRadius: '40px',
      padding: '16px auto',
      fontWeight: 700,
      ...style,
    }}
    {...props}
  >
    {children}
  </BaseButton>
)

export default PurpleButton

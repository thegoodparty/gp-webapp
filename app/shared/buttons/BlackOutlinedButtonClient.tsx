import React, { ReactNode, CSSProperties, MouseEvent, ButtonHTMLAttributes } from 'react'
import BaseButtonClient from './BaseButtonClient'

interface BlackOutlinedButtonClientProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'children' | 'style' | 'type' | 'onClick'> {
  children?: ReactNode
  disabled?: boolean
  fullWidth?: boolean
  onClick?: (e: MouseEvent<HTMLButtonElement>) => void
  style?: CSSProperties
  type?: 'button' | 'submit' | 'reset'
  variant?: string
  color?: string
}

const BlackOutlinedButtonClient = ({
  children,
  disabled = false,
  fullWidth = false,
  onClick,
  style = {},
  type = 'button',
  ...props
}: BlackOutlinedButtonClientProps) => (
  <BaseButtonClient
    {...(props as Record<string, unknown>)}
    onClick={onClick}
    disabled={disabled}
    type={type}
    style={{
      borderRadius: '12px',
      backgroundColor: '#fff',
      border: 'solid 2px #000',
      color: '#000',
      ...style,
    }}
  >
    {children}
  </BaseButtonClient>
)

export default BlackOutlinedButtonClient


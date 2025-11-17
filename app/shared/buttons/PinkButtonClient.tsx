'use client'
import { ReactNode, CSSProperties, MouseEvent } from 'react'
import BaseButtonClient from './BaseButtonClient'

interface PinkButtonClientProps {
  children?: ReactNode
  style?: CSSProperties
  onClick?: (e: MouseEvent<HTMLButtonElement>) => void
  disabled?: boolean
  type?: 'button' | 'submit' | 'reset'
}

const PinkButtonClient = ({
  children,
  style = {},
  onClick,
  disabled,
  type,
}: PinkButtonClientProps) => (
  <BaseButtonClient
    style={{ backgroundColor: '#ca2ccd', color: '#fff', ...style }}
    onClick={onClick}
    disabled={disabled}
    type={type}
  >
    {children}
  </BaseButtonClient>
)

export default PinkButtonClient


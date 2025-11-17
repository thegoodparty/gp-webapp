'use client'
import { ReactNode, CSSProperties, MouseEvent } from 'react'

interface BaseButtonClientProps {
  children?: ReactNode
  style?: CSSProperties
  onClick?: (e: MouseEvent<HTMLButtonElement>) => void
  disabled?: boolean
  type?: 'button' | 'submit' | 'reset'
  className?: string
  id?: string
}

const BaseButtonClient = ({
  children,
  style,
  onClick = () => {},
  disabled = false,
  type = 'button',
  className = '',
  id,
}: BaseButtonClientProps) => (
  <button
    className={`py-4 px-6 rounded-lg ${className}`}
    style={style}
    onClick={onClick}
    disabled={disabled}
    type={type}
    id={id}
  >
    {children}
  </button>
)

export default BaseButtonClient


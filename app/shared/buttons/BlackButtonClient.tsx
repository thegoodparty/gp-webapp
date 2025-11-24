'use client'
import { ReactNode, CSSProperties, MouseEvent } from 'react'
import BaseButtonClient from './BaseButtonClient'

interface BlackButtonClientProps {
  children?: ReactNode
  style?: CSSProperties
  onClick?: (e: MouseEvent<HTMLButtonElement>) => void
  disabled?: boolean
  type?: 'button' | 'submit' | 'reset'
  className?: string
}

const BlackButtonClient = ({
  children,
  style = {},
  onClick,
  disabled,
  type,
  className,
}: BlackButtonClientProps) => {
  const backgroundColor = disabled ? '#b9b9b9' : '#000'
  const cursor = disabled ? 'not-allowed' : 'pointer'

  return (
    <BaseButtonClient
      style={{ backgroundColor, color: '#FFF', cursor, ...style }}
      onClick={onClick}
      disabled={disabled}
      type={type}
      className={className}
    >
      {children}
    </BaseButtonClient>
  )
}

export default BlackButtonClient


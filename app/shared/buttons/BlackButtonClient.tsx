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
  id?: string
}

export type { BlackButtonClientProps }

const BlackButtonClient = ({
  children,
  style = {},
  onClick,
  disabled,
  type,
  className,
  id,
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
      id={id}
    >
      {children}
    </BaseButtonClient>
  )
}

export default BlackButtonClient

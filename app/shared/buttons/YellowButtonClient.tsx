'use client'
import { ReactNode, CSSProperties, MouseEvent } from 'react'
import BaseButtonClient from './BaseButtonClient'

interface YellowButtonClientProps {
  children?: ReactNode
  style?: CSSProperties
  onClick?: (e: MouseEvent<HTMLButtonElement>) => void
  disabled?: boolean
  type?: 'button' | 'submit' | 'reset'
  id?: string
}

const YellowButtonClient = ({
  children,
  style = {},
  onClick,
  disabled,
  type,
  id,
}: YellowButtonClientProps) => {
  const backgroundColor = disabled ? 'rgba(255, 230, 0, 0.3)' : '#FFE600'
  const textColor = disabled ? '#666' : '#000'
  const cursor = disabled ? 'not-allowed' : 'pointer'

  return (
    <BaseButtonClient
      style={{ backgroundColor, color: textColor, cursor, ...style }}
      onClick={onClick}
      disabled={disabled}
      type={type}
      id={id}
    >
      {children}
    </BaseButtonClient>
  )
}

export default YellowButtonClient

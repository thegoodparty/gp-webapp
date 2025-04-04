'use client'
import BaseButtonClient from './BaseButtonClient'

export default function YellowButtonClient({
  children,
  style = {},
  onClick,
  disabled,
  type,
  id,
}) {
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

'use client'
import BaseButtonClient from './BaseButtonClient'

export default function PinkButtonClient({
  children,
  style = {},
  onClick,
  disabled,
  type,
}) {
  // const backgroundColor = disabled ? 'rgba(255, 230, 0, 0.5)' : '#FFE600';
  // const cursor = disabled ? 'not-allowed' : 'pointer';

  return (
    <BaseButtonClient
      style={{ backgroundColor: '#ca2ccd', color: '#fff', ...style }}
      onClick={onClick}
      disabled={disabled}
      type={type}
    >
      {children}
    </BaseButtonClient>
  )
}

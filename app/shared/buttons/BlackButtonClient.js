'use client'
import BaseButtonClient from './BaseButtonClient'

const BlackButtonClient = ({
  children,
  style = {},
  onClick,
  disabled,
  type,
  className,
}) => {
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

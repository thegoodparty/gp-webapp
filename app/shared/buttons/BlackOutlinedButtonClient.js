import React from 'react'
import BaseButton from './BaseButtonClient'

const BlackOutlinedButtonClient = ({
  children,
  disabled = false,
  fullWidth = false,
  onClick,
  style = {},
  type = 'button',
  ...props
}) => {
  return (
    <BaseButton
      variant="outlined"
      color="primary"
      fullWidth={fullWidth}
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
      {...props}
    >
      {children}
    </BaseButton>
  )
}

export default BlackOutlinedButtonClient

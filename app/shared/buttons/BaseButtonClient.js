'use client'
const BaseButton = ({
  children,
  style,
  onClick = () => {},
  disabled = false,
  type = 'button',
  className = '',
  id,
}) => {
  return (
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
}

export default BaseButton

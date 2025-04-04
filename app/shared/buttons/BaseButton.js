'use client'
const BaseButton = ({ children, style, className = '', ...props }) => {
  return (
    <button
      className={`py-5 px-8 rounded-lg ${className}`}
      style={style}
      {...props}
    >
      {children}
    </button>
  )
}

export default BaseButton

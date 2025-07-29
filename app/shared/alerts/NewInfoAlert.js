export default function NewInfoAlert({ children, className = '' }) {
  return (
    <div
      className={`
        rounded-lg
        border
        border-info-light
        bg-info-background
        p-3
        text-info-dark
        ${className}
      `}
    >
      {children}
    </div>
  )
} 
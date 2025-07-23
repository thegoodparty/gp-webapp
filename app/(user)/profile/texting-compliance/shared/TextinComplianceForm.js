'use client'

export default function TextinComplianceForm({ children, className = '', ...props }) {
  return (
    <form className={`space-y-4 pb-16 md:p-0 ${className}`} {...props}>
      {children}
    </form>
  )
} 
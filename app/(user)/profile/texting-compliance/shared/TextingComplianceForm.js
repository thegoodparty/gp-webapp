'use client'

export default function TextingComplianceForm({
  children,
  className = '',
  ...props
}) {
  return (
    <form className={`space-y-4 pb-16 md:p-0 ${className}`} {...props}>
      {children}
    </form>
  )
}

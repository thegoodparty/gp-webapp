export default function Body2({ children, className = '' }) {
  return (
    <div className={`font-normal font-sfpro text-sm ${className}`}>
      {children}
    </div>
  )
}

export default function Caption({ children, className = '' }) {
  return (
    <div className={`font-semibold font-sfpro text-xs ${className}`}>
      {children}
    </div>
  )
}

export default function Subtitle1({ children, className = '' }) {
  return (
    <div className={`font-normal font-sfpro text-base ${className}`}>
      {children}
    </div>
  )
}

export default function MarketingH3({ children, className = '' }) {
  return (
    <h3 className={`font-medium text-5xl leading-tight ${className}`}>
      {children}
    </h3>
  )
}

export default function MarketingH1({ children, className = '' }) {
  return (
    <h1 className={`font-medium text-6xl md:text-7xl ${className}`}>
      {children}
    </h1>
  )
}

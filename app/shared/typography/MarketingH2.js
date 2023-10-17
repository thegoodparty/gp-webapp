export default function MarketingH2({ children, className = '' }) {
  return (
    <h2 className={`font-medium text-4xl md:text-6xl ${className}`}>
      {children}
    </h2>
  );
}

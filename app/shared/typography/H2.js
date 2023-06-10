export default function H2({ children, className = '' }) {
  return <h2 className={`font-semibold text-2xl ${className}`}>{children}</h2>;
}

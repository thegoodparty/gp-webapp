export default function Body2({ children, className = '' }) {
  return <div className={`font-normal text-sm ${className}`}>{children}</div>;
}

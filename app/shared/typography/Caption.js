export default function Caption({ children, className = '' }) {
  return <div className={`font-semibold text-xs ${className}`}>{children}</div>;
}

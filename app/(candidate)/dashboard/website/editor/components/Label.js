export default function Label({ children, className = '' }) {
  return (
    <label
      className={`block text-sm font-medium text-gray-700 mb-1 ${className}`}
    >
      {children}
    </label>
  )
}

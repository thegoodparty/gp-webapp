interface LabelProps {
  children: React.ReactNode
  className?: string
}

export default function Label({ children, className = '' }: LabelProps): React.JSX.Element {
  return (
    <label
      className={`block text-sm font-medium text-gray-700 mb-1 ${className}`}
    >
      {children}
    </label>
  )
}



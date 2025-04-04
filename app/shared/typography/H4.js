export default function H4({ children, className = '', ...props }) {
  return (
    <h4 className={`font-medium text-lg ${className}`} {...props}>
      {children}
    </h4>
  )
}

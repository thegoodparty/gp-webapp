export default function H2({ children, className = '', ...restProps }) {
  return (
    <h2 className={`font-semibold text-2xl ${className}`} {...restProps}>
      {children}
    </h2>
  )
}

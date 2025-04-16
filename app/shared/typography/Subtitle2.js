export default function Subtitle2({ children, className = '', ...restProps }) {
  return (
    <div className={`font-normal text-sm ${className}`} {...restProps}>
      {children}
    </div>
  )
}

export default function Overline({ children, className = '', ...rest }) {
  return (
    <div
      className={` font-sfpro text-xs uppercase tracking-widest ${className}`}
      {...rest}
    >
      {children}
    </div>
  )
}

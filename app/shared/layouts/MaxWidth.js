export default function MaxWidth({
  children,
  smallFull = false,
  className = '',
  ...restProps
}) {
  return (
    <div
      className={`max-w-screen-xl mx-auto ${
        smallFull ? 'px-0' : 'px-4'
      } xl:p-0 ${className}`}
      {...restProps}
    >
      {children}
    </div>
  )
}

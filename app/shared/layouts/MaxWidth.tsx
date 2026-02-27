interface MaxWidthProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode
  smallFull?: boolean
}

const MaxWidth = ({
  children,
  smallFull = false,
  className = '',
  ...restProps
}: MaxWidthProps): React.JSX.Element => {
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

export default MaxWidth

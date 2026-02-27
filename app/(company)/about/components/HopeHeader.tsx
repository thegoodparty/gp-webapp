interface HopeHeaderProps extends React.HTMLAttributes<HTMLHeadingElement> {
  children: React.ReactNode
  className?: string
}

export const HopeHeader = ({
  children,
  className,
  ...restProps
}: HopeHeaderProps): React.JSX.Element => (
  <h2
    className={`text-4xl font-medium leading-tight ${
      className ? className : ''
    }`}
    {...restProps}
  >
    {children}
  </h2>
)

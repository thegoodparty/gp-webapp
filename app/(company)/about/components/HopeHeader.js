export const HopeHeader = ({ children, className, ...restProps }) => (
  <h2
    className={`text-4xl font-medium leading-tight ${
      className ? className : ''
    }`}
    {...restProps}
  >
    {children}
  </h2>
)

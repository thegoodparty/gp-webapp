export const OutreachActionWrapper = ({
  children,
  className = '',
  ...restProps
}) => (
  <div
    {...{
      className: `
        flex
        items-center
        space-x-2 p-4
        hover:bg-gray-100
        cursor-pointer
        ${className}
      `,
      ...restProps,
    }}
  >
    {children}
  </div>
)

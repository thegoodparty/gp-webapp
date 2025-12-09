import React from 'react'

interface OutreachActionWrapperProps {
  children: React.ReactNode
  className?: string
  [key: string]: string | number | boolean | React.ReactNode | undefined
}

export const OutreachActionWrapper = ({
  children,
  className = '',
  ...restProps
}: OutreachActionWrapperProps): React.JSX.Element => (
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

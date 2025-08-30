import clsx from 'clsx'

export default function Overline({ children, className = '', ...rest }) {
  return (
    <div
      className={clsx(
        ' font-sfpro text-xs uppercase tracking-widest',
        className,
      )}
      {...rest}
    >
      {children}
    </div>
  )
}

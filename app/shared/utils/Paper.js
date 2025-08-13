import clsx from 'clsx'

export default function Paper({ children, className, ...rest }) {
  return (
    <div
      className={clsx(
        'bg-white border border-black/[0.12] p-4 md:p-6 rounded-xl',
        className,
      )}
      {...rest}
    >
      {children}
    </div>
  )
}

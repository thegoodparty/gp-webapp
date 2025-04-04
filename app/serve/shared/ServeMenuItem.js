import Link from 'next/link'

export default function ServeMenuItem({
  id,
  link,
  icon,
  children,
  onClick,
  pathname,
}) {
  return (
    <>
      <Link
        href={link}
        className={`no-underline text-[17px] py-3 px-3 flex items-center rounded-lg transition-colors hover:text-slate-50 hover:bg-primary-dark-dark ${
          pathname === link && 'text-slate-50 bg-primary-dark-dark'
        }`}
        onClick={onClick}
        id={id}
      >
        {icon || null}
        <div className="relative">
          <div className="ml-2">{children}</div>
        </div>
      </Link>
    </>
  )
}

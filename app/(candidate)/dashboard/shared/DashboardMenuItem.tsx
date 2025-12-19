import Link from 'next/link'

interface DashboardMenuItemProps {
  id?: string
  link: string
  icon?: React.ReactNode
  children: React.ReactNode
  onClick?: () => void
  pathname: string
  target?: string
  isNew?: boolean
}

export const DashboardMenuItem = ({
  id,
  link,
  icon,
  children,
  onClick,
  pathname,
  target,
  isNew,
}: DashboardMenuItemProps): React.JSX.Element => {
  return (
    <>
      <Link
        href={link}
        className={`no-underline text-[17px] py-3 px-3 flex items-center rounded-lg transition-colors hover:text-slate-50 hover:bg-primary-dark-dark [&:hover_img]:opacity-100 ${
          pathname === link && 'text-slate-50 bg-primary-dark-dark'
        }`}
        onClick={onClick}
        id={id}
        target={target}
      >
        {icon || null}
        <div className="relative flex items-center flex-1">
          <div className="ml-2">{children}</div>
          {isNew && (
            <span className="ml-2 px-2 py-0.5 text-xs font-semibold text-white bg-blue-500 rounded">
              NEW
            </span>
          )}
        </div>
      </Link>
    </>
  )
}







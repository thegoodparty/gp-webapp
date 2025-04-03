import Link from 'next/link';

export const DashboardMenuItem = ({
  id,
  link,
  icon,
  children,
  onClick,
  pathname,
  target,
}) => {
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
        <div className="relative">
          <div className="ml-2">{children}</div>
        </div>
      </Link>
    </>
  );
};

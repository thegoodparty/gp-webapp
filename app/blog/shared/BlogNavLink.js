import Link from 'next/link'

export default function BlogNavLink({
  children,
  href,
  whiteStyle,
  isSelected,
}) {
  const colorClasses = isSelected
    ? 'text-white bg-purple-500 hover:bg-purple-700'
    : whiteStyle
    ? 'bg-white hover:bg-indigo-200 border-[1px] border-indigo-300/[0.6]'
    : 'bg-indigo-200 hover:bg-indigo-300'

  return (
    <Link
      href={href}
      className={`rounded-md text-sm py-2 px-4 mr-2 no-underline cursor focus-visible:outline-primary-dark/40 outline-offset-0 ${colorClasses}`}
    >
      {children}
    </Link>
  )
}

import Link from 'next/link';

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
    : 'bg-indigo-200 hover:bg-indigo-300';

  return (
    <Link href={href}>
      <button
        className={`rounded-md text-sm py-2 px-4 mr-2 no-underline cursor ${colorClasses}`}
      >
        {children}
      </button>
    </Link>
  );
}

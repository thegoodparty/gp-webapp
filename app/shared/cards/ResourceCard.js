import Body1 from '@shared/typography/Body1'
import Body2 from '@shared/typography/Body2'
import Link from 'next/link'

export default function ResourceCard({
  title,
  description,
  link,
  ...restProps
}) {
  return (
    <Link
      href={link}
      className="inline-block h-full candidate_content rounded-xl outline-offset-0"
      {...restProps}
    >
      <div className="p-4 bg-primary-dark rounded-xl transition-colors hover:bg-indigo-600 h-full">
        <Body1 className="text-slate-50 h-12 line-clamp-2">{title}</Body1>
        <Body2 className="text-indigo-100 mt-1">{description}</Body2>
      </div>
    </Link>
  )
}

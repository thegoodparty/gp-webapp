import Link from 'next/link'
import { BriefingListItem } from '../shared/briefing-types'

interface BriefingListCardProps {
  briefing: BriefingListItem
}

export default function BriefingListCard({ briefing }: BriefingListCardProps) {
  const {
    cityName,
    state,
    date,
    title,
    readTime,
    priorityItemCount,
    executiveHeadline,
  } = briefing

  const formatted = new Date(date + 'T00:00:00').toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  })

  return (
    <Link
      href={`/dashboard/briefings/${date}`}
      className="block rounded-lg border border-gray-200 bg-white p-5 shadow-sm hover:border-blue-300 hover:shadow-md transition-all"
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          <p className="text-sm text-gray-500 mb-1">
            {cityName}, {state} &middot; {formatted}
          </p>
          <h2 className="text-base font-semibold text-gray-900 mb-2 leading-snug">
            {title}
          </h2>
          {executiveHeadline && (
            <p className="text-sm text-gray-600 line-clamp-2">
              {executiveHeadline}
            </p>
          )}
        </div>
        <div className="shrink-0 flex flex-col items-end gap-1">
          <span className="inline-flex items-center rounded-full bg-blue-50 px-2.5 py-0.5 text-xs font-medium text-blue-700">
            {priorityItemCount} priority item
            {priorityItemCount !== 1 ? 's' : ''}
          </span>
          <span className="text-xs text-gray-400">{readTime}</span>
        </div>
      </div>
    </Link>
  )
}

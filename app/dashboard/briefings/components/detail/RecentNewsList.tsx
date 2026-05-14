import { ExternalLink } from 'lucide-react'
import type { NewsItem } from '@shared/briefings/types'

type Props = {
  items: NewsItem[]
  pathPrefix: string
}

/**
 * Bulleted list of recent news links. Each title is anchored for highlighting
 * via `data-briefing-json-path` so phase 4's selection toolbar can resolve it.
 */
export default function RecentNewsList({
  items,
  pathPrefix,
}: Props): React.JSX.Element | null {
  if (items.length === 0) return null
  return (
    <ul className="list-disc space-y-1 pl-5 text-sm leading-6 text-foreground">
      {items.map((n, i) => (
        <li key={`${n.url}-${i}`}>
          <a
            href={n.url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-start gap-1 font-medium text-info hover:underline"
            data-briefing-json-path={`${pathPrefix}/${i}/title`}
          >
            <span>{n.title}</span>
            <ExternalLink aria-hidden className="mt-1 size-3 shrink-0" />
          </a>{' '}
          <span className="text-xs text-muted-foreground">— {n.outlet}</span>
        </li>
      ))}
    </ul>
  )
}

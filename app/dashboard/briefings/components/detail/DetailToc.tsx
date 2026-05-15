'use client'

import { useMemo } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  briefingItemHref,
  briefingOverviewHref,
} from '@shared/briefings/routes'
import type { AgendaItem } from '@shared/briefings/types'

type Props = {
  briefingSlug: string
  agenda: AgendaItem[]
}

type Entry = {
  key: string
  label: string
  href: string
}

/**
 * Sidebar TOC for the briefing detail layout. Every agenda item is its
 * own page; the TOC navigates rather than scrolling.
 *
 * Active state is derived from the current pathname.
 */
export default function DetailToc({
  briefingSlug,
  agenda,
}: Props): React.JSX.Element {
  const pathname = usePathname()

  const overviewHref = briefingOverviewHref(briefingSlug)
  const entries: Entry[] = useMemo(() => {
    const list: Entry[] = [
      {
        key: 'overview',
        label: 'Executive Summary',
        href: overviewHref,
      },
    ]
    for (const item of agenda) {
      list.push({
        key: item.id,
        label: item.title,
        href: briefingItemHref(briefingSlug, item.id),
      })
    }
    return list
  }, [agenda, briefingSlug, overviewHref])

  return (
    <ul className="flex list-none flex-col gap-0.5">
      {entries.map((e) => {
        const isActive = pathname === e.href
        return (
          <li key={e.key}>
            <Link
              href={e.href}
              className={`flex w-full items-start gap-2 rounded-lg px-3 py-2 text-left text-sm leading-5 transition-colors ${
                isActive
                  ? 'bg-muted font-semibold text-foreground'
                  : 'text-foreground hover:bg-muted/60'
              }`}
            >
              <span className="min-w-0">{e.label}</span>
            </Link>
          </li>
        )
      })}
    </ul>
  )
}

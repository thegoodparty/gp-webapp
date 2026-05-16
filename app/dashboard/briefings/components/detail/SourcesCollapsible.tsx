'use client'

import { useState } from 'react'
import { Plus, Minus, ExternalLink } from 'lucide-react'
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@styleguide'
import type { Source, SourceType } from '@shared/briefings/types'
import { toDisplaySource } from '@shared/briefings/displaySource'

type Props = {
  sources: Source[]
}

const SOURCE_TYPE_LABEL: Record<SourceType, string> = {
  agenda_packet: 'Agenda packet',
  news: 'News',
  government_website: 'Government',
  campaign: 'Campaign',
  haystaq: 'Voter data',
}

/**
 * "Sources (N)" inline expander at the bottom of each agenda item card.
 * Uses the new Collapsible primitive added to the styleguide.
 */
const SourcesCollapsible = ({ sources }: Props): React.JSX.Element | null => {
  const [open, setOpen] = useState(false)
  if (sources.length === 0) return null

  return (
    <Collapsible open={open} onOpenChange={setOpen}>
      <CollapsibleTrigger className="flex w-full items-center justify-between rounded-md py-2 text-left text-sm font-medium text-foreground transition-colors hover:bg-muted/60">
        <span>Sources ({sources.length})</span>
        {open ? (
          <Minus aria-hidden className="size-4 text-muted-foreground" />
        ) : (
          <Plus aria-hidden className="size-4 text-muted-foreground" />
        )}
      </CollapsibleTrigger>
      <CollapsibleContent>
        <ul className="mt-2 flex flex-col gap-2">
          {sources.map((raw) => {
            const s = toDisplaySource(raw)
            const avatar = (
              <span
                aria-hidden
                className="inline-flex size-5 items-center justify-center rounded-full bg-primary/15 text-[10px] font-bold text-primary"
              >
                {s.initial}
              </span>
            )
            const typeLabel = (
              <span className="ml-auto text-xs uppercase tracking-wide text-muted-foreground">
                {SOURCE_TYPE_LABEL[raw.sourceType]}
              </span>
            )
            return (
              <li
                key={s.id}
                className="flex items-center gap-2 rounded-md border border-border bg-card px-3 py-2 text-sm"
              >
                {avatar}
                {s.isProprietary ? (
                  <Popover>
                    <PopoverTrigger className="inline-flex items-center gap-1 font-medium text-info hover:underline">
                      <span>{s.displayName}</span>
                    </PopoverTrigger>
                    <PopoverContent className="w-72 text-sm">
                      <p className="font-medium text-foreground">
                        {s.displayName}
                      </p>
                      {s.displayBlurb ? (
                        <p className="mt-1 text-muted-foreground">
                          {s.displayBlurb}
                        </p>
                      ) : null}
                    </PopoverContent>
                  </Popover>
                ) : s.url ? (
                  <a
                    href={s.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 font-medium text-info hover:underline"
                  >
                    <span>{s.displayName}</span>
                    <ExternalLink aria-hidden className="size-3" />
                  </a>
                ) : (
                  <span className="font-medium text-foreground">
                    {s.displayName}
                  </span>
                )}
                {typeLabel}
              </li>
            )
          })}
        </ul>
      </CollapsibleContent>
    </Collapsible>
  )
}

export default SourcesCollapsible

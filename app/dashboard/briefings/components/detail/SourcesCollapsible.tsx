'use client'

import { useState } from 'react'
import { Plus, ExternalLink } from 'lucide-react'
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@styleguide'
import type { Source } from '@shared/briefings/types'
import { toDisplaySource } from '@shared/briefings/displaySource'

type Props = {
  sources: Source[]
}

const SourcesCollapsible = ({ sources }: Props): React.JSX.Element | null => {
  const [open, setOpen] = useState(false)
  if (sources.length === 0) return null

  return (
    <Collapsible open={open} onOpenChange={setOpen}>
      <CollapsibleTrigger
        data-state={open ? 'open' : 'closed'}
        className="flex w-full items-center justify-between rounded-md py-2 text-left text-sm font-semibold text-foreground transition-colors [&[data-state=open]>svg]:rotate-45"
      >
        <span>Sources ({sources.length})</span>
        <Plus
          aria-hidden
          className="size-4 shrink-0 text-muted-foreground transition-transform duration-[250ms] ease-out"
        />
      </CollapsibleTrigger>
      <CollapsibleContent className="overflow-hidden data-[state=closed]:animate-collapsible-up data-[state=open]:animate-collapsible-down">
        <ul className="mt-1 flex flex-col gap-3">
          {sources.map((raw) => {
            const s = toDisplaySource(raw)
            return (
              <li key={s.id} className="flex items-start gap-2">
                <span
                  aria-hidden
                  className="mt-0.5 inline-flex size-4 shrink-0 items-center justify-center rounded-sm bg-primary/15 text-[10px] font-bold text-primary"
                >
                  {s.initial}
                </span>
                <div className="flex min-w-0 flex-col gap-0.5">
                  <span className="truncate text-[11px] text-muted-foreground">
                    {s.publisher}
                  </span>
                  {s.isProprietary ? (
                    <span className="text-sm font-semibold text-foreground">
                      {s.displayName}
                    </span>
                  ) : s.url ? (
                    <a
                      href={s.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-start gap-1 text-sm font-semibold text-info-600 hover:underline"
                    >
                      <span>{s.displayName}</span>
                      <ExternalLink
                        aria-hidden
                        className="mt-1 size-3 shrink-0"
                      />
                    </a>
                  ) : (
                    <span className="text-sm font-semibold text-foreground">
                      {s.displayName}
                    </span>
                  )}
                  {s.description ? (
                    <span className="text-xs leading-5 text-muted-foreground">
                      {s.description}
                    </span>
                  ) : null}
                </div>
              </li>
            )
          })}
        </ul>
      </CollapsibleContent>
    </Collapsible>
  )
}

export default SourcesCollapsible

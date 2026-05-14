'use client'

import { useState } from 'react'
import { Plus, Minus, ExternalLink } from 'lucide-react'
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@styleguide'
import type { Source } from '@shared/briefings/types'

type Props = {
  sources: Source[]
}

/**
 * "Sources (N)" inline expander at the bottom of each agenda item card.
 * Uses the new Collapsible primitive added to the styleguide.
 */
export default function SourcesCollapsible({
  sources,
}: Props): React.JSX.Element | null {
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
          {sources.map((s) => (
            <li
              key={s.id}
              className="flex items-center gap-2 rounded-md border border-border bg-card px-3 py-2 text-sm"
            >
              <span
                aria-hidden
                className="inline-flex items-center justify-center rounded-sm bg-primary/15 text-[10px] font-bold text-primary"
                style={{ width: 16, height: 16 }}
              >
                {s.iconInitial}
              </span>
              {s.url ? (
                <a
                  href={s.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 font-medium text-info hover:underline"
                >
                  <span>{s.label}</span>
                  <ExternalLink aria-hidden className="size-3" />
                </a>
              ) : (
                <span className="font-medium text-foreground">{s.label}</span>
              )}
              <span className="ml-auto text-xs uppercase tracking-wide text-muted-foreground">
                {s.kind}
              </span>
            </li>
          ))}
        </ul>
      </CollapsibleContent>
    </Collapsible>
  )
}

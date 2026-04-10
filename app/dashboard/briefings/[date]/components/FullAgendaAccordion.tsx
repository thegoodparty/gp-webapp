'use client'
import { useState } from 'react'
import { LuChevronDown, LuChevronUp } from 'react-icons/lu'
import { FullAgendaItem } from '../../shared/briefing-types'

interface FullAgendaAccordionProps {
  items: FullAgendaItem[]
  summary: string
}

export default function FullAgendaAccordion({
  items,
  summary,
}: FullAgendaAccordionProps) {
  const [open, setOpen] = useState(false)

  return (
    <div className="bg-card rounded-2xl border border-border overflow-hidden">
      <button
        className="flex w-full items-center justify-between px-4 sm:px-8 py-5 text-left"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
      >
        <span className="text-sm font-semibold text-card-foreground">
          Full Agenda
          <span className="ml-2 text-muted-foreground font-normal">
            {items.length} items
            {summary
              ? ` including ${(summary.split(',')[0] ?? '').toLowerCase()}`
              : ''}
          </span>
        </span>
        {open ? (
          <LuChevronUp className="h-5 w-5 shrink-0 text-muted-foreground" />
        ) : (
          <LuChevronDown className="h-5 w-5 shrink-0 text-muted-foreground" />
        )}
      </button>

      {open && (
        <div className="border-t border-border px-4 sm:px-8 pb-6">
          {summary && (
            <p className="mt-4 mb-4 text-sm text-muted-foreground italic">
              {summary}
            </p>
          )}
          <div className="flex flex-col divide-y divide-border">
            {items.map((item, idx) => (
              <div key={idx} className="py-3">
                <div className="flex items-start gap-3">
                  {item.number && (
                    <span className="shrink-0 text-xs font-mono text-muted-foreground/50 mt-0.5 min-w-8">
                      {item.number}
                    </span>
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-card-foreground leading-snug">
                      {item.title}
                      {item.isPriority && (
                        <span className="ml-2 inline-flex items-center rounded-sm bg-brand-midnight-50 px-1.5 py-0.5 text-[10px] font-semibold text-brand-midnight-700">
                          Priority
                        </span>
                      )}
                    </p>
                    {item.description && (
                      <p className="mt-0.5 text-xs text-muted-foreground line-clamp-2">
                        {item.description}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

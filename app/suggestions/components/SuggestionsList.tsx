'use client'

import {
  Briefcase,
  Compass,
  DollarSign,
  Footprints,
  Megaphone,
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import {
  roleLabels,
  roleOrder,
  roleSubtitles,
  type Role,
  type SeedSuggestion,
} from '../presets'
import SuggestionCard from './SuggestionCard'

type Props = {
  suggestions: SeedSuggestion[]
}

const roleIcons: Record<Role, LucideIcon> = {
  manager: Briefcase,
  field: Footprints,
  political: Compass,
  comms: Megaphone,
  finance: DollarSign,
}

function RoleSection({
  role,
  items,
}: {
  role: Role
  items: SeedSuggestion[]
}): React.JSX.Element {
  const Icon = roleIcons[role]
  return (
    <section className="flex flex-col gap-3 rounded-2xl border border-border bg-muted/40 p-5">
      <div className="flex items-center gap-3">
        <span className="inline-flex size-10 items-center justify-center rounded-full bg-primary/10 text-primary">
          <Icon className="size-5" aria-hidden />
        </span>
        <div className="flex flex-col">
          <h3 className="text-base font-semibold text-foreground">
            {roleLabels[role]}
          </h3>
          <p className="text-xs text-muted-foreground">{roleSubtitles[role]}</p>
        </div>
        <span className="ml-auto text-xs text-muted-foreground">
          {items.length} {items.length === 1 ? 'item' : 'items'}
        </span>
      </div>
      {items.length === 0 ? (
        <div className="rounded-lg border border-dashed border-border bg-background p-4 text-xs text-muted-foreground">
          Nothing flagged in {roleLabels[role]} today.
        </div>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2">
          {items.map((s) => (
            <SuggestionCard key={s.id} suggestion={s} />
          ))}
        </div>
      )}
    </section>
  )
}

export default function SuggestionsList({
  suggestions,
}: Props): React.JSX.Element {
  const byRole: Record<Role, SeedSuggestion[]> = {
    manager: [],
    field: [],
    political: [],
    comms: [],
    finance: [],
  }
  for (const s of suggestions) {
    byRole[s.role].push(s)
  }

  return (
    <div className="flex flex-col gap-5">
      {roleOrder.map((role) => (
        <RoleSection key={role} role={role} items={byRole[role]} />
      ))}
    </div>
  )
}

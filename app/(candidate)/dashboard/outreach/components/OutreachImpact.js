import {
  IMPACT_LEVEL_ICONS,
  IMPACT_LEVELS_LABELS,
} from 'app/(candidate)/dashboard/outreach/constants'

export const OutreachImpact = ({ impact }) => (
  <div className="flex items-end gap-1 text-xs text-gray-600 min-w-0">
    <span className="text-lg">
      {IMPACT_LEVEL_ICONS[impact] && IMPACT_LEVEL_ICONS[impact]}
    </span>
    <span className="flex-1 min-w-0 truncate text-nowrap">
      {IMPACT_LEVELS_LABELS[impact] && IMPACT_LEVELS_LABELS[impact]}
    </span>
  </div>
)

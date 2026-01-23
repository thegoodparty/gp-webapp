import {
  ContactStatsCategory,
  ContactsStats,
} from 'app/(candidate)/dashboard/polls/shared/queries'
import { numberFormatter } from 'helpers/numberHelper'

export interface ContactStatsRendered {
  totalConstituents: string | null
  homeownersPercent: string | null
  hasChildrenUnder18Percent: string | null
  medianIncomeRange: string | null
  visibleContactsPercent: string | null
}

const parseIncomeMin = (label: string): number => {
  const num = parseInt(label.replace(/[^0-9]/g, ''), 10)
  if (label.includes('+')) return 250000
  if (label.includes('k')) return num * 1000
  return num
}

const getMedianIncomeRange = (
  category?: ContactStatsCategory,
): string | null => {
  if (!category?.length) return null

  const sorted = category
    .filter((b) => b.label !== 'Unknown' && b.percent > 0)
    .sort((a, b) => parseIncomeMin(a.label) - parseIncomeMin(b.label))

  if (!sorted.length) return null

  const totalKnownPercent = sorted.reduce((sum, b) => sum + b.percent, 0)
  if (totalKnownPercent === 0) return null

  const medianThreshold = totalKnownPercent / 2
  let cumulative = 0
  for (const bucket of sorted) {
    cumulative += bucket.percent
    if (cumulative >= medianThreshold) {
      return `$${bucket.label.replace(/–/g, '-')}`
    }
  }

  const last = sorted[sorted.length - 1]
  return last ? `$${last.label.replace(/–/g, '-')}` : null
}

const getPercentForYes = (category: ContactStatsCategory): number | null => {
  const yes = category?.find((b) => b.label === 'Yes')
  return yes?.percent ? yes.percent : null
}

export const getContactStatsRendered = (
  stats: ContactsStats,
  totalVisibleContacts: number,
): ContactStatsRendered => {
  const totalConstituents = stats.totalConstituents
  const homeownersPercent = getPercentForYes(stats.buckets.homeowner)
  const hasChildrenUnder18Percent = getPercentForYes(
    stats.buckets.presenceOfChildren,
  )
  const medianIncomeRange = getMedianIncomeRange(
    stats.buckets.estimatedIncomeRange,
  )
  const visibleContactsPercent = totalConstituents
    ? (totalVisibleContacts / totalConstituents) * 100
    : 0
  return {
    totalConstituents: totalConstituents
      ? numberFormatter(totalConstituents)
      : null,
    homeownersPercent: homeownersPercent ? `${homeownersPercent}%` : null,
    hasChildrenUnder18Percent: hasChildrenUnder18Percent
      ? `${hasChildrenUnder18Percent}%`
      : null,
    medianIncomeRange: medianIncomeRange ? `${medianIncomeRange}` : null,
    visibleContactsPercent: visibleContactsPercent
      ? `${visibleContactsPercent.toFixed(2)}%`
      : '--',
  }
}

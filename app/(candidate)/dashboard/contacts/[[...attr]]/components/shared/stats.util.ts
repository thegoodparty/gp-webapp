import { numberFormatter } from 'helpers/numberHelper'

type Bucket = { label: string; count: number; percent: number }
type Category = { buckets: Bucket[] }

export type PeopleStats = {
  meta?: { totalConstituents?: number }
  categories?: {
    homeowner?: Category
    presenceOfChildren?: Category
    estimatedIncomeRange?: Category
  }
}

export interface ContactStats {
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
  return num || Infinity
}

const getMedianIncomeRange = (category?: Category): string | null => {
  if (!category?.buckets?.length) return null

  const sorted = category.buckets
    .filter((b) => b.label !== 'Unknown' && b.percent > 0)
    .sort((a, b) => parseIncomeMin(a.label) - parseIncomeMin(b.label))

  if (!sorted.length) return null

  let cumulative = 0
  for (const bucket of sorted) {
    cumulative += bucket.percent
    if (cumulative >= 0.5) {
      return `$${bucket.label.replace(/–/g, '-')}`
    }
  }

  const last = sorted[sorted.length - 1]
  return last ? `$${last.label.replace(/–/g, '-')}` : null
}

const getPercentForYes = (category?: Category): number | null => {
  const yes = category?.buckets?.find((b) => b.label === 'Yes')
  return yes?.percent ? Math.round(yes.percent * 100) : null
}

export const getContactStats = (
  stats: PeopleStats,
  totalVisibleContacts: number,
): ContactStats => {
  const totalConstituents = stats?.meta?.totalConstituents
  const homeownersPercent = getPercentForYes(stats?.categories?.homeowner)
  const hasChildrenUnder18Percent = getPercentForYes(
    stats?.categories?.presenceOfChildren,
  )
  const medianIncomeRange = getMedianIncomeRange(
    stats?.categories?.estimatedIncomeRange,
  )
  const visibleContactsPercent =
    (totalVisibleContacts / (totalConstituents ?? 0)) * 100
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
      ? `${visibleContactsPercent}%`
      : null,
  }
}

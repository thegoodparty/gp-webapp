import { ContactsStats } from 'app/(candidate)/dashboard/polls/shared/queries'

interface ChartDataPoint {
  name: string
  value: number
}

interface ChartData {
  totalConstituents: number
  ageDistribution: ChartDataPoint[]
  presenceOfChildren: ChartDataPoint[]
  homeowner: ChartDataPoint[]
  estimatedIncomeRange: ChartDataPoint[]
  education: ChartDataPoint[]
}

export const mapContactsStatsToCharts = (
  contactsStats: ContactsStats | undefined,
): ChartData => {
  if (!contactsStats) {
    return {
      totalConstituents: 0,
      ageDistribution: [],
      presenceOfChildren: [],
      homeowner: [],
      estimatedIncomeRange: [],
      education: [],
    }
  }

  const categories = contactsStats.buckets

  const toPercent = (value: number): number => {
    if (typeof value !== 'number' || Number.isNaN(value)) return 0
    if (value <= 0) return 0
    return Number(value.toFixed(1))
  }
  const toChartData = (
    buckets: { label: string; percent: number }[],
  ): ChartDataPoint[] =>
    buckets.map((bucket) => ({
      name: bucket.label,
      value: toPercent(bucket.percent),
    }))

  const mapEstimatedIncomeRange = (): ChartDataPoint[] => {
    const buckets = categories.estimatedIncomeRange
    const consolidated = {
      'Under $50K': 0,
      '$50K - $75K': 0,
      '$75K - $100K': 0,
      '$100K - $150K': 0,
      '$150K+': 0,
      Unknown: 0,
    }

    buckets.forEach((bucket) => {
      const normalizedLabel = bucket.label.replace(/–/g, '-').toLowerCase()
      if (
        ['1k-15k', '15k-25k', '25k-35k', '35k-50k'].includes(normalizedLabel)
      ) {
        consolidated['Under $50K'] += bucket.percent
      } else if (normalizedLabel === '50k-75k') {
        consolidated['$50K - $75K'] += bucket.percent
      } else if (normalizedLabel === '75k-100k') {
        consolidated['$75K - $100K'] += bucket.percent
      } else if (['100k-125k', '125k-150k'].includes(normalizedLabel)) {
        consolidated['$100K - $150K'] += bucket.percent
      } else if (
        ['150k-175k', '175k-200k', '200k-250k', '250k+'].includes(
          normalizedLabel,
        )
      ) {
        consolidated['$150K+'] += bucket.percent
      } else if (bucket.label === 'Unknown') {
        consolidated['Unknown'] += bucket.percent
      }
    })

    return toChartData(
      Object.entries(consolidated).map(([label, percent]) => ({
        label,
        percent,
      })),
    )
  }

  return {
    totalConstituents: contactsStats.totalConstituents,
    ageDistribution: toChartData(categories.age),
    presenceOfChildren: toChartData(categories.presenceOfChildren),
    homeowner: toChartData(categories.homeowner),
    estimatedIncomeRange: mapEstimatedIncomeRange(),
    education: toChartData(categories.education),
  }
}

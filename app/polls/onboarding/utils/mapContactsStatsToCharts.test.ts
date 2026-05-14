import { describe, expect, it } from 'vitest'
import type { ContactsStats } from 'app/dashboard/polls/shared/queries'
import { mapContactsStatsToCharts } from './mapContactsStatsToCharts'

type Bucket = { label: string; count: number; percent: number }

const bucket = (label: string, percent: number): Bucket => ({
  label,
  count: 0,
  percent,
})

const buildStats = (
  educationBuckets: Bucket[],
  overrides: Partial<ContactsStats['buckets']> = {},
): ContactsStats => ({
  districtId: 'district-1',
  computedAt: '2026-01-01T00:00:00Z',
  totalConstituents: 100,
  totalConstituentsWithCellPhone: 50,
  buckets: {
    age: overrides.age ?? [],
    homeowner: overrides.homeowner ?? [],
    presenceOfChildren: overrides.presenceOfChildren ?? [],
    estimatedIncomeRange: overrides.estimatedIncomeRange ?? [],
    education: educationBuckets,
  },
})

describe('mapContactsStatsToCharts — education ordering', () => {
  it('returns education buckets in EDUCATION_ORDER sequence', () => {
    const stats = buildStats([
      bucket('Graduate Degree', 11),
      bucket('None', 8),
      bucket('Some College', 18),
      bucket('College Degree', 24),
      bucket('High School Diploma', 32),
      bucket('Technical School', 6),
    ])

    const result = mapContactsStatsToCharts(stats)
    const names = result.education.map((point) => point.name)

    expect(names).toEqual([
      'No High School',
      'High School Diploma',
      'Some College',
      'Technical School',
      'College Degree',
      'Graduate Degree',
    ])
  })

  it('sorts "Unknown" to the end even when the API returns it first', () => {
    const stats = buildStats([
      bucket('Unknown', 1),
      bucket('None', 8),
      bucket('Graduate Degree', 11),
    ])

    const result = mapContactsStatsToCharts(stats)
    const names = result.education.map((point) => point.name)

    expect(names[names.length - 1]).toBe('Unknown')
    expect(names).toEqual(['No High School', 'Graduate Degree', 'Unknown'])
  })

  it('renames "None" to "No High School"', () => {
    const stats = buildStats([bucket('None', 12)])

    const result = mapContactsStatsToCharts(stats)

    expect(result.education).toEqual([{ name: 'No High School', value: 12 }])
  })

  it('drops a label not in EDUCATION_ORDER between known labels and "Unknown"', () => {
    const stats = buildStats([
      bucket('Unknown', 2),
      bucket('Postdoc', 3),
      bucket('None', 5),
      bucket('Graduate Degree', 7),
    ])

    const result = mapContactsStatsToCharts(stats)
    const names = result.education.map((point) => point.name)

    expect(names).toEqual([
      'No High School',
      'Graduate Degree',
      'Postdoc',
      'Unknown',
    ])
  })
})

describe('mapContactsStatsToCharts — Unknown-last across charts', () => {
  it('moves "Unknown" to the end of any category', () => {
    const stats = buildStats([], {
      age: [bucket('Unknown', 5), bucket('25-34', 30), bucket('35-44', 40)],
      homeowner: [bucket('Unknown', 10), bucket('Yes', 90)],
    })

    const result = mapContactsStatsToCharts(stats)

    expect(result.ageDistribution.map((p) => p.name)).toEqual([
      '25-34',
      '35-44',
      'Unknown',
    ])
    expect(result.homeowner.map((p) => p.name)).toEqual(['Yes', 'Unknown'])
  })
})

describe('mapContactsStatsToCharts — empty input', () => {
  it('returns zeroed structure when stats is undefined', () => {
    expect(mapContactsStatsToCharts(undefined)).toEqual({
      totalConstituents: 0,
      ageDistribution: [],
      presenceOfChildren: [],
      homeowner: [],
      estimatedIncomeRange: [],
      education: [],
    })
  })
})

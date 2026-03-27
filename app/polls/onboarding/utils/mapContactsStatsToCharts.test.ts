import { describe, it, expect } from 'vitest'
import { mapContactsStatsToCharts } from './mapContactsStatsToCharts'
import type { ContactsStats } from 'app/(candidate)/dashboard/polls/shared/queries'

const createMockContactsStats = (
  overrides: Partial<ContactsStats> = {},
): ContactsStats => ({
  totalConstituents: 10000,
  buckets: {
    age: [
      { label: '18-24', percent: 15.5 },
      { label: '25-34', percent: 22.3 },
      { label: '35-44', percent: 18.7 },
      { label: '45-54', percent: 17.2 },
      { label: '55-64', percent: 14.8 },
      { label: '65+', percent: 11.5 },
    ],
    presenceOfChildren: [
      { label: 'Yes', percent: 35 },
      { label: 'No', percent: 65 },
    ],
    homeowner: [
      { label: 'Owner', percent: 60 },
      { label: 'Renter', percent: 40 },
    ],
    estimatedIncomeRange: [
      { label: '1K-15K', percent: 5 },
      { label: '15K-25K', percent: 10 },
      { label: '25K-35K', percent: 12 },
      { label: '35K-50K', percent: 15 },
      { label: '50K-75K', percent: 18 },
      { label: '75K-100K', percent: 15 },
      { label: '100K-125K', percent: 10 },
      { label: '125K-150K', percent: 7 },
      { label: '150K-175K', percent: 4 },
      { label: '175K-200K', percent: 2 },
      { label: '200K-250K', percent: 1 },
      { label: '250K+', percent: 1 },
    ],
    education: [
      { label: 'High School', percent: 30 },
      { label: 'Some College', percent: 25 },
      { label: 'Bachelors', percent: 28 },
      { label: 'Graduate', percent: 17 },
    ],
  },
  ...overrides,
})

describe('mapContactsStatsToCharts', () => {
  describe('when contactsStats is undefined or missing buckets', () => {
    it('returns empty chart data when contactsStats is undefined', () => {
      const result = mapContactsStatsToCharts(undefined)

      expect(result).toEqual({
        totalConstituents: 0,
        ageDistribution: [],
        presenceOfChildren: [],
        homeowner: [],
        estimatedIncomeRange: [],
        education: [],
      })
    })

    it('returns empty chart data when contactsStats is null-ish', () => {
      const result = mapContactsStatsToCharts(null as unknown as undefined)

      expect(result).toEqual({
        totalConstituents: 0,
        ageDistribution: [],
        presenceOfChildren: [],
        homeowner: [],
        estimatedIncomeRange: [],
        education: [],
      })
    })

    it('returns empty chart data when buckets is missing', () => {
      const result = mapContactsStatsToCharts({
        totalConstituents: 1000,
      } as ContactsStats)

      expect(result).toEqual({
        totalConstituents: 0,
        ageDistribution: [],
        presenceOfChildren: [],
        homeowner: [],
        estimatedIncomeRange: [],
        education: [],
      })
    })
  })

  describe('totalConstituents', () => {
    it('returns the total constituents from the input', () => {
      const mockData = createMockContactsStats({ totalConstituents: 50000 })
      const result = mapContactsStatsToCharts(mockData)

      expect(result.totalConstituents).toBe(50000)
    })
  })

  describe('toPercent conversion', () => {
    it('rounds percentages to one decimal place', () => {
      const mockData = createMockContactsStats({
        buckets: {
          ...createMockContactsStats().buckets,
          age: [
            { label: '18-24', percent: 15.567 },
            { label: '25-34', percent: 22.333 },
          ],
        },
      })
      const result = mapContactsStatsToCharts(mockData)

      expect(result.ageDistribution).toEqual([
        { name: '18-24', value: 15.6 },
        { name: '25-34', value: 22.3 },
      ])
    })

    it('handles NaN values by converting to 0 (which gets filtered out)', () => {
      const mockData = createMockContactsStats({
        buckets: {
          ...createMockContactsStats().buckets,
          age: [
            { label: '18-24', percent: NaN },
            { label: '25-34', percent: 50 },
          ],
        },
      })
      const result = mapContactsStatsToCharts(mockData)

      // NaN becomes 0, which gets filtered out
      expect(result.ageDistribution).toEqual([{ name: '25-34', value: 50 }])
    })

    it('handles non-number values by converting to 0 (which gets filtered out)', () => {
      const mockData = createMockContactsStats({
        buckets: {
          ...createMockContactsStats().buckets,
          age: [
            { label: '18-24', percent: 'invalid' as unknown as number },
            { label: '25-34', percent: 50 },
          ],
        },
      })
      const result = mapContactsStatsToCharts(mockData)

      expect(result.ageDistribution).toEqual([{ name: '25-34', value: 50 }])
    })
  })

  describe('filtering zero percent values (ENG-6602)', () => {
    it('filters out values that are exactly 0%', () => {
      const mockData = createMockContactsStats({
        buckets: {
          ...createMockContactsStats().buckets,
          age: [
            { label: '18-24', percent: 25 },
            { label: 'Unknown', percent: 0 },
            { label: '25-34', percent: 75 },
          ],
        },
      })
      const result = mapContactsStatsToCharts(mockData)

      expect(result.ageDistribution).toEqual([
        { name: '18-24', value: 25 },
        { name: '25-34', value: 75 },
      ])
      expect(
        result.ageDistribution.find((item) => item.name === 'Unknown'),
      ).toBeUndefined()
    })

    it('filters out values that round to 0% (e.g., 0.04%)', () => {
      const mockData = createMockContactsStats({
        buckets: {
          ...createMockContactsStats().buckets,
          age: [
            { label: '18-24', percent: 50 },
            { label: 'Unknown', percent: 0.04 }, // rounds to 0.0
            { label: '25-34', percent: 49.96 },
          ],
        },
      })
      const result = mapContactsStatsToCharts(mockData)

      expect(result.ageDistribution).toHaveLength(2)
      expect(
        result.ageDistribution.find((item) => item.name === 'Unknown'),
      ).toBeUndefined()
    })

    it('keeps values that are small but do not round to 0% (e.g., 0.1%)', () => {
      const mockData = createMockContactsStats({
        buckets: {
          ...createMockContactsStats().buckets,
          age: [
            { label: '18-24', percent: 50 },
            { label: 'Small', percent: 0.1 },
            { label: '25-34', percent: 49.9 },
          ],
        },
      })
      const result = mapContactsStatsToCharts(mockData)

      expect(result.ageDistribution).toHaveLength(3)
      expect(
        result.ageDistribution.find((item) => item.name === 'Small'),
      ).toEqual({
        name: 'Small',
        value: 0.1,
      })
    })

    it('filters out negative percent values', () => {
      const mockData = createMockContactsStats({
        buckets: {
          ...createMockContactsStats().buckets,
          age: [
            { label: '18-24', percent: 50 },
            { label: 'Invalid', percent: -5 },
            { label: '25-34', percent: 50 },
          ],
        },
      })
      const result = mapContactsStatsToCharts(mockData)

      expect(result.ageDistribution).toHaveLength(2)
      expect(
        result.ageDistribution.find((item) => item.name === 'Invalid'),
      ).toBeUndefined()
    })
  })

  describe('estimatedIncomeRange consolidation', () => {
    it('consolidates income ranges into broader categories', () => {
      const mockData = createMockContactsStats({
        buckets: {
          ...createMockContactsStats().buckets,
          estimatedIncomeRange: [
            { label: '1K-15K', percent: 5 },
            { label: '15K-25K', percent: 5 },
            { label: '25K-35K', percent: 5 },
            { label: '35K-50K', percent: 5 },
            { label: '50K-75K', percent: 20 },
            { label: '75K-100K', percent: 15 },
            { label: '100K-125K', percent: 10 },
            { label: '125K-150K', percent: 10 },
            { label: '150K-175K', percent: 10 },
            { label: '175K-200K', percent: 5 },
            { label: '200K-250K', percent: 5 },
            { label: '250K+', percent: 5 },
          ],
        },
      })
      const result = mapContactsStatsToCharts(mockData)

      expect(result.estimatedIncomeRange).toContainEqual({
        name: 'Under $50K',
        value: 20, // 5+5+5+5
      })
      expect(result.estimatedIncomeRange).toContainEqual({
        name: '$50K - $75K',
        value: 20,
      })
      expect(result.estimatedIncomeRange).toContainEqual({
        name: '$75K - $100K',
        value: 15,
      })
      expect(result.estimatedIncomeRange).toContainEqual({
        name: '$100K - $150K',
        value: 20, // 10+10
      })
      expect(result.estimatedIncomeRange).toContainEqual({
        name: '$150K+',
        value: 25, // 10+5+5+5
      })
    })

    it('handles en-dash characters in income labels', () => {
      const mockData = createMockContactsStats({
        buckets: {
          ...createMockContactsStats().buckets,
          estimatedIncomeRange: [
            { label: '50K–75K', percent: 30 }, // en-dash
          ],
        },
      })
      const result = mapContactsStatsToCharts(mockData)

      expect(result.estimatedIncomeRange).toContainEqual({
        name: '$50K - $75K',
        value: 30,
      })
    })

    it('filters out Unknown income when it is 0%', () => {
      const mockData = createMockContactsStats({
        buckets: {
          ...createMockContactsStats().buckets,
          estimatedIncomeRange: [
            { label: '50K-75K', percent: 100 },
            { label: 'Unknown', percent: 0 },
          ],
        },
      })
      const result = mapContactsStatsToCharts(mockData)

      expect(
        result.estimatedIncomeRange.find((item) => item.name === 'Unknown'),
      ).toBeUndefined()
    })
  })

  describe('all chart categories', () => {
    it('maps all chart categories correctly', () => {
      const mockData = createMockContactsStats()
      const result = mapContactsStatsToCharts(mockData)

      expect(result.ageDistribution).toHaveLength(6)
      expect(result.presenceOfChildren).toHaveLength(2)
      expect(result.homeowner).toHaveLength(2)
      expect(result.education).toHaveLength(4)
      // estimatedIncomeRange has 6 categories but Unknown is 0, so it's filtered
      expect(result.estimatedIncomeRange.length).toBeGreaterThan(0)
    })
  })
})

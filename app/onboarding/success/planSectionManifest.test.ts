import { describe, expect, it } from 'vitest'
import {
  PLAN_SECTION_ORDER,
  getNumberedPlanSections,
} from './planSectionManifest'

describe('plan section manifest', () => {
  it('lists the canonical 11 sections in ClickUp-template order', () => {
    expect(PLAN_SECTION_ORDER.map((s) => s.key)).toEqual([
      'executiveSummary',
      'strategicLandscape',
      'electoralGoals',
      'voterInsights',
      'resources',
      'timeline',
      'community',
      'voterContact',
      'measurement',
      'methodology',
      'glossary',
    ])
  })

  it('marks only Strategic Landscape optional', () => {
    const optional = PLAN_SECTION_ORDER.filter((s) => s.optional).map(
      (s) => s.key,
    )
    expect(optional).toEqual(['strategicLandscape'])
  })

  describe('getNumberedPlanSections', () => {
    it('numbers all 11 sections 1..11 when Strategic Landscape is shown', () => {
      const sections = getNumberedPlanSections(true)
      expect(sections.map((s) => [s.key, s.number])).toEqual([
        ['executiveSummary', 1],
        ['strategicLandscape', 2],
        ['electoralGoals', 3],
        ['voterInsights', 4],
        ['resources', 5],
        ['timeline', 6],
        ['community', 7],
        ['voterContact', 8],
        ['measurement', 9],
        ['methodology', 10],
        ['glossary', 11],
      ])
    })

    it('drops Strategic Landscape and renumbers contiguously when hidden', () => {
      const sections = getNumberedPlanSections(false)
      // No gap at 2: Electoral Goals shifts up into the vacated slot.
      expect(sections.map((s) => [s.key, s.number])).toEqual([
        ['executiveSummary', 1],
        ['electoralGoals', 2],
        ['voterInsights', 3],
        ['resources', 4],
        ['timeline', 5],
        ['community', 6],
        ['voterContact', 7],
        ['measurement', 8],
        ['methodology', 9],
        ['glossary', 10],
      ])
      expect(sections.some((s) => s.key === 'strategicLandscape')).toBe(false)
    })
  })
})

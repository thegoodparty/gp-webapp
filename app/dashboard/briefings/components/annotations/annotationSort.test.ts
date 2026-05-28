import { describe, expect, it } from 'vitest'
import { compareForCycler, type SortableAnnotation } from './annotationSort'

const make = (over: Partial<SortableAnnotation>): SortableAnnotation => ({
  jsonPath: null,
  docOrderIndex: null,
  start: null,
  createdAt: new Date('2026-01-01T00:00:00Z'),
  ...over,
})

describe('compareForCycler', () => {
  it('places unanchored annotations before anchored ones', () => {
    const unanchored = make({ jsonPath: null })
    const anchored = make({ jsonPath: '/x', docOrderIndex: 5, start: 0 })
    expect(compareForCycler(unanchored, anchored)).toBeLessThan(0)
    expect(compareForCycler(anchored, unanchored)).toBeGreaterThan(0)
  })

  it('places anchored-resolved before anchored-unresolved', () => {
    const resolved = make({ jsonPath: '/a', docOrderIndex: 3, start: 0 })
    const unresolved = make({ jsonPath: '/missing', docOrderIndex: null })
    expect(compareForCycler(resolved, unresolved)).toBeLessThan(0)
    expect(compareForCycler(unresolved, resolved)).toBeGreaterThan(0)
  })

  it('sorts two resolved annotations by docOrderIndex ascending', () => {
    const earlier = make({ jsonPath: '/a', docOrderIndex: 2, start: 0 })
    const later = make({ jsonPath: '/b', docOrderIndex: 7, start: 0 })
    expect(compareForCycler(earlier, later)).toBeLessThan(0)
  })

  it('breaks docOrderIndex ties by start position', () => {
    const earlier = make({ jsonPath: '/same', docOrderIndex: 5, start: 4 })
    const later = make({ jsonPath: '/same', docOrderIndex: 5, start: 12 })
    expect(compareForCycler(earlier, later)).toBeLessThan(0)
  })

  it('breaks docOrderIndex+start ties by createdAt ascending', () => {
    const earlier = make({
      jsonPath: '/same',
      docOrderIndex: 5,
      start: 0,
      createdAt: new Date('2026-05-01T00:00:00Z'),
    })
    const later = make({
      jsonPath: '/same',
      docOrderIndex: 5,
      start: 0,
      createdAt: new Date('2026-05-02T00:00:00Z'),
    })
    expect(compareForCycler(earlier, later)).toBeLessThan(0)
  })

  it('sorts two unanchored annotations by createdAt ascending', () => {
    const earlier = make({ createdAt: new Date('2026-04-01T00:00:00Z') })
    const later = make({ createdAt: new Date('2026-04-02T00:00:00Z') })
    expect(compareForCycler(earlier, later)).toBeLessThan(0)
  })

  it('sorts two unresolved anchored annotations by createdAt ascending', () => {
    const earlier = make({
      jsonPath: '/missing-a',
      docOrderIndex: null,
      createdAt: new Date('2026-04-01T00:00:00Z'),
    })
    const later = make({
      jsonPath: '/missing-b',
      docOrderIndex: null,
      createdAt: new Date('2026-04-02T00:00:00Z'),
    })
    expect(compareForCycler(earlier, later)).toBeLessThan(0)
  })

  it('accepts createdAt as an ISO string', () => {
    const a = make({ createdAt: '2026-04-01T00:00:00Z' })
    const b = make({ createdAt: '2026-04-02T00:00:00Z' })
    expect(compareForCycler(a, b)).toBeLessThan(0)
  })
})

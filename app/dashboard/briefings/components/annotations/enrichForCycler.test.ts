import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import type { Annotation } from '@shared/briefings/types'
import {
  enrichForCycler,
  findAnnotationPosition,
  predictNewAnnotationPosition,
} from './enrichForCycler'

const makeAnnotation = (over: Partial<Annotation> = {}): Annotation => ({
  id: over.id ?? 'a-1',
  kind: over.kind ?? 'note',
  resourceType: 'briefing',
  resourceId: 'r-1',
  authorUserId: 1,
  jsonPath: over.jsonPath ?? null,
  start: over.start ?? null,
  end: over.end ?? null,
  createdAt: over.createdAt ?? '2026-01-01T00:00:00Z',
  updatedAt: over.updatedAt ?? '2026-01-01T00:00:00Z',
  ...over,
})

describe('enrichForCycler', () => {
  afterEach(() => {
    document.body.innerHTML = ''
  })

  describe('kind filtering', () => {
    it('filters by kind when provided', () => {
      const note = makeAnnotation({ id: 'n', kind: 'note' })
      const bug = makeAnnotation({ id: 'b', kind: 'bug_report' })
      const chat = makeAnnotation({ id: 'c', kind: 'chat' })
      const result = enrichForCycler([note, bug, chat], 'note')
      expect(result).toHaveLength(1)
      expect(result[0]?.id).toBe('n')
    })

    it('returns all kinds when kind is omitted', () => {
      const note = makeAnnotation({ id: 'n', kind: 'note' })
      const bug = makeAnnotation({ id: 'b', kind: 'bug_report' })
      const chat = makeAnnotation({ id: 'c', kind: 'chat' })
      const result = enrichForCycler([note, bug, chat])
      expect(result).toHaveLength(3)
    })
  })

  it('returns [] for empty annotations[]', () => {
    expect(enrichForCycler([])).toEqual([])
    expect(enrichForCycler([], 'note')).toEqual([])
  })

  describe('SSR / no-DOM fallback', () => {
    it('returns annotations with null docOrderIndex and highlightedText, sorted by createdAt, when no anchor elements are present', () => {
      // No DOM anchors -> buildDomCache returns emptyCache, identical to SSR.
      document.body.innerHTML = ''
      const earlier = makeAnnotation({
        id: 'earlier',
        jsonPath: '/a',
        start: 0,
        end: 5,
        createdAt: '2026-01-01T00:00:00Z',
      })
      const later = makeAnnotation({
        id: 'later',
        jsonPath: '/b',
        start: 0,
        end: 3,
        createdAt: '2026-01-02T00:00:00Z',
      })
      const result = enrichForCycler([later, earlier])
      expect(result.map((a) => a.id)).toEqual(['earlier', 'later'])
      for (const a of result) {
        expect(a.docOrderIndex).toBeNull()
        expect(a.highlightedText).toBeNull()
      }
    })

    it('returns null enrichment when document is undefined (SSR)', () => {
      vi.stubGlobal('document', undefined)
      try {
        const a = makeAnnotation({
          id: 'a',
          jsonPath: '/x',
          start: 0,
          end: 5,
        })
        const result = enrichForCycler([a])
        expect(result).toHaveLength(1)
        expect(result[0]?.docOrderIndex).toBeNull()
        expect(result[0]?.highlightedText).toBeNull()
      } finally {
        vi.unstubAllGlobals()
      }
    })
  })

  describe('DOM resolution', () => {
    beforeEach(() => {
      document.body.innerHTML =
        '<span data-briefing-json-path="/a">Hello world</span>' +
        '<span data-briefing-json-path="/b">Bye</span>'
    })

    it('resolves docOrderIndex and highlightedText for an anchored annotation', () => {
      const a = makeAnnotation({
        id: 'a',
        jsonPath: '/a',
        start: 0,
        end: 5,
      })
      const [enriched] = enrichForCycler([a])
      expect(enriched?.docOrderIndex).toBe(0)
      expect(enriched?.highlightedText).toBe('Hello')
    })

    it('assigns docOrderIndex by document order across anchors', () => {
      const b = makeAnnotation({
        id: 'b',
        jsonPath: '/b',
        start: 0,
        end: 3,
      })
      const [enriched] = enrichForCycler([b])
      expect(enriched?.docOrderIndex).toBe(1)
      expect(enriched?.highlightedText).toBe('Bye')
    })

    it('returns null docOrderIndex and highlightedText for an unresolved jsonPath', () => {
      const a = makeAnnotation({
        id: 'missing',
        jsonPath: '/missing',
        start: 0,
        end: 3,
      })
      const [enriched] = enrichForCycler([a])
      expect(enriched?.docOrderIndex).toBeNull()
      expect(enriched?.highlightedText).toBeNull()
    })

    it('sorts unresolved annotations after resolved ones', () => {
      const resolved = makeAnnotation({
        id: 'resolved',
        jsonPath: '/a',
        start: 0,
        end: 5,
        createdAt: '2026-02-01T00:00:00Z',
      })
      const unresolved = makeAnnotation({
        id: 'unresolved',
        jsonPath: '/missing',
        start: 0,
        end: 3,
        createdAt: '2026-01-01T00:00:00Z',
      })
      const result = enrichForCycler([unresolved, resolved])
      expect(result.map((a) => a.id)).toEqual(['resolved', 'unresolved'])
    })
  })

  describe('duplicate jsonPath dedupe', () => {
    beforeEach(() => {
      document.body.innerHTML =
        '<span data-briefing-json-path="/dup">First</span>' +
        '<span data-briefing-json-path="/dup">Second</span>' +
        '<span data-briefing-json-path="/c">Third element</span>'
    })

    it('uses the first occurrence to resolve docOrderIndex on duplicate jsonPath', () => {
      const a = makeAnnotation({
        id: 'd',
        jsonPath: '/dup',
        start: 0,
        end: 5,
      })
      const [enriched] = enrichForCycler([a])
      expect(enriched?.docOrderIndex).toBe(0)
      expect(enriched?.highlightedText).toBe('First')
    })

    it('still resolves later anchors at their actual document index', () => {
      const a = makeAnnotation({
        id: 'c',
        jsonPath: '/c',
        start: 0,
        end: 5,
      })
      const [enriched] = enrichForCycler([a])
      expect(enriched?.docOrderIndex).toBe(2)
    })
  })

  describe('sort integration', () => {
    beforeEach(() => {
      document.body.innerHTML =
        '<span data-briefing-json-path="/first">AAAA</span>' +
        '<span data-briefing-json-path="/second">BBBB</span>'
    })

    it('orders unanchored first, then resolved by docOrderIndex asc, then unresolved by createdAt asc', () => {
      const unanchored = makeAnnotation({
        id: 'unanchored',
        jsonPath: null,
        createdAt: '2026-05-01T00:00:00Z',
      })
      const resolvedSecond = makeAnnotation({
        id: 'resolvedSecond',
        jsonPath: '/second',
        start: 0,
        end: 4,
        createdAt: '2026-01-01T00:00:00Z',
      })
      const resolvedFirst = makeAnnotation({
        id: 'resolvedFirst',
        jsonPath: '/first',
        start: 0,
        end: 4,
        createdAt: '2026-02-01T00:00:00Z',
      })
      const unresolvedEarlier = makeAnnotation({
        id: 'unresolvedEarlier',
        jsonPath: '/missing-a',
        start: 0,
        end: 2,
        createdAt: '2026-03-01T00:00:00Z',
      })
      const unresolvedLater = makeAnnotation({
        id: 'unresolvedLater',
        jsonPath: '/missing-b',
        start: 0,
        end: 2,
        createdAt: '2026-04-01T00:00:00Z',
      })

      const result = enrichForCycler([
        unresolvedLater,
        resolvedSecond,
        unanchored,
        unresolvedEarlier,
        resolvedFirst,
      ])

      expect(result.map((a) => a.id)).toEqual([
        'unanchored',
        'resolvedFirst',
        'resolvedSecond',
        'unresolvedEarlier',
        'unresolvedLater',
      ])
    })
  })
})

describe('predictNewAnnotationPosition', () => {
  afterEach(() => {
    document.body.innerHTML = ''
  })

  it('predicts last-in-bucket for a new unanchored note when only unanchored notes exist', () => {
    const existing = [
      makeAnnotation({
        id: 'u1',
        kind: 'note',
        jsonPath: null,
        createdAt: '2026-01-01T00:00:00Z',
      }),
      makeAnnotation({
        id: 'u2',
        kind: 'note',
        jsonPath: null,
        createdAt: '2026-01-02T00:00:00Z',
      }),
    ]
    const result = predictNewAnnotationPosition(existing, 'note', null)
    expect(result).toEqual({ position: 3, total: 3 })
  })

  it('predicts the new anchored note slots between earlier and later anchored notes by docOrderIndex', () => {
    document.body.innerHTML = `
      <div data-briefing-json-path="a">A</div>
      <div data-briefing-json-path="b">B</div>
      <div data-briefing-json-path="c">C</div>
    `
    const existing = [
      makeAnnotation({ id: 'na', kind: 'note', jsonPath: 'a', start: 0 }),
      makeAnnotation({ id: 'nc', kind: 'note', jsonPath: 'c', start: 0 }),
    ]
    const result = predictNewAnnotationPosition(existing, 'note', {
      jsonPath: 'b',
      start: 0,
    })
    expect(result).toEqual({ position: 2, total: 3 })
  })

  it('counts the new note as 1 of 1 when there are no existing notes', () => {
    const result = predictNewAnnotationPosition([], 'note', null)
    expect(result).toEqual({ position: 1, total: 1 })
  })

  it('ignores annotations of other kinds when counting', () => {
    const notes = [makeAnnotation({ id: 'n1', kind: 'note' })]
    const chat = makeAnnotation({ id: 'c1', kind: 'chat' })
    const result = predictNewAnnotationPosition([...notes, chat], 'note', null)
    expect(result).toEqual({ position: 2, total: 2 })
  })
})

describe('findAnnotationPosition', () => {
  afterEach(() => {
    document.body.innerHTML = ''
  })

  it('returns the 1-based position of an existing annotation in its kind-bucket order', () => {
    const a = makeAnnotation({
      id: 'a',
      kind: 'note',
      jsonPath: null,
      createdAt: '2026-01-01T00:00:00Z',
    })
    const b = makeAnnotation({
      id: 'b',
      kind: 'note',
      jsonPath: null,
      createdAt: '2026-01-02T00:00:00Z',
    })
    expect(findAnnotationPosition([a, b], 'note', 'b')).toEqual({
      position: 2,
      total: 2,
    })
  })

  it('returns null when the id is not found in the kind bucket', () => {
    const a = makeAnnotation({ id: 'a', kind: 'note' })
    expect(findAnnotationPosition([a], 'note', 'missing')).toBeNull()
  })
})

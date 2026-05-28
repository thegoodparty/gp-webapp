import { describe, expect, it } from 'vitest'
import type { Item } from '@shared/briefings/types'
import { sectionLabelFromPath } from './sectionLabel'

// Minimal `Item` factory — only `title` matters for the helper.
function makeItem(title: string): Item {
  return { title } as unknown as Item
}

describe('sectionLabelFromPath', () => {
  it('returns null for a null jsonPath', () => {
    expect(sectionLabelFromPath(null, undefined)).toBeNull()
  })

  it('returns "EXECUTIVE SUMMARY" for the canonical camelCase card path "/executiveSummary"', () => {
    // This is the form `ActiveCard.jsonPath` produces in
    // AnnotationsScope, and the form annotations save to the DB.
    expect(sectionLabelFromPath('/executiveSummary', undefined)).toBe(
      'EXECUTIVE SUMMARY',
    )
  })

  it('also accepts the snake_case form (passage selectors like "/executive_summary/title")', () => {
    expect(sectionLabelFromPath('/executive_summary/title', undefined)).toBe(
      'EXECUTIVE SUMMARY',
    )
  })

  it('returns the agenda item title (uppercased) for "/items/N" paths', () => {
    const items = [
      makeItem('Approval of agenda'),
      makeItem('Public comment'),
      makeItem('Rezoning vote'),
    ]
    expect(sectionLabelFromPath('/items/2', items)).toBe('REZONING VOTE')
    expect(sectionLabelFromPath('/items/0/title', items)).toBe(
      'APPROVAL OF AGENDA',
    )
  })

  it('returns null when the items index is out of range', () => {
    expect(sectionLabelFromPath('/items/42', [makeItem('only')])).toBeNull()
  })

  it('returns null for an unknown path shape', () => {
    expect(sectionLabelFromPath('/something/else', undefined)).toBeNull()
  })
})

import { beforeEach, describe, expect, it, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import type { Annotation } from '@shared/briefings/types'
import { NotesSurface } from './NotesSurface'

beforeEach(() => {
  Element.prototype.scrollIntoView = vi.fn()
})

function makeNote(overrides: Partial<Annotation> = {}): Annotation {
  return {
    id: overrides.id ?? 'note-1',
    kind: 'note',
    resourceType: 'briefing',
    resourceId: 'briefing_1',
    authorUserId: 42,
    jsonPath: null,
    start: null,
    end: null,
    createdAt: '2026-05-01T12:00:00.000Z',
    updatedAt: '2026-05-01T12:00:00.000Z',
    note: {
      id: overrides.note?.id ?? 'note-data-1',
      body: overrides.note?.body ?? 'Note body text',
      attachments: [],
      createdAt: '2026-05-01T12:00:00.000Z',
      updatedAt: '2026-05-01T12:00:00.000Z',
    },
    ...overrides,
  }
}

describe('NotesSurface', () => {
  it('renders the empty state copy when there are no notes', () => {
    render(
      <NotesSurface
        open
        onClose={() => {}}
        annotations={[]}
        onEditNote={() => {}}
      />,
    )
    expect(screen.getByText(/no notes yet/i)).toBeInTheDocument()
  })

  it('renders the note body when one note is present', () => {
    const note = makeNote({
      id: 'n1',
      note: {
        id: 'd1',
        body: 'Door-knocking takeaway for ward 3.',
        attachments: [],
        createdAt: '2026-05-01T12:00:00.000Z',
        updatedAt: '2026-05-01T12:00:00.000Z',
      },
    })
    render(
      <NotesSurface
        open
        onClose={() => {}}
        annotations={[note]}
        onEditNote={() => {}}
      />,
    )
    expect(
      screen.getByText('Door-knocking takeaway for ward 3.'),
    ).toBeInTheDocument()
  })

  it('calls onEditNote with the currently-displayed annotation after cycling', async () => {
    const noteA = makeNote({
      id: 'note-a',
      createdAt: '2026-05-01T10:00:00.000Z',
      note: {
        id: 'data-a',
        body: 'First note body',
        attachments: [],
        createdAt: '2026-05-01T10:00:00.000Z',
        updatedAt: '2026-05-01T10:00:00.000Z',
      },
    })
    const noteB = makeNote({
      id: 'note-b',
      createdAt: '2026-05-01T11:00:00.000Z',
      note: {
        id: 'data-b',
        body: 'Second note body',
        attachments: [],
        createdAt: '2026-05-01T11:00:00.000Z',
        updatedAt: '2026-05-01T11:00:00.000Z',
      },
    })

    const onEditNote = vi.fn()
    const user = userEvent.setup()
    render(
      <NotesSurface
        open
        onClose={() => {}}
        annotations={[noteA, noteB]}
        onEditNote={onEditNote}
      />,
    )

    await user.click(screen.getByRole('button', { name: /next/i }))

    expect(screen.getByText('Second note body')).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: /edit note/i }))

    expect(onEditNote).toHaveBeenCalledTimes(1)
    expect(onEditNote.mock.calls[0]?.[0]).toMatchObject({ id: 'note-b' })
  })
})

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import type { Annotation } from '@shared/briefings/types'
import { NotesSurface } from './NotesSurface'

beforeEach(() => {
  Element.prototype.scrollIntoView = vi.fn()
})

afterEach(() => {
  vi.useRealTimers()
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
        onClose={vi.fn()}
        annotations={[]}
        onEditNote={vi.fn()}
        onDeleteNote={vi.fn()}
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
        onClose={vi.fn()}
        annotations={[note]}
        onEditNote={vi.fn()}
        onDeleteNote={vi.fn()}
      />,
    )
    expect(
      screen.getByText('Door-knocking takeaway for ward 3.'),
    ).toBeInTheDocument()
  })

  describe('Delete confirmation', () => {
    it('opens a confirm dialog instead of deleting immediately when Delete is clicked', async () => {
      const onDeleteNote = vi.fn()
      const user = userEvent.setup()
      render(
        <NotesSurface
          open
          onClose={vi.fn()}
          annotations={[makeNote()]}
          onEditNote={vi.fn()}
          onDeleteNote={onDeleteNote}
        />,
      )

      await user.click(screen.getByRole('button', { name: /delete note/i }))

      await screen.findByRole('alertdialog')
      expect(
        screen.getByRole('heading', { name: /delete this note\?/i }),
      ).toBeInTheDocument()
      expect(screen.getByText(/can't undo this/i)).toBeInTheDocument()
      expect(onDeleteNote).not.toHaveBeenCalled()
    })

    it('closes the dialog and does not invoke onDeleteNote when Cancel is clicked', async () => {
      const onDeleteNote = vi.fn()
      const user = userEvent.setup()
      render(
        <NotesSurface
          open
          onClose={vi.fn()}
          annotations={[makeNote()]}
          onEditNote={vi.fn()}
          onDeleteNote={onDeleteNote}
        />,
      )

      await user.click(screen.getByRole('button', { name: /delete note/i }))
      await screen.findByRole('alertdialog')
      await user.click(screen.getByRole('button', { name: /cancel/i }))

      expect(screen.queryByRole('alertdialog')).not.toBeInTheDocument()
      expect(onDeleteNote).not.toHaveBeenCalled()
    })

    it('invokes onDeleteNote with the focused annotation when the destructive confirm is clicked', async () => {
      const noteA = makeNote({
        id: 'note-a',
        createdAt: '2026-05-01T10:00:00.000Z',
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
      const onDeleteNote = vi.fn()
      const user = userEvent.setup()
      render(
        <NotesSurface
          open
          onClose={vi.fn()}
          annotations={[noteA, noteB]}
          onEditNote={vi.fn()}
          onDeleteNote={onDeleteNote}
        />,
      )

      await user.click(screen.getByRole('button', { name: /next/i }))
      await user.click(screen.getByRole('button', { name: /delete note/i }))
      const dialog = await screen.findByRole('alertdialog')
      const confirm = within(dialog).getByRole('button', { name: /^delete$/i })
      await user.click(confirm)

      expect(onDeleteNote).toHaveBeenCalledTimes(1)
      expect(onDeleteNote.mock.calls[0]?.[0]).toMatchObject({ id: 'note-b' })
      expect(screen.queryByRole('alertdialog')).not.toBeInTheDocument()
    })
  })

  describe('Relative time formatting', () => {
    it('renders date-fns "about N hours ago" output for a note updated ~3 hours ago', () => {
      const now = new Date('2026-05-26T12:00:00.000Z')
      vi.useFakeTimers()
      vi.setSystemTime(now)
      const threeHoursAgo = new Date(now.getTime() - 3 * 60 * 60 * 1000)
      const note = makeNote({
        updatedAt: threeHoursAgo.toISOString(),
        note: {
          id: 'd-time',
          body: 'A note from a few hours ago',
          attachments: [],
          createdAt: threeHoursAgo.toISOString(),
          updatedAt: threeHoursAgo.toISOString(),
        },
      })

      render(
        <NotesSurface
          open
          onClose={vi.fn()}
          annotations={[note]}
          onEditNote={vi.fn()}
          onDeleteNote={vi.fn()}
        />,
      )

      expect(screen.getByText(/about 3 hours ago/i)).toBeInTheDocument()
    })

    it('never shows a negative duration when updatedAt is in the future (clock skew)', () => {
      const now = new Date('2026-05-26T12:00:00.000Z')
      vi.useFakeTimers()
      vi.setSystemTime(now)
      // Use 2 hours in the future — large enough to bypass the current
      // implementation's `if (minutes < 1) return 'just now'` short-circuit
      // and surface the negative-number bug (which would produce "-2h ago").
      const twoHoursInFuture = new Date(now.getTime() + 2 * 60 * 60 * 1000)
      const note = makeNote({
        updatedAt: twoHoursInFuture.toISOString(),
        note: {
          id: 'd-skew',
          body: 'A note with skewed timestamp',
          attachments: [],
          createdAt: twoHoursInFuture.toISOString(),
          updatedAt: twoHoursInFuture.toISOString(),
        },
      })

      render(
        <NotesSurface
          open
          onClose={vi.fn()}
          annotations={[note]}
          onEditNote={vi.fn()}
          onDeleteNote={vi.fn()}
        />,
      )

      expect(screen.queryByText(/-\d+\s*m\s*ago/i)).not.toBeInTheDocument()
      expect(screen.queryByText(/-\d+\s*h\s*ago/i)).not.toBeInTheDocument()
      expect(screen.queryByText(/-\d+\s*d\s*ago/i)).not.toBeInTheDocument()
      // Future timestamps should produce `date-fns` "in ..." output.
      expect(screen.getByText(/^in\s+/i)).toBeInTheDocument()
    })
  })

  describe('Footer buttons', () => {
    it('does not render an "Add attachment" button in the footer', () => {
      render(
        <NotesSurface
          open
          onClose={vi.fn()}
          annotations={[makeNote()]}
          onEditNote={vi.fn()}
          onDeleteNote={vi.fn()}
        />,
      )

      expect(
        screen.queryByRole('button', { name: /add attachment/i }),
      ).not.toBeInTheDocument()
      expect(
        screen.getByRole('button', { name: /edit note/i }),
      ).toBeInTheDocument()
      expect(
        screen.getByRole('button', { name: /delete note/i }),
      ).toBeInTheDocument()
    })
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
        onClose={vi.fn()}
        annotations={[noteA, noteB]}
        onEditNote={onEditNote}
        onDeleteNote={vi.fn()}
      />,
    )

    await user.click(screen.getByRole('button', { name: /next/i }))

    expect(screen.getByText('Second note body')).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: /edit note/i }))

    expect(onEditNote).toHaveBeenCalledTimes(1)
    expect(onEditNote.mock.calls[0]?.[0]).toMatchObject({ id: 'note-b' })
  })
})

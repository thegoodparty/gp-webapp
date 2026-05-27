import { describe, expect, it, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import AddNoteSheet from './AddNoteSheet'
import type { Annotation } from '@shared/briefings/types'
import type { SheetState } from './AnnotationsScope'

vi.mock('@styleguide/hooks/use-mobile', () => ({
  useIsMobile: vi.fn(() => false),
}))

const reportErrorToSentryMock = vi.fn()
vi.mock('@shared/sentry', () => ({
  reportErrorToSentry: (...args: unknown[]) => reportErrorToSentryMock(...args),
}))

function makeEditAnnotation(body = 'existing note body'): Annotation {
  return {
    id: 'ann_edit_1',
    kind: 'note',
    resourceType: 'briefing',
    resourceId: 'briefing_1',
    authorUserId: 1,
    jsonPath: 'path.a',
    start: 0,
    end: 5,
    createdAt: '2026-05-26T00:00:00.000Z',
    updatedAt: '2026-05-26T00:00:00.000Z',
    note: {
      id: 'note_1',
      body,
      attachments: [],
      createdAt: '2026-05-26T00:00:00.000Z',
      updatedAt: '2026-05-26T00:00:00.000Z',
    },
  }
}

describe('<AddNoteSheet> error surfacing', () => {
  it('shows an inline error when onCreate rejects, keeps the sheet open, preserves the body, and reports to Sentry', async () => {
    reportErrorToSentryMock.mockReset()
    const user = userEvent.setup()
    const onClose = vi.fn()
    const onCreate = vi.fn().mockRejectedValue(new Error('boom'))
    const onUpdate = vi.fn()
    const onDelete = vi.fn()

    const sheet: SheetState = { kind: 'add_note_new', anchor: null }

    render(
      <AddNoteSheet
        sheet={sheet}
        position={null}
        onClose={onClose}
        onCreate={onCreate}
        onUpdate={onUpdate}
        onDelete={onDelete}
        onAttachmentAdd={vi.fn()}
        onAttachmentDelete={vi.fn()}
        topLevelNotes={[]}
        onEditNote={vi.fn()}
      />,
    )

    const textarea = await screen.findByPlaceholderText(/write your note/i)
    await user.type(textarea, 'a new note')

    await user.click(screen.getByRole('button', { name: /^save$/i }))

    const alert = await screen.findByRole('alert')
    expect(alert).toHaveTextContent(/couldn't save your note/i)
    expect(onClose).not.toHaveBeenCalled()
    expect((textarea as HTMLTextAreaElement).value).toBe('a new note')
    expect(reportErrorToSentryMock).toHaveBeenCalledTimes(1)
  })

  it('shows an inline error when onUpdate rejects in edit mode, keeps the sheet open, preserves the body, and reports to Sentry', async () => {
    reportErrorToSentryMock.mockReset()
    const user = userEvent.setup()
    const onClose = vi.fn()
    const onCreate = vi.fn()
    const onUpdate = vi.fn().mockRejectedValue(new Error('boom'))
    const onDelete = vi.fn()

    const sheet: SheetState = {
      kind: 'add_note_edit',
      annotation: makeEditAnnotation('original body'),
    }

    render(
      <AddNoteSheet
        sheet={sheet}
        position={null}
        onClose={onClose}
        onCreate={onCreate}
        onUpdate={onUpdate}
        onDelete={onDelete}
        onAttachmentAdd={vi.fn()}
        onAttachmentDelete={vi.fn()}
        topLevelNotes={[]}
        onEditNote={vi.fn()}
      />,
    )

    const textarea = await screen.findByPlaceholderText(/write your note/i)
    await user.clear(textarea)
    await user.type(textarea, 'edited body')

    await user.click(screen.getByRole('button', { name: /^save$/i }))

    const alert = await screen.findByRole('alert')
    expect(alert).toHaveTextContent(/couldn't save your note/i)
    expect(onClose).not.toHaveBeenCalled()
    expect((textarea as HTMLTextAreaElement).value).toBe('edited body')
    expect(reportErrorToSentryMock).toHaveBeenCalledTimes(1)
  })

  it('shows an inline error when onDelete rejects, keeps the sheet open, and reports to Sentry', async () => {
    reportErrorToSentryMock.mockReset()
    const user = userEvent.setup()
    const onClose = vi.fn()
    const onCreate = vi.fn()
    const onUpdate = vi.fn()
    const onDelete = vi.fn().mockRejectedValue(new Error('boom'))

    const sheet: SheetState = {
      kind: 'add_note_edit',
      annotation: makeEditAnnotation('original body'),
    }

    render(
      <AddNoteSheet
        sheet={sheet}
        position={null}
        onClose={onClose}
        onCreate={onCreate}
        onUpdate={onUpdate}
        onDelete={onDelete}
        onAttachmentAdd={vi.fn()}
        onAttachmentDelete={vi.fn()}
        topLevelNotes={[]}
        onEditNote={vi.fn()}
      />,
    )

    await user.click(screen.getByRole('button', { name: /delete note/i }))

    const alert = await screen.findByRole('alert')
    expect(alert).toHaveTextContent(/couldn't delete this note/i)
    expect(onClose).not.toHaveBeenCalled()
    expect(reportErrorToSentryMock).toHaveBeenCalledTimes(1)
  })
})

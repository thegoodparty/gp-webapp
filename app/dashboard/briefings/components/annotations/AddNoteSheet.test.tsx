import { describe, expect, it, vi } from 'vitest'
import { screen } from '@testing-library/react'
import { render } from 'helpers/test-utils/render'
import userEvent from '@testing-library/user-event'
import AddNoteSheet from './AddNoteSheet'
import type {
  Annotation,
  AnnotationNoteAttachmentData,
} from '@shared/briefings/types'
import type { SheetState } from './AnnotationsScope'

vi.mock('@styleguide/hooks/use-mobile', () => ({
  useIsMobile: vi.fn(() => false),
}))

const reportErrorToSentryMock = vi.fn()
vi.mock('@shared/sentry', () => ({
  reportErrorToSentry: (...args: unknown[]) => reportErrorToSentryMock(...args),
}))

function makeEditAnnotation(
  body = 'existing note body',
  attachments: AnnotationNoteAttachmentData[] = [],
): Annotation {
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
      attachments,
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
        activeCardTitle="Executive Summary"
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
        activeCardTitle="Executive Summary"
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
        activeCardTitle="Executive Summary"
      />,
    )

    await user.click(screen.getByRole('button', { name: /delete note/i }))

    const alert = await screen.findByRole('alert')
    expect(alert).toHaveTextContent(/couldn't delete this note/i)
    expect(onClose).not.toHaveBeenCalled()
    expect(reportErrorToSentryMock).toHaveBeenCalledTimes(1)
  })
})

describe('<AddNoteSheet> edit-mode attachment error reporting', () => {
  it('reports to Sentry when onAttachmentAdd rejects in edit mode and surfaces an inline error', async () => {
    reportErrorToSentryMock.mockReset()
    const user = userEvent.setup()

    const onAttachmentAdd = vi
      .fn<(annotationId: string, file: File) => Promise<void>>()
      .mockRejectedValue(new Error('upload failed'))

    const annotation = makeEditAnnotation('original body')
    const sheet: SheetState = { kind: 'add_note_edit', annotation }

    render(
      <AddNoteSheet
        sheet={sheet}
        position={null}
        onClose={vi.fn()}
        onCreate={vi.fn()}
        onUpdate={vi.fn()}
        onDelete={vi.fn()}
        onAttachmentAdd={onAttachmentAdd}
        onAttachmentDelete={vi.fn()}
        activeCardTitle="Executive Summary"
      />,
    )

    // Desktop path (useIsMobile mocked to false): clicking the "Add
    // attachment" button triggers the hidden desktop input. Upload
    // directly to that input to drive onAttachmentAdd through its
    // catch path. The Drawer renders into a portal under document.body,
    // so query at document level rather than the render container.
    const fileInputs = document.body.querySelectorAll('input[type="file"]')
    const desktopInput = fileInputs[0] as HTMLInputElement
    expect(desktopInput).toBeDefined()
    const file = new File(['hello'], 'doc.pdf', { type: 'application/pdf' })
    await user.upload(desktopInput, file)

    await screen.findByText(/couldn't upload doc\.pdf/i)
    expect(onAttachmentAdd).toHaveBeenCalledWith(annotation.id, file)
    expect(reportErrorToSentryMock).toHaveBeenCalledTimes(1)
    expect(reportErrorToSentryMock).toHaveBeenCalledWith(expect.any(Error), {
      surface: 'briefing-annotations',
      op: 'uploadAttachment',
      annotationId: annotation.id,
      fileName: 'doc.pdf',
    })
  })

  it('reports to Sentry when onAttachmentDelete rejects in edit mode and surfaces an inline error', async () => {
    reportErrorToSentryMock.mockReset()
    const user = userEvent.setup()

    const onAttachmentDelete = vi
      .fn<(annotationId: string, attachmentId: string) => Promise<void>>()
      .mockRejectedValue(new Error('delete failed'))

    const existingAttachment: AnnotationNoteAttachmentData = {
      id: 'att_1',
      fileName: 'photo.jpg',
      mimeType: 'image/jpeg',
      sizeBytes: 1234,
      ocrStatus: 'completed',
      ocrText: null,
      ocrError: null,
      ocrCompletedAt: null,
      createdAt: '2026-05-26T00:00:00.000Z',
    }

    const annotation = makeEditAnnotation('original body', [existingAttachment])
    const sheet: SheetState = { kind: 'add_note_edit', annotation }

    render(
      <AddNoteSheet
        sheet={sheet}
        position={null}
        onClose={vi.fn()}
        onCreate={vi.fn()}
        onUpdate={vi.fn()}
        onDelete={vi.fn()}
        onAttachmentAdd={vi.fn()}
        onAttachmentDelete={onAttachmentDelete}
        activeCardTitle="Executive Summary"
      />,
    )

    const removeBtn = await screen.findByRole('button', {
      name: /remove photo\.jpg/i,
    })
    await user.click(removeBtn)

    await screen.findByText(/couldn't remove attachment/i)
    expect(onAttachmentDelete).toHaveBeenCalledWith(
      annotation.id,
      existingAttachment.id,
    )
    expect(reportErrorToSentryMock).toHaveBeenCalledTimes(1)
    expect(reportErrorToSentryMock).toHaveBeenCalledWith(expect.any(Error), {
      surface: 'briefing-annotations',
      op: 'deleteAttachment',
      annotationId: annotation.id,
    })
  })
})

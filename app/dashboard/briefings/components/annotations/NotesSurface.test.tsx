import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { render } from 'helpers/test-utils/render'
import type {
  Annotation,
  AnnotationNoteAttachmentData,
} from '@shared/briefings/types'
import { NotesSurface } from './NotesSurface'

vi.mock('@styleguide/hooks/use-mobile', () => ({
  useIsMobile: vi.fn(() => false),
}))

const reportErrorToSentryMock = vi.fn()
vi.mock('@shared/sentry', () => ({
  reportErrorToSentry: (...args: unknown[]) => reportErrorToSentryMock(...args),
}))

// AttachmentThumbnail fetches a presigned S3 GET URL via React Query when
// it sees a server attachment. Stub the hook so the test doesn't make a
// real network call and the anchor / image render synchronously off the
// hook's `data`.
vi.mock('@shared/briefings/use-attachment-download-url', () => ({
  useAttachmentDownloadUrl: (annotationId: string, attachmentId: string) => ({
    data: {
      url: `https://s3.example/${annotationId}/${attachmentId}.signed`,
      expiresAt: '2026-05-26T13:00:00.000Z',
    },
    isPending: false,
  }),
}))

beforeEach(() => {
  Element.prototype.scrollIntoView = vi.fn()
  reportErrorToSentryMock.mockReset()
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
        onSaveEdit={vi.fn(() => Promise.resolve())}
        onUploadAttachment={vi.fn(() => Promise.resolve())}
        onDeleteAttachment={vi.fn(() => Promise.resolve())}
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
        onSaveEdit={vi.fn(() => Promise.resolve())}
        onUploadAttachment={vi.fn(() => Promise.resolve())}
        onDeleteAttachment={vi.fn(() => Promise.resolve())}
        onDeleteNote={vi.fn()}
      />,
    )
    expect(
      screen.getByText('Door-knocking takeaway for ward 3.'),
    ).toBeInTheDocument()
  })

  describe('Card-level section header', () => {
    // Anchored notes already render the AnchoredQuote with a label. For
    // card-level notes (jsonPath set, no quote/offsets), we still want
    // the uppercase section label so the user can see which card the
    // note is attached to as they cycle.
    it('renders the section label for a card-level note on the executive summary (no highlightedText)', () => {
      const note: Annotation = {
        ...makeNote(),
        id: 'card-level-exec',
        // Canonical card jsonPath (camelCase) — matches what
        // `ActiveCard.jsonPath` and the create flow store on the DB.
        jsonPath: '/executiveSummary',
        start: null,
        end: null,
      }
      render(
        <NotesSurface
          open
          onClose={vi.fn()}
          annotations={[note]}
          onSaveEdit={vi.fn(() => Promise.resolve())}
          onUploadAttachment={vi.fn(() => Promise.resolve())}
          onDeleteAttachment={vi.fn(() => Promise.resolve())}
          onDeleteNote={vi.fn()}
        />,
      )

      expect(screen.getByText('EXECUTIVE SUMMARY')).toBeInTheDocument()
      // No anchored-quote glyph since there's no highlighted text.
      expect(screen.queryByText(/“/)).not.toBeInTheDocument()
    })
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
          onSaveEdit={vi.fn(() => Promise.resolve())}
          onUploadAttachment={vi.fn(() => Promise.resolve())}
          onDeleteAttachment={vi.fn(() => Promise.resolve())}
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
          onSaveEdit={vi.fn(() => Promise.resolve())}
          onUploadAttachment={vi.fn(() => Promise.resolve())}
          onDeleteAttachment={vi.fn(() => Promise.resolve())}
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
          onSaveEdit={vi.fn(() => Promise.resolve())}
          onUploadAttachment={vi.fn(() => Promise.resolve())}
          onDeleteAttachment={vi.fn(() => Promise.resolve())}
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
          onSaveEdit={vi.fn(() => Promise.resolve())}
          onUploadAttachment={vi.fn(() => Promise.resolve())}
          onDeleteAttachment={vi.fn(() => Promise.resolve())}
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
          onSaveEdit={vi.fn(() => Promise.resolve())}
          onUploadAttachment={vi.fn(() => Promise.resolve())}
          onDeleteAttachment={vi.fn(() => Promise.resolve())}
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

  describe('Server attachments', () => {
    const imageAttachment: AnnotationNoteAttachmentData = {
      id: 'att-img-1',
      fileName: 'photo.jpg',
      mimeType: 'image/jpeg',
      sizeBytes: 1024,
      ocrStatus: 'completed',
      ocrText: null,
      ocrError: null,
      ocrCompletedAt: null,
      createdAt: '2026-05-01T12:00:00.000Z',
    }

    it('renders an image attachment thumbnail with the presigned URL resolved off useAttachmentDownloadUrl', () => {
      const note = makeNote({
        id: 'note-with-image',
        note: {
          id: 'data-with-image',
          body: 'Photo attached',
          attachments: [imageAttachment],
          createdAt: '2026-05-01T12:00:00.000Z',
          updatedAt: '2026-05-01T12:00:00.000Z',
        },
      })
      render(
        <NotesSurface
          open
          onClose={vi.fn()}
          annotations={[note]}
          onSaveEdit={vi.fn(() => Promise.resolve())}
          onUploadAttachment={vi.fn(() => Promise.resolve())}
          onDeleteAttachment={vi.fn(() => Promise.resolve())}
          onDeleteNote={vi.fn()}
        />,
      )

      const link = screen.getByRole('link', { name: /open photo\.jpg/i })
      expect(link).toHaveAttribute(
        'href',
        'https://s3.example/note-with-image/att-img-1.signed',
      )
      expect(link).toHaveAttribute('target', '_blank')
      const img = within(link).getByRole('img', { name: 'photo.jpg' })
      expect(img).toHaveAttribute(
        'src',
        'https://s3.example/note-with-image/att-img-1.signed',
      )
      expect(screen.getByText('photo.jpg')).toBeInTheDocument()
    })
  })

  describe('Header', () => {
    it('renders the "Note" panel title on desktop (matches Lovable design)', () => {
      render(
        <NotesSurface
          open
          onClose={vi.fn()}
          annotations={[makeNote()]}
          onSaveEdit={vi.fn(() => Promise.resolve())}
          onUploadAttachment={vi.fn(() => Promise.resolve())}
          onDeleteAttachment={vi.fn(() => Promise.resolve())}
          onDeleteNote={vi.fn()}
        />,
      )

      // The visible big heading; sr-only DrawerTitle ("Notes") is separate.
      const titles = screen.getAllByText(/^Note$/)
      expect(titles.some((el) => !el.classList.contains('sr-only'))).toBe(true)
    })

    it('does not render a visible "Note" panel title on mobile (sr-only label only)', async () => {
      // Multiple components in the render tree call useIsMobile()
      // (NotesSurface + AnnotationSurfaceSheet at minimum). mockReturnValueOnce
      // only covers the first call, so use mockReturnValue to make every call
      // in this test return true.
      const useMobile = await import('@styleguide/hooks/use-mobile')
      const useIsMobileMock = vi.mocked(useMobile.useIsMobile)
      useIsMobileMock.mockReturnValue(true)

      render(
        <NotesSurface
          open
          onClose={vi.fn()}
          annotations={[makeNote()]}
          onSaveEdit={vi.fn(() => Promise.resolve())}
          onUploadAttachment={vi.fn(() => Promise.resolve())}
          onDeleteAttachment={vi.fn(() => Promise.resolve())}
          onDeleteNote={vi.fn()}
        />,
      )

      // Mobile drops the visible big heading. The Radix DrawerTitle uses
      // the accessibleTitle ("Notes" — note the plural) for a11y, so no
      // element with text exactly "Note" should render on mobile. Pair the
      // negative assertion with a positive one on the plural sr-only title
      // to prove the surface actually rendered (otherwise the negative
      // assertion could pass vacuously on an empty tree).
      expect(screen.queryByText(/^Note$/)).not.toBeInTheDocument()
      expect(screen.getByText(/^Notes$/)).toHaveClass('sr-only')

      // Restore the default so subsequent tests in this file get the
      // desktop branch (mockReturnValue persists across tests otherwise).
      useIsMobileMock.mockReturnValue(false)
    })
  })

  describe('Footer buttons', () => {
    it('renders Add attachment, Edit Note, and Delete note in the viewer footer', () => {
      render(
        <NotesSurface
          open
          onClose={vi.fn()}
          annotations={[makeNote()]}
          onSaveEdit={vi.fn(() => Promise.resolve())}
          onUploadAttachment={vi.fn(() => Promise.resolve())}
          onDeleteAttachment={vi.fn(() => Promise.resolve())}
          onDeleteNote={vi.fn()}
        />,
      )

      expect(
        screen.getByRole('button', { name: /add attachment/i }),
      ).toBeInTheDocument()
      expect(
        screen.getByRole('button', { name: /edit note/i }),
      ).toBeInTheDocument()
      expect(
        screen.getByRole('button', { name: /delete note/i }),
      ).toBeInTheDocument()
    })
  })

  describe('Delete attachment', () => {
    it('invokes onDeleteAttachment with (annotationId, attachmentId) when the remove button on an attachment pill is clicked', async () => {
      const onDeleteAttachment = vi.fn(() => Promise.resolve())
      const user = userEvent.setup()
      const noteWithAttachment = makeNote({
        id: 'note-with-att',
        note: {
          id: 'd-att',
          body: 'Note that has an attachment',
          attachments: [
            {
              id: 'att-xyz',
              fileName: 'photo.png',
              mimeType: 'image/png',
              sizeBytes: 1234,
              ocrStatus: 'completed',
              ocrText: null,
              ocrError: null,
              ocrCompletedAt: null,
              createdAt: '2026-05-01T12:00:00.000Z',
            },
          ],
          createdAt: '2026-05-01T12:00:00.000Z',
          updatedAt: '2026-05-01T12:00:00.000Z',
        },
      })

      render(
        <NotesSurface
          open
          onClose={vi.fn()}
          annotations={[noteWithAttachment]}
          onSaveEdit={vi.fn(() => Promise.resolve())}
          onUploadAttachment={vi.fn(() => Promise.resolve())}
          onDeleteAttachment={onDeleteAttachment}
          onDeleteNote={vi.fn()}
        />,
      )

      await user.click(
        screen.getByRole('button', { name: /remove photo\.png/i }),
      )

      expect(onDeleteAttachment).toHaveBeenCalledTimes(1)
      expect(onDeleteAttachment.mock.calls[0]).toEqual([
        'note-with-att',
        'att-xyz',
      ])
    })
  })

  describe('Edit Note in-place', () => {
    it('clicking Edit Note swaps the note body for a textarea with Save/Cancel; Add attachment + Edit Note hide, Delete note stays', async () => {
      const user = userEvent.setup()
      render(
        <NotesSurface
          open
          onClose={vi.fn()}
          annotations={[
            makeNote({
              note: {
                id: 'd',
                body: 'original body',
                attachments: [],
                createdAt: '',
                updatedAt: '',
              },
            }),
          ]}
          onSaveEdit={vi.fn(() => Promise.resolve())}
          onUploadAttachment={vi.fn(() => Promise.resolve())}
          onDeleteAttachment={vi.fn(() => Promise.resolve())}
          onDeleteNote={vi.fn()}
        />,
      )

      await user.click(screen.getByRole('button', { name: /edit note/i }))

      const textarea = screen.getByPlaceholderText(/write a note/i)
      expect((textarea as HTMLTextAreaElement).value).toBe('original body')
      expect(
        screen.getByRole('button', { name: /^save$/i }),
      ).toBeInTheDocument()
      expect(
        screen.getByRole('button', { name: /^cancel$/i }),
      ).toBeInTheDocument()
      // Footer Add attachment + Edit Note are hidden while editing
      expect(
        screen.queryByRole('button', { name: /^edit note$/i }),
      ).not.toBeInTheDocument()
      expect(
        screen.queryByRole('button', { name: /add attachment/i }),
      ).not.toBeInTheDocument()
      // Delete note STAYS visible during edit (matches Lovable)
      expect(
        screen.getByRole('button', { name: /delete note/i }),
      ).toBeInTheDocument()
    })

    it('Save is disabled when the body is empty or whitespace-only', async () => {
      const user = userEvent.setup()
      const onSaveEdit = vi.fn(() => Promise.resolve())
      render(
        <NotesSurface
          open
          onClose={vi.fn()}
          annotations={[
            makeNote({
              note: {
                id: 'd',
                body: 'orig',
                attachments: [],
                createdAt: '',
                updatedAt: '',
              },
            }),
          ]}
          onSaveEdit={onSaveEdit}
          onUploadAttachment={vi.fn(() => Promise.resolve())}
          onDeleteAttachment={vi.fn(() => Promise.resolve())}
          onDeleteNote={vi.fn()}
        />,
      )

      await user.click(screen.getByRole('button', { name: /edit note/i }))
      const textarea = screen.getByPlaceholderText(
        /write a note/i,
      ) as HTMLTextAreaElement
      await user.clear(textarea)
      const save = screen.getByRole('button', { name: /^save$/i })
      expect(save).toBeDisabled()
      await user.type(textarea, '   ')
      expect(save).toBeDisabled()
      await user.click(save)
      expect(onSaveEdit).not.toHaveBeenCalled()
    })

    it('keeps the card in edit mode and surfaces the error when onSaveEdit rejects', async () => {
      const user = userEvent.setup()
      const onSaveEdit = vi.fn(() => Promise.reject(new Error('network down')))
      render(
        <NotesSurface
          open
          onClose={vi.fn()}
          annotations={[
            makeNote({
              note: {
                id: 'd',
                body: 'orig',
                attachments: [],
                createdAt: '',
                updatedAt: '',
              },
            }),
          ]}
          onSaveEdit={onSaveEdit}
          onUploadAttachment={vi.fn(() => Promise.resolve())}
          onDeleteAttachment={vi.fn(() => Promise.resolve())}
          onDeleteNote={vi.fn()}
        />,
      )

      await user.click(screen.getByRole('button', { name: /edit note/i }))
      const textarea = screen.getByPlaceholderText(
        /write a note/i,
      ) as HTMLTextAreaElement
      await user.clear(textarea)
      await user.type(textarea, 'updated body')
      await user.click(screen.getByRole('button', { name: /^save$/i }))

      const alert = await screen.findByRole('alert')
      expect(alert.textContent).toMatch(/network down/i)
      // Still in edit mode — textarea + Save/Cancel still rendered, draft preserved.
      expect(
        (screen.getByPlaceholderText(/write a note/i) as HTMLTextAreaElement)
          .value,
      ).toBe('updated body')
      expect(
        screen.getByRole('button', { name: /^save$/i }),
      ).toBeInTheDocument()
    })

    it('Save commits the edit by calling onSaveEdit with the updated body', async () => {
      const user = userEvent.setup()
      const onSaveEdit = vi.fn(() => Promise.resolve())
      render(
        <NotesSurface
          open
          onClose={vi.fn()}
          annotations={[
            makeNote({
              id: 'n1',
              note: {
                id: 'd',
                body: 'orig',
                attachments: [],
                createdAt: '',
                updatedAt: '',
              },
            }),
          ]}
          onSaveEdit={onSaveEdit}
          onUploadAttachment={vi.fn(() => Promise.resolve())}
          onDeleteAttachment={vi.fn(() => Promise.resolve())}
          onDeleteNote={vi.fn()}
        />,
      )

      await user.click(screen.getByRole('button', { name: /edit note/i }))
      const textarea = screen.getByPlaceholderText(
        /write a note/i,
      ) as HTMLTextAreaElement
      await user.clear(textarea)
      await user.type(textarea, 'edited body')
      await user.click(screen.getByRole('button', { name: /^save$/i }))

      expect(onSaveEdit).toHaveBeenCalledTimes(1)
      expect(onSaveEdit.mock.calls[0]).toEqual(['n1', 'edited body'])
    })

    it('Cancel returns to view mode without calling onSaveEdit', async () => {
      const user = userEvent.setup()
      const onSaveEdit = vi.fn(() => Promise.resolve())
      render(
        <NotesSurface
          open
          onClose={vi.fn()}
          annotations={[
            makeNote({
              note: {
                id: 'd',
                body: 'orig',
                attachments: [],
                createdAt: '',
                updatedAt: '',
              },
            }),
          ]}
          onSaveEdit={onSaveEdit}
          onUploadAttachment={vi.fn(() => Promise.resolve())}
          onDeleteAttachment={vi.fn(() => Promise.resolve())}
          onDeleteNote={vi.fn()}
        />,
      )

      await user.click(screen.getByRole('button', { name: /edit note/i }))
      await user.click(screen.getByRole('button', { name: /^cancel$/i }))

      expect(onSaveEdit).not.toHaveBeenCalled()
      expect(
        screen.getByRole('button', { name: /^edit note$/i }),
      ).toBeInTheDocument()
    })
  })

  describe('Sentry error reporting', () => {
    it('reports to Sentry with op=updateNote + annotationId when onSaveEdit rejects', async () => {
      const user = userEvent.setup()
      const onSaveEdit = vi.fn(() => Promise.reject(new Error('save failed')))
      render(
        <NotesSurface
          open
          onClose={vi.fn()}
          annotations={[
            makeNote({
              id: 'n-update',
              note: {
                id: 'd',
                body: 'orig',
                attachments: [],
                createdAt: '',
                updatedAt: '',
              },
            }),
          ]}
          onSaveEdit={onSaveEdit}
          onUploadAttachment={vi.fn(() => Promise.resolve())}
          onDeleteAttachment={vi.fn(() => Promise.resolve())}
          onDeleteNote={vi.fn()}
        />,
      )

      await user.click(screen.getByRole('button', { name: /edit note/i }))
      const textarea = screen.getByPlaceholderText(
        /write a note/i,
      ) as HTMLTextAreaElement
      await user.clear(textarea)
      await user.type(textarea, 'updated')
      await user.click(screen.getByRole('button', { name: /^save$/i }))

      await screen.findByRole('alert')
      expect(reportErrorToSentryMock).toHaveBeenCalledTimes(1)
      expect(reportErrorToSentryMock).toHaveBeenCalledWith(expect.any(Error), {
        surface: 'briefing-annotations',
        op: 'updateNote',
        annotationId: 'n-update',
      })
    })

    it('reports to Sentry with op=uploadAttachment + fileName when onUploadAttachment rejects', async () => {
      const user = userEvent.setup()
      const onUploadAttachment = vi
        .fn<(id: string, file: File) => Promise<void>>()
        .mockRejectedValue(new Error('upload boom'))
      render(
        <NotesSurface
          open
          onClose={vi.fn()}
          annotations={[makeNote({ id: 'n-upload' })]}
          onSaveEdit={vi.fn(() => Promise.resolve())}
          onUploadAttachment={onUploadAttachment}
          onDeleteAttachment={vi.fn(() => Promise.resolve())}
          onDeleteNote={vi.fn()}
        />,
      )

      const fileInputs = document.body.querySelectorAll('input[type="file"]')
      const desktopInput = fileInputs[0] as HTMLInputElement
      expect(desktopInput).toBeDefined()
      const file = new File(['hi'], 'pic.png', { type: 'image/png' })
      await user.upload(desktopInput, file)

      await screen.findByText(/couldn't attach pic\.png/i)
      expect(reportErrorToSentryMock).toHaveBeenCalledTimes(1)
      expect(reportErrorToSentryMock).toHaveBeenCalledWith(expect.any(Error), {
        surface: 'briefing-annotations',
        op: 'uploadAttachment',
        annotationId: 'n-upload',
        fileName: 'pic.png',
      })
    })
  })

  describe('attachmentError scoping across notes', () => {
    it('does not render an attachment error against a different note after the user cycles away', async () => {
      const user = userEvent.setup()
      let rejectUploadFn: (reason: Error) => void = () => undefined
      const uploadPromise = new Promise<void>((_, reject) => {
        rejectUploadFn = reject
      })
      const onUploadAttachment = vi.fn(
        async (_id: string, _file: File) => uploadPromise,
      )

      const noteA = makeNote({
        id: 'note-a',
        createdAt: '2026-05-01T10:00:00.000Z',
        note: {
          id: 'data-a',
          body: 'Note A body',
          attachments: [],
          createdAt: '',
          updatedAt: '',
        },
      })
      const noteB = makeNote({
        id: 'note-b',
        createdAt: '2026-05-01T11:00:00.000Z',
        note: {
          id: 'data-b',
          body: 'Note B body',
          attachments: [],
          createdAt: '',
          updatedAt: '',
        },
      })

      render(
        <NotesSurface
          open
          onClose={vi.fn()}
          annotations={[noteA, noteB]}
          onSaveEdit={vi.fn(() => Promise.resolve())}
          onUploadAttachment={onUploadAttachment}
          onDeleteAttachment={vi.fn(() => Promise.resolve())}
          onDeleteNote={vi.fn()}
        />,
      )

      const fileInputs = document.body.querySelectorAll('input[type="file"]')
      const desktopInput = fileInputs[0] as HTMLInputElement
      expect(desktopInput).toBeDefined()
      const file = new File(['x'], 'a.png', { type: 'image/png' })
      await user.upload(desktopInput, file)

      // Cycle to noteB before the upload rejects.
      await user.click(screen.getByRole('button', { name: /next/i }))

      // Now reject the upload for noteA.
      rejectUploadFn(new Error('upload boom'))

      // The error message bound to "a.png" must NOT render because the user
      // has cycled to a different note.
      await new Promise((resolve) => setTimeout(resolve, 50))
      expect(
        screen.queryByText(/couldn't attach a\.png/i),
      ).not.toBeInTheDocument()
    })
  })

  describe('Draft preservation during transient refetch', () => {
    it('preserves the in-progress draft when the active annotation stays the same (id unchanged)', async () => {
      const user = userEvent.setup()
      const noteA = makeNote({
        id: 'n-keep',
        note: {
          id: 'd',
          body: 'original',
          attachments: [],
          createdAt: '',
          updatedAt: '',
        },
      })

      function Harness({ rev }: { rev: number }) {
        // Pass a fresh object reference each rev to simulate an optimistic
        // refetch producing a new annotation array — without changing the id.
        const annotations = [
          { ...noteA, updatedAt: `2026-05-26T00:00:0${rev}.000Z` },
        ]
        return (
          <NotesSurface
            open
            onClose={vi.fn()}
            annotations={annotations}
            onSaveEdit={vi.fn(() => Promise.resolve())}
            onUploadAttachment={vi.fn(() => Promise.resolve())}
            onDeleteAttachment={vi.fn(() => Promise.resolve())}
            onDeleteNote={vi.fn()}
          />
        )
      }

      const { rerender } = render(<Harness rev={0} />)
      await user.click(screen.getByRole('button', { name: /edit note/i }))
      const textarea = screen.getByPlaceholderText(
        /write a note/i,
      ) as HTMLTextAreaElement
      await user.clear(textarea)
      await user.type(textarea, 'in-progress draft')

      // Simulate the refetch — same id, but a fresh annotation reference.
      rerender(<Harness rev={1} />)

      const after = screen.getByPlaceholderText(
        /write a note/i,
      ) as HTMLTextAreaElement
      expect(after.value).toBe('in-progress draft')
    })
  })
})

import { describe, expect, it, vi } from 'vitest'
import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import type { Annotation } from '@shared/briefings/types'
import type { EnrichedAnnotation } from './enrichForCycler'
import { DeleteAnnotationButton } from './DeleteAnnotationButton'

function makeEnrichedNote(
  overrides: Partial<EnrichedAnnotation> = {},
): EnrichedAnnotation {
  const base: EnrichedAnnotation = {
    id: 'ann_1',
    kind: 'note',
    resourceType: 'briefing',
    resourceId: 'briefing_1',
    authorUserId: 1,
    jsonPath: null,
    start: null,
    end: null,
    createdAt: '2026-05-01T12:00:00.000Z',
    updatedAt: '2026-05-01T12:00:00.000Z',
    note: {
      id: 'note_1',
      body: 'Note body',
      attachments: [],
      createdAt: '2026-05-01T12:00:00.000Z',
      updatedAt: '2026-05-01T12:00:00.000Z',
    },
    docOrderIndex: null,
    highlightedText: null,
  }
  return { ...base, ...overrides }
}

describe('<DeleteAnnotationButton>', () => {
  it('opens the confirm dialog when the outer Delete button is clicked', async () => {
    const user = userEvent.setup()
    render(
      <DeleteAnnotationButton
        current={makeEnrichedNote()}
        label="Delete note"
        title="Delete this note?"
        description="This note will be permanently removed. You can't undo this."
        onDelete={vi.fn().mockResolvedValue(undefined)}
      />,
    )

    expect(screen.queryByRole('alertdialog')).not.toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: /delete note/i }))

    await screen.findByRole('alertdialog')
    expect(
      screen.getByRole('heading', { name: /delete this note\?/i }),
    ).toBeInTheDocument()
  })

  it('invokes onDelete with the current annotation when confirm is clicked, then closes the dialog', async () => {
    const user = userEvent.setup()
    const annotation = makeEnrichedNote({ id: 'ann_focus' })
    const onDelete = vi.fn().mockResolvedValue(undefined)

    render(
      <DeleteAnnotationButton
        current={annotation}
        label="Delete note"
        title="Delete this note?"
        description="Gone forever."
        onDelete={onDelete}
      />,
    )

    await user.click(screen.getByRole('button', { name: /delete note/i }))
    const dialog = await screen.findByRole('alertdialog')
    const confirm = within(dialog).getByRole('button', { name: /^delete$/i })
    await user.click(confirm)

    expect(onDelete).toHaveBeenCalledTimes(1)
    expect(onDelete).toHaveBeenCalledWith(
      expect.objectContaining({ id: 'ann_focus' }),
    )
    expect(screen.queryByRole('alertdialog')).not.toBeInTheDocument()
  })

  it('keeps the dialog open and surfaces an error message when onDelete rejects', async () => {
    const user = userEvent.setup()
    const onDelete = vi
      .fn<(a: Annotation) => Promise<void>>()
      .mockRejectedValueOnce(new Error('boom'))
      .mockResolvedValueOnce(undefined)

    render(
      <DeleteAnnotationButton
        current={makeEnrichedNote()}
        label="Delete note"
        title="Delete this note?"
        description="This note will be permanently removed. You can't undo this."
        onDelete={onDelete}
      />,
    )

    await user.click(screen.getByRole('button', { name: /delete note/i }))
    const dialog = await screen.findByRole('alertdialog')
    const confirm = within(dialog).getByRole('button', { name: /^delete$/i })
    await user.click(confirm)

    expect(await within(dialog).findByRole('alert')).toHaveTextContent(
      /couldn't delete/i,
    )
    expect(screen.getByRole('alertdialog')).toBeInTheDocument()

    await user.click(within(dialog).getByRole('button', { name: /^delete$/i }))

    expect(onDelete).toHaveBeenCalledTimes(2)
    expect(screen.queryByRole('alertdialog')).not.toBeInTheDocument()
  })

  it('shows a loading state on the confirm button and locks the dialog while onDelete is in flight', async () => {
    const user = userEvent.setup()
    const deferred: { resolve: () => void } = { resolve: () => undefined }
    const pending = new Promise<void>((res) => {
      deferred.resolve = res
    })
    const onDelete = vi.fn(() => pending)

    render(
      <DeleteAnnotationButton
        current={makeEnrichedNote()}
        label="Delete note"
        title="Delete this note?"
        description="This note will be permanently removed. You can't undo this."
        onDelete={onDelete}
      />,
    )

    await user.click(screen.getByRole('button', { name: /delete note/i }))
    const dialog = await screen.findByRole('alertdialog')
    const confirm = within(dialog).getByRole('button', { name: /^delete$/i })
    await user.click(confirm)

    const confirmAfter = within(dialog).getByRole('button', {
      name: /^delete$/i,
    })
    expect(confirmAfter).toBeDisabled()
    expect(confirmAfter).toHaveAttribute('data-loading', 'true')

    const cancel = within(dialog).getByRole('button', { name: /cancel/i })
    expect(cancel).toBeDisabled()

    deferred.resolve()
  })

  it('disables the outer Delete button when the disabled prop is true', async () => {
    const user = userEvent.setup()

    render(
      <DeleteAnnotationButton
        current={makeEnrichedNote()}
        label="Delete note"
        title="Delete this note?"
        description="Gone forever."
        onDelete={vi.fn().mockResolvedValue(undefined)}
        disabled
      />,
    )

    const trigger = screen.getByRole('button', { name: /delete note/i })
    expect(trigger).toBeDisabled()

    await user.click(trigger)

    expect(screen.queryByRole('alertdialog')).not.toBeInTheDocument()
  })

  it('renders nothing when current is null', () => {
    render(
      <DeleteAnnotationButton
        current={null}
        label="Delete note"
        title="Delete this note?"
        description="Gone forever."
        onDelete={vi.fn().mockResolvedValue(undefined)}
      />,
    )

    expect(
      screen.queryByRole('button', { name: /delete note/i }),
    ).not.toBeInTheDocument()
  })
})

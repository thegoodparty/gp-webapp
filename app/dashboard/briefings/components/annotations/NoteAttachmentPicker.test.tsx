import { describe, expect, it, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import NoteAttachmentPicker from './NoteAttachmentPicker'

vi.mock('@styleguide/hooks/use-mobile', () => ({
  useIsMobile: () => true,
}))

describe('NoteAttachmentPicker', () => {
  it('labels the document-picker option "Files" (not "Document")', async () => {
    const user = userEvent.setup()
    render(
      <NoteAttachmentPicker items={[]} onAdd={vi.fn()} onRemove={vi.fn()} />,
    )

    await user.click(screen.getByRole('button', { name: /add attachment/i }))

    expect(screen.getByRole('button', { name: /^files$/i })).toBeInTheDocument()
    expect(
      screen.queryByRole('button', { name: /^document$/i }),
    ).not.toBeInTheDocument()
  })
})

import { describe, it, expect, vi } from 'vitest'
import { screen, fireEvent } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { render } from 'helpers/test-utils/render'
import { MIN_POLICY_FOCUS_LENGTH } from '../candidateProfile.utils'
import PolicyForm from './PolicyForm'

vi.mock('app/shared/utils/RichEditor', async () => ({
  default: (await import('helpers/test-utils/RichEditorMock')).RichEditorMock,
}))

const typeFocus = (length: number) => {
  fireEvent.change(screen.getByTestId('rich-editor'), {
    target: { value: 'x'.repeat(length) },
  })
}

describe('PolicyForm — validation messaging', () => {
  it('keeps the Save button enabled even when the form is empty', () => {
    render(
      <PolicyForm showDelete={false} onSave={vi.fn()} onDelete={vi.fn()} />,
    )
    expect(screen.getByRole('button', { name: /save/i })).toBeEnabled()
  })

  it('shows the combined add-fields message and flags both fields when empty', async () => {
    const user = userEvent.setup()
    const onSave = vi.fn()
    render(<PolicyForm showDelete={false} onSave={onSave} onDelete={vi.fn()} />)

    await user.click(screen.getByRole('button', { name: /save/i }))

    expect(onSave).not.toHaveBeenCalled()
    expect(
      screen.getByText('Please add a Policy title and Policy focus'),
    ).toBeInTheDocument()
    expect(screen.getByLabelText('Policy title')).toHaveAttribute(
      'aria-invalid',
      'true',
    )
    expect(screen.getByTestId('rich-editor')).toHaveAttribute(
      'data-error',
      'true',
    )
  })

  it('reports the focus length requirement when the title is set but focus is too short', async () => {
    const user = userEvent.setup()
    const onSave = vi.fn()
    render(<PolicyForm showDelete={false} onSave={onSave} onDelete={vi.fn()} />)

    await user.type(screen.getByLabelText('Policy title'), 'Education')
    typeFocus(MIN_POLICY_FOCUS_LENGTH - 1)
    await user.click(screen.getByRole('button', { name: /save/i }))

    expect(onSave).not.toHaveBeenCalled()
    expect(
      screen.getByText(
        `Policy focus requires ${MIN_POLICY_FOCUS_LENGTH} characters`,
      ),
    ).toBeInTheDocument()
    // Title is valid now, so only the focus field is flagged.
    expect(screen.getByLabelText('Policy title')).toHaveAttribute(
      'aria-invalid',
      'false',
    )
    expect(screen.getByTestId('rich-editor')).toHaveAttribute(
      'data-error',
      'true',
    )
  })

  it('saves the trimmed title and description once the form is valid', async () => {
    const user = userEvent.setup()
    const onSave = vi.fn()
    render(<PolicyForm showDelete={false} onSave={onSave} onDelete={vi.fn()} />)

    await user.type(screen.getByLabelText('Policy title'), '  Education  ')
    typeFocus(MIN_POLICY_FOCUS_LENGTH)
    await user.click(screen.getByRole('button', { name: /save/i }))

    expect(onSave).toHaveBeenCalledTimes(1)
    expect(onSave).toHaveBeenCalledWith({
      title: 'Education',
      description: 'x'.repeat(MIN_POLICY_FOCUS_LENGTH),
    })
    expect(screen.queryByText(/Please add a Policy/)).not.toBeInTheDocument()
  })
})

import { describe, it, expect, vi } from 'vitest'
import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { render } from 'helpers/test-utils/render'
import PinForm from './PinForm'

const getDigitInputs = (): HTMLInputElement[] =>
  screen
    .getAllByRole('textbox')
    .filter((el) =>
      (el.getAttribute('aria-label') ?? '').startsWith('Digit '),
    ) as HTMLInputElement[]

describe('PinForm', () => {
  it('renders 6 digit inputs and autofocuses the first', () => {
    render(
      <PinForm channels={['email', 'phone', 'address']} onSubmit={vi.fn()} />,
    )
    const inputs = getDigitInputs()
    expect(inputs).toHaveLength(6)
    expect(inputs[0]).toHaveFocus()
  })

  it('auto-advances focus to the next input after each digit', async () => {
    const user = userEvent.setup()
    render(<PinForm channels={['email']} onSubmit={vi.fn()} />)
    const inputs = getDigitInputs()
    await user.type(inputs[0]!, '1')
    expect(inputs[1]).toHaveFocus()
    await user.type(inputs[1]!, '2')
    expect(inputs[2]).toHaveFocus()
  })

  it('rejects non-digit input', async () => {
    const user = userEvent.setup()
    render(<PinForm channels={['email']} onSubmit={vi.fn()} />)
    const inputs = getDigitInputs()
    await user.type(inputs[0]!, 'a')
    expect(inputs[0]).toHaveValue('')
  })

  it('moves backwards on Backspace from an empty cell', async () => {
    const user = userEvent.setup()
    render(<PinForm channels={['email']} onSubmit={vi.fn()} />)
    const inputs = getDigitInputs()
    await user.type(inputs[0]!, '1')
    await user.keyboard('{Backspace}')
    expect(inputs[0]).toHaveFocus()
    expect(inputs[0]).toHaveValue('')
  })

  it('builds helper text from the provided channels', () => {
    render(
      <PinForm channels={['email', 'phone', 'address']} onSubmit={vi.fn()} />,
    )
    expect(
      screen.getByText(
        /to either your email, phone or address from CampaignVerify\./i,
      ),
    ).toBeInTheDocument()
  })

  it('lists only the channels passed in', () => {
    render(<PinForm channels={['email']} onSubmit={vi.fn()} />)
    expect(
      screen.getByText(/to your email from CampaignVerify\./i),
    ).toBeInTheDocument()
    // "either" only makes sense with multiple channels; with one channel it
    // would misleadingly imply the user has a choice of delivery methods.
    expect(screen.queryByText(/either/i)).not.toBeInTheDocument()
    expect(screen.queryByText(/phone/i)).not.toBeInTheDocument()
    expect(screen.queryByText(/address/i)).not.toBeInTheDocument()
  })

  it('disables submit until all 6 digits are entered', async () => {
    const user = userEvent.setup()
    const onSubmit = vi.fn()
    render(<PinForm channels={['email']} onSubmit={onSubmit} />)
    const submit = screen.getByRole('button', { name: /submit/i })
    expect(submit).toBeDisabled()

    const inputs = getDigitInputs()
    for (let i = 0; i < 5; i++) {
      await user.type(inputs[i]!, String(i + 1))
    }
    expect(submit).toBeDisabled()

    await user.type(inputs[5]!, '6')
    expect(submit).toBeEnabled()
  })

  it('calls onSubmit with the assembled PIN', async () => {
    const user = userEvent.setup()
    const onSubmit = vi.fn()
    render(<PinForm channels={['email']} onSubmit={onSubmit} />)
    const inputs = getDigitInputs()
    for (let i = 0; i < 6; i++) {
      await user.type(inputs[i]!, String(i + 1))
    }
    await user.click(screen.getByRole('button', { name: /submit/i }))
    expect(onSubmit).toHaveBeenCalledWith('123456')
  })

  it('disables the form while loading', () => {
    render(<PinForm channels={['email']} onSubmit={vi.fn()} loading />)
    const inputs = getDigitInputs()
    inputs.forEach((input) => expect(input).toBeDisabled())
    expect(screen.getByRole('button', { name: /submit/i })).toBeDisabled()
  })

  it('renders an inline error message when provided', () => {
    render(
      <PinForm
        channels={['email']}
        onSubmit={vi.fn()}
        error="That PIN didn’t match. Double-check and try again."
      />,
    )
    const alert = screen.getByRole('alert')
    expect(alert).toHaveTextContent(
      /that PIN didn’t match\. Double-check and try again\./i,
    )
  })

  it('distributes a pasted code across the inputs', async () => {
    const user = userEvent.setup()
    const onSubmit = vi.fn()
    render(<PinForm channels={['email']} onSubmit={onSubmit} />)
    const inputs = getDigitInputs()
    inputs[0]!.focus()
    await user.paste('123456')
    expect(inputs.map((i) => i.value)).toEqual(['1', '2', '3', '4', '5', '6'])
  })
})

import { describe, expect, it, vi } from 'vitest'
import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { render } from 'helpers/test-utils/render'
import PhoneInput, { isValidPhone } from './PhoneInput'

describe('isValidPhone', () => {
  it('returns false for empty string', () => {
    expect(isValidPhone('')).toBe(false)
  })

  it('returns true for a 10-digit number', () => {
    expect(isValidPhone('5551234567')).toBe(true)
  })

  it('returns true for an 11-digit number starting with 1', () => {
    expect(isValidPhone('15551234567')).toBe(true)
  })

  it('returns false for an 11-digit number not starting with 1', () => {
    expect(isValidPhone('25551234567')).toBe(false)
  })

  it('returns false for a 9-digit number', () => {
    expect(isValidPhone('555123456')).toBe(false)
  })

  it('strips non-digits when checking validity', () => {
    expect(isValidPhone('(555) 123-4567')).toBe(true)
  })
})

describe('PhoneInput', () => {
  it('renders with a Phone label by default', () => {
    render(<PhoneInput value="" onChangeCallback={vi.fn()} />)
    expect(screen.getByLabelText('Phone')).toBeInTheDocument()
  })

  it('renders no label when useLabel is false', () => {
    render(<PhoneInput value="" onChangeCallback={vi.fn()} useLabel={false} />)
    expect(screen.queryByLabelText('Phone')).not.toBeInTheDocument()
  })

  it('formats typed input via AsYouType and calls onChangeCallback with digits only', async () => {
    const cb = vi.fn()
    render(<PhoneInput value="" onChangeCallback={cb} />)
    const input = screen.getByRole('textbox')
    await userEvent.type(input, '5551234567')
    const lastCall = cb.mock.calls[cb.mock.calls.length - 1]
    expect(lastCall?.[0]).toMatch(/^\d+$/)
  })

  it('calls onChangeCallback with isValid=true for a 10-digit number', async () => {
    const cb = vi.fn()
    render(<PhoneInput value="" onChangeCallback={cb} />)
    const input = screen.getByRole('textbox')
    await userEvent.type(input, '5551234567')
    const lastCall = cb.mock.calls[cb.mock.calls.length - 1]
    expect(lastCall?.[1]).toBe(true)
  })

  it('calls onChangeCallback with isValid=false for a partial number', async () => {
    const cb = vi.fn()
    render(<PhoneInput value="" onChangeCallback={cb} />)
    const input = screen.getByRole('textbox')
    await userEvent.type(input, '555')
    const lastCall = cb.mock.calls[cb.mock.calls.length - 1]
    expect(lastCall?.[1]).toBe(false)
  })

  it('renders the phone icon by default', () => {
    const { container } = render(
      <PhoneInput value="" onChangeCallback={vi.fn()} />,
    )
    expect(container.querySelector('svg')).toBeInTheDocument()
  })

  it('does not render the phone icon when hideIcon is true', () => {
    const { container } = render(
      <PhoneInput value="" onChangeCallback={vi.fn()} hideIcon />,
    )
    expect(container.querySelector('svg')).not.toBeInTheDocument()
  })

  it('calls onBlurCallback with digits-only value on blur', async () => {
    const blurCb = vi.fn()
    render(
      <PhoneInput
        value=""
        onChangeCallback={vi.fn()}
        onBlurCallback={blurCb}
      />,
    )
    const input = screen.getByRole('textbox')
    await userEvent.type(input, '5551234567')
    await userEvent.tab()
    expect(blurCb).toHaveBeenCalled()
    const blurArg = blurCb.mock.calls[0]?.[0]
    expect(blurArg).toMatch(/^\d*$/)
  })
})

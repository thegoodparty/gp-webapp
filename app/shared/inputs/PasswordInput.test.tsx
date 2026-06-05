import { describe, expect, it, vi } from 'vitest'
import { screen, fireEvent } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { render } from 'helpers/test-utils/render'
import PasswordInput from './PasswordInput'

describe('PasswordInput', () => {
  it('renders with a password type input by default', () => {
    render(<PasswordInput onChangeCallback={vi.fn()} />)
    expect(screen.getByLabelText('Password')).toHaveAttribute(
      'type',
      'password',
    )
  })

  it('toggles input type to text when the show-password button is clicked', async () => {
    render(<PasswordInput onChangeCallback={vi.fn()} />)
    const toggle = screen.getByRole('button', {
      name: /toggle password visibility/i,
    })
    await userEvent.click(toggle)
    expect(screen.getByLabelText('Password')).toHaveAttribute('type', 'text')
  })

  it('toggles back to password type on second click', async () => {
    render(<PasswordInput onChangeCallback={vi.fn()} />)
    const toggle = screen.getByRole('button', {
      name: /toggle password visibility/i,
    })
    await userEvent.click(toggle)
    await userEvent.click(toggle)
    expect(screen.getByLabelText('Password')).toHaveAttribute(
      'type',
      'password',
    )
  })

  it('calls onChangeCallback with the typed value and a validity boolean', () => {
    const cb = vi.fn()
    render(<PasswordInput onChangeCallback={cb} />)
    fireEvent.change(screen.getByLabelText('Password'), {
      target: { value: 'abc123456' },
    })
    expect(cb).toHaveBeenCalledWith('abc123456', expect.any(Boolean))
  })

  it('calls onChangeCallback with isValid=true for a valid password', () => {
    const cb = vi.fn()
    render(<PasswordInput onChangeCallback={cb} />)
    fireEvent.change(screen.getByLabelText('Password'), {
      target: { value: 'Secure1!' },
    })
    expect(cb).toHaveBeenCalledWith('Secure1!', true)
  })

  it('calls onChangeCallback with isValid=false for an invalid password', async () => {
    const cb = vi.fn()
    render(<PasswordInput onChangeCallback={cb} />)
    await userEvent.type(screen.getByLabelText('Password'), 'abc')
    const lastCall = cb.mock.calls[cb.mock.calls.length - 1]
    expect(lastCall?.[1]).toBe(false)
  })

  it('renders the error adornment icon when error prop is set', () => {
    const { container } = render(
      <PasswordInput onChangeCallback={vi.fn()} error />,
    )
    const svgs = container.querySelectorAll('svg')
    expect(svgs.length).toBeGreaterThan(1)
  })

  it('renders a custom label when provided', () => {
    render(<PasswordInput onChangeCallback={vi.fn()} label="New Password" />)
    expect(screen.getByLabelText('New Password')).toBeInTheDocument()
  })

  it('renders helperText when provided', () => {
    render(
      <PasswordInput
        onChangeCallback={vi.fn()}
        helperText="At least 8 chars"
      />,
    )
    expect(screen.getByText('At least 8 chars')).toBeInTheDocument()
  })

  it('forwards data-testid to the underlying input via inputProps', () => {
    render(<PasswordInput onChangeCallback={vi.fn()} data-testid="pwd-input" />)
    expect(screen.getByTestId('pwd-input')).toBeInTheDocument()
  })
})

import { describe, expect, it, vi } from 'vitest'
import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { render } from 'helpers/test-utils/render'
import TextField from './TextField'

describe('TextField', () => {
  it('renders the label and associates it with the input', () => {
    render(<TextField label="Email" value="" onChange={() => {}} />)
    const input = screen.getByLabelText('Email')
    expect(input).toBeInTheDocument()
  })

  it('fires onChange and surfaces the typed value', async () => {
    const onChange = vi.fn()
    render(<TextField label="Name" defaultValue="" onChange={onChange} />)
    await userEvent.type(screen.getByLabelText('Name'), 'a')
    expect(onChange).toHaveBeenCalled()
    const event = onChange.mock.calls[0]?.[0]
    expect(event?.target.value).toBe('a')
  })

  it('renders helperText and shows error styling when error is set', () => {
    render(
      <TextField
        label="Zip"
        value=""
        onChange={() => {}}
        error
        helperText="Invalid zip"
      />,
    )
    expect(screen.getByText('Invalid zip')).toBeInTheDocument()
    expect(screen.getByLabelText('Zip')).toHaveAttribute('aria-invalid', 'true')
  })

  it('renders the error icon when endAdornments includes error', () => {
    const { container } = render(
      <TextField
        label="Phone"
        value=""
        onChange={() => {}}
        endAdornments={['error']}
      />,
    )
    expect(container.querySelector('svg')).toBeInTheDocument()
  })

  it('applies maxLength to the input', () => {
    render(
      <TextField label="EIN" value="" onChange={() => {}} maxLength={10} />,
    )
    expect(screen.getByLabelText('EIN')).toHaveAttribute('maxlength', '10')
  })

  it('forwards maxLength from inputProps', () => {
    render(
      <TextField
        label="Zip"
        value=""
        onChange={() => {}}
        inputProps={{ maxLength: 5 }}
      />,
    )
    expect(screen.getByLabelText('Zip')).toHaveAttribute('maxlength', '5')
  })

  it('renders a textarea when multiline is set', () => {
    render(<TextField label="Bio" value="" onChange={() => {}} multiline />)
    expect(screen.getByLabelText('Bio').tagName).toBe('TEXTAREA')
  })
})

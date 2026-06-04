import { describe, expect, it, vi } from 'vitest'
import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { render } from 'helpers/test-utils/render'
import TextField from './TextField'

describe('TextField', () => {
  it('renders the label and associates it with the input', () => {
    render(<TextField label="Email" value="" onChange={vi.fn()} />)
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
        onChange={vi.fn()}
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
        onChange={vi.fn()}
        endAdornments={['error']}
      />,
    )
    expect(container.querySelector('svg')).toBeInTheDocument()
  })

  it('applies maxLength to the input', () => {
    render(<TextField label="EIN" value="" onChange={vi.fn()} maxLength={10} />)
    expect(screen.getByLabelText('EIN')).toHaveAttribute('maxlength', '10')
  })

  it('forwards maxLength from inputProps', () => {
    render(
      <TextField
        label="Zip"
        value=""
        onChange={vi.fn()}
        inputProps={{ maxLength: 5 }}
      />,
    )
    expect(screen.getByLabelText('Zip')).toHaveAttribute('maxlength', '5')
  })

  it('renders a textarea when multiline is set', () => {
    render(<TextField label="Bio" value="" onChange={vi.fn()} multiline />)
    expect(screen.getByLabelText('Bio').tagName).toBe('TEXTAREA')
  })

  it('reserves padding for an end adornment so text does not overlap', () => {
    render(
      <TextField
        label="Link"
        value=""
        onChange={vi.fn()}
        endAdornments={['error']}
      />,
    )
    expect(screen.getByLabelText('Link')).toHaveClass('pr-9')
  })

  it('reserves padding for a start adornment so text does not overlap', () => {
    render(
      <TextField
        label="Budget"
        value=""
        onChange={vi.fn()}
        InputProps={{ startAdornment: <span>$</span> }}
      />,
    )
    expect(screen.getByLabelText('Budget')).toHaveClass('pl-9')
  })

  it('renders both endAdornments and InputProps.endAdornment when given together', () => {
    render(
      <TextField
        label="Both"
        value=""
        onChange={vi.fn()}
        endAdornments={['error']}
        InputProps={{ endAdornment: <span>extra adornment</span> }}
      />,
    )
    expect(screen.getByText('extra adornment')).toBeInTheDocument()
  })

  it('renders the error helperText with the destructive color token', () => {
    render(
      <TextField
        label="Email"
        value=""
        onChange={vi.fn()}
        error
        helperText="Invalid email"
      />,
    )
    expect(screen.getByText('Invalid email')).toHaveClass('text-destructive')
  })

  it('applies InputLabelProps.className to the label', () => {
    render(
      <TextField
        label="Email"
        value=""
        onChange={vi.fn()}
        InputLabelProps={{ className: 'text-black' }}
      />,
    )
    expect(screen.getByText('Email')).toHaveClass('text-black')
  })
})

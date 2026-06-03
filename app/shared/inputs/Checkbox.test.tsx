import { describe, expect, it, vi } from 'vitest'
import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { render } from 'helpers/test-utils/render'
import Checkbox from './Checkbox'

describe('Checkbox', () => {
  it('renders the label and toggles checked via the label', async () => {
    const onChange = vi.fn()
    render(<Checkbox label="Accept terms" name="terms" onChange={onChange} />)
    await userEvent.click(screen.getByText('Accept terms'))
    expect(onChange).toHaveBeenCalledTimes(1)
    expect(onChange.mock.calls[0]?.[0]).toEqual({
      target: { checked: true, name: 'terms' },
    })
  })

  it('fires change with a boolean and the name on the synthesized event', async () => {
    const onChange = vi.fn()
    render(<Checkbox name="voicemail" onChange={onChange} />)
    await userEvent.click(screen.getByRole('checkbox'))
    const event = onChange.mock.calls[0]?.[0]
    expect(event?.target.checked).toBe(true)
    expect(event?.target.name).toBe('voicemail')
  })

  it('reflects the checked prop and does not fire when disabled', async () => {
    const onChange = vi.fn()
    render(<Checkbox checked disabled onChange={onChange} />)
    const checkbox = screen.getByRole('checkbox')
    expect(checkbox).toHaveAttribute('data-state', 'checked')
    await userEvent.click(checkbox)
    expect(onChange).not.toHaveBeenCalled()
  })
})

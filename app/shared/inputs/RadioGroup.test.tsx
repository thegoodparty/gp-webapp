import { describe, expect, it, vi } from 'vitest'
import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { render } from 'helpers/test-utils/render'
import { Label } from '@styleguide/components/ui/label'
import RadioGroup, { RadioGroupItem } from './RadioGroup'

describe('RadioGroup', () => {
  it('fires onValueChange with the selected value', async () => {
    const onValueChange = vi.fn()
    render(
      <RadioGroup onValueChange={onValueChange}>
        <Label>
          <RadioGroupItem value="a" />
          Option A
        </Label>
        <Label>
          <RadioGroupItem value="b" />
          Option B
        </Label>
      </RadioGroup>,
    )
    await userEvent.click(screen.getByText('Option B'))
    expect(onValueChange).toHaveBeenCalledWith('b')
  })

  it('honors defaultValue', () => {
    render(
      <RadioGroup defaultValue="a">
        <Label>
          <RadioGroupItem value="a" />
          Option A
        </Label>
      </RadioGroup>,
    )
    expect(screen.getByRole('radio')).toHaveAttribute('data-state', 'checked')
  })
})

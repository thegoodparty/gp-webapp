import { beforeAll, describe, expect, it, vi } from 'vitest'
import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { render } from 'helpers/test-utils/render'
import RenderInputField, { FieldConfig } from './RenderInputField'

beforeAll(() => {
  Element.prototype.scrollIntoView = vi.fn()
})

describe('RenderInputField', () => {
  it('renders a text input and fires onChangeCallback with the typed value', async () => {
    const onChangeCallback = vi.fn()
    const field: FieldConfig = { key: 'name', label: 'Name', type: 'text' }
    render(
      <RenderInputField
        field={field}
        value=""
        onChangeCallback={onChangeCallback}
      />,
    )
    await userEvent.type(screen.getByLabelText('Name'), 'x')
    expect(onChangeCallback).toHaveBeenCalledWith('name', 'x', undefined)
  })

  it('renders radio options and fires onChangeCallback on selection', async () => {
    const onChangeCallback = vi.fn()
    const field: FieldConfig = {
      key: 'flavor',
      label: 'Flavor',
      type: 'radio',
      options: [
        { key: 'v', label: 'Vanilla', value: 'vanilla' },
        { key: 'c', label: 'Chocolate', value: 'chocolate' },
      ],
    }
    render(
      <RenderInputField
        field={field}
        value=""
        onChangeCallback={onChangeCallback}
      />,
    )
    await userEvent.click(screen.getByText('Chocolate'))
    expect(onChangeCallback).toHaveBeenCalledWith('flavor', 'chocolate')
  })

  it('renders a checkbox and fires onChangeCallback with a boolean', async () => {
    const onChangeCallback = vi.fn()
    const field: FieldConfig = {
      key: 'agree',
      label: 'I agree',
      type: 'checkbox',
    }
    render(
      <RenderInputField
        field={field}
        value={false}
        onChangeCallback={onChangeCallback}
      />,
    )
    await userEvent.click(screen.getByRole('checkbox'))
    expect(onChangeCallback).toHaveBeenCalledWith('agree', true)
  })

  it('renders a select and fires onChangeCallback on choosing an option', async () => {
    const onChangeCallback = vi.fn()
    const field: FieldConfig = {
      key: 'state',
      label: 'State',
      type: 'select',
      options: ['CA', 'NY'],
    }
    render(
      <RenderInputField
        field={field}
        value=""
        onChangeCallback={onChangeCallback}
      />,
    )
    await userEvent.click(screen.getByRole('combobox'))
    await userEvent.click(screen.getByRole('option', { name: 'NY' }))
    expect(onChangeCallback).toHaveBeenCalledWith('state', 'NY', undefined)
  })
})

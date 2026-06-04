import { describe, it, expect, vi, beforeAll } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Combobox } from './combobox'

beforeAll(() => {
  Element.prototype.scrollIntoView = vi.fn()
  globalThis.ResizeObserver = class {
    observe = vi.fn()
    unobserve = vi.fn()
    disconnect = vi.fn()
  }
})

type Office = {
  value: string
  label: string
  branch: string
}

const offices: Office[] = [
  { value: 'mayor', label: 'Mayor', branch: 'Local' },
  { value: 'city-council', label: 'City Council', branch: 'Local' },
  { value: 'state-senate', label: 'State Senate', branch: 'State' },
  { value: 'us-house', label: 'US House', branch: 'Federal' },
]

const baseProps = {
  options: offices,
  getOptionLabel: (o: Office) => o.label,
  getOptionKey: (o: Office) => o.value,
}

describe('Combobox', () => {
  it('renders the placeholder when nothing is selected', () => {
    render(
      <Combobox
        {...baseProps}
        value={null}
        onChange={vi.fn()}
        placeholder="Select an office"
      />,
    )
    expect(screen.getByText('Select an office')).toBeInTheDocument()
  })

  it('shows options when opened', async () => {
    const user = userEvent.setup()
    render(<Combobox {...baseProps} value={null} onChange={vi.fn()} />)
    await user.click(screen.getByRole('combobox'))
    expect(await screen.findByText('Mayor')).toBeInTheDocument()
    expect(screen.getByText('City Council')).toBeInTheDocument()
    expect(screen.getByText('US House')).toBeInTheDocument()
  })

  it('filters options as the user types', async () => {
    const user = userEvent.setup()
    render(<Combobox {...baseProps} value={null} onChange={vi.fn()} />)
    await user.click(screen.getByRole('combobox'))
    await screen.findByText('Mayor')
    await user.type(screen.getByPlaceholderText('Search...'), 'council')
    await waitFor(() => {
      expect(screen.queryByText('Mayor')).not.toBeInTheDocument()
    })
    expect(screen.getByText('City Council')).toBeInTheDocument()
  })

  it('calls onChange with the selected option and shows its label', async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()
    const { rerender } = render(
      <Combobox {...baseProps} value={null} onChange={onChange} />,
    )
    await user.click(screen.getByRole('combobox'))
    await user.click(await screen.findByText('State Senate'))
    expect(onChange).toHaveBeenCalledWith(offices[2])

    rerender(
      <Combobox
        {...baseProps}
        value={offices[2] ?? null}
        onChange={onChange}
      />,
    )
    expect(screen.getByText('State Senate')).toBeInTheDocument()
  })

  it('clears the selection via the clear affordance', async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()
    render(
      <Combobox
        {...baseProps}
        value={offices[0] ?? null}
        onChange={onChange}
      />,
    )
    await user.click(screen.getByRole('button', { name: 'Clear selection' }))
    expect(onChange).toHaveBeenCalledWith(null)
  })

  it('shows a check indicator on the preselected item when opened', async () => {
    const user = userEvent.setup()
    render(
      <Combobox {...baseProps} value={offices[0] ?? null} onChange={vi.fn()} />,
    )
    await user.click(screen.getByRole('combobox'))
    const item = await screen.findByRole('option', { name: /Mayor/ })
    expect(item).toHaveAttribute('aria-selected', 'true')
  })

  it('renders group headings when groupBy is provided', async () => {
    const user = userEvent.setup()
    render(
      <Combobox
        {...baseProps}
        value={null}
        onChange={vi.fn()}
        groupBy={(o) => o.branch}
      />,
    )
    await user.click(screen.getByRole('combobox'))
    expect(await screen.findByText('Local')).toBeInTheDocument()
    expect(screen.getByText('State')).toBeInTheDocument()
    expect(screen.getByText('Federal')).toBeInTheDocument()
  })

  it('keeps all options visible regardless of typed text when disableClientFilter is set', async () => {
    const user = userEvent.setup()
    render(
      <Combobox
        {...baseProps}
        value={null}
        onChange={vi.fn()}
        disableClientFilter
      />,
    )
    await user.click(screen.getByRole('combobox'))
    await screen.findByText('Mayor')
    await user.type(screen.getByPlaceholderText('Search...'), 'zzzzz')
    expect(screen.getByText('Mayor')).toBeInTheDocument()
    expect(screen.getByText('City Council')).toBeInTheDocument()
    expect(screen.getByText('US House')).toBeInTheDocument()
  })

  it('calls onInputChange with the typed text', async () => {
    const user = userEvent.setup()
    const onInputChange = vi.fn()
    render(
      <Combobox
        {...baseProps}
        value={null}
        onChange={vi.fn()}
        onInputChange={onInputChange}
      />,
    )
    await user.click(screen.getByRole('combobox'))
    await screen.findByText('Mayor')
    await user.type(screen.getByPlaceholderText('Search...'), 'sen')
    expect(onInputChange).toHaveBeenCalledWith('sen')
  })

  it('shows the loading row and hides the empty state while loading', async () => {
    const user = userEvent.setup()
    render(
      <Combobox
        {...baseProps}
        options={[]}
        value={null}
        onChange={vi.fn()}
        loading
        loadingText="Fetching districts..."
        emptyText="No results"
      />,
    )
    await user.click(screen.getByRole('combobox'))
    expect(await screen.findByText('Fetching districts...')).toBeInTheDocument()
    expect(screen.queryByText('No results')).not.toBeInTheDocument()
  })
})

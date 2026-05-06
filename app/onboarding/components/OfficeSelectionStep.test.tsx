import { describe, expect, it, vi, beforeEach } from 'vitest'
import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { OfficeSelectionStep } from './OfficeSelectionStep'
import { clientFetch } from 'gpApi/clientFetch'

vi.mock('gpApi/clientFetch', () => ({
  clientFetch: vi.fn(),
}))

const mockClientFetch = vi.mocked(clientFetch)

const sampleRace = (overrides: Record<string, unknown> = {}) => ({
  id: 'race-1',
  position: {
    id: 'pos-1',
    name: /city council election date/i,
    level: 'local',
    state: 'WY',
    electionFrequencies: [{ frequency: 4 }],
  },
  election: {
    id: 'elec-1',
    electionDay: '2026-11-03',
    state: 'WY',
  },
  filingPeriods: [{ startOn: '2026-01-01', endOn: '2026-06-01' }],
  city: 'Cheyenne',
  ...overrides,
})

const renderStep = (
  props: Partial<React.ComponentProps<typeof OfficeSelectionStep>> = {},
) => {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  })
  const merged = {
    zip: undefined,
    selected: undefined,
    onZipChange: vi.fn(),
    onSelect: vi.fn(),
    onCantFindOffice: vi.fn(),
    ...props,
  }
  return {
    ...merged,
    ...render(
      <QueryClientProvider client={queryClient}>
        <OfficeSelectionStep {...merged} />
      </QueryClientProvider>,
    ),
  }
}

describe('OfficeSelectionStep', () => {
  beforeEach(() => {
    mockClientFetch.mockReset()
  })

  it('keeps the search disabled until a 5-digit zip is entered', () => {
    renderStep()

    const searchButton = screen.getByRole('button', { name: /search/i })
    expect(searchButton).toBeDisabled()

    const zipInput = screen.getByLabelText(/zip code/i)
    fireEvent.change(zipInput, { target: { value: '8200' } })
    expect(searchButton).toBeDisabled()

    fireEvent.change(zipInput, { target: { value: '82001' } })
    expect(searchButton).toBeEnabled()
  })

  it('strips non-digits from the zip input', () => {
    renderStep()
    const zipInput = screen.getByLabelText(/zip code/i) as HTMLInputElement
    fireEvent.change(zipInput, { target: { value: '8a2b0c0d1' } })
    expect(zipInput.value).toBe('82001')
  })

  it('fetches and renders races for the submitted zip', async () => {
    mockClientFetch.mockResolvedValueOnce({
      data: [sampleRace()],
      ok: true,
    } as unknown as Awaited<ReturnType<typeof clientFetch>>)

    const { onZipChange } = renderStep()

    fireEvent.change(screen.getByLabelText(/zip code/i), {
      target: { value: '82001' },
    })
    fireEvent.click(screen.getByRole('button', { name: /search/i }))

    await waitFor(() => {
      expect(mockClientFetch).toHaveBeenCalledTimes(1)
    })
    expect(onZipChange).toHaveBeenCalledWith('82001')

    await waitFor(() => {
      expect(
        screen.getByRole('radio', { name: /city council election date/i }),
      ).toBeInTheDocument()
    })
  })

  it('forwards selected race details to onSelect', async () => {
    mockClientFetch.mockResolvedValueOnce({
      data: [sampleRace()],
      ok: true,
    } as unknown as Awaited<ReturnType<typeof clientFetch>>)

    const { onSelect } = renderStep()
    fireEvent.change(screen.getByLabelText(/zip code/i), {
      target: { value: '82001' },
    })
    fireEvent.click(screen.getByRole('button', { name: /search/i }))

    const raceButton = await screen.findByRole('radio', {
      name: /city council election date/i,
    })
    fireEvent.click(raceButton)

    expect(onSelect).toHaveBeenCalledWith(
      expect.objectContaining({
        raceId: 'race-1',
        positionId: 'pos-1',
        officeTermLength: '4 years',
        electionDay: '2026-11-03',
        electionId: 'elec-1',
      }),
    )
  })

  it('hides "I don\'t see my office" until results are showing', async () => {
    mockClientFetch.mockResolvedValueOnce({
      data: [sampleRace()],
      ok: true,
    } as unknown as Awaited<ReturnType<typeof clientFetch>>)

    const { onCantFindOffice } = renderStep()
    expect(
      screen.queryByRole('button', { name: /i don't see my office/i }),
    ).not.toBeInTheDocument()

    fireEvent.change(screen.getByLabelText(/zip code/i), {
      target: { value: '82001' },
    })
    fireEvent.click(screen.getByRole('button', { name: /search/i }))

    const cantFindButton = await screen.findByRole('button', {
      name: /i don't see my office/i,
    })
    fireEvent.click(cantFindButton)
    expect(onCantFindOffice).toHaveBeenCalledTimes(1)
  })

  it('shows an empty state until a search has been run', () => {
    renderStep()
    expect(
      screen.getByText(/enter your zip code to see offices/i),
    ).toBeInTheDocument()
  })
})

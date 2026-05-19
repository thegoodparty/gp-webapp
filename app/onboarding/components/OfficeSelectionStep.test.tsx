import { describe, expect, it, vi, beforeEach } from 'vitest'
import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { OfficeSelectionStep } from './OfficeSelectionStep'
import { clientFetch } from 'gpApi/clientFetch'
import { clientRequest } from 'gpApi/typed-request'
import { useSnackbar } from 'helpers/useSnackbar'

vi.mock('gpApi/clientFetch', () => ({
  clientFetch: vi.fn(),
}))

vi.mock('gpApi/typed-request', () => ({
  clientRequest: vi.fn(),
}))

vi.mock('helpers/useSnackbar', () => ({
  useSnackbar: vi.fn(),
}))

const mockClientFetch = vi.mocked(clientFetch)
const mockClientRequest = vi.mocked(clientRequest)
const mockErrorSnackbar = vi.fn()

const sampleRace = (overrides: Record<string, unknown> = {}) => ({
  id: 'race-1',
  brPositionId: 'br-pos-1',
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
    mockClientRequest.mockReset()
    mockErrorSnackbar.mockReset()
    vi.mocked(useSnackbar).mockReturnValue({
      errorSnackbar: mockErrorSnackbar,
      successSnackbar: vi.fn(),
      displaySnackbar: vi.fn(),
    })
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

  it('selects the race optimistically and forwards full details after hydration', async () => {
    mockClientFetch.mockResolvedValueOnce({
      data: [sampleRace()],
      ok: true,
    } as unknown as Awaited<ReturnType<typeof clientFetch>>)

    mockClientRequest.mockResolvedValueOnce({
      data: {
        id: 'race-server',
        brPositionId: 'br-pos-1',
        position: {
          id: 'pos-1',
          name: 'City Council',
          level: 'local',
          state: 'WY',
          partisanType: 'partisan',
          hasPrimary: true,
          electionFrequencies: [{ frequency: 4 }],
        },
        election: {
          id: 'elec-1',
          electionDay: '2026-11-03',
          state: 'WY',
          primaryElectionDate: '2026-08-04',
          primaryElectionId: 'prim-elec-1',
        },
        filingPeriods: [{ startOn: '2026-01-01', endOn: '2026-06-01' }],
        city: 'Cheyenne',
      },
      ok: true,
      status: 200,
      headers: new Headers(),
    } as unknown as Awaited<ReturnType<typeof clientRequest>>)

    const { onSelect } = renderStep()
    fireEvent.change(screen.getByLabelText(/zip code/i), {
      target: { value: '82001' },
    })
    fireEvent.click(screen.getByRole('button', { name: /search/i }))

    const raceButton = await screen.findByRole('radio', {
      name: /city council election date/i,
    })
    fireEvent.click(raceButton)

    // Optimistic select fires synchronously with the click — no await.
    expect(onSelect).toHaveBeenCalledWith(
      expect.objectContaining({ raceId: 'race-1' }),
    )

    await waitFor(() => {
      expect(mockClientRequest).toHaveBeenCalledWith(
        'GET /v1/elections/race-by-position',
        {
          brPositionId: 'br-pos-1',
          zip: '82001',
          electionDate: '2026-11-03',
        },
      )
    })

    await waitFor(() => {
      expect(onSelect).toHaveBeenLastCalledWith(
        expect.objectContaining({
          raceId: 'race-1',
          positionId: 'pos-1',
          positionName: 'City Council',
          officeTermLength: '4 years',
          electionDay: '2026-11-03',
          electionId: 'elec-1',
          partisanType: 'partisan',
          hasPrimary: true,
          primaryElectionDate: '2026-08-04',
          primaryElectionId: 'prim-elec-1',
          filingPeriodsStart: '2026-01-01',
          filingPeriodsEnd: '2026-06-01',
        }),
      )
    })
  })

  it('signals hydration via onHydratingChange across the request lifecycle', async () => {
    mockClientFetch.mockResolvedValueOnce({
      data: [sampleRace()],
      ok: true,
    } as unknown as Awaited<ReturnType<typeof clientFetch>>)

    let resolveHydrate: (value: unknown) => void = () => undefined
    mockClientRequest.mockImplementationOnce(
      () =>
        new Promise<unknown>((resolve) => {
          resolveHydrate = resolve
        }) as ReturnType<typeof clientRequest>,
    )

    const onHydratingChange = vi.fn()
    renderStep({ onHydratingChange })
    fireEvent.change(screen.getByLabelText(/zip code/i), {
      target: { value: '82001' },
    })
    fireEvent.click(screen.getByRole('button', { name: /search/i }))

    const raceButton = await screen.findByRole('radio', {
      name: /city council election date/i,
    })
    fireEvent.click(raceButton)

    await waitFor(() => {
      expect(onHydratingChange).toHaveBeenCalledWith(true)
    })

    resolveHydrate({
      data: {
        id: 'race-server',
        brPositionId: 'br-pos-1',
        position: {
          id: 'pos-1',
          name: 'City Council',
          electionFrequencies: [{ frequency: 4 }],
        },
        election: { id: 'elec-1', electionDay: '2026-11-03' },
      },
      ok: true,
      status: 200,
      headers: new Headers(),
    })

    await waitFor(() => {
      expect(onHydratingChange).toHaveBeenLastCalledWith(false)
    })
  })

  it('reverts the optimistic selection and signals an error when hydration fails', async () => {
    mockClientFetch.mockResolvedValueOnce({
      data: [sampleRace()],
      ok: true,
    } as unknown as Awaited<ReturnType<typeof clientFetch>>)

    mockClientRequest.mockRejectedValueOnce(new Error('boom'))

    const onSelect = vi.fn()
    renderStep({ onSelect })
    fireEvent.change(screen.getByLabelText(/zip code/i), {
      target: { value: '82001' },
    })
    fireEvent.click(screen.getByRole('button', { name: /search/i }))

    const raceButton = await screen.findByRole('radio', {
      name: /city council election date/i,
    })
    onSelect.mockClear()
    fireEvent.click(raceButton)

    // Optimistic select fires immediately so the radio reflects the click.
    expect(onSelect).toHaveBeenCalledWith(
      expect.objectContaining({ raceId: 'race-1' }),
    )

    await waitFor(() => {
      expect(mockErrorSnackbar).toHaveBeenCalledWith(
        'Could not load race details. Please try again.',
      )
    })

    // Hydration failure rolls the selection back.
    expect(onSelect).toHaveBeenLastCalledWith(undefined)
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
      screen.getByText(/enter your zip code/i),
    ).toBeInTheDocument()
  })
})

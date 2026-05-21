import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import BallotRaces from './BallotRaces'
import type { Campaign } from 'helpers/types'
import { clientRequest } from 'gpApi/typed-request'
import { useSnackbar } from 'helpers/useSnackbar'
import type { Race } from './types'

const mockUpdateCampaign = vi.fn().mockResolvedValue({})
const mockErrorSnackbar = vi.fn()

vi.mock('app/onboarding/shared/ajaxActions', () => ({
  createCampaignWithOffice: vi.fn(),
  onboardingStep: vi.fn(),
  updateCampaign: (...args: unknown[]) => mockUpdateCampaign(...args),
}))

vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: vi.fn() }),
}))

const useQueryMock = vi.fn(() => ({
  isPending: false,
  data: {
    sortedRaces: [] as Race[],
    fuse: { search: () => [] as { item: Race }[] },
  },
}))

vi.mock('@tanstack/react-query', () => ({
  useQuery: () => useQueryMock(),
}))

vi.mock('gpApi/typed-request', () => ({
  clientRequest: vi.fn().mockResolvedValue({ data: {}, ok: true }),
}))

vi.mock('helpers/useSnackbar', () => ({
  useSnackbar: vi.fn(),
}))

vi.mock('./CantFindRaceModal', () => ({
  default: ({
    onSaveCustomOffice,
  }: {
    onSaveCustomOffice: (campaign: Campaign, customPositionName: string) => void
  }) => (
    <button
      data-testid="save-custom-office"
      onClick={() =>
        onSaveCustomOffice(
          {
            details: {
              city: 'Austin',
              district: '2',
              electionDate: '2026-11-03',
              officeTermLength: '4 years',
              state: 'TX',
            },
          } as unknown as Campaign,
          'School Board',
        )
      }
    >
      Save custom office
    </button>
  ),
}))

const campaign = {
  id: 1,
  createdAt: '2026-01-01',
  updatedAt: '2026-01-01',
  slug: 'test-campaign',
  isActive: true,
  isDemo: false,
  data: {},
  details: {
    zip: '78701',
    raceId: 'race-1',
    electionId: 'elec-1',
  },
  aiContent: {},
  vendorTsData: {},
  userId: 1,
  canDownloadFederal: false,
  completedTaskIds: [],
  hasFreeTextsOffer: false,
} as Campaign

beforeEach(() => {
  mockUpdateCampaign.mockClear()
  mockErrorSnackbar.mockReset()
  vi.mocked(clientRequest).mockReset()
  vi.mocked(clientRequest).mockResolvedValue({
    data: {},
    ok: true,
    status: 200,
    headers: new Headers(),
  } as any)
  vi.mocked(useSnackbar).mockReturnValue({
    errorSnackbar: mockErrorSnackbar,
    successSnackbar: vi.fn(),
    displaySnackbar: vi.fn(),
  } as any)
  useQueryMock.mockReturnValue({
    isPending: false,
    data: {
      sortedRaces: [] as Race[],
      fuse: { search: () => [] as { item: Race }[] },
    },
  })
})

describe('BallotRaces', () => {
  it('sends campaign details and patches org with customPositionName when saving custom office', async () => {
    vi.doMock('./RaceCard', () => ({
      default: () => null,
    }))

    render(
      <BallotRaces
        campaign={campaign}
        onSelect={vi.fn()}
        zip="78701"
        selectedOffice={false}
      />,
    )

    fireEvent.click(screen.getByText("I don't see my office"))
    fireEvent.click(screen.getByTestId('save-custom-office'))

    await waitFor(() => {
      expect(mockUpdateCampaign).toHaveBeenCalledWith(
        expect.arrayContaining([
          { key: 'details.raceId', value: null },
          { key: 'details.electionId', value: null },
          { key: 'details.city', value: 'Austin' },
          { key: 'details.state', value: 'TX' },
        ]),
      )
    })

    await waitFor(() => {
      expect(clientRequest).toHaveBeenCalledWith(
        'PATCH /v1/organizations/:slug',
        {
          slug: 'campaign-1',
          customPositionName: 'School Board',
        },
      )
    })
  })

  it('hydrates the selected race via /race-by-position and calls onSelect with full shape', async () => {
    const leanRace: Race = {
      id: 'race-1',
      brPositionId: 'br-pos-123',
      position: { id: 'pos-1', name: 'Mayor' },
      election: { id: 'elec-1', electionDay: '2026-11-03' },
    }

    const fullRace: Race = {
      id: 'br-original-id',
      brPositionId: 'br-pos-123',
      position: {
        id: 'pos-1',
        name: 'Mayor',
        partisanType: 'partisan',
        electionFrequencies: [{ frequency: 4 }],
      },
      election: {
        id: 'elec-1',
        electionDay: '2026-11-03',
        primaryElectionDate: '2026-03-03',
      },
      filingPeriods: [{ startOn: '2026-01-01', endOn: '2026-02-01' }],
    }

    useQueryMock.mockReturnValue({
      isPending: false,
      data: {
        sortedRaces: [leanRace],
        fuse: { search: () => [{ item: leanRace }] },
      },
    })

    vi.mocked(clientRequest).mockResolvedValueOnce({
      data: fullRace,
      ok: true,
      status: 200,
      headers: new Headers(),
    } as any)

    const onSelect = vi.fn()

    render(
      <BallotRaces
        campaign={campaign}
        onSelect={onSelect}
        zip="78701"
        selectedOffice={false}
      />,
    )

    fireEvent.click(screen.getByText('Mayor'))

    await waitFor(() => {
      expect(clientRequest).toHaveBeenCalledWith(
        'GET /v1/elections/race-by-position',
        {
          brPositionId: 'br-pos-123',
          zip: '78701',
          electionDate: '2026-11-03',
        },
      )
    })

    await waitFor(() => {
      expect(onSelect).toHaveBeenCalledWith(
        expect.objectContaining({
          id: 'race-1',
          brPositionId: 'br-pos-123',
          filingPeriods: [{ startOn: '2026-01-01', endOn: '2026-02-01' }],
          position: expect.objectContaining({ partisanType: 'partisan' }),
        }),
      )
    })
  })

  it('shows an error snackbar and does not call onSelect when hydration errors', async () => {
    const leanRace: Race = {
      id: 'race-1',
      brPositionId: 'br-pos-123',
      position: { id: 'pos-1', name: 'Mayor' },
      election: { id: 'elec-1', electionDay: '2026-11-03' },
    }

    useQueryMock.mockReturnValue({
      isPending: false,
      data: {
        sortedRaces: [leanRace],
        fuse: { search: () => [{ item: leanRace }] },
      },
    })

    vi.mocked(clientRequest).mockRejectedValueOnce(new Error('boom'))

    const onSelect = vi.fn()

    render(
      <BallotRaces
        campaign={campaign}
        onSelect={onSelect}
        zip="78701"
        selectedOffice={false}
      />,
    )

    fireEvent.click(screen.getByText('Mayor'))

    await waitFor(() => {
      expect(mockErrorSnackbar).toHaveBeenCalledWith(
        'Could not load race details. Please try again.',
      )
    })

    expect(onSelect).not.toHaveBeenCalled()
  })
})

import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import BallotRaces from './BallotRaces'
import type { Campaign } from 'helpers/types'
import { clientRequest } from 'gpApi/typed-request'

const mockUpdateCampaign = vi.fn().mockResolvedValue({})

vi.mock('app/onboarding/shared/ajaxActions', () => ({
  createCampaignWithOffice: vi.fn(),
  onboardingStep: vi.fn(),
  updateCampaign: (...args: unknown[]) => mockUpdateCampaign(...args),
}))

vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: vi.fn() }),
}))

vi.mock('@tanstack/react-query', () => ({
  useQuery: () => ({
    isPending: false,
    data: {
      sortedRaces: [],
      fuse: { search: () => [] },
    },
  }),
}))

vi.mock('gpApi/typed-request', () => ({
  clientRequest: vi.fn().mockResolvedValue({ data: {}, ok: true }),
}))

vi.mock('./RaceCard', () => ({
  default: () => null,
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

describe('BallotRaces', () => {
  it('sends campaign details and patches org with customPositionName when saving custom office', async () => {
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
})

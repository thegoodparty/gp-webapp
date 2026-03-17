import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import BallotRaces from './BallotRaces'
import type { Campaign } from 'helpers/types'

const mockUpdateCampaign = vi.fn().mockResolvedValue({})

vi.mock('app/(candidate)/onboarding/shared/ajaxActions', () => ({
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

vi.mock('./RaceCard', () => ({
  default: () => null,
}))

vi.mock('./CantFindRaceModal', () => ({
  default: ({
    onSaveCustomOffice,
  }: {
    onSaveCustomOffice: (campaign: Campaign) => void
  }) => (
    <button
      data-testid="save-custom-office"
      onClick={() =>
        onSaveCustomOffice({
          details: {
            office: 'School Board',
            city: 'Austin',
            district: '2',
            electionDate: '2026-11-03',
            officeTermLength: '4 years',
            state: 'TX',
          },
        } as Campaign)
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
    positionId: 'pos-1',
  },
  aiContent: {},
  vendorTsData: {},
  userId: 1,
  canDownloadFederal: false,
  completedTaskIds: [],
  hasFreeTextsOffer: false,
} as Campaign

describe('BallotRaces', () => {
  it('clears raceId/electionId/positionId when saving custom office', async () => {
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
          { key: 'details.positionId', value: null },
          { key: 'details.electionId', value: null },
        ]),
      )
    })
  })
})

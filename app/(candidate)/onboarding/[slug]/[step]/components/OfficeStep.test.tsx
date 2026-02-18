import { describe, it, expect, vi, beforeEach, type Mock } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import OfficeStep from './OfficeStep'
import { clientFetch } from 'gpApi/clientFetch'
import { apiRoutes } from 'gpApi/routes'
import type { Campaign } from 'helpers/types'

// Mock all external dependencies
vi.mock('gpApi/clientFetch', () => ({
  clientFetch: vi.fn(),
}))

vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: vi.fn() }),
}))

vi.mock('app/(candidate)/onboarding/shared/ajaxActions', () => ({
  onboardingStep: vi.fn(),
  updateCampaign: vi.fn().mockResolvedValue({}),
}))

vi.mock('helpers/analyticsHelper', () => ({
  buildTrackingAttrs: () => ({}),
  EVENTS: { Onboarding: { OfficeStep: { ClickNext: '', OfficeSelected: '', OfficeCompleted: '' } } },
  trackEvent: vi.fn(),
}))

vi.mock('@shared/hooks/useTrackOfficeSearch', () => ({
  useTrackOfficeSearch: vi.fn(),
}))

vi.mock('@shared/hooks/useUser', () => ({
  useUser: () => [{ id: 1 }],
}))

vi.mock('@shared/utils/analytics', () => ({
  identifyUser: vi.fn().mockResolvedValue(undefined),
}))

// Stub child components to avoid deep dependency trees
vi.mock('./ballotOffices/BallotRaces', () => ({
  default: ({ onSelect }: { onSelect: (office: unknown) => void }) => (
    <button
      data-testid="select-office"
      onClick={() =>
        onSelect({
          id: 'race-1',
          position: { id: 'pos-1', name: 'Mayor', state: 'CA', level: 'local' },
          election: { id: 'elec-1', state: 'CA', electionDay: '2026-11-03' },
          filingPeriods: [],
        })
      }
    >
      Select Office
    </button>
  ),
}))

vi.mock('./OfficeStepForm', () => ({
  default: () => <div data-testid="office-step-form" />,
}))

vi.mock('@shared/buttons/Button', () => ({
  default: ({
    children,
    onClick,
    disabled,
    ...rest
  }: {
    children: React.ReactNode
    onClick?: () => void
    disabled?: boolean
  }) => (
    <button onClick={onClick} disabled={disabled} {...rest}>
      {children}
    </button>
  ),
}))

const baseCampaign: Campaign = {
  id: 1,
  createdAt: '2025-01-01',
  updatedAt: '2025-01-01',
  slug: 'test-campaign',
  isActive: true,
  isDemo: false,
  data: {} as Campaign['data'],
  details: { zip: '90210' } as Campaign['details'],
  aiContent: {} as Campaign['aiContent'],
  vendorTsData: {} as Campaign['vendorTsData'],
  userId: 1,
  canDownloadFederal: false,
  completedTaskIds: [],
  hasFreeTextsOffer: false,
}

describe('OfficeStep', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    ;(clientFetch as Mock).mockResolvedValue({
      data: baseCampaign,
      ok: true,
      status: 200,
    })
  })

  async function selectOfficeAndSave() {
    fireEvent.click(screen.getByTestId('select-office'))
    const saveButton = screen.getByRole('button', { name: /save/i })
    fireEvent.click(saveButton)
  }

  it('calls the user endpoint when not in admin mode', async () => {
    render(<OfficeStep campaign={baseCampaign} />)

    await selectOfficeAndSave()

    await waitFor(() => {
      expect(clientFetch).toHaveBeenCalledWith(
        apiRoutes.campaign.raceTargetDetails.update,
        { slug: undefined },
      )
    })
  })

  it('calls the admin endpoint when in admin mode', async () => {
    render(<OfficeStep campaign={baseCampaign} adminMode />)

    await selectOfficeAndSave()

    await waitFor(() => {
      expect(clientFetch).toHaveBeenCalledWith(
        apiRoutes.campaign.raceTargetDetails.adminUpdate,
        { slug: 'test-campaign' },
      )
    })
  })
})

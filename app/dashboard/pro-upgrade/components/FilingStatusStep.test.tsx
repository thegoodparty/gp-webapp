import { describe, it, expect, vi, beforeEach } from 'vitest'
import { screen, fireEvent, waitFor } from '@testing-library/react'
import { render, testQueryClient } from 'helpers/test-utils/render'
import { CAMPAIGN_QUERY_KEY } from '@shared/hooks/CampaignProvider'
import { updateCampaign } from 'app/onboarding/shared/ajaxActions'
import { EVENTS, trackEvent } from 'helpers/analyticsHelper'
import FilingStatusStep from './FilingStatusStep'
import { useProUpgradeWizard } from './ProUpgradeWizard'

vi.mock('./ProUpgradeWizard', () => ({
  useProUpgradeWizard: vi.fn(),
}))

vi.mock('app/onboarding/shared/ajaxActions', () => ({
  updateCampaign: vi.fn(),
}))

const errorSnackbar = vi.fn()
vi.mock('helpers/useSnackbar', () => ({
  useSnackbar: () => ({ errorSnackbar }),
}))

// Keep EVENTS real; stub trackEvent so we don't hit analytics in tests.
vi.mock('helpers/analyticsHelper', async (importOriginal) => {
  const actual =
    await importOriginal<typeof import('helpers/analyticsHelper')>()
  return { ...actual, trackEvent: vi.fn() }
})

const mockUseProUpgradeWizard = vi.mocked(useProUpgradeWizard)
const mockUpdateCampaign = vi.mocked(updateCampaign)
const goToStep = vi.fn()

describe('FilingStatusStep', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockUseProUpgradeWizard.mockReturnValue({
      currentStep: 'status',
      goToStep,
      goToNextStep: vi.fn(),
      goToPreviousStep: vi.fn(),
    })
    // Default: persistence succeeds and returns the updated campaign.
    mockUpdateCampaign.mockResolvedValue({ id: 1 } as never)
  })

  it('fires the viewed analytics event on mount', () => {
    render(<FilingStatusStep />)
    expect(trackEvent).toHaveBeenCalledWith(
      EVENTS.ProUpgrade.Compliance.FilingStatusViewed,
    )
  })

  it('renders both options with their titles and descriptions', () => {
    render(<FilingStatusStep />)
    expect(screen.getByText("Yes, I'm already filed")).toBeInTheDocument()
    expect(
      screen.getByText('I have my campaign EIN and filing documents ready'),
    ).toBeInTheDocument()
    expect(screen.getByText('No, not yet')).toBeInTheDocument()
    expect(
      screen.getByText('I still need to file for this election'),
    ).toBeInTheDocument()
  })

  it('persists hasFiledForRace=true and advances to guidance when "Yes" is selected', async () => {
    render(<FilingStatusStep />)

    fireEvent.click(screen.getByText("Yes, I'm already filed"))

    await waitFor(() => expect(goToStep).toHaveBeenCalledWith('guidance'))
    expect(mockUpdateCampaign).toHaveBeenCalledWith([
      { key: 'details.hasFiledForRace', value: true },
    ])
    // The cache write is load-bearing: ProUpgradeEntry derives the resume step
    // from the campaign in this cache, so without it a returning candidate is
    // re-asked the question they just answered.
    expect(testQueryClient.getQueryData(CAMPAIGN_QUERY_KEY)).toEqual({ id: 1 })
    expect(trackEvent).toHaveBeenCalledWith(
      EVENTS.ProUpgrade.Compliance.FilingStatusAlreadyFiled,
    )
    expect(errorSnackbar).not.toHaveBeenCalled()
  })

  it('persists hasFiledForRace=false and routes to filing-instructions when "No" is selected', async () => {
    render(<FilingStatusStep />)

    fireEvent.click(screen.getByText('No, not yet'))

    await waitFor(() =>
      expect(goToStep).toHaveBeenCalledWith('filing-instructions'),
    )
    expect(mockUpdateCampaign).toHaveBeenCalledWith([
      { key: 'details.hasFiledForRace', value: false },
    ])
    expect(testQueryClient.getQueryData(CAMPAIGN_QUERY_KEY)).toEqual({ id: 1 })
    expect(trackEvent).toHaveBeenCalledWith(
      EVENTS.ProUpgrade.Compliance.FilingStatusNotFiled,
    )
    expect(errorSnackbar).not.toHaveBeenCalled()
  })

  it('shows an error and does not navigate when persistence fails', async () => {
    // updateCampaign swallows API errors and returns false; navigating anyway
    // would strand an un-persisted answer (re-entry would re-ask the question).
    mockUpdateCampaign.mockResolvedValue(false)

    render(<FilingStatusStep />)

    fireEvent.click(screen.getByText("Yes, I'm already filed"))

    await waitFor(() => expect(errorSnackbar).toHaveBeenCalled())
    expect(goToStep).not.toHaveBeenCalled()
    expect(testQueryClient.getQueryData(CAMPAIGN_QUERY_KEY)).toBeUndefined()
  })
})

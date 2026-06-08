import { describe, it, expect, vi, beforeEach } from 'vitest'
import { screen, fireEvent, waitFor } from '@testing-library/react'
import { render, testQueryClient } from 'helpers/test-utils/render'
import { CAMPAIGN_QUERY_KEY } from '@shared/hooks/CampaignProvider'
import { useCampaign } from '@shared/hooks/useCampaign'
import { updateCampaign } from 'app/onboarding/shared/ajaxActions'
import { EVENTS, trackEvent } from 'helpers/analyticsHelper'
import EinStep from './EinStep'
import { useProUpgradeWizard } from './ProUpgradeWizard'

vi.mock('./ProUpgradeWizard', () => ({
  useProUpgradeWizard: vi.fn(),
}))

vi.mock('@shared/hooks/useCampaign', () => ({
  useCampaign: vi.fn(),
}))

vi.mock('app/onboarding/shared/ajaxActions', () => ({
  updateCampaign: vi.fn(),
}))

const errorSnackbar = vi.fn()
vi.mock('helpers/useSnackbar', () => ({
  useSnackbar: () => ({ errorSnackbar }),
}))

// Keep EVENTS real; stub trackEvent so we don't hit analytics in tests. The real
// EinCheckInput / AsyncValidationIcon also call trackEvent, so a real EVENTS
// tree keeps those wired without exploding.
vi.mock('helpers/analyticsHelper', async (importOriginal) => {
  const actual =
    await importOriginal<typeof import('helpers/analyticsHelper')>()
  return { ...actual, trackEvent: vi.fn() }
})

const mockUseProUpgradeWizard = vi.mocked(useProUpgradeWizard)
const mockUseCampaign = vi.mocked(useCampaign)
const mockUpdateCampaign = vi.mocked(updateCampaign)
const goToNextStep = vi.fn()

// A well-formed EIN with an IRS-issued prefix (12) that is not a placeholder.
const CLEAN_EIN = '12-3456780'

const setEin = (value: string) => {
  fireEvent.change(screen.getByLabelText('Campaign EIN'), { target: { value } })
}

const seedCampaign = (einNumber?: string) =>
  mockUseCampaign.mockReturnValue([
    einNumber ? ({ details: { einNumber } } as never) : null,
  ])

describe('EinStep', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockUseProUpgradeWizard.mockReturnValue({
      currentStep: 'ein',
      goToStep: vi.fn(),
      goToNextStep,
      goToPreviousStep: vi.fn(),
    })
    // Default: no EIN on file yet, persistence succeeds.
    seedCampaign(undefined)
    mockUpdateCampaign.mockResolvedValue({ id: 1 } as never)
  })

  it('fires the viewed analytics event on mount', () => {
    render(<EinStep />)
    expect(trackEvent).toHaveBeenCalledWith(
      EVENTS.ProUpgrade.Compliance.EinViewed,
    )
  })

  it('renders the EIN input and the IRS link', () => {
    render(<EinStep />)
    expect(screen.getByLabelText('Campaign EIN')).toBeInTheDocument()
    const link = screen.getByRole('link', { name: /get a free ein/i })
    expect(link).toHaveAttribute('href', expect.stringContaining('irs.gov'))
  })

  it('keeps Continue disabled for a format-invalid (incomplete) EIN', () => {
    render(<EinStep />)
    setEin('12')
    expect(screen.getByRole('button', { name: 'Continue' })).toBeDisabled()
    expect(mockUpdateCampaign).not.toHaveBeenCalled()
  })

  it('disables Continue and shows the Phase 1 error copy for a non-IRS-prefix EIN', async () => {
    render(<EinStep />)

    // 07 is not an IRS-issued prefix, but the value passes the shape-only check.
    setEin('07-1234567')

    expect(
      await screen.findByText(/prefix isn't one the IRS issues/i),
    ).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Continue' })).toBeDisabled()
    expect(mockUpdateCampaign).not.toHaveBeenCalled()
  })

  it('disables Continue and shows the placeholder error copy for a placeholder EIN', async () => {
    render(<EinStep />)

    // All-same-digit is a classic placeholder the sanity check rejects.
    setEin('00-0000000')

    expect(
      await screen.findByText(/looks like a placeholder/i),
    ).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Continue' })).toBeDisabled()
    expect(mockUpdateCampaign).not.toHaveBeenCalled()
  })

  it('persists einNumber + validatedEin and advances for a clean EIN', async () => {
    render(<EinStep />)

    setEin(CLEAN_EIN)

    const continueButton = screen.getByRole('button', { name: 'Continue' })
    await waitFor(() => expect(continueButton).toBeEnabled())

    fireEvent.click(continueButton)

    await waitFor(() => expect(goToNextStep).toHaveBeenCalledTimes(1))
    expect(mockUpdateCampaign).toHaveBeenCalledWith([
      { key: 'details.einNumber', value: CLEAN_EIN },
      { key: 'details.validatedEin', value: true },
    ])
    // The cache write is load-bearing: ProUpgradeEntry derives the resume step
    // from the campaign in this cache, so without it a returning candidate is
    // re-asked for the EIN they just entered.
    expect(testQueryClient.getQueryData(CAMPAIGN_QUERY_KEY)).toEqual({ id: 1 })
    expect(trackEvent).toHaveBeenCalledWith(
      EVENTS.ProUpgrade.Compliance.EinContinue,
    )
    expect(errorSnackbar).not.toHaveBeenCalled()
  })

  it('shows an error and does not advance when persistence fails', async () => {
    // updateCampaign swallows API errors and returns false; advancing anyway
    // would strand an un-persisted EIN (re-entry would re-prompt).
    mockUpdateCampaign.mockResolvedValue(false)

    render(<EinStep />)

    setEin(CLEAN_EIN)
    const continueButton = screen.getByRole('button', { name: 'Continue' })
    await waitFor(() => expect(continueButton).toBeEnabled())

    fireEvent.click(continueButton)

    await waitFor(() => expect(errorSnackbar).toHaveBeenCalled())
    expect(goToNextStep).not.toHaveBeenCalled()
    expect(testQueryClient.getQueryData(CAMPAIGN_QUERY_KEY)).toBeUndefined()
    // The continue event must not fire for a write that never committed.
    expect(trackEvent).not.toHaveBeenCalledWith(
      EVENTS.ProUpgrade.Compliance.EinContinue,
    )
  })

  it('prefills a previously entered EIN and treats the step as complete', async () => {
    seedCampaign(CLEAN_EIN)

    render(<EinStep />)

    expect(screen.getByLabelText('Campaign EIN')).toHaveValue(CLEAN_EIN)
    // A prefilled, valid EIN means the step is already satisfied: Continue is
    // enabled on mount with no edits.
    await waitFor(() =>
      expect(screen.getByRole('button', { name: 'Continue' })).toBeEnabled(),
    )
  })

  it('syncs a persisted EIN that resolves after first render', async () => {
    // No SSR initialData: the shared campaign query is still pending on mount,
    // so useCampaign returns null, then resolves with the saved EIN.
    seedCampaign(undefined)
    const { rerender } = render(<EinStep />)
    expect(screen.getByLabelText('Campaign EIN')).toHaveValue('')

    seedCampaign(CLEAN_EIN)
    rerender(<EinStep />)

    await waitFor(() =>
      expect(screen.getByLabelText('Campaign EIN')).toHaveValue(CLEAN_EIN),
    )
    expect(screen.getByRole('button', { name: 'Continue' })).toBeEnabled()
  })

  it('does not flash an error for a prefilled complete-but-bad EIN', async () => {
    // A legacy EIN saved before the sanity rules existed: format-valid but a
    // non-IRS prefix. It must stay neutral on mount (no red error) until the
    // candidate edits the untouched field, and Continue stays disabled.
    seedCampaign('07-1234567')

    render(<EinStep />)

    expect(screen.getByLabelText('Campaign EIN')).toHaveValue('07-1234567')
    expect(
      screen.queryByText(/prefix isn't one the IRS issues/i),
    ).not.toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Continue' })).toBeDisabled()

    // Once the candidate edits it, the sanity verdict (and error) surfaces.
    fireEvent.change(screen.getByLabelText('Campaign EIN'), {
      target: { value: '08-1234567' },
    })
    expect(
      await screen.findByText(/prefix isn't one the IRS issues/i),
    ).toBeInTheDocument()
  })
})

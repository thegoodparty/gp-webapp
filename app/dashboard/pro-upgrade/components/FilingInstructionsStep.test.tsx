import { describe, it, expect, vi, beforeEach } from 'vitest'
import { screen, fireEvent, waitFor } from '@testing-library/react'
import { render } from 'helpers/test-utils/render'
import { api } from 'helpers/test-utils/api-mocking'
import { router } from 'helpers/test-utils/router-mocking'
import { useCampaign } from '@shared/hooks/useCampaign'
import { EVENTS, trackEvent } from 'helpers/analyticsHelper'
import type { Campaign } from 'helpers/types'
import FilingInstructionsStep from './FilingInstructionsStep'

vi.mock('@shared/hooks/useCampaign', () => ({
  useCampaign: vi.fn(),
}))

const successSnackbar = vi.fn()
const errorSnackbar = vi.fn()
vi.mock('helpers/useSnackbar', () => ({
  useSnackbar: () => ({ successSnackbar, errorSnackbar }),
}))

// Keep EVENTS real; stub trackEvent so we don't hit analytics in tests.
vi.mock('helpers/analyticsHelper', async (importOriginal) => {
  const actual =
    await importOriginal<typeof import('helpers/analyticsHelper')>()
  return { ...actual, trackEvent: vi.fn() }
})

const mockUseCampaign = vi.mocked(useCampaign)

const EMAIL_ROUTE = 'POST /v1/campaigns/mine/filing-instructions/email' as const

// A fully-populated campaign: filing window on details, fee/requirements/office
// on raceTargetMetrics. Individual tests override pieces to exercise omission.
const fullCampaign = {
  id: 1,
  details: {
    filingPeriodsStart: '2026-06-01',
    filingPeriodsEnd: '2026-06-30',
  },
  raceTargetMetrics: {
    filingFee: 0,
    filingRequirementsText:
      'Signature requirement is between 20 and 100 qualified electors.',
    filingOfficeAddress: '270 Pleasant St, Rockland, ME 04841',
    filingPhoneNumber: '(207) 594-8431',
    paperworkInstructions:
      'Complete and submit the Declaration of Candidacy form.',
  },
} as unknown as Campaign

const setCampaign = (campaign: Campaign | null): void => {
  mockUseCampaign.mockReturnValue([campaign] as never)
}

describe('FilingInstructionsStep', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    setCampaign(fullCampaign)
    api.mock(EMAIL_ROUTE, { status: 200, data: { success: true } })
  })

  it('fires the viewed analytics event on mount', () => {
    render(<FilingInstructionsStep />)
    expect(trackEvent).toHaveBeenCalledWith(
      EVENTS.ProUpgrade.Compliance.FilingInstructionsViewed,
    )
  })

  it('renders the filing window, fee, and requirements from campaign data', () => {
    render(<FilingInstructionsStep />)

    expect(screen.getByText('Filing window')).toBeInTheDocument()
    // Both dates rendered and joined — verifies the window composition without
    // pinning a timezone-sensitive exact day.
    expect(screen.getByText(/2026.*–.*2026/)).toBeInTheDocument()

    expect(screen.getByText('Filing requirements')).toBeInTheDocument()
    expect(
      screen.getByText(
        'Filing fee is $0. Signature requirement is between 20 and 100 qualified electors.',
      ),
    ).toBeInTheDocument()
  })

  it('renders the office-contact block (address + phone) when present', () => {
    render(<FilingInstructionsStep />)

    expect(screen.getByText('Filing office')).toBeInTheDocument()
    expect(
      screen.getByText('270 Pleasant St, Rockland, ME 04841'),
    ).toBeInTheDocument()
    expect(screen.getByText('(207) 594-8431')).toBeInTheDocument()
    expect(screen.getByText('Paperwork')).toBeInTheDocument()
  })

  it('omits requirements, paperwork, and office blocks when metrics are absent', () => {
    setCampaign({ id: 1, details: {} } as unknown as Campaign)
    render(<FilingInstructionsStep />)

    // Window still renders (its own AC); the data-dependent blocks do not.
    expect(screen.getByText('Filing window')).toBeInTheDocument()
    expect(screen.queryByText('Filing requirements')).not.toBeInTheDocument()
    expect(screen.queryByText('Paperwork')).not.toBeInTheDocument()
    expect(screen.queryByText('Filing office')).not.toBeInTheDocument()
  })

  it('is a dead-end: offers a dashboard exit and no payment CTA', () => {
    render(<FilingInstructionsStep />)

    expect(
      screen.getByRole('button', { name: 'Continue to dashboard' }),
    ).toBeInTheDocument()
    expect(screen.queryByText(/payment/i)).not.toBeInTheDocument()
    expect(screen.queryByText(/continue to payment/i)).not.toBeInTheDocument()
  })

  it('routes to the dashboard when the exit is clicked', () => {
    render(<FilingInstructionsStep />)

    fireEvent.click(
      screen.getByRole('button', { name: 'Continue to dashboard' }),
    )

    expect(router.push).toHaveBeenCalledWith('/dashboard')
    expect(trackEvent).toHaveBeenCalledWith(
      EVENTS.ProUpgrade.Compliance.FilingInstructionsExit,
    )
  })

  it('emails the filing instructions and confirms success', async () => {
    const onRequest = vi.fn()
    api.mock(EMAIL_ROUTE, () => {
      onRequest()
      return { status: 200, data: { success: true } }
    })

    render(<FilingInstructionsStep />)

    fireEvent.click(screen.getByRole('button', { name: /email this to me/i }))

    await waitFor(() => expect(successSnackbar).toHaveBeenCalled())
    // The real clientRequest path hit the endpoint, not just a mocked fn.
    expect(onRequest).toHaveBeenCalledTimes(1)
    expect(trackEvent).toHaveBeenCalledWith(
      EVENTS.ProUpgrade.Compliance.FilingInstructionsEmail,
    )
    expect(errorSnackbar).not.toHaveBeenCalled()
  })

  it('shows an error snackbar when the email request fails', async () => {
    api.mock(EMAIL_ROUTE, { status: 500, data: { message: 'boom' } })

    render(<FilingInstructionsStep />)

    fireEvent.click(screen.getByRole('button', { name: /email this to me/i }))

    await waitFor(() => expect(errorSnackbar).toHaveBeenCalled())
    expect(successSnackbar).not.toHaveBeenCalled()
  })
})

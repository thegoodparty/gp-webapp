import { describe, it, expect, vi, beforeEach } from 'vitest'
import { screen, fireEvent, waitFor } from '@testing-library/react'
import { render } from 'helpers/test-utils/render'
import { apiRoutes } from 'gpApi/routes'
import { useCampaign } from '@shared/hooks/useCampaign'
import { submitTcrCompliance } from 'app/dashboard/profile/texting-compliance/util/registrationFormData.util'
import { EVENTS, trackEvent } from 'helpers/analyticsHelper'
import FilingDetailsStep, {
  ballotLevelToOfficeLevel,
  getInitialFilingDetailsState,
} from './FilingDetailsStep'
import { useProUpgradeWizard } from './ProUpgradeWizard'

vi.mock('./ProUpgradeWizard', () => ({
  useProUpgradeWizard: vi.fn(),
}))

vi.mock('@shared/hooks/useCampaign', () => ({
  useCampaign: vi.fn(),
}))

// Keep toRegistrationFormData real (the test asserts the mapped payload shape);
// only stub the network submit so we can assert what it was called with and
// drive the success / failure branches.
vi.mock(
  'app/dashboard/profile/texting-compliance/util/registrationFormData.util',
  async (importOriginal) => {
    const actual =
      await importOriginal<
        typeof import('app/dashboard/profile/texting-compliance/util/registrationFormData.util')
      >()
    return { ...actual, submitTcrCompliance: vi.fn() }
  },
)

const errorSnackbar = vi.fn()
vi.mock('helpers/useSnackbar', () => ({
  useSnackbar: () => ({ errorSnackbar }),
}))

// AddressAutocomplete pulls in the Google Places widget; stub it with a button
// that fires onSelect so a test can supply a valid filing address.
vi.mock('@shared/AddressAutocomplete', () => ({
  default: ({
    onSelect,
  }: {
    onSelect: (place: { formatted_address: string; place_id: string }) => void
  }) => (
    <button
      type="button"
      data-testid="select-address"
      onClick={() =>
        onSelect({ formatted_address: '123 Main St', place_id: 'place-123' })
      }
    >
      select address
    </button>
  ),
}))

vi.mock('helpers/analyticsHelper', async (importOriginal) => {
  const actual =
    await importOriginal<typeof import('helpers/analyticsHelper')>()
  return { ...actual, trackEvent: vi.fn() }
})

const mockUseProUpgradeWizard = vi.mocked(useProUpgradeWizard)
const mockUseCampaign = vi.mocked(useCampaign)
const mockSubmit = vi.mocked(submitTcrCompliance)
const goToNextStep = vi.fn()

// A well-formed, non-placeholder EIN with an IRS-issued prefix.
const CLEAN_EIN = '12-3456780'

type CampaignDetails = {
  einNumber?: string
  campaignCommittee?: string
  ballotLevel?: string
}

const seedCampaign = (details: CampaignDetails | null) =>
  mockUseCampaign.mockReturnValue([
    details === null ? null : ({ details } as never),
  ])

// Fill every field a non-federal candidate must provide for a valid submit.
const fillValidNonFederalForm = () => {
  fireEvent.change(screen.getByLabelText('Campaign committee name'), {
    target: { value: 'Friends of Jane' },
  })
  fireEvent.change(screen.getByLabelText('Campaign filing link'), {
    target: { value: 'https://example.com/filing' },
  })
  fireEvent.change(screen.getByLabelText('Email'), {
    target: { value: 'jane@example.com' },
  })
  fireEvent.change(screen.getByLabelText('Phone'), {
    target: { value: '4155551234' },
  })
  fireEvent.click(screen.getByTestId('select-address'))
}

describe('ballotLevelToOfficeLevel', () => {
  it('maps the capitalized manual-entry office-level labels to the backend enum', () => {
    expect(ballotLevelToOfficeLevel('Federal')).toBe('federal')
    expect(ballotLevelToOfficeLevel('State')).toBe('state')
    expect(ballotLevelToOfficeLevel('Local/Township/City')).toBe('local')
    expect(ballotLevelToOfficeLevel('County/Regional')).toBe('local')
  })

  it('maps the lowercase BallotReady position.level values case-insensitively', () => {
    // BallotReady search stores lowercase levels (e.g. onboarding fixtures use
    // `level: 'local'`); these must not fall through to the local default for
    // federal/state, which would hide the FEC fields and submit a wrong level.
    expect(ballotLevelToOfficeLevel('federal')).toBe('federal')
    expect(ballotLevelToOfficeLevel('state')).toBe('state')
    expect(ballotLevelToOfficeLevel('local')).toBe('local')
  })

  it('defaults an unknown or missing ballot level to local', () => {
    expect(ballotLevelToOfficeLevel(undefined)).toBe('local')
    expect(ballotLevelToOfficeLevel(null)).toBe('local')
    expect(ballotLevelToOfficeLevel('Something else')).toBe('local')
  })
})

describe('getInitialFilingDetailsState', () => {
  it('prefills committee + EIN and derives officeLevel, leaving contact info blank', () => {
    const state = getInitialFilingDetailsState({
      details: {
        einNumber: CLEAN_EIN,
        campaignCommittee: 'Friends of Jane',
        ballotLevel: 'State',
      },
    } as never)
    expect(state.ein).toBe(CLEAN_EIN)
    expect(state.campaignCommitteeName).toBe('Friends of Jane')
    expect(state.officeLevel).toBe('state')
    // Filing contact info must be entered fresh to match the official filing.
    expect(state.email).toBe('')
    expect(state.phone).toBe('')
  })
})

describe('FilingDetailsStep', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockUseProUpgradeWizard.mockReturnValue({
      currentStep: 'filing-details',
      goToStep: vi.fn(),
      goToNextStep,
      goToPreviousStep: vi.fn(),
    })
    // Default: a local candidate with EIN already collected at the prior step.
    seedCampaign({ einNumber: CLEAN_EIN, ballotLevel: 'Local/Township/City' })
    mockSubmit.mockResolvedValue(undefined)
  })

  it('fires the viewed analytics event once the form is shown', () => {
    render(<FilingDetailsStep />)
    expect(trackEvent).toHaveBeenCalledWith(
      EVENTS.ProUpgrade.Compliance.FilingDetailsViewed,
    )
  })

  it('shows a loading placeholder (and no view event) until the campaign loads', () => {
    seedCampaign(null)
    render(<FilingDetailsStep />)
    expect(screen.getByText('Loading…')).toBeInTheDocument()
    expect(trackEvent).not.toHaveBeenCalledWith(
      EVENTS.ProUpgrade.Compliance.FilingDetailsViewed,
    )
  })

  it('renders the filing-details fields and the mismatch warning copy', () => {
    render(<FilingDetailsStep />)
    expect(
      screen.getByText('What are your campaign filing details?'),
    ).toBeInTheDocument()
    expect(screen.getByText(/it will take much longer/i)).toBeInTheDocument()
    expect(screen.getByLabelText('Campaign committee name')).toBeInTheDocument()
    expect(screen.getByLabelText('Campaign filing link')).toBeInTheDocument()
    expect(screen.getByLabelText('Email')).toBeInTheDocument()
    expect(screen.getByLabelText('Phone')).toBeInTheDocument()
    expect(screen.getByTestId('select-address')).toBeInTheDocument()
  })

  it('submits the mapped payload to createAgentic and advances on success', async () => {
    render(<FilingDetailsStep />)
    fillValidNonFederalForm()

    fireEvent.click(screen.getByRole('button', { name: 'Continue' }))

    await waitFor(() => expect(mockSubmit).toHaveBeenCalledTimes(1))
    expect(mockSubmit).toHaveBeenCalledWith(
      apiRoutes.campaign.tcrCompliance.createAgentic,
      expect.objectContaining({
        campaignCommitteeName: 'Friends of Jane',
        electionFilingLink: 'https://example.com/filing',
        officeLevel: 'local',
        ein: CLEAN_EIN,
        email: 'jane@example.com',
        phone: '4155551234',
        address: { formatted_address: '123 Main St', place_id: 'place-123' },
        // Non-federal committees submit as CANDIDATE.
        committeeType: 'CANDIDATE',
      }),
      expect.any(String),
    )
    await waitFor(() => expect(goToNextStep).toHaveBeenCalledTimes(1))
    expect(trackEvent).toHaveBeenCalledWith(
      EVENTS.Outreach.DlcCompliance.RegistrationSubmitted,
      expect.objectContaining({ email: 'jane@example.com' }),
    )
    expect(errorSnackbar).not.toHaveBeenCalled()
  })

  it('does not submit or advance when the form is invalid', () => {
    // No fields filled (and no EIN on file) → invalid form.
    seedCampaign({ ballotLevel: 'Local/Township/City' })
    render(<FilingDetailsStep />)

    fireEvent.click(screen.getByRole('button', { name: 'Continue' }))

    expect(mockSubmit).not.toHaveBeenCalled()
    expect(goToNextStep).not.toHaveBeenCalled()
  })

  it('surfaces an error and does not advance when the submit fails', async () => {
    mockSubmit.mockRejectedValue(new Error('boom'))
    render(<FilingDetailsStep />)
    fillValidNonFederalForm()

    fireEvent.click(screen.getByRole('button', { name: 'Continue' }))

    await waitFor(() => expect(errorSnackbar).toHaveBeenCalled())
    expect(goToNextStep).not.toHaveBeenCalled()
  })

  it('hides the FEC fields for a non-federal candidate', () => {
    render(<FilingDetailsStep />)
    expect(screen.queryByLabelText('FEC Committee ID')).not.toBeInTheDocument()
    expect(screen.queryByText('Committee type *')).not.toBeInTheDocument()
  })

  it('shows the FEC fields for a federal candidate', () => {
    seedCampaign({ einNumber: CLEAN_EIN, ballotLevel: 'Federal' })
    render(<FilingDetailsStep />)
    expect(screen.getByLabelText('FEC Committee ID')).toBeInTheDocument()
    expect(screen.getByText('Committee type *')).toBeInTheDocument()
  })

  it('submits fecCommitteeId + the chosen committeeType verbatim for a federal candidate', async () => {
    seedCampaign({ einNumber: CLEAN_EIN, ballotLevel: 'Federal' })
    render(<FilingDetailsStep />)

    fireEvent.change(screen.getByLabelText('Campaign committee name'), {
      target: { value: 'Friends of Jane' },
    })
    // Federal validation requires the filing link to be a fec.gov URL.
    fireEvent.change(screen.getByLabelText('Campaign filing link'), {
      target: { value: 'https://www.fec.gov/data/committee/C00123456' },
    })
    fireEvent.change(screen.getByLabelText('Email'), {
      target: { value: 'jane@example.com' },
    })
    fireEvent.change(screen.getByLabelText('Phone'), {
      target: { value: '4155551234' },
    })
    fireEvent.click(screen.getByTestId('select-address'))
    fireEvent.change(screen.getByLabelText('FEC Committee ID'), {
      target: { value: 'C00123456' },
    })
    // Committee type is the only Radix Select rendered (office level is hidden).
    fireEvent.click(screen.getByRole('combobox'))
    fireEvent.click(screen.getByRole('option', { name: 'House' }))

    fireEvent.click(screen.getByRole('button', { name: 'Continue' }))

    await waitFor(() => expect(mockSubmit).toHaveBeenCalledTimes(1))
    const [, payload] = mockSubmit.mock.calls[0]!
    // The federal branch must NOT strip the FEC id nor force CANDIDATE — that
    // distinction is the whole contract with the backend's federal branch.
    expect(payload).toEqual(
      expect.objectContaining({
        officeLevel: 'federal',
        fecCommitteeId: 'C00123456',
        committeeType: 'HOUSE',
      }),
    )
    expect(payload.committeeType).not.toBe('CANDIDATE')
    await waitFor(() => expect(goToNextStep).toHaveBeenCalledTimes(1))
  })

  it('does not double-submit on two rapid clicks', async () => {
    render(<FilingDetailsStep />)
    fillValidNonFederalForm()

    // Two synchronous clicks before the async `loading` prop can re-render: the
    // synchronous ref guard must block the second so only one TCR registration
    // is created.
    const button = screen.getByRole('button', { name: 'Continue' })
    fireEvent.click(button)
    fireEvent.click(button)

    await waitFor(() => expect(mockSubmit).toHaveBeenCalledTimes(1))
  })
})

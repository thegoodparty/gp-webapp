import { describe, it, expect, vi, beforeEach } from 'vitest'
import { screen, fireEvent, waitFor } from '@testing-library/react'
import { render } from 'helpers/test-utils/render'
import CommitteeCheckPage from './CommitteeCheckPage'
import { updateCampaign } from 'app/onboarding/shared/ajaxActions'

vi.mock('app/onboarding/shared/ajaxActions', () => ({
  updateCampaign: vi.fn(),
}))

// The real upload component reaches for useCampaign + clientFetch; the page seeds
// the uploaded filename from campaign.details.einSupportingDocument, so a stub is
// enough to satisfy the "file uploaded" precondition for enabling Next.
vi.mock(
  'app/dashboard/pro-sign-up/committee-check/components/CommitteeSupportingFilesUpload',
  () => ({
    CommitteeSupportingFilesUpload: () => null,
  }),
)

vi.mock('helpers/analyticsHelper', () => ({
  EVENTS: {
    ProUpgrade: {
      CommitteeCheck: {
        ClickNext: 'click_next',
        ClickBack: 'click_back',
        HoverNameHelp: 'hover_name_help',
        HoverEinHelp: 'hover_ein_help',
      },
    },
  },
  trackEvent: vi.fn(),
}))

const mockUpdateCampaign = vi.mocked(updateCampaign)

// Committee name + a previously-uploaded doc are pre-seeded so the only gate the
// test exercises is the EIN sanity check.
const seededCampaign = {
  details: {
    campaignCommittee: 'Smith for Council',
    einSupportingDocument: 'doc.pdf',
  },
}

const setEin = (value: string) => {
  const einInput = screen.getByLabelText('Campaign EIN')
  fireEvent.change(einInput, { target: { value } })
}

describe('CommitteeCheckPage EIN sanity gate', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('blocks submission and shows a specific error for a non-IRS-prefix EIN', async () => {
    render(<CommitteeCheckPage campaign={seededCampaign} />)

    // 07 is not an IRS-issued prefix, but the value passes the shape-only check.
    setEin('07-1234567')

    const nextButton = await screen.findByRole('button', { name: 'Next' })
    await waitFor(() => expect(nextButton).toBeEnabled())

    fireEvent.click(nextButton)

    expect(
      await screen.findByText(/prefix isn't one the IRS issues/i),
    ).toBeInTheDocument()
    expect(mockUpdateCampaign).not.toHaveBeenCalled()
  })

  it('shows an error icon (not a green check) on the EIN field for a bad EIN before submit', async () => {
    const { container } = render(
      <CommitteeCheckPage campaign={seededCampaign} />,
    )

    // Fully-formed shape but a placeholder value: the field icon must not show a
    // green check just because the shape is right. `validatedEin` is set inside
    // the async `doEinCheck` effect, so wait for the icon to settle rather than
    // racing the state update.
    setEin('00-0000000')

    await waitFor(() =>
      expect(container.querySelector('.text-error')).toBeInTheDocument(),
    )
  })

  it('submits as before for a well-formed, plausible EIN', async () => {
    render(<CommitteeCheckPage campaign={seededCampaign} />)

    setEin('12-3456780')

    const nextButton = await screen.findByRole('button', { name: 'Next' })
    await waitFor(() => expect(nextButton).toBeEnabled())

    fireEvent.click(nextButton)

    await waitFor(() => expect(mockUpdateCampaign).toHaveBeenCalledTimes(1))
    expect(
      screen.queryByText(/prefix isn't one the IRS issues/i),
    ).not.toBeInTheDocument()
  })
})

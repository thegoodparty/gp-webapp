import { describe, it, expect, vi, beforeEach } from 'vitest'
import { waitFor } from '@testing-library/react'
import { render } from 'helpers/test-utils/render'
import { EVENTS } from 'helpers/analyticsHelper'
import ElectionFiling from './ElectionFiling'

const mockTrackEvent = vi.fn()
vi.mock('helpers/analyticsHelper', async (importOriginal) => {
  const actual = await importOriginal<
    typeof import('helpers/analyticsHelper')
  >()
  return {
    ...actual,
    trackEvent: (...args: unknown[]) => mockTrackEvent(...args),
  }
})

vi.mock('@shared/hooks/useUser', () => ({
  useUser: () => [
    { email: 'jane@example.com', phone: '5551234567' },
    vi.fn(),
    false,
  ],
}))

vi.mock('@shared/hooks/useCampaign', () => ({
  useCampaign: () => [{ details: {} }],
}))

vi.mock('helpers/useSnackbar', () => ({
  useSnackbar: () => ({ errorSnackbar: vi.fn(), successSnackbar: vi.fn() }),
}))

// Stub the heavy registration form — this test only verifies the funnel view
// event fires when the step renders, not the form's behavior. Both the default
// export and the named `validateRegistrationForm` (used at module load) must be
// provided or the import of ElectionFiling throws.
vi.mock(
  'app/dashboard/profile/texting-compliance/register/components/TextingComplianceRegistrationForm',
  () => ({
    default: () => <div data-testid="registration-form" />,
    validateRegistrationForm: () => ({}),
  }),
)

beforeEach(() => {
  vi.clearAllMocks()
})

describe('ElectionFiling — funnel view event (ENG-10294)', () => {
  it('fires Filing Details Viewed when the step renders', async () => {
    render(<ElectionFiling />)
    await waitFor(() => {
      expect(mockTrackEvent).toHaveBeenCalledWith(
        EVENTS.ProUpgrade.Compliance.FilingDetailsViewed,
      )
    })
  })
})

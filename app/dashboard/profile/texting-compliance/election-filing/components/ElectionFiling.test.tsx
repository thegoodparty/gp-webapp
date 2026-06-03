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

// [user, setUser, userLoading] — default to a loaded user so `ready` is true.
type UseUserReturn = [
  { email: string; phone: string } | null,
  () => void,
  boolean,
]
const readyUser: UseUserReturn = [
  { email: 'jane@example.com', phone: '5551234567' },
  vi.fn(),
  false,
]
const mockUseUser = vi.fn<() => UseUserReturn>(() => readyUser)
vi.mock('@shared/hooks/useUser', () => ({
  useUser: () => mockUseUser(),
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
  mockUseUser.mockReturnValue(readyUser)
})

describe('ElectionFiling — funnel view event (ENG-10294)', () => {
  it('fires Filing Details Viewed when the form is shown (ready)', async () => {
    render(<ElectionFiling />)
    await waitFor(() => {
      expect(mockTrackEvent).toHaveBeenCalledWith(
        EVENTS.ProUpgrade.Compliance.FilingDetailsViewed,
      )
    })
  })

  it('does not fire while only the loading state is shown (not ready)', async () => {
    // userLoading=true → `ready` is false → the form is hidden behind the
    // Loading… spinner, so the view event must not fire (matches EnterPin's
    // gated behavior — no over-counting users who never see the form).
    mockUseUser.mockReturnValue([null, vi.fn(), true])
    render(<ElectionFiling />)
    await waitFor(() => {
      expect(mockUseUser).toHaveBeenCalled()
    })
    expect(mockTrackEvent).not.toHaveBeenCalledWith(
      EVENTS.ProUpgrade.Compliance.FilingDetailsViewed,
    )
  })
})

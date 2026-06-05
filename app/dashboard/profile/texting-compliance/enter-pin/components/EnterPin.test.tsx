import { describe, it, expect, vi, beforeEach } from 'vitest'
import { screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { render } from 'helpers/test-utils/render'
import { router } from 'helpers/test-utils/router-mocking'
import { api } from 'helpers/test-utils/api-mocking'
import type { TcrCompliance, TcrComplianceStatus } from 'helpers/types'
import { EVENTS } from 'helpers/analyticsHelper'
import EnterPin from './EnterPin'

const mockGetTcrCompliance = vi.fn<() => Promise<TcrCompliance | null>>()
vi.mock(
  'app/dashboard/profile/texting-compliance/util/tcrCompliance.util',
  async (importOriginal) => {
    const actual = await importOriginal<
      typeof import('app/dashboard/profile/texting-compliance/util/tcrCompliance.util')
    >()
    return {
      ...actual,
      getTcrCompliance: () => mockGetTcrCompliance(),
    }
  },
)

const mockSuccessSnackbar = vi.fn()
const mockErrorSnackbar = vi.fn()
vi.mock('helpers/useSnackbar', () => ({
  useSnackbar: () => ({
    successSnackbar: mockSuccessSnackbar,
    errorSnackbar: mockErrorSnackbar,
  }),
}))

const mockUseUser = vi.fn(() => [{ email: 'jane@example.com' }, vi.fn(), false])
vi.mock('@shared/hooks/useUser', () => ({
  useUser: () => mockUseUser(),
}))

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

const baseTcrCompliance: TcrCompliance = {
  id: 'tcr-1',
  ein: '12-3456789',
  postalAddress: '123 Main St',
  committeeName: 'Jane for Council',
  websiteDomain: 'janeforcouncil.org',
  filingUrl: 'https://example.com/filing',
  phone: '5551234567',
  email: 'jane@example.com',
  status: 'submitted',
  createdAt: new Date(),
  updatedAt: new Date(),
  campaignId: 1,
}

const tcrWith = (status: TcrComplianceStatus | null): TcrCompliance => ({
  ...baseTcrCompliance,
  status,
})

const getDigitInputs = (): HTMLInputElement[] =>
  screen
    .getAllByRole('textbox')
    .filter((el) =>
      (el.getAttribute('aria-label') ?? '').startsWith('Digit '),
    ) as HTMLInputElement[]

const fillPin = async (
  user: ReturnType<typeof userEvent.setup>,
  pin: string,
): Promise<void> => {
  const inputs = getDigitInputs()
  for (let i = 0; i < pin.length; i++) {
    await user.type(inputs[i]!, pin.charAt(i))
  }
}

beforeEach(() => {
  mockGetTcrCompliance.mockReset()
  mockSuccessSnackbar.mockReset()
  mockErrorSnackbar.mockReset()
  mockTrackEvent.mockReset()
  ;(router.push as ReturnType<typeof vi.fn>).mockClear()
})

describe('EnterPin — gating', () => {
  it('renders the PIN form when status is `submitted` (awaiting_pin)', async () => {
    mockGetTcrCompliance.mockResolvedValue(tcrWith('submitted'))
    render(<EnterPin />)
    await waitFor(() => {
      expect(getDigitInputs()).toHaveLength(6)
    })
    expect(screen.getByRole('button', { name: /submit/i })).toBeInTheDocument()
  })

  it.each<[TcrComplianceStatus | null]>([['rejected'], ['error'], [null]])(
    'renders OutOfStateNotice (not the form) when status is %s',
    async (status) => {
      mockGetTcrCompliance.mockResolvedValue(tcrWith(status))
      render(<EnterPin />)
      await waitFor(() => {
        expect(
          screen.getByText(/this step isn’t available yet/i),
        ).toBeInTheDocument()
      })
      expect(screen.queryByRole('button', { name: /submit/i })).toBeNull()
      expect(router.push).not.toHaveBeenCalled()
    },
  )

  it.each<[TcrComplianceStatus]>([['pending'], ['approved']])(
    'redirects to /dashboard/profile when status is %s (already past PIN step)',
    async (status) => {
      mockGetTcrCompliance.mockResolvedValue(tcrWith(status))
      render(<EnterPin />)
      await waitFor(() => {
        expect(router.push).toHaveBeenCalledWith('/dashboard/profile')
      })
      expect(screen.queryByRole('button', { name: /submit/i })).toBeNull()
    },
  )

  it('renders OutOfStateNotice when no tcrCompliance record exists', async () => {
    mockGetTcrCompliance.mockResolvedValue(null)
    render(<EnterPin />)
    await waitFor(() => {
      expect(
        screen.getByText(/this step isn’t available yet/i),
      ).toBeInTheDocument()
    })
  })
})

describe('EnterPin — funnel view event (ENG-10294)', () => {
  it('fires PIN Entry Viewed once the PIN form is shown (status submitted)', async () => {
    mockGetTcrCompliance.mockResolvedValue(tcrWith('submitted'))
    render(<EnterPin />)
    await waitFor(() => {
      expect(mockTrackEvent).toHaveBeenCalledWith(
        EVENTS.ProUpgrade.Compliance.PinEntryViewed,
      )
    })
  })

  it.each<[TcrComplianceStatus | null]>([['pending'], ['approved'], [null]])(
    'does not fire PIN Entry Viewed when the form is never shown (status %s)',
    async (status) => {
      mockGetTcrCompliance.mockResolvedValue(tcrWith(status))
      render(<EnterPin />)
      // Let the gating/redirect effects settle before asserting non-emission.
      await waitFor(() => {
        expect(mockGetTcrCompliance).toHaveBeenCalled()
      })
      expect(mockTrackEvent).not.toHaveBeenCalledWith(
        EVENTS.ProUpgrade.Compliance.PinEntryViewed,
      )
    },
  )
})

describe('EnterPin — submit flow', () => {
  it('happy path: submits PIN, fires analytics, invalidates cache, redirects', async () => {
    const user = userEvent.setup()
    mockGetTcrCompliance.mockResolvedValue(tcrWith('submitted'))

    let receivedBody: { pin?: string } = {}
    api.mock(
      'POST /v1/campaigns/tcr-compliance/:tcrComplianceId/submit-cv-pin',
      ({ body, params }) => {
        receivedBody = body
        expect(params.tcrComplianceId).toBe('tcr-1')
        return { status: 200, data: undefined }
      },
    )

    render(<EnterPin />)
    await waitFor(() => expect(getDigitInputs()).toHaveLength(6))

    await fillPin(user, '123456')
    await user.click(screen.getByRole('button', { name: /submit/i }))

    await waitFor(() => {
      expect(router.push).toHaveBeenCalledWith('/dashboard/profile')
    })

    expect(receivedBody).toEqual({ pin: '123456' })
    // Submit fires the PIN-verification event. (The mount-time PinEntryViewed
    // funnel event also fires for `submitted` status — assert the specific
    // submit event rather than a raw call count.)
    expect(mockTrackEvent).toHaveBeenCalledWith(
      EVENTS.Outreach.DlcCompliance.PinVerificationCompleted,
      expect.objectContaining({ dlcComplianceStatus: 'Yes' }),
    )
    expect(mockSuccessSnackbar).toHaveBeenCalledWith(
      expect.stringMatching(/PIN submitted/i),
    )
    expect(mockErrorSnackbar).not.toHaveBeenCalled()
  })

  it('400 response: renders "PIN didn’t match", no redirect, no snackbar error, form re-enables', async () => {
    const user = userEvent.setup()
    mockGetTcrCompliance.mockResolvedValue(tcrWith('submitted'))

    api.mock(
      'POST /v1/campaigns/tcr-compliance/:tcrComplianceId/submit-cv-pin',
      { status: 400, data: { message: 'invalid PIN' } },
    )

    render(<EnterPin />)
    await waitFor(() => expect(getDigitInputs()).toHaveLength(6))

    await fillPin(user, '123456')
    await user.click(screen.getByRole('button', { name: /submit/i }))

    await waitFor(() => {
      expect(screen.getByRole('alert')).toHaveTextContent(
        /that PIN didn’t match/i,
      )
    })

    expect(router.push).not.toHaveBeenCalled()
    expect(mockErrorSnackbar).not.toHaveBeenCalled()
    // Form re-enabled.
    expect(screen.getByRole('button', { name: /submit/i })).toBeEnabled()
    expect(getDigitInputs()[0]).not.toBeDisabled()
  })

  it('500 response: renders generic verify error (does not claim PIN mismatch)', async () => {
    const user = userEvent.setup()
    mockGetTcrCompliance.mockResolvedValue(tcrWith('submitted'))

    api.mock(
      'POST /v1/campaigns/tcr-compliance/:tcrComplianceId/submit-cv-pin',
      { status: 500, data: { message: 'peerly upstream blew up' } },
    )

    render(<EnterPin />)
    await waitFor(() => expect(getDigitInputs()).toHaveLength(6))

    await fillPin(user, '123456')
    await user.click(screen.getByRole('button', { name: /submit/i }))

    await waitFor(() => {
      expect(screen.getByRole('alert')).toHaveTextContent(
        /couldn’t verify that PIN/i,
      )
    })
    // Should not say "didn't match" — that's reserved for client-validation
    // errors (4xx), not generic upstream failures.
    expect(screen.getByRole('alert')).not.toHaveTextContent(/didn’t match/i)
    // No Peerly internals leaked.
    expect(screen.queryByText(/peerly/i)).toBeNull()
    expect(router.push).not.toHaveBeenCalled()
  })
})

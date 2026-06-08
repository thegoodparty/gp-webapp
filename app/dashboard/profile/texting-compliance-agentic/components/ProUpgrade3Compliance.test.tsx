import { describe, it, expect, vi, beforeEach } from 'vitest'
import { screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { render } from 'helpers/test-utils/render'
import { api } from 'helpers/test-utils/api-mocking'
import type { TcrCompliance, TcrComplianceStatus } from 'helpers/types'
import ProUpgrade3Compliance from './ProUpgrade3Compliance'

const mockGetTcrCompliance = vi.fn<() => Promise<TcrCompliance | null>>()
vi.mock(
  'app/dashboard/profile/texting-compliance/util/tcrCompliance.util',
  async (importOriginal) => {
    const actual =
      await importOriginal<
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
    .queryAllByRole('textbox')
    .filter((el) =>
      (el.getAttribute('aria-label') ?? '').startsWith('Digit '),
    ) as HTMLInputElement[]

beforeEach(() => {
  mockGetTcrCompliance.mockReset()
  mockSuccessSnackbar.mockReset()
  mockErrorSnackbar.mockReset()
})

describe('ProUpgrade3Compliance — status → state mapping', () => {
  it('renders the PIN entry form when status is `submitted`', async () => {
    mockGetTcrCompliance.mockResolvedValue(tcrWith('submitted'))
    render(<ProUpgrade3Compliance />)

    await waitFor(() => {
      expect(getDigitInputs()).toHaveLength(6)
    })
    expect(screen.getByText('Enter your PIN')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /submit/i })).toBeInTheDocument()
  })

  it('renders the in-review state when status is `pending`', async () => {
    mockGetTcrCompliance.mockResolvedValue(tcrWith('pending'))
    render(<ProUpgrade3Compliance />)

    await waitFor(() => {
      expect(
        screen.getByText('Your candidate profile is being reviewed'),
      ).toBeInTheDocument()
    })
    expect(screen.queryByRole('button', { name: /submit/i })).toBeNull()
  })

  it('renders the approved state when status is `approved`', async () => {
    mockGetTcrCompliance.mockResolvedValue(tcrWith('approved'))
    render(<ProUpgrade3Compliance />)

    await waitFor(() => {
      expect(
        screen.getByText('Your profile has been approved!'),
      ).toBeInTheDocument()
    })
  })

  it('renders the denied state when status is `rejected`', async () => {
    mockGetTcrCompliance.mockResolvedValue(tcrWith('rejected'))
    render(<ProUpgrade3Compliance />)

    await waitFor(() => {
      expect(
        screen.getByText('Your profile needs updates before sending texts'),
      ).toBeInTheDocument()
    })
    // Gives the candidate the concrete next step from the Figma annotation.
    const supportLink = screen.getByRole('link', {
      name: 'campaignsuccess@goodparty.org',
    })
    expect(supportLink).toHaveAttribute(
      'href',
      'mailto:campaignsuccess@goodparty.org',
    )
  })

  it.each<[TcrComplianceStatus | null]>([['error'], [null]])(
    'falls back to the neutral holding state for status %s (no enumerated screen)',
    async (status) => {
      mockGetTcrCompliance.mockResolvedValue(
        status === null ? null : tcrWith(status),
      )
      render(<ProUpgrade3Compliance />)

      await waitFor(() => {
        expect(
          screen.getByText(/your pro upgrade status will appear here/i),
        ).toBeInTheDocument()
      })
      expect(getDigitInputs()).toHaveLength(0)
      expect(
        screen.queryByText('Your profile needs updates before sending texts'),
      ).toBeNull()
    },
  )

  it('shows the loading skeleton (not the fallback) while the TCR query is pending', () => {
    // Never-resolving query keeps the component in the isPending branch.
    mockGetTcrCompliance.mockReturnValue(
      new Promise(() => {
        /* never resolves */
      }),
    )
    render(<ProUpgrade3Compliance />)

    expect(screen.getByText('Texting Compliance')).toBeInTheDocument()
    expect(
      screen.queryByText(/your pro upgrade status will appear here/i),
    ).toBeNull()
    expect(getDigitInputs()).toHaveLength(0)
  })
})

describe('ProUpgrade3Compliance — PIN submit', () => {
  it('submits the PIN via the existing submit-cv-pin endpoint and transitions to in-review', async () => {
    const user = userEvent.setup()
    // First fetch: mount with `submitted` → PIN form. Every fetch after the
    // post-submit invalidateQueries returns `pending`, so the test verifies the
    // card actually transitions off PIN entry (not just that the snackbar fired).
    mockGetTcrCompliance.mockResolvedValueOnce(tcrWith('submitted'))
    mockGetTcrCompliance.mockResolvedValue(tcrWith('pending'))

    let receivedBody: { pin?: string } = {}
    api.mock(
      'POST /v1/campaigns/tcr-compliance/:tcrComplianceId/submit-cv-pin',
      ({ body, params }) => {
        receivedBody = body
        expect(params.tcrComplianceId).toBe('tcr-1')
        return { status: 200, data: undefined }
      },
    )

    render(<ProUpgrade3Compliance />)
    await waitFor(() => expect(getDigitInputs()).toHaveLength(6))

    const inputs = getDigitInputs()
    for (let i = 0; i < 6; i++) {
      await user.type(inputs[i]!, String(i + 1))
    }
    await user.click(screen.getByRole('button', { name: /submit/i }))

    await waitFor(() => {
      expect(mockSuccessSnackbar).toHaveBeenCalledWith(
        expect.stringMatching(/PIN submitted/i),
      )
    })
    expect(receivedBody).toEqual({ pin: '123456' })
    expect(mockErrorSnackbar).not.toHaveBeenCalled()

    // The invalidated query refetches `pending`, so the card must leave PIN
    // entry for the in-review state — this fails if invalidateQueries is dropped.
    await waitFor(() => {
      expect(
        screen.getByText('Your candidate profile is being reviewed'),
      ).toBeInTheDocument()
    })
    expect(getDigitInputs()).toHaveLength(0)
  })

  it('surfaces a mismatch error on a 400 without claiming success', async () => {
    const user = userEvent.setup()
    mockGetTcrCompliance.mockResolvedValue(tcrWith('submitted'))

    api.mock(
      'POST /v1/campaigns/tcr-compliance/:tcrComplianceId/submit-cv-pin',
      { status: 400, data: { message: 'invalid PIN' } },
    )

    render(<ProUpgrade3Compliance />)
    await waitFor(() => expect(getDigitInputs()).toHaveLength(6))

    const inputs = getDigitInputs()
    for (let i = 0; i < 6; i++) {
      await user.type(inputs[i]!, String(i + 1))
    }
    await user.click(screen.getByRole('button', { name: /submit/i }))

    await waitFor(() => {
      expect(screen.getByRole('alert')).toHaveTextContent(
        /that PIN didn’t match/i,
      )
    })
    expect(mockSuccessSnackbar).not.toHaveBeenCalled()
    // Form re-enabled so the candidate can retry.
    expect(screen.getByRole('button', { name: /submit/i })).toBeEnabled()
  })
})

import { describe, it, expect, vi, beforeEach } from 'vitest'
import { screen, fireEvent, waitFor } from '@testing-library/react'
import { render } from 'helpers/test-utils/render'
import { api } from 'helpers/test-utils/api-mocking'
import { EVENTS } from 'helpers/analyticsHelper'
import { PRO_UPGRADE_STEP } from '../proUpgradeStep'
import PaymentStep from './PaymentStep'
import { useProUpgradeWizard } from './ProUpgradeWizard'

const {
  confirmMock,
  checkoutValue,
  errorSnackbar,
  successSnackbar,
  trackEventMock,
} = vi.hoisted(() => {
  const confirmMock = vi.fn()
  return {
    confirmMock,
    checkoutValue: {
      confirm: confirmMock,
      canConfirm: true,
      // $10.00 — the amount the order summary reads from the live session.
      total: {
        total: { minorUnitsAmount: 1000 },
        subtotal: { minorUnitsAmount: 1000 },
      },
      discountAmounts: undefined,
      applyPromotionCode: vi.fn(),
      removePromotionCode: vi.fn(),
    },
    errorSnackbar: vi.fn(),
    successSnackbar: vi.fn(),
    trackEventMock: vi.fn(),
  }
})

vi.mock('./ProUpgradeWizard', () => ({
  useProUpgradeWizard: vi.fn(),
}))

vi.mock('helpers/analyticsHelper', async (importOriginal) => {
  const actual =
    await importOriginal<typeof import('helpers/analyticsHelper')>()
  return { ...actual, trackEvent: trackEventMock }
})

vi.mock('@stripe/stripe-js', () => ({
  loadStripe: vi.fn(() => Promise.resolve(null)),
}))

// The Stripe Custom Checkout SDK is the external dependency; everything else
// (provider fetch, the reused CheckoutForm, the order summary, navigation) is
// the real code under test.
vi.mock('@stripe/react-stripe-js/checkout', () => ({
  CheckoutProvider: ({ children }: { children: React.ReactNode }) => (
    <>{children}</>
  ),
  useCheckout: () => ({ type: 'success', checkout: checkoutValue }),
  PaymentElement: () => <div data-testid="payment-element" />,
}))

vi.mock('@shared/utils/Snackbar', () => ({
  useSnackbar: () => ({ errorSnackbar, successSnackbar }),
}))

vi.mock('app/shared/sentry', () => ({
  reportErrorToSentry: vi.fn(),
}))

const mockUseProUpgradeWizard = vi.mocked(useProUpgradeWizard)
const goToStep = vi.fn()

const CHECKOUT_SESSION_ROUTE = 'POST /v1/payments/purchase/checkout-session'

describe('PaymentStep', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    confirmMock.mockResolvedValue({ type: 'success' })
    mockUseProUpgradeWizard.mockReturnValue({
      currentStep: 'payment',
      goToStep,
      goToNextStep: vi.fn(),
      goToPreviousStep: vi.fn(),
    })
  })

  it('fetches the embedded subscription client secret and mounts the checkout with the order summary', async () => {
    let requestBody: { embedded?: boolean; returnUrl?: string } | undefined
    api.mock(CHECKOUT_SESSION_ROUTE, ({ body }) => {
      requestBody = body
      return { status: 200, data: { clientSecret: 'cs_test_123' } }
    })

    render(<PaymentStep />)

    // The embedded checkout (reused CheckoutForm) only mounts once the session
    // resolves.
    expect(
      await screen.findByRole('button', { name: 'Complete upgrade' }),
    ).toBeInTheDocument()

    expect(requestBody?.embedded).toBe(true)
    expect(requestBody?.returnUrl).toMatch(/\/dashboard\/pro-upgrade\/success$/)

    // Order summary reads the live amount from the session, not a hardcode.
    expect(screen.getByText('Pro Plan')).toBeInTheDocument()
    expect(screen.getByText('$10.00/mo')).toBeInTheDocument()

    expect(trackEventMock).toHaveBeenCalledWith(
      EVENTS.ProUpgrade.Compliance.PaymentViewed,
    )
  })

  it('confirms the payment and advances to the success step (isPro flips via webhook, not here)', async () => {
    api.mock(CHECKOUT_SESSION_ROUTE, {
      status: 200,
      data: { clientSecret: 'cs_test_123' },
    })

    render(<PaymentStep />)

    fireEvent.click(
      await screen.findByRole('button', { name: 'Complete upgrade' }),
    )

    await waitFor(() =>
      expect(goToStep).toHaveBeenCalledWith(PRO_UPGRADE_STEP.SUCCESS),
    )
    expect(confirmMock).toHaveBeenCalledWith({ redirect: 'if_required' })
  })

  it('keeps the candidate on the payment form to retry when the payment fails', async () => {
    confirmMock.mockResolvedValue({
      type: 'error',
      error: { message: 'Your card was declined' },
    })
    api.mock(CHECKOUT_SESSION_ROUTE, {
      status: 200,
      data: { clientSecret: 'cs_test_123' },
    })

    render(<PaymentStep />)

    const submit = await screen.findByRole('button', {
      name: 'Complete upgrade',
    })
    fireEvent.click(submit)

    await waitFor(() => expect(errorSnackbar).toHaveBeenCalled())
    expect(goToStep).not.toHaveBeenCalled()
    // Still on the form — the candidate can fix their card and retry.
    expect(
      screen.getByRole('button', { name: 'Complete upgrade' }),
    ).toBeInTheDocument()
  })

  it('shows a hard error when the checkout session cannot be created', async () => {
    api.mock(CHECKOUT_SESSION_ROUTE, {
      status: 500,
      data: { error: 'stripe down' },
    })

    render(<PaymentStep />)

    expect(await screen.findByText('Purchase Error')).toBeInTheDocument()
    expect(
      screen.queryByRole('button', { name: 'Complete upgrade' }),
    ).not.toBeInTheDocument()
    expect(goToStep).not.toHaveBeenCalled()
  })
})

import { describe, it, expect, vi, beforeEach } from 'vitest'
import { screen, fireEvent, waitFor } from '@testing-library/react'
import { render } from 'helpers/test-utils/render'
import CheckoutForm from './CheckoutForm'

const { confirmMock, checkoutValue, errorSnackbar, successSnackbar, setError } =
  vi.hoisted(() => {
    const confirmMock = vi.fn()
    return {
      confirmMock,
      checkoutValue: {
        confirm: confirmMock,
        canConfirm: true,
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
      setError: vi.fn(),
    }
  })

vi.mock('@stripe/react-stripe-js/checkout', () => ({
  useCheckout: () => ({ type: 'success', checkout: checkoutValue }),
  PaymentElement: () => <div data-testid="payment-element" />,
}))

vi.mock('@shared/utils/Snackbar', () => ({
  useSnackbar: () => ({ errorSnackbar, successSnackbar }),
}))

vi.mock('app/shared/sentry', () => ({
  reportErrorToSentry: vi.fn(),
}))

vi.mock('./CheckoutSessionProvider', () => ({
  useCheckoutSession: () => ({ setError }),
}))

const clickSubmit = () =>
  fireEvent.click(screen.getByRole('button', { name: 'Complete Purchase' }))

describe('CheckoutForm', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    confirmMock.mockResolvedValue({ type: 'success' })
  })

  it('completes a one-time purchase via onSuccess with the session id', async () => {
    const onSuccess = vi.fn()

    render(<CheckoutForm onSuccess={onSuccess} sessionId="cs_one_time" />)
    clickSubmit()

    await waitFor(() => expect(onSuccess).toHaveBeenCalledWith('cs_one_time'))
    expect(confirmMock).toHaveBeenCalledWith({ redirect: 'if_required' })
  })

  it('signals confirmation via onConfirmed (not onSuccess) when there is no session id', async () => {
    const onSuccess = vi.fn()
    const onConfirmed = vi.fn()

    render(
      <CheckoutForm
        onSuccess={onSuccess}
        onConfirmed={onConfirmed}
        submitLabel="Complete Purchase"
      />,
    )
    clickSubmit()

    await waitFor(() => expect(onConfirmed).toHaveBeenCalled())
    expect(confirmMock).toHaveBeenCalled()
    expect(onSuccess).not.toHaveBeenCalled()
  })

  it('fails before charging when a one-time session has no id and no onConfirmed fallback', async () => {
    // Guards the regression the type change opened up: confirming first would
    // charge the card and then silently skip fulfillment.
    const onSuccess = vi.fn()
    const onError = vi.fn()

    render(<CheckoutForm onSuccess={onSuccess} onError={onError} />)
    clickSubmit()

    await waitFor(() => expect(onError).toHaveBeenCalled())
    expect(confirmMock).not.toHaveBeenCalled()
    expect(onSuccess).not.toHaveBeenCalled()
  })
})

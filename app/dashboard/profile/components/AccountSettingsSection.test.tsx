import { describe, it, expect, vi, beforeEach } from 'vitest'
import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { render } from 'helpers/test-utils/render'
import { AccountSettingsSection } from './AccountSettingsSection'
import { trackEvent, EVENTS } from 'helpers/analyticsHelper'

const mockUseCampaign = vi.fn()
const mockUseUser = vi.fn()

vi.mock('@shared/hooks/useCampaign', () => ({
  useCampaign: () => mockUseCampaign(),
}))

vi.mock('@shared/hooks/useUser', () => ({
  useUser: () => mockUseUser(),
}))

vi.mock('helpers/analyticsHelper', () => ({
  trackEvent: vi.fn(),
  EVENTS: {
    Account: { ProSubscriptionCanceled: 'Account - Pro Subscription Canceled' },
    Settings: { Account: { ClickSendEmail: 'Settings - Account Click Send Email' } },
  },
}))

vi.mock('@shared/utils/analytics', () => ({
  identifyUser: vi.fn(),
}))

vi.mock('helpers/linkhelper', () => ({
  getMarketingUrl: (path: string) => `https://goodparty.org${path}`,
}))

vi.mock('app/dashboard/profile/components/AccountSettingsButton', () => ({
  AccountSettingsButton: ({ isPro }: { isPro: boolean }) => (
    <button data-testid="account-settings-button">
      {isPro ? 'Manage Subscription' : 'Upgrade'}
    </button>
  ),
}))

vi.mock('app/dashboard/profile/components/SubscriptionPendingCancellationAlert', () => ({
  SubscriptionPendingCancellationAlert: () => (
    <div data-testid="cancellation-alert">Subscription pending cancellation</div>
  ),
}))

const mockTrackEvent = vi.mocked(trackEvent)

describe('AccountSettingsSection', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockUseUser.mockReturnValue([{ id: 'user-1' }, vi.fn()])
  })

  describe('when user is on FREE plan', () => {
    beforeEach(() => {
      mockUseCampaign.mockReturnValue([
        {
          isPro: false,
          details: { subscriptionCancelAt: null, subscriptionId: null },
        },
      ])
    })

    it('renders the FREE plan name', () => {
      render(<AccountSettingsSection />)
      expect(screen.getByText(/GoodParty\.org - Candidate FREE/)).toBeInTheDocument()
    })

    it('renders the Account Settings button', () => {
      render(<AccountSettingsSection />)
      expect(screen.getByTestId('account-settings-button')).toBeInTheDocument()
    })

    it('does not render the cancellation alert', () => {
      render(<AccountSettingsSection />)
      expect(screen.queryByTestId('cancellation-alert')).not.toBeInTheDocument()
    })
  })

  describe('when user is on PRO plan', () => {
    beforeEach(() => {
      mockUseCampaign.mockReturnValue([
        {
          isPro: true,
          details: { subscriptionCancelAt: null, subscriptionId: 'sub-123' },
        },
      ])
    })

    it('renders the PRO plan name', () => {
      render(<AccountSettingsSection />)
      expect(screen.getByText(/GoodParty\.org - Candidate PRO/)).toBeInTheDocument()
    })

    it('renders the Account Settings button for PRO users with subscription', () => {
      render(<AccountSettingsSection />)
      expect(screen.getByTestId('account-settings-button')).toBeInTheDocument()
    })
  })

  describe('when PRO user has pending cancellation', () => {
    beforeEach(() => {
      mockUseCampaign.mockReturnValue([
        {
          isPro: true,
          details: { subscriptionCancelAt: 1735689600000, subscriptionId: 'sub-123' },
        },
      ])
    })

    it('renders the cancellation alert', () => {
      render(<AccountSettingsSection />)
      expect(screen.getByTestId('cancellation-alert')).toBeInTheDocument()
    })

    it('tracks ProSubscriptionCanceled event', () => {
      render(<AccountSettingsSection />)
      expect(mockTrackEvent).toHaveBeenCalledWith(
        EVENTS.Account.ProSubscriptionCanceled,
        { cancellationDate: 1735689600000 },
      )
    })
  })

  describe('when PRO user is in limbo state (no subscriptionId)', () => {
    beforeEach(() => {
      mockUseCampaign.mockReturnValue([
        {
          isPro: true,
          details: { subscriptionCancelAt: null, subscriptionId: null },
        },
      ])
    })

    it('hides the Account Settings button for limbo PRO users', () => {
      render(<AccountSettingsSection />)
      expect(screen.queryByTestId('account-settings-button')).not.toBeInTheDocument()
    })
  })

  describe('contact link', () => {
    beforeEach(() => {
      mockUseCampaign.mockReturnValue([
        {
          isPro: false,
          details: { subscriptionCancelAt: null, subscriptionId: null },
        },
      ])
    })

    it('renders the "Send us an email" link with the correct external URL', () => {
      render(<AccountSettingsSection />)
      const link = screen.getByRole('link', { name: /Send us an email/i })
      expect(link).toHaveAttribute('href', 'https://goodparty.org/contact')
    })

    it('opens the contact link in a new tab', () => {
      render(<AccountSettingsSection />)
      const link = screen.getByRole('link', { name: /Send us an email/i })
      expect(link).toHaveAttribute('target', '_blank')
    })

    it('has proper security attributes for external link', () => {
      render(<AccountSettingsSection />)
      const link = screen.getByRole('link', { name: /Send us an email/i })
      expect(link).toHaveAttribute('rel', 'noopener noreferrer')
    })

    it('tracks ClickSendEmail event when link is clicked', async () => {
      const user = userEvent.setup()
      render(<AccountSettingsSection />)
      const link = screen.getByRole('link', { name: /Send us an email/i })

      await user.click(link)

      expect(mockTrackEvent).toHaveBeenCalledWith(EVENTS.Settings.Account.ClickSendEmail)
    })
  })
})

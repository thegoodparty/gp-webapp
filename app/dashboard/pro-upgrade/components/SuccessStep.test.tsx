import { describe, it, expect, vi, beforeEach } from 'vitest'
import { screen } from '@testing-library/react'
import { render } from 'helpers/test-utils/render'
import { router } from 'helpers/test-utils/router-mocking'
import { EVENTS, trackEvent } from 'helpers/analyticsHelper'
import SuccessStep from './SuccessStep'

// The confetti overlay paints to a <canvas>, which jsdom can't render — stub it
// so the test exercises the success content and CTA, not the celebration.
vi.mock('app/dashboard/questions/components/Confetti', () => ({
  default: () => null,
}))

// Keep EVENTS real; stub trackEvent so we don't hit analytics in tests.
vi.mock('helpers/analyticsHelper', async (importOriginal) => {
  const actual =
    await importOriginal<typeof import('helpers/analyticsHelper')>()
  return { ...actual, trackEvent: vi.fn() }
})

const mockTrackEvent = vi.mocked(trackEvent)

describe('SuccessStep', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders the Welcome-to-Pro messaging and fires the viewed event', () => {
    render(<SuccessStep />)

    expect(
      screen.getByRole('heading', { name: 'Welcome to Pro!' }),
    ).toBeInTheDocument()
    expect(
      screen.getByText(
        /your PIN will be sent to your email, phone or address/i,
      ),
    ).toBeInTheDocument()
    expect(mockTrackEvent).toHaveBeenCalledWith(
      EVENTS.ProUpgrade.Compliance.SuccessViewed,
    )
  })

  it('routes to the post-payment compliance surface when Continue is clicked', () => {
    render(<SuccessStep />)

    screen.getByRole('button', { name: /continue/i }).click()

    expect(router.push).toHaveBeenCalledWith(
      '/dashboard/profile#texting-compliance',
    )
    expect(mockTrackEvent).toHaveBeenCalledWith(
      EVENTS.ProUpgrade.Compliance.SuccessContinue,
    )
  })

  it('does not gate the success content on isPro — it renders with no campaign state', () => {
    // The screen takes no isPro/campaign input; rendering at all (the assertion
    // above) proves it can't get stuck waiting on the webhook-driven flip.
    render(<SuccessStep />)

    expect(screen.getByRole('button', { name: /continue/i })).toBeEnabled()
  })
})

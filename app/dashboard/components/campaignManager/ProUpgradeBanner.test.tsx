import { describe, it, expect, vi, beforeEach } from 'vitest'
import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { render } from 'helpers/test-utils/render'
import { router } from 'helpers/test-utils/router-mocking'
import { CampaignContext } from '@shared/hooks/CampaignProvider'
import type { Campaign } from 'helpers/types'
import { useProUpgrade3Flag } from '@shared/experiments/proUpgrade3Flag'
import { EVENTS, trackEvent } from 'helpers/analyticsHelper'
import ProUpgradeBanner from './ProUpgradeBanner'

vi.mock('@shared/experiments/proUpgrade3Flag', () => ({
  useProUpgrade3Flag: vi.fn(),
}))

vi.mock('helpers/analyticsHelper', async (importOriginal) => {
  const actual =
    await importOriginal<typeof import('helpers/analyticsHelper')>()
  return { ...actual, trackEvent: vi.fn() }
})

const mockUseProUpgrade3Flag = vi.mocked(useProUpgrade3Flag)
const mockTrackEvent = vi.mocked(trackEvent)

const renderBanner = (isPro: boolean | null) =>
  render(
    <CampaignContext.Provider value={[{ isPro } as Campaign]}>
      <ProUpgradeBanner />
    </CampaignContext.Provider>,
  )

describe('ProUpgradeBanner', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders the banner and tracks a view for a non-Pro candidate with the flag on', () => {
    mockUseProUpgrade3Flag.mockReturnValue({ ready: true, enabled: true })
    renderBanner(false)

    expect(
      screen.getByText('76% of candidates who use Pro win'),
    ).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Get Pro' })).toBeInTheDocument()
    expect(mockTrackEvent).toHaveBeenCalledWith(
      EVENTS.ProUpgrade.Compliance.BannerViewed,
    )
  })

  it('routes into the wizard and tracks the click when Get Pro is pressed', async () => {
    mockUseProUpgrade3Flag.mockReturnValue({ ready: true, enabled: true })
    renderBanner(false)

    await userEvent.click(screen.getByRole('button', { name: 'Get Pro' }))

    expect(router.push).toHaveBeenCalledWith('/dashboard/pro-upgrade')
    expect(mockTrackEvent).toHaveBeenCalledWith(
      EVENTS.ProUpgrade.Compliance.BannerGetPro,
    )
  })

  it('renders nothing for a Pro candidate', () => {
    mockUseProUpgrade3Flag.mockReturnValue({ ready: true, enabled: true })
    const { container } = renderBanner(true)

    expect(container).toBeEmptyDOMElement()
    expect(mockTrackEvent).not.toHaveBeenCalled()
  })

  it('renders nothing when the flag is off', () => {
    mockUseProUpgrade3Flag.mockReturnValue({ ready: true, enabled: false })
    const { container } = renderBanner(false)

    expect(container).toBeEmptyDOMElement()
    expect(mockTrackEvent).not.toHaveBeenCalled()
  })

  it('renders nothing until the flag is ready', () => {
    mockUseProUpgrade3Flag.mockReturnValue({ ready: false, enabled: false })
    const { container } = renderBanner(false)

    expect(container).toBeEmptyDOMElement()
  })
})

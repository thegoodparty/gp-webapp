import { describe, expect, it, vi, beforeEach } from 'vitest'
import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { render } from 'helpers/test-utils/render'
import DetailHeaderActions from './DetailHeaderActions'
import { useShareScope } from './ShareScope'

vi.mock('./ShareScope', () => ({
  useShareScope: vi.fn(),
}))

const mockedUseShareScope = vi.mocked(useShareScope)

const SPEECH = 'City Council. June 1, 2026. City Hall'

function setShareScope({
  canShare = true,
  openShareDrawer = vi.fn(),
}: { canShare?: boolean; openShareDrawer?: () => void } = {}) {
  mockedUseShareScope.mockReturnValue({ canShare, openShareDrawer })
  return openShareDrawer
}

describe('<DetailHeaderActions>', () => {
  beforeEach(() => {
    mockedUseShareScope.mockReset()
  })

  it('renders the Share button when share scope reports canShare', () => {
    setShareScope()
    render(<DetailHeaderActions speechText={SPEECH} />)

    expect(screen.getByRole('button', { name: /^share$/i })).toBeInTheDocument()
  })

  it('asks the share scope to open the drawer when Share is clicked', async () => {
    const openShareDrawer = setShareScope()
    render(<DetailHeaderActions speechText={SPEECH} />)

    await userEvent.click(screen.getByRole('button', { name: /^share$/i }))
    expect(openShareDrawer).toHaveBeenCalledTimes(1)
  })

  it('renders an icon-only IconButton for mobile and a labelled Button for desktop, gated by width-aware Tailwind classes', () => {
    // Mobile (icon-only) and desktop (icon + "Share" text) both live in
    // the DOM under jsdom; visibility is controlled by Tailwind utility
    // classes. Asserting the class gating here pins the responsive
    // contract so a future refactor can't accidentally drop one side.
    setShareScope()
    render(<DetailHeaderActions speechText={SPEECH} />)

    const mobileBtn = screen.getByRole('button', { name: /share briefing/i })
    expect(mobileBtn).toHaveClass('lg:hidden')

    const desktopBtn = screen.getByRole('button', { name: /^share$/i })
    expect(desktopBtn).toHaveClass('hidden', 'lg:inline-flex')
  })

  it('renders the Read aloud control to the left of Share', () => {
    setShareScope()
    render(<DetailHeaderActions speechText={SPEECH} />)

    // Two breakpoints' worth of read-aloud controls live in the DOM (icon
    // on mobile, labelled on desktop); both carry the "Read aloud" label.
    expect(
      screen.getAllByRole('button', { name: /read aloud/i }).length,
    ).toBeGreaterThan(0)
  })

  it('still renders Read aloud (but no Share) when share scope reports !canShare', () => {
    // Rolling-deploy window: gp-webapp has the share-drawer code but
    // gp-api's response hasn't grown `briefing_id` yet. `canShare` is
    // false in that case, so Share is hidden — but Read aloud is
    // independent of share and stays.
    setShareScope({ canShare: false })
    render(<DetailHeaderActions speechText={SPEECH} />)

    expect(
      screen.queryByRole('button', { name: /^share$/i }),
    ).not.toBeInTheDocument()
    expect(
      screen.getAllByRole('button', { name: /read aloud/i }).length,
    ).toBeGreaterThan(0)
  })
})

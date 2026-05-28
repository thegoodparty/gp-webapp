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
    render(<DetailHeaderActions />)

    expect(screen.getByRole('button', { name: /^share$/i })).toBeInTheDocument()
  })

  it('asks the share scope to open the drawer when Share is clicked', async () => {
    const openShareDrawer = setShareScope()
    render(<DetailHeaderActions />)

    await userEvent.click(screen.getByRole('button', { name: /^share$/i }))
    expect(openShareDrawer).toHaveBeenCalledTimes(1)
  })

  it('renders an icon-only IconButton for mobile and a labelled Button for desktop, gated by width-aware Tailwind classes', () => {
    // Mobile (icon-only) and desktop (icon + "Share" text) both live in
    // the DOM under jsdom; visibility is controlled by Tailwind utility
    // classes. Asserting the class gating here pins the responsive
    // contract so a future refactor can't accidentally drop one side.
    setShareScope()
    render(<DetailHeaderActions />)

    const mobileBtn = screen.getByRole('button', { name: /share briefing/i })
    expect(mobileBtn).toHaveClass('lg:hidden')

    const desktopBtn = screen.getByRole('button', { name: /^share$/i })
    expect(desktopBtn).toHaveClass('hidden', 'lg:inline-flex')
  })

  it('renders nothing when share scope reports !canShare', () => {
    // Rolling-deploy window: gp-webapp has the share-drawer code but
    // gp-api's response hasn't grown `briefing_id` yet. `canShare` is
    // false in that case and the header has no other actions left
    // (Add note + Briefing assistant moved to `DesktopBottomBar`), so
    // the component renders nothing.
    setShareScope({ canShare: false })
    const { container } = render(<DetailHeaderActions />)

    expect(container).toBeEmptyDOMElement()
  })
})

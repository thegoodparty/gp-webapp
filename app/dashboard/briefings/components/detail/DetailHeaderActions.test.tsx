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
